// General, reveal-aware slide navigation. Talk-specific behavior is injected through TalkFeatures.
  // V34: Animate COMPOSED slide snapshots, not the live DOM. The previous
  // transition changed the active stage while individual descendants still had
  // 0.3-0.6s reveal transitions, producing distracting second entrances.
  // A view transition isolates old/new paints. The WAAPI fallback follows the
  // same two-phase sequence and locks descendant transitions during entry.
  const slideCanvas = $('#slide');
  const deckFrame = $('#deck-frame');
  let transitionBusy = false;
  let deckInitialized = false;
  let queuedNavigation = null;

  function setFrameTheme(destination, destinationStep, immediate = false) {
    if (immediate) deckFrame.style.transition = 'none';
    deckFrame.classList.toggle('is-dark-page', destination === 25 || (destination === 1 && destinationStep === 0));
    if (immediate) {
      void deckFrame.offsetWidth;
      deckFrame.style.removeProperty('transition');
    }
  }

  function finishSlideTransition() {
    // Leave the entry-only CSS keyframes suppressed until the next reveal.
    // This prevents the cover entrance from replaying when snapshots disappear.
    slideCanvas.classList.remove('deck-preparing');
    slideCanvas.classList.add('deck-settled');
    slideCanvas.style.removeProperty('pointer-events');
    slideCanvas.style.removeProperty('will-change');
    document.documentElement.classList.remove('deck-transition-backwards', 'deck-transition-to-dark');
    transitionBusy = false;
    if (queuedNavigation) {
      const [nextPage, nextStep] = queuedNavigation;
      queuedNavigation = null;
      if (slide !== nextPage || step !== nextStep) go(nextPage, nextStep);
    }
  }

  function go(page, nextStep = 0) {
    const destination = clamp(page, 1, slideCount);
    const finalStep = clamp(nextStep, 0, slideMeta(destination).reveals);
    if (transitionBusy) {
      // Keep the latest explicit jump instead of silently dropping it.
      queuedNavigation = [destination, finalStep];
      return;
    }
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (deckInitialized && destination !== slide && !reducedMotion) {
      transitionBusy = true;
      slideCanvas.style.pointerEvents = 'none';
      const direction = destination > slide ? 1 : -1;
      document.documentElement.classList.toggle('deck-transition-backwards', direction < 0);
      document.documentElement.classList.toggle('deck-transition-to-dark', destination === 25 || (destination === 1 && finalStep === 0));

      if (typeof document.startViewTransition === 'function') {
        // The browser captures the outgoing pixels, commits the new slide while
        // hidden, and captures the fully settled incoming pixels. Neither
        // snapshot can independently animate its headings/figures midway.
        try {
          const transition = document.startViewTransition(() => {
            slideCanvas.classList.remove('deck-settled');
            slideCanvas.classList.add('deck-preparing');
            setFrameTheme(destination, finalStep, true);
            commitGo(destination, finalStep);
          });
          transition.finished.catch(() => {}).finally(finishSlideTransition);
        } catch (error) {
          slideCanvas.classList.add('deck-preparing');
          setFrameTheme(destination, finalStep, true);
          commitGo(destination, finalStep);
          finishSlideTransition();
        }
        return;
      }

      // Fallback for older browsers: sequential outgoing/incoming animation.
      // Suppressing descendant transitions prevents a second entrance after swap.
      const offset = `${26 * direction}px 0px`;
      slideCanvas.style.willChange = 'opacity, translate';
      const outgoing = slideCanvas.animate([
        {opacity: 1, translate: '0px 0px'},
        {opacity: 0, translate: `${-26 * direction}px 0px`}
      ], {duration: 145, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards'});
      let incoming = null;
      outgoing.finished.then(() => {
        slideCanvas.classList.remove('deck-settled');
        slideCanvas.classList.add('deck-preparing');
        setFrameTheme(destination, finalStep, true);
        commitGo(destination, finalStep);
        // Paint the final state before revealing it; never animate every child.
        void slideCanvas.offsetWidth;
        incoming = slideCanvas.animate([
          {opacity: 0, translate: offset},
          {opacity: 1, translate: '0px 0px'}
        ], {duration: 190, easing: 'cubic-bezier(.22,.75,.2,1)', fill: 'both'});
        outgoing.cancel();
        return incoming.finished;
      }).catch(() => {
        if (slide !== destination) {
          slideCanvas.classList.add('deck-preparing');
          setFrameTheme(destination, finalStep, true);
          commitGo(destination, finalStep);
        }
      }).finally(() => {
        outgoing.cancel();
        incoming?.cancel();
        finishSlideTransition();
      });
      return;
    }
    slideCanvas.classList.remove('deck-settled', 'deck-preparing');
    setFrameTheme(destination, finalStep, !deckInitialized || reducedMotion);
    commitGo(destination, finalStep);
    deckInitialized = true;
  }
  function commitGo(page, nextStep = 0) {
    if (typeof closeSlideJump === "function") closeSlideJump(false);
    if(AsideNav.active) AsideNav.close(false);
    TalkFeatures.stopAnimations?.();
    triggerGeneration++;
    const oldPage = slide;
    const oldStep = step;
    const requestedPage = clamp(page, 1, slideCount);
    const requestedStep = clamp(nextStep, 0, slideMeta(requestedPage).reveals);
    controllerFor(oldPage)?.beforeChange?.({oldPage, oldStep, nextPage:requestedPage, nextStep:requestedStep});
    slide = clamp(page, 1, slideCount);
    step = clamp(nextStep, 0, slideMeta(slide).reveals);

    const slideElement = $("#slide");
    slideElement.dataset.page = slide;
    slideElement.dataset.step = step;
    for (const stage of document.querySelectorAll(".stage")) {
      stage.dataset.step = step;
      const active = Number(stage.dataset.slide) === slide;
      stage.classList.toggle("is-active", active);
      stage.setAttribute("aria-hidden", String(!active));
      stage.inert = !active;
    }

    $("#counter").textContent =
      String(slide).padStart(2, "0") + " / " + String(slideCount).padStart(2, "0");
    if (oldPage !== slide) {
      controllerFor(oldPage)?.leave?.({ nextPage: slide, nextStep: step });
    }
    controllerFor(slide)?.enter?.({ oldPage, oldStep, step });
    TalkFeatures.syncCoverAnimation?.();
    TalkFeatures.timeline?.();

    try {
      const url = new URL(location.href);
      TalkFeatures.copyStateToURL?.(url);
      url.hash = `slide-${slide}-${step}`;
      history.replaceState(null, "", url);
    } catch (error) {
      // The deck remains navigable if the browser blocks history updates.
    }
  }

  // Click the slide counter to jump directly to a slide, without changing the deck's reveal model.
  const counterButton = $("#counter");
  const jumpForm = $("#slide-jump");
  const jumpInput = $("#slide-jump-input");
  function closeSlideJump(restoreFocus = false) {
    if (jumpForm.hidden) return;
    jumpForm.hidden = true;
    counterButton.setAttribute("aria-expanded", "false");
    if (restoreFocus) counterButton.focus();
  }
  function openSlideJump() {
    if (AsideNav.active) AsideNav.close();
    jumpInput.min = "1";
    jumpInput.max = String(slideCount);
    jumpInput.value = String(slide);
    jumpForm.hidden = false;
    counterButton.setAttribute("aria-expanded", "true");
    jumpInput.focus();
    jumpInput.select();
  }
  counterButton.addEventListener("click", () => {
    if (jumpForm.hidden) openSlideJump(); else closeSlideJump(true);
  });
  jumpForm.addEventListener("submit", event => {
    event.preventDefault();
    const number = Number(jumpInput.value);
    if (!Number.isInteger(number) || number < 1 || number > slideCount) {
      jumpInput.setCustomValidity(`Choose a slide from 1 to ${slideCount}`);
      jumpInput.reportValidity();
      jumpInput.setCustomValidity("");
      return;
    }
    closeSlideJump(false);
    go(number, 0);
    counterButton.focus();
  });
  document.addEventListener("pointerdown", event => {
    if (!jumpForm.hidden && !jumpForm.contains(event.target) && event.target !== counterButton) closeSlideJump();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !jumpForm.hidden) {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeSlideJump(true);
    }
  }, true);

  function next() {
    if(AsideNav.active){AsideNav.next();return;}
    if (controllerFor(slide)?.beforeAdvance?.() === false) return;
    if (step < slideMeta(slide).reveals) go(slide, step + 1);
    else if (slide < slideCount) go(slide + 1, 0);
  }

  function prev() {
    if(AsideNav.active){AsideNav.prev();return;}
    if (step > 0) go(slide, step - 1);
    else if (slide > 1) go(slide - 1, slideMeta(slide - 1).reveals);
  }

  let triggerGeneration = 0;
  /* @CONTROLLER_REGISTRY@ */
  const controllerFor = id => sceneControllers[slideMeta(id)?.key];

  function trigger() {
    if(AsideNav.active){AsideNav.trigger();return;}
    controllerFor(slide)?.trigger?.();
  }

  $("#back").addEventListener("click", prev);
  $("#forward").addEventListener("click", next);
  $("#reseed")?.addEventListener("click", () => TalkFeatures.reroll?.());
  $("#trigger").addEventListener("click", trigger);
