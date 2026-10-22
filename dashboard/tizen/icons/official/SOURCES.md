# Original brand artwork

Retrieved October 21, 2026. These files are original assets, not hand-drawn interpretations. Preserve their colors and aspect ratios. Artwork belongs to its respective brand; the Still dashboard is independent. All files are bundled for offline TV use.

- YouTube: https://brand.youtube/ — site's official 180px product icon, https://www.gstatic.com/marketing-cms/assets/images/98/c6/59f93f6f4ac1a8e63612c5370193/favicon-1.png=s180
- Netflix: https://about.netflix.com/en/company-assets — RGB PNG extracted without modification from https://assets.ctfassets.net/4cd45et68cgf/5vCbQ45TfVUvWgm8eiDOtn/ef1c2431dc81f79ae93fcce649ae796f/Netflix_Symbol.zip
- Prime Video: https://www.primevideo.com/ — site's white wordmark, https://m.media-amazon.com/images/G/01/digital/video/acquisition/logo/pv_logo_white._CB548637580_.png
- Disney+: https://press.disneyplus.com/about/logos — Disney+ logo asset, https://lumiere-a.akamaihd.net/v1/images/disney_logo_march_2024_050fef2e.png (server returns JPEG data despite .png URL).
- Spotify: https://newsroom.spotify.com/media-kit/logo-and-brand-assets/ — https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png
- Tubi: https://corporate.tubitv.com/ — site's wordmark, https://corporate.tubitv.com/wp-content/uploads/2024/02/logo-footer.png
- Samsung TV Plus: https://www.samsungtvplus.com/ — site's logo, https://www.samsungtvplus.com/img/homepage/mobile/M1/Brand/Logo.png

Other apps use their public ApplicationInformation.iconPath when available. Initials are a fallback identifier, never represented as an original brand logo. The browser preview uses initials for Internet because no installed icon is available there.

Transparent Disney+ wordmark (official homepage, retrieved October 21, 2026): https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/C17497FEB6E396BC29C6A790A01C34FEAC1E56F78A0AEAD93D6390B42C95C05E/compose?format=png&width=640

Prime Video, Disney+, and TV Plus now sit directly on the shared tile background. Their transparent white artwork is rendered black with CSS in Light mode for contrast; original files are unchanged.


Added app artwork (October 21, 2026):
- Smart STB original transparent artwork from https://www.smart-stb.net/ — https://www.smart-stb.net/wp-content/uploads/webp/2026/07/logo@2x1.webp
- Hoichoi app icon: decoded without alteration from the embedded SVG favicon on https://help.hoichoi.tv/.
- Bongo original wordmark: https://cdn.bongo-solutions.com/logo/bongo.jpg, linked as the organization logo on https://prerender.bongobd.com/en. CSS blend mode visually removes its white background; the downloaded image is unchanged.

Hoichoi full wordmark: https://commons.wikimedia.org/wiki/File:Hoichoi-cover.png (original source hoichoi.tv). hoichoi-wordmark.svg embeds that original PNG, crops surrounding whitespace through its viewBox, and removes white through an SVG display filter.

### 1.2.8: large-screen artwork
- Hoichoi: traced the full red wordmark from the user's 735×458 reference into real SVG paths; no embedded low-resolution bitmap.
- Bongo and YouTube: smooth SVG paths traced from the original artwork, preserving shape and brand color. YouTube source requested at s720 (server provides 288×288).
- Samsung TV Plus: original vector https://www.samsungtvplus.com/img/logo.svg
- Tubi: original 1280×575 transparent artwork https://corporate.tubitv.com/wp-content/uploads/2019/12/1280px-Tubi_logo.svg_.png
- Smart STB: original PNG https://www.smart-stb.net/wp-content/uploads/2026/07/logo@2x1.png, cropped to artwork and resampled 4× with Lanczos. This smooths sampling but adds no original detail.
- Netflix (991×1801), Spotify (939×940), Prime (1040×317), Disney+ (640×350) already exceed their TV display dimensions and retain original source detail.

### 1.3.9: missing installed-app artwork
- Samsung Health: official Samsung developer connection-design guide icon, https://d3unf4s5rp9dfh.cloudfront.net/SHealth_doc/samsung-health_72x72.png (72px source; displayed at 80 CSS pixels maximum).
- Windows 365: original Microsoft artwork from https://commons.wikimedia.org/wiki/File:Windows365-logo.svg (downloaded via Special:Redirect/file/Windows365-logo.svg).
- Internet: existing bundled generic globe, icons/browser.svg, used as a browser symbol.

### 1.5.2: refreshed Hoichoi identity
- Replaced the old traced red wordmark with Hoichoi’s current original path-based gradient SVG from its official homepage header: https://hoichoi.tv/_build/assets/header-hoichoi-BX4oEbwk.svg (October 22, 2026). Matches the user’s supplied screenshot. Bundled locally as hoichoi-wordmark.svg, with transparent background, no embedded bitmap, and no font dependency.

### 1.5.3: official-site vector review — October 22, 2026

New local original vectors:
- Netflix: `netflix-current.svg`, original N symbol from `svg[data-uia="n-logo"]` on https://www.netflix.com/ca/. Preserves original paths, colors and shading. Removed the old PNG's clear-space compensation.
- Spotify: `spotify-current.svg`, original `logoSpotify` SVG from https://open.spotify.com/. Preserves the site's 24×24 icon viewBox and path; explicitly sets Spotify green #1ed760 for standalone rendering.
- YouTube: `youtube-current.svg`, original play-icon group from the current `yt-ringo2` header SVG on https://www.youtube.com/. ViewBox crops to that original group, retaining the site's #FF0033 red and white triangle.
- Bongo: `bongo-current.svg`, https://cdn.bongo-solutions.com/icons/bongo_white.svg, linked by the header on https://bongobd.com/. Replaces a traced bitmap with original paths.
- Tubi: `tubi-current.svg`, original SVG labelled “Tubi logo” in navigation on https://tubitv.com/. Explicit standalone white color; light theme uses the existing black presentation.
- Curiosity Stream: `curiosity-current.svg`, original SVG inside the “Curiosity Stream home” link on https://curiositystream.com/. Preserves original white artwork and gradient.
- Perplexity: `perplexity-current.svg`, `pplx-logo-mark` symbol and its displayed 30×32 viewBox from https://www.perplexity.ai/. Inlines original paths instead of retaining an external sprite reference; explicitly white with black presentation in Light mode.
- TSN: `tsn-current.svg`, https://static.themebuilder.aws.arc.pub/bellmediainc/1741638442172.svg, the “TSN Logo” image on https://www.tsn.ca/.

Other installed apps checked:
- Hoichoi: original current gradient SVG checked and installed in 1.5.2 from https://hoichoi.tv/; retained.
- Samsung TV Plus: https://www.samsungtvplus.com/ still links https://www.samsungtvplus.com/img/logo.svg; existing original vector retained.
- Prime Video: https://www.primevideo.com/ exposes raster `logo-min-remaster.png` and the existing original `pv_logo_white._CB548637580_.png`; retained the existing original image. No suitable vector found in the inspected page.
- Disney+: https://www.disneyplus.com/ exposes Disney CDN raster logos; existing official transparent image retained. No suitable vector found in the inspected page.
- Smart STB: https://www.smart-stb.net/ still exposes the raster logo@2x1.webp; existing official PNG retained.
- MagellanTV Documentaries: https://www.magellantv.com/ exposes `/images/device-linking/logo-copycat.png` through its image optimizer; installed app icon retained.
- Amazon Alexa: https://www.amazon.com/alexa exposes raster Alexa/AI branding; installed Amazon Alexa app icon retained rather than substituting Alexa+ identity.
- Xbox: https://www.xbox.com/ exposes the raster UHF header image https://uhf.microsoft.com/images/xbox/RW4ESm.png; installed app icon retained.
- Samsung Health: https://www.samsung.com/us/apps/samsung-health/ inspected; existing original app icon retained. No suitable standalone app-logo vector found.
- SmartThings: https://www.smartthings.com/ redirects to Samsung's SmartThings page. Generic interface symbols were not substituted for the actual app icon; installed app icon retained.
- Windows 365: https://www.microsoft.com/en-us/windows-365 exposes raster Windows branding; existing bundled Windows 365 SVG retained.
- Internet: https://www.samsung.com/us/apps/samsung-internet/ inspected. Existing bundled generic browser symbol retained rather than conflating the TV Internet app with another browser product.
- Chorki: https://www.chorki.com/ failed DNS; the alternative official domain https://www.chorki.net/ could not be inspected in this browser session. Existing installed icon retained; current vector availability remains unverified.

These are offline assets. Brand shapes were not approximated or traced; homepage bitmap usage does not establish that no vector exists elsewhere.
