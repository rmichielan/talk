# Planted Clique Recovery in Random Geometric Graphs

**Scientific presentation · 25 slides · HTML / CSS / JavaScript · v35 (based on the v30 refactor)**

The v30 refactor preserved the v29 HTML byte for byte. Version **v31** introduced focused presentation changes: a non-overlapping page-transition wipe, offline fallback for the Torino background, small bibliography improvements, corrected edge legends, and streamlined headings on slides 17–18. Version **v32** refines slides 19–25: proof-idea typography, simpler geometric diagrams, comparison axes and legend, consistent hollow curve markers, conclusion icons and final QR placement. Version **v33** introduced a directional Soft Slide + Fade transition. Version **v34** fixes visual popping during page changes: the browser animates composed snapshots instead of live slide elements, and all new-slide elements are settled before the incoming snapshot is captured. A two-phase fallback handles browsers without the View Transitions API. The internal reveal animations remain available after each page change. The simulation algorithms and approved experiment datasets remain unchanged. Version **v35** applies final visual refinements to slides 14, 16, 17 and 18: evenly spaced degree markers, clearer initial network edges, consistent algorithm-complexity typography, and a more balanced CN-theorem layout with concise HTML axis labels.

## Present the talk

Open **`index.html`** directly in Chrome, Firefox or Edge. No server, JavaScript installation or compilation is needed. The presentation works offline, including an embedded schematic city-grid background for slide 7. When internet is available, the authentic Torino cartographic image can replace that schematic; links to external papers still require connectivity.

- `→` or `Space`: advance; `←`: return to previous moment or slide.
- Click the bottom-right slide counter to jump by number (`Enter`), or close with `Esc`.
- `R`: regenerate a random graph in supported slides; `T`: toggle the slide-specific view.
- The deck uses 16:9 stage scaling, multiple reveal moments, and interactive graphs/plots.

See [docs/PRESENTER_GUIDE.md](docs/PRESENTER_GUIDE.md) for the **full slide-by-slide behavior** and exact simulation parameter descriptions.

## Editing and rebuilding

The only required build prerequisite is **Python 3** (the precomputed `math_assets.json` holds all LaTeX assets currently used). Node.js and the optional math renderer are necessary **only when introducing new mathematical formulas** that are absent from the cache.

```sh
python generate.py
python generate.py --check
```

GitHub Pages runs the same commands via `.github/workflows/pages.yml`. Commit the regenerated `index.html` together with the source changes. The `--check` command fails if the single-file output is stale.

Source integrity tests (Python standard library):

```sh
python -m unittest discover -s tests -p test_project.py
```

Optional Chromium interaction smoke tests: install `playwright` and a supported Chromium browser, then run `python tests/browser_smoke.py` and `TALK_QUICK=1 python tests/transition_regression.py`. Omit `TALK_QUICK=1` for the extended test across all 48 page boundaries. `TALK_CHROME` can point to a local Chromium executable.

## Source map

| Path | What it owns |
|---|---|
| `src/slides/*.html` | The 25 content pages; edit text, formulas and local markup here. |
| `src/slides/manifest.json` | Slide order, reveal counts, keys and scene-controller metadata. **Do not create per-slide JS stubs.** |
| `src/core/` | Runtime, navigation, viewport and presenter controls. |
| `src/talk/` | Scientific model, cover network, drawing, interactivity and simulation controllers. |
| `src/styles/` | Theme, section styles and ordered `talk-refinements.css` visual overrides. |
| `src/assets/` | Embedded photographs, logos, SVG graphs and qualitative diagrams. |
| `src/layouts/` | Optional reusable template snippets; not currently invoked by this talk. |
| `src/build.json` | Ordered inputs and build configuration. |
| `template/builder.py` | Assembles a standalone HTML from the manifest, style list, modules and asset cache. |
| `experiments/` | Research data and exploratory scripts, separate from runtime. |
| `scripts/` | Diagram and LaTeX SVG generation, run only when assets change. |
| `docs/` | Presenter guide, mathematical style audit and historical release notes. |

### Controller simplification

Each slide used to contain a roughly 200-byte JS file that forwarded events to one of four shared engines (`DeckScenes`, `VDScenes`, `CNScenes`, `ConclusionScenes`). These 25 files are **now generated automatically** from `manifest.json` by `template/builder.py`. The default listener includes `enter`, `leave`, `trigger` and `pauseChanged`; the few special cases are declared in metadata. The generated JavaScript is identical to v29.

To add a slide: create its HTML file, add its entry to the manifest including `scene` and the appropriate reveal count, and rerun the build. Do not add a parallel `.js` controller unless opting out of generation in `src/build.json`.

### CSS simplification

Fourteen historical targeted CSS files (`v15` through `v29`) were consolidated **in original cascade order** into `src/styles/talk-refinements.css`. Edit existing selectors there instead of creating another version-numbered CSS file for each visual tweak. Keeping the order is essential to preserving the current look; an aggressive selector-level rewrite would require its own visual regression study.

## Scientific data provenance

The approved VD/CN dataset for slide 23 is `experiments/approved_vdcn_mu4_12_36.csv`, embedded in `src/talk/experimental-data.js`. Experimental settings: `N ~ Poisson(10000)`, two-dimensional torus, `μ = 4, 12, 36`, `k = 2,...,40`, 1,000 independent trials per `(μ,k)` for VD/CN. The displayed HC points are exploratory; for `μ=12,36` they use approximated centralities and must **not** be described as exact HC. Other legacy numerical studies in `experiments/` are retained for research provenance and **do not feed slide 23**. Do not run the old `experiments/sync_results.py` over the approved embedded dataset.

VD and CN schematic regions are **qualitative**, not finite-n exact thresholds. The three-regime positions and moveable indicators in slides 15/22 are deliberately illustrative. The diagram sources and original notebooks remain available separately as research materials.

## Refactor parity guarantee

For the v29 → v30 cleanup, `python generate.py --check` succeeds and the complete generated `index.html` SHA-256 remains:

`675f9e51c22e16ea70a221b5f1710297795fda2f6d5cb5c66be5251bf1a3ad6d`

This means **zero presentation-level changes** in this release. The archived individual CSS patch sources and controller files were combined/generated without changing their emitted contents. The release history is in [docs/REVISION_HISTORY.md](docs/REVISION_HISTORY.md).
