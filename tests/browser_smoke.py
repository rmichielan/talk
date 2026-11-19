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

        async def wait_for_page(target, target_step=0):
            await page.wait_for_function(
                "([page, step]) => {const state=window.talk.state();return state.slide===page && state.step===step && document.querySelector('#slide').getAnimations({subtree:false}).length===0;}",
                arg=[target, target_step], timeout=15000)

        async def goto(target, target_step=0):
            await page.evaluate('([s, t]) => window.talk.go(s, t)', [target, target_step])
            await wait_for_page(target, target_step)

        # Counter selector and a full slide transition, including the return.
        await page.locator('#counter').click()
        await page.locator('#slide-jump-input').fill('13')
        await page.locator('#slide-jump-input').press('Enter')
        await wait_for_page(13)
        await goto(1, 1)
        await page.wait_for_timeout(450)
        cover1 = await page.locator('.cover-paper').bounding_box()
        await goto(1, 2)
        await page.wait_for_timeout(450)
        cover2 = await page.locator('.cover-paper').bounding_box()
        assert abs(cover1['y'] - cover2['y']) < 0.5

        # The same RGG realization occupies the same viewport on slides 8 and 9.
        await goto(8, 3)
        rgg = await page.locator('#rgg-svg').bounding_box()
        await goto(9, 3)
        planted = await page.locator('#plant-svg').bounding_box()
        assert all(abs(rgg[k] - planted[k]) < 1 for k in ('x', 'y', 'width', 'height'))

        # The v3 qualitative figures stay embedded; slide 23 stays interactive.
        for slide_id in (13, 15, 18, 22, 23, 25):
            await goto(slide_id)
        await goto(13, 3)
        assert (await page.locator('.s13 .q27-plot-image').get_attribute('src')).startswith('data:image/svg+xml;base64,')
        await goto(15, 1)
        await page.wait_for_timeout(700)
        assert await page.locator('.s15 .vd15-regime-view').is_visible()
        await goto(23, 1)
        assert await page.locator('.s23').count() == 1
        assert not errors, errors
        print('Browser smoke test: passed; slides, controls, diagrams and JavaScript errors checked')
        await browser.close()


if __name__ == '__main__':
    asyncio.run(main())
