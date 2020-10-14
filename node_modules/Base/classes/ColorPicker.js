import { Template } from './Template.js';
import { Func } from './Func.js';

function ColorPicker() {

    let self = {};
    self.func = new Func();
    self.elementModifier = new Template();
    self.elementModifier.elementLibrary();
    self.colorIndicatorPosition = { x: 0, y: 0 };
    self.opacityIndicatorPosition = { x: 0, y: 0 };
    self.convertTo = 'RGB';

    self.init = (params) => {
        self.picker = self.elementModifier.createElement({
            element: 'div', attributes: { class: 'color-picker' }, children: [
                {
                    element: 'span', attributes: { id: 'color-picker-setters' }, children: [
                        {
                            element: 'span', attributes: { id: 'color-picker-colors-window' }, children: [
                                { element: 'canvas', attributes: { id: 'color-picker-colors' } },
                                { element: 'span', attributes: { id: 'color-picker-color-indicator' } }
                            ]
                        },
                        {
                            element: 'span', attributes: { id: 'color-picker-opacities-window' }, children: [
                                { element: 'canvas', attributes: { id: 'color-picker-opacities' } },
                                { element: 'span', attributes: { id: 'color-picker-opacity-indicator' } }
                            ]
                        }
                    ]
                },
                {
                    element: 'div', attributes: { id: 'color-picker-result' }, children: [
                        { element: 'span', attributes: { id: 'picked-color' } },
                        {
                            element: 'span', attributes: { id: 'picked-color-window' }, children: [
                                { element: 'select', attributes: { id: 'picked-color-setter' }, options: ['RGB', 'HEX', 'HSL'] },
                                { element: 'span', attributes: { id: 'picked-color-value' } }
                            ]
                        }
                    ]
                }
            ]
        });

        self.colorWindow = self.picker.find('#color-picker-colors-window');
        self.opacityWindow = self.picker.find('#color-picker-opacities-window');
        self.colorCanvas = self.picker.find('#color-picker-colors');
        self.opacityCanvas = self.picker.find('#color-picker-opacities');
        self.colorMarker = self.picker.find('#color-picker-color-indicator');
        self.opacityMarker = self.picker.find('#color-picker-opacity-indicator');
        self.width = params.width;
        self.height = params.height;
        self.pickedColor = params.color || 'rgb(0, 0, 0)';
        self.colorWindow.css({ height: self.height + 'px' });
        self.colorCanvas.width = self.width;
        self.colorCanvas.height = self.height;
        self.opacityWindow.css({ height: self.height + 'px' });
        self.opacityCanvas.height = self.height;
        self.opacityCanvas.width = 20;

        //the context
        self.colorContext = self.colorCanvas.getContext('2d');
        self.opacityContext = self.opacityCanvas.getContext('2d');

        self.picker.find('#picked-color-value').innerText = self.pickedColor;
        self.picker.find('#picked-color-setter').onChanged(value => {
            self.convertTo = value;
            self.reply();
        });

        self.listen();

        return self.picker;
    }

    self.calibrateColor = () => {
        let colorGradient = self.colorContext.createLinearGradient(0, 0, self.width, 0);

        //color stops
        colorGradient.addColorStop(0, "rgb(255, 0, 0)");
        colorGradient.addColorStop(0.15, "rgb(255, 0, 255)");
        colorGradient.addColorStop(0.33, "rgb(0, 0, 255)");
        colorGradient.addColorStop(0.49, "rgb(0, 255, 255)");
        colorGradient.addColorStop(0.67, "rgb(0, 255, 0)");
        colorGradient.addColorStop(0.87, "rgb(255, 255, 0)");
        colorGradient.addColorStop(1, "rgb(255, 0, 0)");

        self.colorContext.fillStyle = colorGradient;
        self.colorContext.fillRect(0, 0, self.width, self.height);

        //add black and white stops
        colorGradient = self.colorContext.createLinearGradient(0, 0, 0, self.height);
        colorGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        colorGradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        colorGradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
        colorGradient.addColorStop(1, "rgba(0, 0, 0, 1)");

        self.colorContext.fillStyle = colorGradient;
        self.colorContext.fillRect(0, 0, self.width, self.height);
    }

    self.calibrateOpacity = () => {
        let rgba;

        self.opacityContext.clearRect(0, 0, self.opacityCanvas.width, self.height);
        let opacityGradient = self.opacityContext.createLinearGradient(0, 0, 0, self.opacityCanvas.height);

        for (let i = 100; i >= 0; i--) {
            rgba = self.addOpacity(self.pickedColor, i / 100);
            opacityGradient.addColorStop(i / 100, rgba);
        }

        self.opacityContext.fillStyle = opacityGradient;
        self.opacityContext.clearRect(0, 0, self.opacityCanvas.width, self.opacityCanvas.height);
        self.opacityContext.fillRect(0, 0, self.opacityCanvas.width, self.opacityCanvas.height);
    }

    self.listen = () => {
        let isColorMouseDown = false;
        let isOpacityMouseDown = false;

        self.picker.notBubbledEvent('click', event => {
            if (self.added && !isColorMouseDown && !isOpacityMouseDown) {
                self.dispose();
            }
        });

        const colorMouseDown = (event) => {
            let currentX = event.clientX - self.colorCanvas.getBoundingClientRect().left;
            let currentY = event.clientY - self.colorCanvas.getBoundingClientRect().top;

            //is mouse in color picker
            isColorMouseDown = (currentX > 0 && currentX < self.colorCanvas.getBoundingClientRect().width && currentY > 0 && currentY < self.colorCanvas.getBoundingClientRect().height);
        };

        const colorMouseMove = (event) => {
            if (isColorMouseDown) {
                self.colorIndicatorPosition.x = event.clientX - self.colorCanvas.getBoundingClientRect().left;
                self.colorIndicatorPosition.y = event.clientY - self.colorCanvas.getBoundingClientRect().top;
                self.colorMarker.css({ top: self.colorIndicatorPosition.y + 'px', left: self.colorIndicatorPosition.x + 'px' });

                let picked = self.getPickedColor();
                self.pickedColor = `rgb(${picked.r}, ${picked.g}, ${picked.b})`;
                self.reply();
            }
        };

        const colorMouseUp = (event) => {
            isColorMouseDown = false;
            self.calibrateOpacity();
        };

        //Register
        self.colorCanvas.addEventListener("mousedown", colorMouseDown);
        self.colorCanvas.addEventListener("mousemove", colorMouseMove);
        self.colorCanvas.addEventListener("mouseup", colorMouseUp);

        const opacityMouseDown = (event) => {
            let currentX = event.clientX - self.opacityCanvas.getBoundingClientRect().left;
            let currentY = event.clientY - self.opacityCanvas.getBoundingClientRect().top;

            //is mouse in color picker
            isOpacityMouseDown = (currentX > 0 && currentX < self.opacityCanvas.getBoundingClientRect().width && currentY > 0 && currentY < self.opacityCanvas.getBoundingClientRect().height);
        };

        const opacityMouseMove = (event) => {
            if (isOpacityMouseDown) {
                self.opacityIndicatorPosition.x = event.clientX - self.opacityCanvas.getBoundingClientRect().left;
                self.opacityIndicatorPosition.y = event.clientY - self.opacityCanvas.getBoundingClientRect().top;
                self.opacityMarker.css({ top: self.opacityIndicatorPosition.y + 'px' });

                let picked = self.getPickedOpacity();
                self.pickedColor = `rgb(${picked.r}, ${picked.g}, ${picked.b}, ${picked.a})`;
                self.reply();
            }
        };

        const opacityMouseUp = (event) => {
            isOpacityMouseDown = false;
        };

        self.opacityCanvas.addEventListener("mousedown", opacityMouseDown);
        self.opacityCanvas.addEventListener("mousemove", opacityMouseMove);
        self.opacityCanvas.addEventListener("mouseup", opacityMouseUp);
    }

    self.reply = () => {
        self.converColor();
        self.picker.dispatchEvent(new CustomEvent('colorChanged'));
        self.picker.find('#picked-color').css({ backgroundColor: self.convertedColor });
        self.picker.find('#picked-color-value').innerText = self.convertedColor;
    }

    self.converColor = () => {
        if (self.convertTo == 'HEX') {
            self.convertedColor = self.rgbToHex(self.pickedColor);
        }
        else if (self.convertTo == 'HSL') {
            self.convertedColor = self.rgbToHSL(self.pickedColor);
        }
        else if (self.convertTo == 'RGB') {
            self.convertedColor = self.pickedColor;
        }
    }

    self.onChanged = (callBack) => {
        self.picker.addEventListener('colorChanged', event => {
            callBack(self.convertedColor);
        });
    }

    self.getPickedColor = () => {
        let imageData = self.colorContext.getImageData(self.colorIndicatorPosition.x, self.colorIndicatorPosition.y, 1, 1);
        return { r: imageData.data[0], g: imageData.data[1], b: imageData.data[2] };
    }

    self.getPickedOpacity = () => {
        let imageData = self.opacityContext.getImageData(self.opacityIndicatorPosition.x, self.opacityIndicatorPosition.y, 1, 1);

        let alpha = Math.ceil(((imageData.data[3] / 255) * 100)) / 100;
        return { r: imageData.data[0], g: imageData.data[1], b: imageData.data[2], a: alpha };
    }

    self.draw = (params) => {
        self.init(params);
        self.calibrateColor();
        self.calibrateOpacity();

        let interval = setTimeout(() => {
            self.added = true;
            clearTimeout(interval);
        }, 2000);

        return self.picker;
    }

    self.dispose = () => {
        clearInterval(self.interval);
        self.picker.remove();
    }

    self.colorType = (color = '#ffffff') => {
        let type = 'string';
        if (color.indexOf('#') == 0 && (color.length - 1) % 3 == 0) {
            type = 'hex';
        }
        else if (color.indexOf('rgba') == 0) {
            let values = self.func.inBetween(color, 'rgba(', ')');
            if (values != -1 && values.split(',').length == 4) {
                type = 'rgba';
            }
        }
        else if (color.indexOf('rgb') == 0) {
            let values = self.func.inBetween(color, 'rgb(', ')');
            if (values != -1 && values.split(',').length == 3) {
                type = 'rgb';
            }
        }
        else if (color.indexOf('hsla') == 0) {
            let values = self.func.inBetween(color, 'hsla(', ')');
            if (values != -1 && values.split(',').length == 4) {
                type = 'hsla';
            }
        }
        else if (color.indexOf('hsl') == 0) {
            let values = self.func.inBetween(color, 'hsl(', ')');
            if (values != -1 && values.split(',').length == 3) {
                type = 'hsl';
            }
        }

        return type;
    }

    self.hexToRGB = (hex = '#ffffff', alpha = true) => {
        let r = 0, g = 0, b = 0, a = 255;
        if (hex.length == 4) {
            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];
        }
        else if (hex.length == 5) {
            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];
            a = "0x" + hex[4] + hex[4];
        }
        else if (hex.length == 7) {
            r = "0x" + hex[1] + hex[2];
            g = "0x" + hex[3] + hex[4];
            b = "0x" + hex[5] + hex[6];
        }
        else if (hex.length == 9) {
            r = "0x" + hex[1] + hex[2];
            g = "0x" + hex[3] + hex[4];
            b = "0x" + hex[5] + hex[6];
            a = "0x" + hex[7] + hex[8];
        }
        a = +(a / 255).toFixed(3);

        if (alpha == false) {
            return `rgb(${+r}, ${+g}, ${+b})`;
        }
        else {
            return `rgb(${+r}, ${+g}, ${+b}, ${a})`;
        }
    }

    self.hexToHSL = (hex = '#ffffff', alpha = true) => {
        let color = self.hexToRGB(hex, alpha);
        color = self.rgbToHSL(color, alpha);
        return color;
    }

    self.rgbToHex = (rgb = 'rgb(0, 0, 0)', alpha = true) => {
        let start = rgb.indexOf('(') + 1;
        let end = rgb.indexOf(')');
        let [r, g, b, a] = rgb.slice(start, end).split(',');

        if (!self.func.isset(a)) {
            a = 1;
        }

        r = (+r).toString(16);
        g = (+g).toString(16);
        b = (+b).toString(16);
        a = Math.round(a * 255).toString(16);

        if (r.length == 1) {
            r = `0${r}`;
        }

        if (g.length == 1) {
            g = `0${g}`;
        }

        if (b.length == 1) {
            b = `0${b}`;
        }
        if (a.length == 1) {
            a = `0${a}`;
        }

        let hex = '#';
        if (alpha != false) {
            hex += `${r}${g}${b}${a}`;
        }
        else {
            hex += `${r}${g}${b}`;
        }

        return hex;
    }

    self.rgbToHSL = (rgb = 'rgb(0, 0, 0)', alpha = true) => {
        let start = rgb.indexOf('(') + 1;
        let end = rgb.indexOf(')');
        let [r, g, b, a] = rgb.slice(start, end).split(',');

        console.log(r, g, b);
        if (!self.func.isset(a)) {
            a = 1;
        }

        r /= 225;
        g /= 225;
        b /= 225;

        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0,
            s = 0,
            l = 0;

        // Calculate hue
        // No difference
        if (delta == 0) {
            h = 0;
        }
        else if (cmax == r) {
            h = ((g - b) / delta) % 6;
        }
        else if (cmax == g) {
            h = (b - r) / delta + 2;
        }
        else if (cmax == g) {
            h = (r - g) / delta + 4;
        }

        h = Math.round(h * 60);
        // Make negative hues positive behind 360°
        if (h < 0) {
            h += 360;
        }

        l = (cmax + cmin) / 2;

        s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

        l = +(l * 100).toFixed(1);
        s = +(s * 100).toFixed(1);

        let hsl = `hsl`;
        if (alpha == false) {
            hsl += `(${h}, ${s}%, ${l}%)`;
        }
        else {
            hsl += `(${h}, ${s}%, ${l}%, ${a})`;
        }
        return hsl;
    }

    self.hslToRGB = (hsl = 'hsl(0, 0%, 0%)', alpha = true) => {
        let rgb = 'rgb';
        let start = hsl.indexOf('(') + 1;
        let end = hsl.indexOf(')');
        let [h, s, l, a] = hsl.slice(start, end).split(',');

        if (!self.func.isset(a)) {
            a = 1;
        }

        console.log(h, s, l);

        if (h.indexOf("deg") > -1)
            h = h.substr(0, h.length - 3);
        else if (h.indexOf("rad") > -1)
            h = Math.round(h.substr(0, h.length - 3) * (180 / Math.PI));
        else if (h.indexOf("turn") > -1)
            h = Math.round(h.substr(0, h.length - 4) * 360);
        // Keep hue fraction of 360 if ending up over
        if (h >= 360)
            h %= 360;

        s = s.replace('%', '') / 100;
        l = l.replace('%', '') / 100;

        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c / 2,
            r = 0,
            g = 0,
            b = 0;

        if (0 <= h && h < 60) {
            r = c; g = x; b = 0;
        } else if (60 <= h && h < 120) {
            r = x; g = c; b = 0;
        } else if (120 <= h && h < 180) {
            r = 0; g = c; b = x;
        } else if (180 <= h && h < 240) {
            r = 0; g = x; b = c;
        } else if (240 <= h && h < 300) {
            r = x; g = 0; b = c;
        } else if (300 <= h && h < 360) {
            r = c; g = 0; b = x;
        }
        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        if (alpha == false) {
            rgb += `(${r}, ${g}, ${b})`;
        }
        else {
            rgb += `(${r}, ${g}, ${b}, ${a})`;
        }

        return rgb;
    }

    self.hslToHex = (hsl = '', alpha = true) => {
        let color = self.hslToRGB(hsl, alpha);
        return self.rgbToHex(color, alpha);
    }

    self.addOpacity = (color = 'rgb(0, 0, 0)', opacity = 0.5) => {
        let start = color.indexOf('(') + 1;
        let end = color.indexOf(')');
        let points = color.slice(start, end).split(',');
        points[3] = opacity;

        let changedColor = `rgba(${points.join(',')})`;

        return changedColor;
    }

    self.getOpacity = (color = 'rgb(0, 0, 0)') => {
        color = self.func.inBetween(color, '(', ')');
        let [r, g, b, a] = color.split(',');
        return a.trim();
    }

    self.invertColor = (color = '#ffffff') => {
        let type = self.colorType(color);
        let invert;
        if (type == 'hex') {
            color = color.replace('#', '');
            invert = '#' + self.invertHex(color);
        }
        else if (type == 'rgb') {
            color = self.rgbToHex(color).replace('#', '');
            invert = self.invertHex(color);
            invert = self.hexToRGB(invert);
        }
        else if (type == 'rgba') {
            let opacity = self.getOpacity(color);
            color = self.rgbToHex(color).replace('#', '');
            invert = self.invertHex(color);
            invert = self.hexToRGB(invert);
            invert = self.addOpacity(invert, opacity);
        }
        return invert;
    }

    self.invertHex = (hex = 'ffffff') => {
        return (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substr(1).toUpperCase();
    }

    return self;
}

export { ColorPicker };