# BlockLink — Minecraft Remote Controller

Browser-only experiment for controlling the original Minecraft/Eaglercraft page on a school tablet from a second phone.

## Target experience

- Tablet: keep the original Wasm Arcade game page open.
- Phone: open a responsive touch controller website.
- Link: send controller input to a bridge running inside the game page.

## Milestones

1. **Same-page bridge proof:** verify that the game page accepts keyboard input from a script running in that same page.
2. **Phone controller UI:** joystick, camera pad, jump, sprint, attack, place, inventory and hotbar.
3. **Pairing transport:** room-based browser-to-browser messaging.
4. **Real-device test:** test on the school tablet browser and the phone.

## Technical constraint

A controller page on another origin cannot directly dispatch keyboard/mouse events into the game's tab. The tablet-side bridge must execute in the game's own page context. A WebSocket connection transports commands but does not itself grant input access.

## Current status

- Project shell committed.
- Same-page input bridge is the next proof of concept.
- No remote connection has been tested yet.
