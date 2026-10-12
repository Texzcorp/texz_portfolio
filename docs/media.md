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

Nine selected tracks are served locally from `public/music/normalized/`, with a
common integrated loudness target of −16 LUFS. Measure the full source, apply
the measured gain, then measure the decoded AAC export again. Preserve musical
dynamics: use linear gain where peaks allow it, and an oversampled lookahead
peak limiter where additional headroom is needed. Original audio files are
retained; normalized exports are AAC-LC, stereo, 48 kHz, 192 kb/s, with faststart.
These prepared files require no normalization work in the visitor's browser.

Decoded export measurements (12 October 2026):

| Track | Original LUFS | Export LUFS | Export true peak (dBTP) |
| --- | ---: | ---: | ---: |
| Analyse Objective | −19.30 | −16.01 | −2.34 |
| Traité de paix | −17.44 | −16.07 | −2.35 |
| Le verger sans printemps | −16.52 | −16.08 | −2.44 |
| L'appel du dragon | −12.79 | −16.01 | −3.11 |
| Sky for a ceiling (Clip version) | −12.40 | −16.02 | −3.04 |
| Airmax | −13.77 | −16.02 | −1.59 |
| Robot jogging | −8.11 | −16.05 | −6.01 |
| Lightpower | −15.72 | −16.09 | −1.80 |
| Orchestral sketch | −20.69 | −16.03 | −2.36 |

The two existing music clips retain their original 350 × 350 FFmpeg exports
and full timelines. The clip for Traité de paix is *Lost in Dreams and
Nostalgia – Movies Edit* by trotorrr. L'appel du dragon uses its full original
YouTube video (`moYpAmICrLg`). Sky for a ceiling uses **Clip version**
(`N6lk4lK-Ziw`), with the monkeys, and the audio from that same upload, which
has a slightly shorter timeline than the static-cover upload. New square clips
are silent H.264, 350 × 350, 25 fps, faststart, with posters from their content.
Audio and video remain synchronized by the existing player.
Dragon is 3,679,890 bytes / 156 seconds; Sky is 10,527,786 bytes / 257.36 seconds.
Both use the existing square-video preset, with shadow AQ and a 650 kb/s maximum
rate. Sky uses CRF 25; Dragon uses the existing dark-scene CRF 22.

Square video is fetched only when the track starts; the cover poster is shown
before playback. Covers are 600 × 600 WebP exports of the owner's illustrations.
The original artwork for *Le verger sans printemps* is `Fleurdemie.png`. The
recording “67” is presented as “Orchestral sketch”, with the owner's
`AlbumKomodo.png` illustration. Airmax reuses the `SkyAsCeiling.JPG` cover;
Lightpower retains its existing illustration.

Unselected track metadata and the previous YouTube catalog are preserved in
`src/app/music/archive/`; the old audio files are retained. This archive is not
read by the public project loader.

The original square-video presets remain in the repository README. Choose the
dark-scene AQ preset for shadow detail and inspect the resulting size. A static
cover and full audio are enough when a moving image adds little to the piece.

Measure loudness (the `input_i` / `input_tp` fields describe the decoded file):

```sh
ffmpeg -hide_banner -nostats -i source.m4a -map 0:a:0 -af "loudnorm=I=-16:TP=-1.5:LRA=50:print_format=json" -f null -
```

For a gain-only export, subtract measured integrated LUFS from −16 to obtain
`GAIN_DB`. If peaks need limiting, oversample around the limiter; disable its
automatic gain and compensate latency to preserve the video's timeline:

```sh
ffmpeg -i source.m4a -map 0:a:0 -af "volume=GAIN_DBdB,aresample=192000,alimiter=limit=0.749894:level=false:attack=5:release=50:latency=1,aresample=48000" -c:a aac -b:a 192k -ar 48000 -map_metadata -1 -movflags +faststart normalized.m4a
```

Measure the final decoded M4A as well: encoding can change loudness and true
peaks. Adjust the original-source gain / limiter headroom if needed, then
encode again from the original; don't normalize an already normalized AAC.
