# Presenter guide — preserved v29 behavior

This guide preserves the detailed slide-by-slide behavior from the original v29 README. The v30 refactor changes only source organization, not the delivered presentation.

## Run (no installation)

Open `index.html` in Chrome, Firefox, or Edge. All scripts, mathematical fonts as SVGs, logos, photos and simulations are embedded into this single file. Note: the Torino background map on slide 7 still requests the OpenStreetMap-derived image online (a limitation inherited from v06); other visuals work without an Internet connection. DOI links also require a connection.

Presentation shortcuts (click the **?** in the lower-left corner for the on-screen guide; current slide number **01 / 25** appears at bottom-right and is clickable to jump directly to another slide):

- Click the bottom-right slide counter, type a slide number and press `Enter` to jump directly; `Esc` closes it.
- `→`, `Space`: next reveal / next slide.
- `←`: previous reveal / previous slide.
- `R`: regenerate the current random example where available.
- `T`: slide-specific toggle / trigger where available.
- Drag the graph on slide 8 or 9 to translate the torus view.
- The μ slider on slide 8 varies geometric connectivity, while `R` generates another Poisson RGG and returns μ to `1.2 log n`.
- Slide 9 inherits *the same graph and positions* from 8, and slide 10 inherits the same planted graph from 9. In latent-geometric views, natural edges use torus-wrapped segments and **newly planted edges use direct chords**; the Kamada–Kawai view does not apply torus wrapping. `T` on slide 9 reveals/hides the planting. `T` on slide 10 switches between true latent positions and a Kamada–Kawai graph-only layout.
- Slide 11 starts a fresh, reproducible example with exactly **100 vertices**, μ=4.5, k=10. The presenter advances three manual moments (vertical natural-degree bars → orange increments stacked above the blue without rank changes → smooth left-to-right reordering of the vertical bars). Natural degree is always blue; only newly added edges contribute an orange segment. The default realization recovers all planted vertices.
- Slide 12 keeps the successful example and shows Algorithm 1, its computational complexity and a single large top-k degree-ranking visualization (no redundant network drawing).
- Slide 13 defines alpha, T(n), t(n), and H on the left (without yet identifying the sequences as degree extrema); the positive theorem, negative theorem, and final three-regime aligned summary with the qualitative log–log diagram appear in succession on the right. The two theorem statements retain their epsilon assumptions. Slide 14 uses the Toronto-inspired minimum/maximum degree ladder on the left, and the degree-boost argument with LaTeX-rendered diagram labels and sufficient condition on the right.
- Slide 15 uses the **same 100-vertex demonstration model** with sliders μ∈[0.5,19], k∈{2,…,10}; `T` toggles the same planted set. The set is a prefix of a fixed list of 10 candidates, so changing k preserves prior selections. `R` redraws at the selected μ and k. The network view is replaced by the qualitative log–log regime diagram on the next reveal; the ranked-degree bars remain visible on the right. The marker is schematic and does not assert finite-n theorem validity. μ≤19 maintains the RGG model restriction r<1/4 when n=100.

- Slide 16 presents an independent **exactly 300-vertex** toroidal graph at μ=7.5 and k=10. Drag to translate the graph. The natural-edge sequence reveals endpoints, induced neighborhoods, a centered ~3.675x zoom and highlighted common neighbors; the planted-edge sequence shows the planted-edge witness and the highlighted clique. `R` selects a different eligible edge in the **same graph**, resetting translation. The initial zoom correctly accounts for any prior dragging. All newly planted links (including nonselected ones) use direct chords in the latent view; all clique edges are direct when the planted-edge sequence is active. A numeric common-neighbor count appears only when common neighbors are highlighted.
- Slide 17 reproduces the CN algorithm in the same mathematical/pseudocode visual language as slide 12; its complexity estimate, exact-count check and clique check are visible in successive reveals.
- Slide 18 renders the three sufficient CN recovery regimes **A, B, C** separately with full-size formulas and progressively green regions in a qualitative log–log diagram based on the paper's Fig. 2(b) and the uploaded Toronto talk, with distinct B/C regions and a gray connectivity band (math labels rendered from LaTeX); final reveal compares all conditions side-by-side.
- Slides 19–21 split the proof idea into three linked parts: **what can go wrong?** (clearly defined calligraphic events 𝒜, 𝓑₁, 𝓑₂ and a failure bound), **finding a planted edge** (geometrically distant clique vertices), and **excluding false positives** (highlighted geometric cap sets R₁,R₂ (with mathematical labels/typeset formulae) and Poisson-count tails, explaining c₁,d and c₂,d). Capital A/B/C in the diagram refer to *regimes*, not calligraphic events.

- Slide 22 compares VD and CN qualitative recovery regions using **identically aligned log-scale axes**, against a 300-vertex hard-RGG observed graph with its planted clique revealed using Kamada–Kawai. The two synchronized markers respond to `mu ∈ [0.5,55]` and `k ∈ {2,…,30}`. The marker mapping is intentionally **schematic**; theoretical regions describe asymptotic sufficient/negative conditions and do not classify a finite-n realization. `R` reseeds the graph.
- Slide 23 shows the approved corrected VD/CN exact-recovery experiments initially, adding exploratory HC in a **second reveal** and three clickable choices `mu=4,12,36`. It has the same `k=2,...,40` range for each regime, `N~Poisson(10000)`, `d=2`, and **1,000 simulations for each (mu,k)**. The blue circle-marker curve is Vertex Degree, and the orange diamond-marker curve is Common Neighbors. Exact observed proportions are plotted with no smoothing or confidence bands. HC appears in the second reveal with a methodological disclosure: it is exploratory (exact at mu=4, approximation via sampled reference vertices at mu=12,36). The source rates and success counts are in `experiments/approved_vdcn_mu4_12_36.csv`, and are embedded in `src/talk/experimental-data.js`. The previous v22 experiments and scripts remain archived under `experiments/` and do not feed slide 23.

- Slide 24 gives three research takeaways and open problems (higher dimension, soft/heterogeneous RGGs, centrality scores) and connects them back to PAiNe.
- Slide 25 recreates the 12-Nov-2026 closing cover (Thank you, Questions, personal site QR, institutional logos), with the **same animated network** as the opening slide. This reuse is intentional; no second independent network renderer is introduced.

All animations and revealed states are reproducible with the initial seed. `R` changes seeds. Slide 7 uses **40 fixed, seeded illustrative coordinates** distributed in unequal geographic clusters, a broad continuous moderate-heavy political cloud, and a math-interest illustration with more low- than high-interest values. They are not representative survey records, do not identify political groups, and do not regenerate when revealing. Refer to `docs/V15_STYLE_AUDIT.md` for assumptions and external references. The cover has an additional third moment after the coauthors: the six-part talk outline.


## Mathematical conventions

The random geometric model follows the accompanying paper *Planted clique recovery in random geometric graphs* (Journal of Complex Networks, 2026, doi:10.1093/comnet/cnag025): a Poisson(`n`) number of uniformly located torus vertices, Euclidean distance with periodic identification, hard radius `r_n`, `μ_n = n φ_d r_n^d`, technical condition `r_n < 1/4` and a uniformly sampled planted vertex set independent of the latent positions. Slide 8 **depicts only d=2** while stating the general-d formula.

The connectivity-scale marker μ ≈ log n is asymptotic; component counts shown are realization-specific. The positional examples on slide 7 (Torino, political orientation, age and mathematics interest) are hypothetical **visual metaphors**, not actual personal data. Kamada–Kawai on slide 10 is a topology-derived schematic layout, not an inference of the hidden positions. The finite-n planted scenarios are illustrative simulations and are not proofs of statistical recovery thresholds.

## Academic sources and assets

- Riccardo Michielan, Konstantin Avrachenkov, Andrei Bobu, Nelly Litvak, *Planted clique recovery in random geometric graphs*, Journal of Complex Networks 14 (2026), cnag025. https://doi.org/10.1093/comnet/cnag025
- Historical timeline: Matula (1970, 1976); Bollobás & Erdős (1976); Kučera (1977, 1995); Alon, Krivelevich & Sudakov (1998).
- Reused uploaded assets: 12 November 2026 HTML talk template, Toronto 2026 collaborator photographs, UniPD / MSCA imagery from provided source materials.

Current delivery: **v14**, complete HTML presentation through slide 25, with the shared 12-Nov template presentation controls, responsive stage geometry, editable modular sources and built-in mathematical figures.

### Cover refinements (15 Nov 2026)
The first cover state keeps the signal propagation and RGB clique glitch.
In the second cover state the network freezes, and all edges and nodes
of one planted clique remain highlighted. Node disks are 35% smaller
and base edge strokes are slightly heavier than in the preceding version.

### Introduction updates (15 Nov 2026)
- Slide 2: the initial graph and both comparison networks now use topology-derived Kamada-Kawai layouts, recomputed whenever R regenerates them.
- Recovery reveal order: natural copy (purple, not planted), then planted copy (orange); detection in the paired network view.
- Slide 2 no longer displays the R-key instruction on the canvas.
- Slide 3 UniPD and MSCA logos enlarged and moved to the upper-right area.
- Section I renamed Introduction. All other slides retain their previous behavior.
