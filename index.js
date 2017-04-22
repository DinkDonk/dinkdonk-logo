const fs = require('fs');
const Canvas = require('canvas');
const canvas = new Canvas(600, 300, 'svg');
const context = canvas.getContext('2d');
const Logo = require('./Logo').default;
const tension = parseFloat(process.argv[2]);

new Logo(canvas, context, tension);

fs.writeFileSync('logo.svg', canvas.toBuffer());