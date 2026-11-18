"""Optional Chromium/Playwright interaction smoke test (not needed to build)."""
import asyncio
import os
import shutil
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]


async def main():
    async with async_playwright() as p:
        browser_path = os.getenv('TALK_CHROME') or shutil.which('chromium') or shutil.which('google-chrome')
        launch = {'headless': True, 'args': ['--no-sandbox', '--disable-background-networking']}
        if browser_path:
            launch['executable_path'] = browser_path
        browser = await p.chromium.launch(**launch)
        page = await browser.new_page(viewport={'width': 1600, 'height': 900})
        errors = []
        page.on('pageerror', lambda err: errors.append(str(err)))
        await page.set_content((ROOT / 'index.html').read_text(), wait_until='load', timeout=60000)
        await page.wait_for_timeout(350)

        # Navigation jump, including going back to the cover.
        await page.locator('#counter').click()
        await page.locator('#slide-jump-input').fill('13')
        await page.locator('#slide-jump-input').press('Enter')
        assert await page.evaluate('window.talk.state().slide') == 13
        await page.evaluate('window.talk.go(1,1)')
        await page.wait_for_timeout(450)
        cover1 = await page.locator('.cover-paper').bounding_box()
        await page.evaluate('window.talk.go(1,2)')
        await page.wait_for_timeout(450)
        cover2 = await page.locator('.cover-paper').bounding_box()
        assert abs(cover1['y'] - cover2['y']) < 0.5

        # The same RGG realization occupies the same viewport on slides 8 and 9.
        await page.evaluate('window.talk.go(8,3)')
        await page.wait_for_timeout(150)
        rgg = await page.locator('#rgg-svg').bounding_box()
        await page.evaluate('window.talk.go(9,3)')
        await page.wait_for_timeout(150)
        planted = await page.locator('#plant-svg').bounding_box()
        assert all(abs(rgg[k] - planted[k]) < 1 for k in ('x', 'y', 'width', 'height'))

        # The v3 qualitative figures stay embedded; slide 23 stays interactive.
        for slide_id in (13, 15, 18, 22, 23, 25):
            await page.evaluate('(id) => window.talk.go(id,0)', slide_id)
            await page.wait_for_timeout(80)
            assert await page.evaluate('window.talk.state().slide') == slide_id
        await page.evaluate('window.talk.go(13,3)')
        assert (await page.locator('.s13 .q27-plot-image').get_attribute('src')).startswith('data:image/svg+xml;base64,')
        await page.evaluate('window.talk.go(15,1)')
        await page.wait_for_timeout(700)
        assert await page.locator('.s15 .vd15-regime-view').is_visible()
        await page.evaluate('window.talk.go(23,1)')
        assert await page.locator('.s23').count() == 1
        assert not errors, errors
        print('Browser smoke test: passed; slides, controls, diagrams and JavaScript errors checked')
        await browser.close()


if __name__ == '__main__':
    asyncio.run(main())
