# Portfolio media

Project galleries use the existing Once UI `SmartImage` and portfolio `Carousel`.
The first item can be an MP4 preview; subsequent stills explain the project. New
screenshots are captured at 1920 × 1080, with English interfaces. Preserve source
pixels: export interface captures as lossless WebP and pass them through without
another Next Image encode. `SmartImage` now respects caller quality, sizes and
unoptimized props; its ordinary image default is 85 rather than 50.

Game stills use WebP quality 95. Their source PNGs are Full HD. Steam screenshots
are kept at their original 1920 × 1080 resolution.

## Gameplay previews

Undertaker opens with 18 seconds from the official demo trailer (15.5–33.5 s),
obtained from the English Steam store's trailer manifest. Jack & Snag opens with
20 seconds captured directly in Godot on the glass track, with the existing
Steam capture tool, five bots, English UI, no HUD and a 1920 × 1080 PNG sequence
at 30 fps. Its additional stills show the glass track and the Frutiger arena.
The optional diagnostic instrument and player labels are hidden for capture.

Encode a silent landscape preview:

```sh
ffmpeg -ss 15.5 -i source.mp4 -t 18 -vf "fps=30,scale=1280:720:flags=lanczos" -an -c:v libx264 -crf 21 -preset slow -x264-params "aq-mode=2:aq-strength=1.2" -maxrate 2200k -bufsize 4400k -profile:v high -level 3.1 -pix_fmt yuv420p -movflags +faststart showcase.mp4
```

For the PNG sequence use `-framerate 30 -i f_%05d.png`, a 20-second limit and
CRF 23. Both previews are about 5 MiB. Add a matching Full HD `showcase.webp`
poster. Legacy gallery videos have a same-name JPEG poster.

Previews load when first visible, pause outside the viewport and in hidden tabs,
and show their poster with reduced motion or data saving enabled. Carousel
navigation preloads only stills. Images and media are static CDN assets; the new
WebP screenshots don't consume Vercel image transformations.

## Music Collection

Nine selected tracks are served locally. Seven additions keep the downloaded
AAC/M4A audio without a second lossy audio encode. The two existing music clips
retain their original 350 × 350 FFmpeg exports and full timelines. The clip for
Traité de paix is *Lost in Dreams and Nostalgia – Movies Edit* by trotorrr.
Audio and video remain synchronized by the existing player.

Square video is fetched only when the track starts; the cover poster is shown
before playback. Covers are 600 × 600 WebP exports of the owner's illustrations.
The original artwork for *Le verger sans printemps* is `Fleurdemie.png`. The
recording “67” is presented as “Orchestral sketch”.

Unselected track metadata and the previous YouTube catalog are preserved in
`src/app/music/archive/`; the old audio files are retained. This archive is not
read by the public project loader.

The original square-video presets remain in the repository README. Choose the
dark-scene AQ preset for shadow detail and inspect the resulting size. A static
cover and full audio are enough when a moving image adds little to the piece.
