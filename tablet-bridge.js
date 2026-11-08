(() => {
  if (window.__blockLinkBridge) {
    window.__blockLinkBridge.destroy();
    return;
  }

  const style = document.createElement("style");
  style.id = "blocklink-bridge-style";
  style.textContent = `
    #blocklink-pad{position:fixed;z-index:2147483647;inset:auto 12px 12px 12px;display:flex;justify-content:space-between;align-items:end;gap:14px;pointer-events:none;font:600 13px system-ui,sans-serif;color:#fff}
    #blocklink-pad *{box-sizing:border-box}
    #blocklink-pad .cluster{display:grid;grid-template-columns:repeat(3,48px);grid-template-rows:repeat(2,48px);gap:5px;pointer-events:auto}
    #blocklink-pad button{border:1px solid #ffffff55;background:#172331dd;color:#fff;border-radius:13px;min-width:48px;min-height:48px;font-size:15px;touch-action:none;user-select:none;box-shadow:0 4px 14px #0006}
    #blocklink-pad button:active{background:#387d62}
    #blocklink-pad .actions{display:flex;gap:7px;flex-wrap:wrap;justify-content:end;max-width:190px;pointer-events:auto}
    #blocklink-pad .actions button{min-width:54px;min-height:54px}
    #blocklink-pad .tag{position:absolute;top:-30px;right:0;background:#102019dd;border:1px solid #75e0ad88;color:#a8f0c7;padding:5px 9px;border-radius:9px;font-size:11px}
    @media(min-width:700px){#blocklink-pad{opacity:.82}}
  `;

  const root = document.createElement("div");
  root.id = "blocklink-pad";
  root.innerHTML = `
    <div class="tag">BLOCKLINK INPUT TEST · tap × to close</div>
    <div class="cluster">
      <span></span><button data-key="w">▲</button><span></span>
      <button data-key="a">◀</button><button data-key="s">▼</button><button data-key="d">▶</button>
    </div>
    <div class="actions">
      <button data-key=" " aria-label="Jump">JUMP</button>
      <button data-key="Shift" aria-label="Sneak">SNEAK</button>
      <button data-mouse="0">MINE</button>
      <button data-mouse="2">PLACE</button>
      <button data-close="1">×</button>
    </div>`;

  document.documentElement.append(style, root);

  const keyMap = {
    w: ["KeyW", "w"], a: ["KeyA", "a"], s: ["KeyS", "s"], d: ["KeyD", "d"],
    " ": ["Space", " "], Shift: ["ShiftLeft", "Shift"]
  };

  function sendKey(key, type) {
    const pair = keyMap[key];
    if (!pair) return;
    const target = document.activeElement || document.body;
    const event = new KeyboardEvent(type, {
      key: pair[1], code: pair[0], bubbles: true, cancelable: true,
      composed: true
    });
    target.dispatchEvent(event);
    window.dispatchEvent(new KeyboardEvent(type, {
      key: pair[1], code: pair[0], bubbles: true, cancelable: true
    }));
  }

  function bindHold(button, key) {
    let held = false;
    const down = event => {
      event.preventDefault();
      if (held) return;
      held = true;
      try { button.setPointerCapture(event.pointerId); } catch (_) {}
      sendKey(key, "keydown");
    };
    const up = event => {
      if (!held) return;
      held = false;
      sendKey(key, "keyup");
    };
    button.addEventListener("pointerdown", down);
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(name => button.addEventListener(name, up));
  }

  root.querySelectorAll("[data-key]").forEach(button => bindHold(button, button.dataset.key));
  root.querySelectorAll("[data-mouse]").forEach(button => {
    button.addEventListener("pointerdown", event => {
      event.preventDefault();
      const buttonNumber = Number(button.dataset.mouse);
      const target = document.querySelector("canvas") || document.activeElement || document.body;
      const names = buttonNumber === 2 ? ["contextmenu"] : ["mousedown"];
      names.forEach(name => target.dispatchEvent(new MouseEvent(name, {
        button: buttonNumber, buttons: buttonNumber === 0 ? 1 : 2, bubbles: true, cancelable: true
      })));
    });
    button.addEventListener("pointerup", () => {
      const target = document.querySelector("canvas") || document.activeElement || document.body;
      target.dispatchEvent(new MouseEvent("mouseup", {button:Number(button.dataset.mouse),bubbles:true}));
    });
  });

  root.querySelector("[data-close]").addEventListener("click", () => window.__blockLinkBridge.destroy());

  window.__blockLinkBridge = {
    destroy() {
      root.remove();
      style.remove();
      delete window.__blockLinkBridge;
    },
    sendKey,
    version: "0.1.0"
  };
  console.info("[BlockLink] same-page input test overlay loaded.");
})();