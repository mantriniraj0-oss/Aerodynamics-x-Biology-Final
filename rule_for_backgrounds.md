When implementing full-page background images:
- Prefer using a fixed `div` container with `z-index: -1` over styling the `body` tag directly.
- This ensures better control over overlays, positioning (parallax), and avoids conflicts with CSS framework resets.