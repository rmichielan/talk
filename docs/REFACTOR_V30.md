# v30 refactor — exact-output compatibility audit

## Objective

Simplify the editable repository without changing the presentation, its scientific content, experiment data, simulation code, controls, visual design, asset bytes, or single-file HTML output.

## What changed

| Before (v29) | After (v30) | Reason |
|---|---|---|
| 25 one-line `src/slides/*.js` controllers | Generated from the per-slide `scene` declarations in `src/slides/manifest.json` | No repeated JS scaffolding; equivalent generated code |
| 14 chronological CSS patch files | One ordered `src/styles/talk-refinements.css` | Preserve cascade exactly and remove version-specific file management |
| 14 separate `docs/V##_CHANGES.md` files | `docs/REVISION_HISTORY.md` | Keep all historical decisions in one searchable reference |
| A 20 KB README mixing current instructions with years of history | Concise `README.md`, detailed `docs/PRESENTER_GUIDE.md`, archived notes | Make the project easier to navigate |
| Four genuinely unused placeholder/starter/utility files | Removed | Eliminate dead files that neither build nor slides reference |
| No systematic source integrity tests | `tests/test_project.py` and optional `tests/browser_smoke.py` | Guard future edits |

The shared `/src/layouts` partials and `/experiments` code are deliberately **retained**, even though they are not all used by the current runtime, because they serve template reuse and scientific provenance respectively.

## Exact identity of deliverable HTML

SHA-256 of `index.html` in v29 and after rebuilding from refactored v30 sources:

`675f9e51c22e16ea70a221b5f1710297795fda2f6d5cb5c66be5251bf1a3ad6d`

Size in both cases: **3,605,772 bytes**. This verifies that the complete HTML, CSS, JS and embedded assets are **identical byte for byte**. No screenshot approximation or visual-only equivalence is involved.

The following checks also passed:

```sh
python generate.py
python generate.py --check
python -m unittest discover -s tests -p test_project.py
```

Browser smoke test (Chromium + Playwright):

```sh
python tests/browser_smoke.py
```

It checks navigation by slide number, cover state reversal, size parity of slide 8/9 network canvases, embedded qualitative graphics, slide 15 switch, slide 23 presence and uncaught browser errors.

## Scope and limits

- This is intentionally **not** a selector-level CSS rewrite or a mathematical algorithm refactor. Both would make exact-output parity harder to guarantee. The consolidated refinements still contain historical overrides in their original cascade order.
- Existing third-party references, externally linked map resources and recorded numerical datasets are unchanged.
- The historical experiment scripts under `/experiments` do not feed the live presentation except for the specifically approved embedded dataset. They remain for provenance and have not been modified.
- For future substantive talk edits, the saved v29 hash is no longer expected to remain unchanged. Instead use `python generate.py --check` and the new regression tests against that future version.
