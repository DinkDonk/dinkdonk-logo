DinkDonk Logo
=============

The main source for the DinkDonk logo, including an SVG exporter.

### Requirements

**Cairo** and **Pango**:

```bash
$ brew install pkg-config cairo --enable-svg=yes pango libpng jpeg giflib
```

### Export to SVG

```bash
$ npm start [tension]
```

Tension is a `float` typically from *0* to *1* – *0* being zero tension (straight lines), and *1* being the default tension (curvy lines).
