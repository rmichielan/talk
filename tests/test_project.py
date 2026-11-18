"""Standard-library structural tests for the reproducible scientific-talk build."""
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from template.builder import build_document, generated_controller  # noqa: E402


class DeckBuildTest(unittest.TestCase):
    def test_generated_document_matches_committed_file(self):
        document, sources, outputs = build_document()
        self.assertEqual(outputs, [Path('index.html')])
        self.assertEqual((ROOT / 'index.html').read_bytes(), document.encode('utf-8'))
        self.assertGreater(len(sources), 30)

    def test_every_slide_has_an_html_source_and_generated_controller(self):
        manifest = json.loads((ROOT / 'src/slides/manifest.json').read_text())
        self.assertEqual(len(manifest), 25)
        self.assertEqual([s['id'] for s in manifest], list(range(1, 26)))
        for slide in manifest:
            self.assertTrue((ROOT / 'src/slides' / (slide['name'] + '.html')).exists())
            self.assertFalse((ROOT / 'src/slides' / (slide['name'] + '.js')).exists())
            self.assertIn(slide['controller'], generated_controller(slide))

    def test_build_inputs_exist(self):
        cfg = json.loads((ROOT / 'src/build.json').read_text())
        self.assertTrue(cfg['generate_slide_controllers'])
        for key in ('styles', 'runtime_modules', 'after_slides_modules', 'controls_html'):
            for filename in cfg[key]:
                self.assertTrue((ROOT / filename).is_file(), f'Missing {filename}')
        self.assertTrue((ROOT / cfg['head_html']).is_file())
        self.assertEqual(len([x for x in cfg['styles'] if '/v2' in x]), 0)
        self.assertEqual(cfg['styles'][-1], 'src/styles/talk-refinements.css')


if __name__ == '__main__':
    unittest.main()
