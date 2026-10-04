Century Gothic Pro — self-hosted display face
===========================================

Drop the licensed web files here, using EXACTLY these names, and the @font-face
declarations already in src/index.css will pick them up with no other change:

    CenturyGothicPro-Regular.woff2   (weight 400)
    CenturyGothicPro-Bold.woff2      (weight 700)

Until these files exist, both URLs 404. The browser handles that quietly and
falls through the stack in src/index.css:

    Century Gothic Pro  ->  Century Gothic  ->  Montserrat  ->  system UI

so the site renders correctly in the meantime and nothing appears broken. To
stop the two failed requests while you source the real files, comment out the
@font-face block in src/index.css — the font stack still names the family, so a
visitor who has Century Gothic Pro installed locally still gets it.

Why the files are not in this repository
----------------------------------------
Century Gothic Pro is a commercial Monotype typeface. It cannot be redistributed
without a licence, so it is deliberately absent.

If you do not hold a licence, the fallback chain already produces a geometric
sans heading face, which is what Century Gothic was chosen for. To change it,
edit only the --font-display value in src/index.css.