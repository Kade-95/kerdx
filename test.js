import { ColorPicker, Kerdx } from './index.js';
window.colorPicker = new ColorPicker();

document.addEventListener('DOMContentLoaded', event => {
    document.body.makeElement(colorPicker.draw({width: 200, height: 200}))
});