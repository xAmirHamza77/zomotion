# Contributing to Zomotion

Thank you for your interest in contributing to **Zomotion: The Cinematic Programmatic Motion Graphics Engine**!

## Development Workflow

1. **Fork and Clone**
   ```bash
   git clone https://github.com/xAmirHamza77/zomotion.git
   cd zomotion
   npm install
   ```

2. **Launch Studio**
   ```bash
   npm run dev
   ```
   Open the browser interface to inspect your compositions and scrub frame-by-frame with hot module reloading.

3. **Verify Compositions**
   ```bash
   npm run still -- --frame=45 out/test-still.png
   npm run render
   ```

## The Quality Laws

All contributions must adhere to the **Zomotion Aesthetic Quality Checklist** located in `.agents/skills/zomotion/references/aesthetic-checklist.md`:

- **Deterministic Math**: Never use `Math.random()` or `Date.now()`. Use `mulberry32(seed)` to guarantee frame determinism across parallel rendering workers.
- **Layout-Scale Zoom**: In 3D camera scenes, leverage CSS `zoom` rather than GPU `transform: scale()` to avoid Chromium downsampling blur on text and fine lines.
- **Audio Integrity**: Follow the 16 SFX families. Never use cartoonish synthesizer bloops; rely on authentic physical Foley and compensate for $-1.28\text{f}$ AAC priming offsets.
- **Rhythm Budget**: Do not shake or slam the entire viewport on every beat. Limit camera slams to $\le 3$ per video.

## Pull Requests

1. Create a feature branch: `git checkout -b feature/my-new-shot-recipe`
2. Commit your changes with clear, descriptive messages.
3. Push to your branch and submit a Pull Request.
