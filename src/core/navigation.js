// General, reveal-aware slide navigation. Talk-specific behavior is injected through TalkFeatures.
  // Page changes are handled by a full-opacity wipe, never a crossfade of two
  // text-heavy slides. Reveals *within* a slide retain their existing timing.
  const transitionVeil = document.createElement('div');
  transitionVeil.id = 'deck-transition-veil';
  transitionVeil.setAttribute('aria-hidden', 'true');
  $('#slide').appendChild(transitionVeil);
  let transitionBusy = false;
  let deckInitialized = false;
  function go(page, nextStep = 0) {
    const destination = clamp(page, 1, slideCount);
    const finalStep = clamp(nextStep, 0, slideMeta(destination).reveals);
    if (transitionBusy) return;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (deckInitialized && destination !== slide && !reducedMotion) {
      transitionBusy = true;
      transitionVeil.classList.toggle('dark', destination === 1 || destination === 25);
      transitionVeil.style.visibility = 'visible';
      transitionVeil.style.pointerEvents = 'auto';
      const close = transitionVeil.animate([
        {clipPath:'inset(0 100% 0 0)'},
        {clipPath:'inset(0 0 0 0)'}
      ],{duration:235,easing:'cubic-bezier(.42,0,.25,1)',fill:'forwards'});
      close.finished.then(() => {
        // When the curtain is fully opaque, swap the stage. Nothing from the
        // previous slide can show through while the new slide is being drawn.
        commitGo(destination, finalStep);
        const open = transitionVeil.animate([
          {clipPath:'inset(0 0 0 0)'},
          {clipPath:'inset(0 0 0 100%)'}
        ],{duration:310,easing:'cubic-bezier(.22,.7,.2,1)',fill:'forwards'});
        return open.finished;
      }).catch(() => {}).finally(() => {
        transitionVeil.getAnimations().forEach(a=>a.cancel());
        transitionVeil.style.visibility = 'hidden';
        transitionVeil.style.pointerEvents = 'none';
        transitionBusy = false;
      });
      return;
    }
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
