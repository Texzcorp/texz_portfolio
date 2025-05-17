# Texz's Custom Portfolio on Once UI

This repository is a **personal fork** of **Magic Portfolio**—the Next.js template maintained by Lorant One and Zsofia Komaromi and published under the **CC BY‑NC 4.0** license. The upstream project delivers a clean, responsive portfolio built with [Once UI](https://once-ui.com) (v0.3.1).

My objective is to reuse the template while adding functionality that supports richer case studies, audio playback, and higher perceived performance.

---

## Quick start

```bash
git clone https://github.com/Texzcorp/texz_portfolio.git
cd texz_portfolio
npm install
npm run dev
```

Edit configuration under `src/app/resources/config` and content under `src/app/resources/content`.

---

## Additional features in this project

| # | Enhancement                                 | Description                                                                                                                                                                                                                                                                |
| - | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 | **Interactive audio‑responsive background** | A sinusoidal backdrop that reacts to pointer movement, scrolling *and* music amplitude, adding subtle motion and depth to every page.                                                                                                                                                 |
| 2 | **3D bird animation via Vanta.js**          | When a track is playing, Vanta's **BIRDS** shader releases interactive flocks in a lightweight WebGL space. The effect is easily swappable with any other Vanta scene [Vanta.js](https://www.vantajs.com/).                                                                                                     |
| 3 | **Re‑worked Home (hero) section**           | The home page hero has been reorganised for a stronger first impression, re‑using elements originally located in the About page.                                                                                                                                           |
| 4 | **Experimental organic masonry grid**       | A new, more fluid gallery layout supports arbitrary span sizes for tiles. Still experimental and not fully generalised, but simple to test and iterate. [Live demo](https://terencediazportfolio.vercel.app/gallery).                                                      |
| 5 | **Subscribe notification (Music page)**     | A notification in the lower‑left corner invites visitors to follow the associated YouTube channel.                                                                                                                                                                    |
| 6 | **Custom MDX carousel**                     | A bespoke carousel component callable from `.mdx`, enabling richer project walkthroughs (e.g. the [Example of one of my case studies](https://terencediazportfolio.vercel.app/programmation/Artemis)). Newer Once UI versions now ship an official carousel with additional capabilities so maybe that you should consider importing their carousel. |
| 7 | **Loading spinner for media**               | Displays a minimal loading indicator while videos or carousel assets buffer, improving perceived responsiveness.                                                                                                                                                           |
| 8 | **Synced video clips for music tracks**     | A tuned video player keeps short clips synchronised with the audio track, despite the limited bandwidth of Vercel's free tier. 
For this to work properly, videos need to be optimized to reduce their size and ease of playback. Here are some examples of commands I've used to achieve this: 
For a normal video with noise :
ffmpeg -i input.mp4   -vf "fps=25,scale=350:350:force_original_aspect_ratio=increase,crop=350:350"   -c:v libx264   -crf 28   -preset veryslow   -tune fastdecode   -profile:v baseline   -level 3.0   -movflags +faststart   -pix_fmt yuv420p   -an   -bufsize 1000k   -maxrate 1500k   output.mp4
For videos with dark tones :                                                                                                                                            |
ffmpeg -i input.mp4 -vf "fps=25,scale=350:350:force_original_aspect_ratio=increase,crop=350:350,format=yuv420p" -c:v libx264 -crf 22 -preset veryslow -x264-params "aq-mode=2:aq-strength=1.2" -profile:v baseline -level 3.0 -movflags +faststart -pix_fmt yuv420p -an -bufsize 2000k -maxrate 2000k output.mp4


## License compliance

* **Upstream template**: Magic Portfolio by Lorant One & Zsofia Komaromi — CC BY‑NC 4.0. Commercial use is prohibited without express permission from the original authors.
* **This fork**: All new source files and assets are released under **CC BY‑NC 4.0** and inherit the same non‑commercial limitation.

See [`LICENSE.txt`](./LICENSE.txt) for full terms and attribution requirements.

---

## Community & support

For questions about Once UI or the original template, join the [Once UI Discord](https://discord.com/invite/5EyAQ4eNdS). Issues specific to this fork can be raised in this repository.

---

*Last updated: 17 May 2025*
