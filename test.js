import { ColorPicker, Kerdx } from './index.js';
let kerdx = new Kerdx();

let route = () => {
    document.body.makeElement({
        element: 'a', attributes: { href: 'https://google.com', target: '_blank' }, text: 'Click Me.'
    });
}

document.addEventListener('DOMContentLoaded', event => {
    route();
    kerdx.api.makeWebapp(event => {
        route();
    });
});