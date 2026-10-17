# Personal portfolio subdomain

Prepared on 17 October 2026 for `https://portfolio.cosmocrow.com`.
The existing Vercel project and portfolio design stay in place.

This branch changes the shared metadata hostname (`baseURL`) and the destination
of legacy personal-domain page redirects. Canonical links, Open Graph, structured
data, sitemap and robots use the shared hostname. Product links already lead to
their own sites. Relative assets and authentication requests stay same-origin.

Do not publish this branch or transfer the apex until the coordinator gives the
cutover signal. During preparation, `cosmocrow.com` and `www.cosmocrow.com` keep
serving the existing portfolio. The added subdomain initially serves that same
production build, with its existing apex canonical, until this branch is released.

Before moving the apex, the studio must implement the compatibility contract in
the local handoff directory `../outputs/studio-split-2026-10-17/` (relative to the
repository root), especially `route-contract.json` and `public-asset-manifest.json`:

- Keep the apex root for the studio. Redirect only legacy portfolio page prefixes
  on GET/HEAD to the new hostname, preserving paths and the original query.
- Preserve the two legacy `/api/check-auth` and `/api/authenticate` endpoints via
  same-origin reverse proxy, including POST bodies, cookies and response status.
- Preserve existing media paths, MIME types and HTTP Range behavior. `/music`
  contains pages and files; do not redirect its whole prefix indiscriminately.
- Resolve compatibility for old Next image/chunk URLs before the apex transfer.
- Keep product subdomains and `playpicka.com` unchanged.

Use native Vercel routes for page redirects: the previous production checks found
that Next middleware alone lost empty query parameters at the Vercel edge.
The middleware remains a local/fallback implementation. Neither implementation
redirects APIs, non-GET/HEAD requests or media files.

The password guard uses host-only HttpOnly cookies, Secure in production,
SameSite=Strict, Path=/ and a one-hour lifetime. Users may need to authenticate
again on the new origin. Do not broaden the cookie domain or CORS policy.
There are no portfolio OAuth, payment, licensing or webhook routes to migrate.

Release order after the coordinator's signal:

1. Check the new subdomain HTTPS and the studio's accepted preview/route contract.
2. Publish this commit to the portfolio production branch and verify the new
   canonical/OG/sitemap/robots plus the legacy personal-host redirects.
3. Have the coordinator transfer apex/www to the studio and run the contract checks
   on the actual public hosts. Do not announce completion from a preview alone.

The remote branch `archive/portfolio-before-studio-split-2026-10-17` preserves
production commit `793255f60795498ff1a1905179e242ccbc1f0081`. The original portfolio
is separately retained on `archive/portfolio-before-refresh-2026-10-12`.
Before apex transfer, retaining the baseline production is sufficient rollback.
After transfer, restoring apex/www to the portfolio project and restoring the
baseline deployment requires coordination; keep the subdomain and product hosts.
