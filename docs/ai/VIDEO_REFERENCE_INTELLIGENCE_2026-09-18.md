# Video reference intelligence — 2026-09-18

Scope: current official platform guidance used as a bounded reference for the internal short-form video exam. These are mechanics, not copied creative or source media.

| Source | Mechanic extracted | Applicability to original cut | Rights / implementation check |
|---|---|---|---|
| [YouTube Shorts upload tips](https://support.google.com/youtube/answer/12921536) | Square or vertical short-form upload; test upload and sustainable cadence are recommended | Keep the first/second cut vertical and inspect a real delivery encode before any publication | No YouTube asset was imported; generated local SVG layers only |
| [YouTube mobile filming tips](https://support.google.com/youtube/answer/12948118) | Shoot vertically, plan a shot list, protect sound quality, and leave a beat around starts/stops | The exam has an explicit shot plan, 9:16 frames, real voice/audio bed, and measured beat changes | Voice is local Windows SAPI; audio bed is generated sine; no external recording |
| [YouTube Shorts enhancement guidance](https://support.google.com/youtube/answer/16215842) | Text/interactive overlays can be hidden by platform UI; use visual safe-area guides | Titles, captions and data overlay stay inside a 64px horizontal safe margin; contact sheets inspect placement | No platform publication; safe margin is an internal measurable rule |
| [TikTok Creative Center](https://ads.tiktok.com/resources/help/article/creative-center) | Use current public creative examples/trends as research input, not as copied source | Internal consilium uses the principle of rapid hook → action → payoff and then tests a faster second cut | No trend asset, music, logo or third-party media was copied |

## Internal translation

- First cut: 3 long beats, max 7 seconds, clear voice/captions but slower cadence.
- Consilium: identified hook delay, broad lower-third treatment and weak rhythm as repair targets.
- Second cut: 8 beats, max 2.5 seconds, problem named at 0s, generated still/data layer, safe margins, timed captions, real voice mix and final payoff.
- Evidence: `tests/fixtures/second-brain/video/evidence/video-evidence.json` plus first/second contact sheets. Master/delivery files are generated in an ephemeral task directory and removed after the run.

The reference research informs the test mechanics only. It is not a claim of platform approval, reach, ranking, or publication readiness.
