import { JSElements } from './JSElements.js';

class ColorPicker extends JSElements {

    constructor() {
        super();
    }

    hexToRGB(hex) {
        hex = '0x' + hex.replace('#', '');
        let red = (hex >> 16) & 0xFF,
            green = (hex >> 8) & 0xFF,
            blue = hex & 0xFF;

        return `rgb(${red}, ${green}, ${blue})`;
    }

    rgbToHex(color) {
        let start = color.indexOf('(') + 1;
        let end = color.indexOf(')');
        let [r, g, b, a] = color.slice(start, end).split(',');
                
        let hex = '#';
        if (!this.isset(a)) {
            hex += ((1 << 24) + (Math.floor(r) << 16) + (Math.floor(g) << 8) + Math.floor(b)).toString(16).slice(1, 7);
        }

        return hex;
    }

    addOpacity(color, opacity) {
        let start = color.indexOf('(') + 1;
        let end = color.indexOf(')');
        let points = color.slice(start, end).split(',');
        points[3] = opacity;

        return `rgba(${points.join(',')})`;
    }
}

export { ColorPicker };