from pathlib import Path

from mitmproxy import ctx, http

TARGET_HOST = "kuliah.itera.ac.id"
BOT_PATH = Path(__file__).with_name("bot.js")
KEY_PATH = Path(__file__).with_name("key.txt")
OAI_KEY_PATH = Path(__file__).with_name("oai_key.txt")


def load_bot() -> str:
    try:
        return BOT_PATH.read_text(encoding="utf-8")
    except OSError as exc:
        ctx.log.error(f"[mikost-bot] gagal baca bot.js: {exc}")
        return ""


def load_key() -> str:
    try:
        return KEY_PATH.read_text(encoding="utf-8").strip()
    except OSError:
        return ""


def load_oai_key() -> str:
    try:
        return OAI_KEY_PATH.read_text(encoding="utf-8").strip()
    except OSError:
        return ""


def js_str(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"').replace("<", "\\x3c")


def response(flow: http.HTTPFlow) -> None:
    if TARGET_HOST not in (flow.request.pretty_host or ""):
        return
    ctype = flow.response.headers.get("content-type", "")
    if "text/html" not in ctype.lower():
        return
    if flow.response.status_code != 200:
        return

    bot = load_bot()
    if not bot:
        return
    try:
        html = flow.response.get_text()
    except ValueError:
        return
    if "Mikost" in html or "Anti Maling" in html:
        return
    marker = "</body>"
    key = load_key()

    key_tag = ""
    if key:
        key_tag += '<script>window.__MIKOST_BOT_KEY="' + js_str(key) + '";</script>\n'
    oai_key = load_oai_key()
    if oai_key:
        key_tag += '<script>window.__MIKOST_BOT_OAIKEY="' + js_str(oai_key) + '";</script>\n'
    tag = key_tag + "<script>/* mikost-bot injected */\n" + bot + "\n</script>\n</body>"
    if marker in html.lower():
        idx = html.lower().rfind(marker)
        html = html[:idx] + tag + html[idx + len(marker):]
        flow.response.set_text(html)
        ctx.log.info(f"[mikost-bot] injected -> {flow.request.path[:80]}")
