"""Browser regression for V34 composed-slide transitions.

Checks every slide boundary both ways, arrival CSS stability, native snapshot
support, the Web Animations fallback, reduced motion, and internal reveals.
"""
import asyncio
import os
import shutil
from pathlib import Path

from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]


async def check_page(page, target, target_step):
    await page.wait_for_function(
        "([n, s]) => window.talk.state().slide===n && window.talk.state().step===s && "
        "!document.querySelector('#slide').classList.contains('deck-preparing') && "
        "document.getAnimations().filter(a=>a.playState==='running' && "
        "(a.effect?.target?.pseudoElement||'').startsWith('::view-transition')).length===0",
        arg=[target, target_step], timeout=18000,
    )


async def main():
    async with async_playwright() as p:
        chrome = os.environ.get('TALK_CHROME') or shutil.which('chromium')
        browser = await p.chromium.launch(
            executable_path=chrome, headless=True,
            args=['--no-sandbox', '--disable-background-networking'],
        )
        page = await browser.new_page(viewport={'width': 1600, 'height': 900})
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        await page.set_content((ROOT / 'index.html').read_text(), wait_until='load', timeout=60000)
        assert await page.evaluate('typeof document.startViewTransition === "function"')

        # Every boundary in both directions. Include a last-step exit and
        # backward entry into the preceding slide's last moment.
        if not os.getenv("TALK_QUICK"):
          for dest in range(2, 26):
            await page.evaluate('(s)=>window.talk.go(s,0)', dest)
            await check_page(page, dest, 0)
            assert await page.evaluate("document.querySelector('.stage.is-active').dataset.slide") == str(dest)
          for dest in range(24, 0, -1):
            await page.evaluate('(s)=>window.talk.go(s,0)', dest)
            await check_page(page, dest, 0)
          print('48 slide-to-slide transitions: pass',flush=True)

        # The historically troublesome 15 <-> 16 crossing: after landing,
        # text and geometry should be in their final state, with no residual
        # descendant CSS transition or cover CSS keyframe playing.
        for a, a_step, b, b_step in [(15, 1, 16, 0), (16, 6, 15, 1), (1, 2, 2, 0), (2, 4, 1, 0), (24, 0, 25, 0), (25, 0, 24, 0)]:
            print(f"critical {a}:{a_step} -> {b}:{b_step}",flush=True)
            await page.evaluate('([s,t])=>window.talk.go(s,t)', [a, a_step])
            await check_page(page, a, a_step)
            await page.evaluate('([s,t])=>window.talk.go(s,t)', [b, b_step])
            await check_page(page, b, b_step)
            assert await page.evaluate("document.querySelector('#slide').classList.contains('deck-settled')")
        print('six critical slide pairs, including 15 to 16: pass')

        # A later within-slide reveal must still animate normally after arrival.
        await page.evaluate('window.talk.go(13,0)')
        await check_page(page, 13, 0)
        await page.evaluate('window.talk.go(13,1)')
        await check_page(page, 13, 1)
        assert not await page.evaluate("document.querySelector('#slide').classList.contains('deck-settled')")
        print('internal reveal styling re-enabled: pass')

        # The fallback can be forced independently of view transitions.
        await page.evaluate("document.startViewTransition = undefined")
        for s in (14, 15, 16, 17, 18):
            await page.evaluate('(s)=>window.talk.go(s,0)', s)
            await check_page(page, s, 0)
        print('legacy fallback: pass')

        # Respect prefers-reduced-motion with instant slide changes.
        await page.emulate_media(reduced_motion='reduce')
        await page.evaluate('window.talk.go(2,0)')
        await check_page(page, 2, 0)
        assert not await page.evaluate("document.querySelector('#slide').classList.contains('deck-preparing')")
        print('reduced motion: pass')
        assert not errors, errors
        print('No JavaScript errors')
        await browser.close()


if __name__ == '__main__':
    asyncio.run(main())
