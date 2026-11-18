# Historical version notes (v16-v29)

The notes below are preserved from the individual historical release files. These are archival design decisions, not a current build specification.

---

## V16

# v16 changes from the supplied v15

- Slide 1: +0.40 / +0.40 / +0.50 SVG stroke widths for cyan/red/warm glitch-clique edges only. The third reveal retains exactly the step-1 cover title vertical position; collaborator cards and label disappear and the six-part talk outline becomes a prominent bordered panel.
- Slide 2: remove redundant last reveal (manifest reveals=4, states 0..4).
- Slide 4: remove redundant last reveal (manifest reveals=3, states 0..3).
- Slide 6: complete references in the same two-entry bibliography style as slide 5, verified against SIAM / authors' listing (Barak et al. 2019) and Kunisky & Mao (arXiv:2609.24780, 2026).
- Slide 7: geographic map untouched. Political quadrant is now gridded with more saturated colors and comfortable top/bottom label margins. Age-interest panel is redrawn with exact axis titles AGE and MATH INTEREST, child/older-person vector portraits and high/low stock chart illustrations. Same 40 fixed point pairs, data meaning, and 4 reveal sequence retained.
- Other slides and logic unchanged.

---

## V17

# v17 changes relative to supplied v16

- Slide 8: shared RGG simulation now has Poisson mean `n = 200` (and displays `n = 200`), with node radius increasing slightly from `3.6` to `4.05` SVG units. Slider range is `mu = 0` through `mu = 15`; the three displayed regimes are equally divided `0–5`, `5–10`, `10–15`, and the old small endpoint labels are removed. This partition is illustrative of the scale `mu ~ log n` rather than exact asymptotic threshold classification.
- Slide 9: highlighted planted vertices are radius `5.9` (formerly `4.6`), while non-highlighted vertices follow the shared `4.05` radius. The selected subset and underlying graph stay unchanged.
- Slide 10: `Why can geometry be unavailable?` is revealed alongside the topology-only view at step 1, above the estimator. The estimator arrives at step 2 and exact recovery at step 3; the existing closing question (step 4) is retained.
- All other slides and functions remain as in v16.

---

## V18

# v18 · Cover-flow correction and slide 2 pattern

- Fixed slide 1 so that the 3 reveals remain exactly 0: cover, 1: coauthor portraits, 2: talk outline.
- Published Paper bibliography is pinned to a shared bottom position in moments 2 and 3, rather than following content flow.
- Kept cover title, main author, art and bibliography at identical positions during the transition from coauthors to outline.
- Changed just the left-side pattern diagram in slide 2 to the existing orange accent (`#e78b45`).
- No other slides, reveal counts or simulations modified.

---

## V19

# v19 — targeted corrections (17 November 2026)

- Slide 4: removed step-dependent fading of natural ER edges.
- Slide 6: removed the single sentence beginning “Lower bounds are known…”; no other claim changed.
- Slide 7: redesigned child/older-adult portraits and increase/decrease icons as larger, crisp inline SVG illustrations; no change to data or axes.
- Slide 8: mean-degree slider 0–18; illustrative equal regions 0–6, 6–12, 12–18; rebuilt visible slider track as a single continuous 3-color gradient, eliminating the confusing second colored strip.
- Slide 11: slightly increased contrast, thickness and size of the natural network edges/nodes (only slide 11).

Other slides remain unchanged.

---

## V20

# V20 — Slide 13 only (17 November 2026)

- Refined definition panel: smaller mathematical notation, compact per-case blocks, content-fitted card.
- Positive and negative theorem cards now have content-based height, smaller formulas, and more generous in-card hierarchy.
- Rebuilt qualitative VD phase diagram as native vector SVG: red non-recovery area rises in the dense regime, two more legible vertical gray separators at equal visual intervals.
- Summary header/formula rows and SVG now share an explicit 720-unit horizontal grid: 75-unit left axis gutter, three equal 206⅔-unit regimes, 25-unit right inset; diagram labels are not redundantly repeated.
- Regions are **schematic**, faithfully preserving success/failure/unknown semantics of Figure 2(a) of *Planted clique recovery in random geometric graphs* (Avrachenkov, Bobu, Litvak, Michielan, Journal of Complex Networks, 2026). The equal spacing is a presentation choice, not exact logarithmic parameter scaling.
- All other slides, interactive behaviour, and mathematical statements are unchanged.

---

## V21

# V21 - cover-state fix and slide 8 edge timing

- Cover has exactly three discrete states: 0 cover, 1 coauthors + fixed publication, 2 one-column talk outline + same publication.
- Inactive title and agenda layers are removed from layout, eliminating stale transitions when navigating backwards.
- Cover-to-slide-2 navigation is also instantaneous to avoid stage ghosting.
- On slide 8, natural edges are not drawn until the connection rule is introduced at step 1.
- Slide 9 and 10 network rendering and the original cover network animation are unchanged.

Run `python generate.py` to regenerate `index.html`.

---

## V22

# v22 — focused slide 23 numerical experiments

Based on v21. Modified only the content and operation of slide 23; slide 22 and qualitative theory diagrams unchanged.

- Replaced the old two theoretical mini-diagrams plus small plot with one large exact-recovery plot and a right-hand algorithm reminder.
- Replaced the four narrated steps with two: VD vs CN, then reveal HC curve and HC reminder.
- Added three mutually exclusive clickable buttons: SUB-CONNECTIVITY (`mu=1`), CONNECTIVITY (`mu=5`), SUPER-CONNECTIVITY (`mu=20`). These regimes are illustrative labels at finite n.
- Generated `mu=10` benchmark separately, kept out of the three buttons and saved a preview PNG.
- Shared `k=2..40` domain across all mu values; 21 sampling points, denser near the transitions.
- Simulations use the published `N~Poisson(10000)`, 2D torus, and VD/CN algorithms; 1,000 trials per `(mu,k)` each. HC is additional with 75 trials and exact/approx methods indicated in the README.
- Added portable C++ source, raw runs, combined CSV/JSON and updated embedded JavaScript. No data hand-drawn.
- Removed BC from this slide.

---

## V23

# v23 changes (slide 23 only)

- Replaced outdated mu=1,5,20 measurements with approved, corrected VD/CN simulation results for mu=4,12,36.
- 1000 simulation replicates per (mu,k), n=10,000 expected Poisson vertices, toroidal Euclidean geometry.
- Each integer k=2,...,40 is represented by its original observed recovery fraction. No smoothing, variance bands or error bars.
- Blue thick curve and white circular markers = VD; orange thick curve and diamond markers = CN.
- Buttons switch all 39 points; all three axes use exactly the same scales.
- Removed the old exploratory HC reveal and curves; HC pending validation.
- The raw data remain in experiments/approved_vdcn_mu4_12_36.csv for audit and future revisions.
- Slides 1-22 and 24-25 are untouched.

---

## V24

# v24 — Slide 23, Harmonic Centrality reveal

Reinstated exactly one slide reveal (two moments). Step 0 is VD/CN only, unchanged.
Step 1 adds the HC curve in green with triangle markers and an explanation of global distance-based centrality.

**Methodological distinction**: the HC data are exploratory, 40 trials per plotted point (19 actual measured k values for each mu). For mu=4, HC is computed exactly. For mu=12 and mu=36, the study used an approximate ranking based on distances from 256 sampled reference vertices. These estimates have known mismatches with the exact HC top-k selection for small k; do not describe them as exact HC or as 1,000-trial outcomes.

The 1,000-trial approved VD/CN data for k=2...40 are untouched. No error bars, no smoothing or invented data points.

The HC source values are in `experiments/hc_exploratory_mu4_12_36.csv`, copied from `RGG_study_mu4_12_36/results/mu{4,12,36}/hc_pilot_results.csv`.

---

## V25

# v25 — Slide 23 layout and plot readability

- Marker radii increased for VD (open circles), CN (filled diamonds), and HC (green triangles).
- HC is now solid for all three regimes. Its measurements are still exploratory and the exact/approximate methodology is clearly disclosed.
- Right explanation column rebuilt with native `<details>` / `<summary>` elements, with narrative step defaults: step 0 VD+CN open; step 1 VD+CN closed and HC open. Manual clicking is supported; revisiting a step restores the narrative state.
- HC includes the formula `H(v)=sum_{u in V\{v}} 1/d_G(v,u)` and the disconnected-pairs convention.
- Unchanged: all datasets, regime buttons, axis labels, plots values, slide 22 and qualitative diagrams.

---

## V26

# V26 — shared qualitative region diagrams

Only slides 13, 18, and 22 were modified. Slide 23 is deliberately unchanged.

- Slide 13: final VD summary displays the full approved v3 region geometry (without duplicating the headings already in the summary table).
- Slide 18: full CN v3 plot, with A/B/C badges highlighting the corresponding conditions as the four moments progress. No red failure region was introduced for CN.
- Slide 22: zoomed versions of the same curves keep the two gray transition bands, the internal dashed CN separator, and synchronised markers. Kept the original simulator bounds n=300, mu=0.5..55, k=2..30. Plot marker horizontal placement is explicitly schematic, with a reference centered at log(n) and 3log(n), *not* a finite-n interpretation of the asymptotic bands.
- The figures are SVG, embedded by the single-file build; they are generated by scripts/generate_qualitative_v26.py from the approved v3 reference curves.
- Slide 23: no changes to data, algorithms, layout, or interactions.

---

## V27

# V27 - text-free qualitative SVGs

- Slides 13, 18 and 22: preserved the approved v3 region geometry, color bands and separators.
- Removed all text and embedded legends from the four SVG assets. Labels, axis captions, regime headings and legends are now editable HTML outside each image.
- On slides 13 and 18, the legends are visibly separate below the respective diagrams.
- Slide 22: two cropped diagrams have the same shared HTML regime header; dynamic markers and simulator range stay unchanged.
- Slide 23 and benchmark datasets are intentionally untouched.
- The diagram SVGs are intentionally graphic-only; regenerate with `python scripts/generate_qualitative_v27.py` after updating the shared v3 geometry.

---

## V28

# V28 — final targeted polish

- Click the footer slide counter, type a slide number and press Enter to jump directly; Esc or click outside closes the popup.
- Cover reveal entry and network motion softened while content states stay exclusive and Published Paper stays fixed.
- Slide 4 raised the left four blocks and right network. Slide 5 compacted history card group and increased reference font.
- Slides 8–9 enlarged left equations, removed redundant regime labels and torus boundary captions, synchronized network dimensions, and cleaned copy.
- Slides 10–11 removed right-counter wording and the slide 11 Degree heading only. Slide 12 left-aligned and reduced complexity equation.
- Slide 13 added theorem-condition top and bottom rules; aligned diagram regime separators to the three table columns, increased legend text, labeled axes k and mu (log-scale).
- Other slides, scientific data and dynamics unchanged.

---

## V29

# V29 — Targeted refinements to slides 14 and 15

## Slide 14 — Proof idea: separation of degrees

- Moved alpha=0 down and alpha=infinity up; centered the alpha=1 label on the actual horizontal minimum-degree divider, using the post-reveal position.
- Lowered the maximum-degree divider and enlarged the finite-alpha formula to match the other mathematical entries.
- Placed MINIMUM and MAXIMUM transition captions under their corresponding columns and added the explicit wording "transition at" for both.
- Used context-free delta and Delta notation exclusively in the right-hand panel, including the sufficient condition k-1+delta>Delta. The left panel's mathematical definitions were unchanged.

## Slide 15 — When degrees are not enough

- Replaced the legacy inline SVG diagram with the exact approved text-free VD v3 asset already used on slide 13.
- Created independent HTML headings, logarithmic axes, color legend and a schematicity note; the v3 geometric regions and transition bands are unchanged.
- Reimplemented the interactive marker as an overlaid SVG with the same plot viewBox; preserved the existing graph, sliders, ranked bars and recovery computation.
- Slider ranges remain mu in [0.5, 19] and k in [2, 10]; the qualitative marker does not assert finite-n thresholds.

## Verification

- All five reveal moments of slide 14 and both moments of slide 15 rendered in Chromium.
- Alpha=1 label aligned to within one pixel of the minimum-degree horizontal divider.
- Min/max slider values move the diagram marker within the expected bounds; backward navigation hides the diagram when the network returns.
- JavaScript error check, offline HTML build and patch-rebuild verification passed.

---

# Early release notes from the original README

## v02 · 15 November 2026

- Slide 3: project website link and a locally embedded QR (currently pointing to the known personal site homepage `https://rmichielan.github.io/site/`; replace with the exact PAiNe page URL when supplied).
- Slide 4: stable Kamada–Kawai graph layout, stronger orange selected vertices, recovery question moved into the final step card.
- Slide 5: corrected 1970 and 1976 bibliographic details, compact references on five separate lines, DOI links where available.
- Slide 6: red below the natural clique scale, green degree-recovery region expanding to the spectral scale, careful statement that the general polynomial-time lower bound is NOT proven.
- Removed on-slide keyboard instructions from slides 4 and 8–10; shortcuts still work.

## v03 (15 November 2026)

- Slide 5: increased legibility of all five bibliographic references.
- Slide 6: thresholds are typeset with embedded MathJax SVG/LaTeX; first polynomial region is labelled consistently; removed schematic caption and kept only the two linked references.
- Slides 1-6: projection-layout and reveal audit; no changes to the narrative or to later slides.

## v04 (15 November 2026)

- Slide 7: rebuilt the illustrative Torino street-map background (Po, Dora Riparia, recognizable major avenues and landmarks); all 40 individuals are now identical teal circular markers. After the three successive geometric spaces, a fourth reveal brings all three panels side by side with the message **Similarity shapes the network** / **Connections arise between closeby vertices**. The positions are illustrative rather than measured personal data.
- Slide 8: node colors no longer encode connected components; all normal vertices share the same color. Initial and `R`-regenerated density is `mu = 1.2 log(n)`, the slider runs from 0.5 to 20 and indicates the illustrative sub-connectivity (`mu < 0.8 log(n)`), connectivity (`0.8 log(n) <= mu <= 2 log(n)`), and super-connectivity (`mu > 2 log(n)`) intervals.
- Slide 9: planted clique size runs from `k=2` to `k=10`, initially `k=5`. Ten candidate vertices are selected per generated graph and slider values use a prefix of this same ordered list; increasing `k` never reselects earlier vertices. The planted edge set is recalculated without altering the underlying geometric graph.
- Slide 10: corrected captions when toggling latent vs graph-only layouts; highlighted planted nodes disappear in the graph-only layout. The same graph and edges are retained from slides 8–9.
- Slides 8–10 use the paper's simplified `G_k(n,r)`, `K`, and `mu` notation (with `r=r_n`, `k=k_n`, and `mu=mu_n` implicitly depending on `n`, just as done in the paper's proofs).


## v05 · Torino map + political compass

Slide 7 includes the public map image `Location map Italy Torino.jpg` (OpenStreetMap data, cartography by Flappiefh, licensed CC BY-SA 3.0, https://commons.wikimedia.org/wiki/File:Location_map_Italy_Torino.jpg). When an internet connection is available, the slide loads and crops the actual street-map image of Torino, with the Po and city-center grid recognizable. The original embedded, offline vector illustration is retained as a fallback if the image cannot load. The political compass uses a true 510 x 510 square in both full-size and triptych views. All 40 people retain the same node shape and color.


## v06 · visual correction to slide 7

Removed all synthetic street grid, landmarks, labels, Po and Dora drawings previously
underneath the real street map. Slide 7 now contains **one** genuine cartographic
image layer, tinted down to 31% opacity, with all 40 individuals above it. The map
source is Wikimedia Commons File:Location map Italy Torino.jpg (Flappiefh / ©
OpenStreetMap contributors, CC BY-SA 3.0). Since the picture is externally loaded,
it requires internet; if the internet is unavailable, the map area stays blank and
neutral (rather than showing the prior invented cartography). The political compass
is a true 510 x 510 square in the main panel and in the three-panel comparison.

Source and license: https://commons.wikimedia.org/wiki/File:Location_map_Italy_Torino.jpg

Only slide 7's geographic background and related description changed; other slides
keep their v05 source.

## Version v07

- Section IV (slides 11–15) implemented in native SVG/HTML with staged reveals, algorithm-style environment, accurate theorem conditions and interactive degree sorting.
- Defined the asymptotic density parameter `α = lim μ/log n` on slide 8 as agreed.
- Used the original Toronto talk for the α-dependent minimum- and maximum-degree transition table.
- Existing slide 7 offline map limitation remains. The rest of slides 1–10 are unchanged.

**Scientific source:** K. Avrachenkov, A. Bobu, N. Litvak, R. Michielan, “Planted clique recovery in random geometric graphs”, *Journal of Complex Networks* 14(4), cnag025 (2026), https://doi.org/10.1093/comnet/cnag025.

## v10 · Section V — Common Neighbors (slides 16–20)

- Slide 16: **300 vertices exactly**, conditional geometric RGG on the flat torus (2D), mean natural degree parameter μ=7.5, planted k=10. The graph is a standalone instance independent of slides 8–15. Natural edge → induced neighborhood → toroidal zoom with r-balls → common neighbors → planted edge → induced neighborhood → planted common-neighbor clique. Press `R` on slide 16 to select another edge *from the same fixed graph*; natural-edge reselection cycles through a randomized ordering of all natural edges with both endpoints outside K (no condition on their CN count); drag the SVG to translate its toroidal view. The scene tests the CN algorithm on candidate seeded realizations to find a clear demonstrative sample; this empirical visual is not a proof of its theorem.
- Slide 17: true algorithm environment in the same style as slide 12. Exact `|Z_ij|=k-2` and clique check are separate reveal moments; complexity `O_p(μ n(n+k²))`.
- Slide 18: theorem 3.3 is split into regions **A (large μ)**, **B (few CN)**, **C (many CN)**, with the original sufficient conditions including k-range assumptions. The figure is qualitative (not a finite-n boundary), with a green region revealed separately for each condition and a beige unknown area.
- Slide 19: events **𝒜, 𝓑₁, 𝓑₂** are not to be confused with the named *regions* A, B, C. Failure decomposition and proof of existence of an edge with exactly k−2 common neighbors. Distance `d_T>2r` visually provides the witness.
- Slide 20: event 𝓑₁ via lens geometry and regions R₁, R₂; event 𝓑₂ via Poisson common-neighbor counts. The geometric meaning of dimension-dependent constants `c_{1,d}`, `c_{2,d}` is displayed.
- In the current v10 only slides 16–20 and the navigation metadata/runtime hook were added. Earlier slide design, counts, animations and interactions are preserved.

The formulas and argument outline were checked against the published 2026 paper, Sections 2.2, 3.3 and 6, https://doi.org/10.1093/comnet/cnag025.

## v16 change log
See `docs/REVISION_HISTORY.md (section v16)` for the six requested targeted refinements.
