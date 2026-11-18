# geoffreyfolkerth.com

Static site: one landing page with a qualifying form, plus a blog. No build step. Edit the HTML and push.

```
index.html                      Landing page + form
styles.css                      All styling
main.js                         Mobile nav, country/state logic, fit score, Formspree submit
blog/index.html                 Blog list
blog/<post-slug>.html           One file per post
images/                         Photos (create this folder)
```

## Before launch

1. **Formspree.** Create a free account at formspree.io with Geoffrey's email, make a new form, and copy its ID (looks like `xyzabcd`). In `index.html`, replace `YOUR_FORM_ID` in the form's `action`. Submissions are emailed to the account address. Turn on reCAPTCHA or the spam filter in Formspree settings; a honeypot field (`_gotcha`) is already in the form.
2. **Photos.** The site uses `images/geoffrey-headshot.jpg` (currently a 240px headshot, shown in black and white). Replace it with a larger original when available, and add `images/og-image.jpg` (1200×630) for link previews.
3. **Domain.** Update `geoffreyfolkerth.com` in the canonical/OG tags if the domain is different.

## Hosting on GitHub Pages

1. Create a repo (e.g. `geoffreyfolkerth-site`) and push these files to `main`.
2. Repo **Settings → Pages**: source `Deploy from a branch`, branch `main`, folder `/ (root)`.
3. Custom domain: enter it in the Pages settings (this creates a `CNAME` file), then at the registrar add an `A` record to GitHub's Pages IPs (185.199.108.153, .109, .110, .111) and a `CNAME` for `www` pointing to `<username>.github.io`. Tick **Enforce HTTPS** once it's available.

## How the form email looks

The subject line carries a fit score so Geoffrey can triage from his inbox:

`[Strong fit] Acme Plumbing | $2M–$5M | Within 90 days`

Score (0–10) comes from revenue, role, timing and willingness to invest; see `POINTS` in `main.js` to change the weights. 8+ = Strong fit, 5–7 = Possible fit, under 5 = Low fit. The score is a sorting aid only; every lead still comes through.

## Adding a blog post

1. Copy `blog/behind-on-business-taxes-first-week.html` to a new slug, e.g. `blog/sales-up-cash-down.html`.
2. Update the `<title>`, meta description, canonical URL, both JSON-LD blocks, headline, date and body. Replace the video placeholder with the YouTube embed:
   `<iframe class="video-ph" src="https://www.youtube.com/embed/VIDEO_ID" title="..." allowfullscreen style="width:100%;border:0;border-radius:14px"></iframe>`
3. Add a `post-card` to the top of `blog/index.html` and, if it's one of the three newest, to the blog section of `index.html`.
