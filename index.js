import { Func } from './classes/Func.js';
import { Matrix } from './classes/Matrix.js';
import { NeuralNetwork } from './classes/NeuralNetwork.js';
import { Template } from './classes/Template.js';
import { API } from './classes/API.js';
import { Components } from './classes/Components.js';
import { ColorPicker } from './classes/ColorPicker.js';
import { Period } from './classes/Period.js';
import { Ledger } from './classes/Ledger.js';
import { Shadow } from './classes/Shadow.js';
import { Icons } from './Icons.js';

function extendMultiple(base, ...mixins) {
    class result extends base {
        constructor(params) {
            super(params);
        }
    }

    let copyProps = (target, source) => {
        let props = Object.getOwnPropertyNames(source).concat(Object.getOwnPropertySymbols(source));
        let ignore = [
            'contructor',
            'prototype',
            'arguments',
            'caller',
            'name',
            'bind',
            'call',
            'apply',
            'toString',
            'length'
        ];

        for (let prop of props) {
            if (!ignore.includes(prop)) {
                Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
            }
        }
    }

    for (let mixin of mixins) {
        copyProps(base.prototype, mixin.prototype);
    }

    let r = new result();
    return result;
}

class Kerdx extends Components {
    constructor() {
        super();
        this.Matrix = Matrix;
        this.NeuralNetwork = NeuralNetwork;
        this.Shadow = Shadow;
        this.colorHandler = new ColorPicker();
        this.api = new API();
        this.icons = Icons;
        this.currentPage = location.href;
        this.styles = [
            '../Kerdx/css/table.css',
            '../Kerdx/css/cell.css',
            '../Kerdx/css/form.css',
            '../Kerdx/css/picker.css',
            '../Kerdx/css/select.css',
            '../Kerdx/css/json.css'
        ];

        for (let style of this.styles) {
            this.loadCss(style);
        }
    }
}

// let R = extendMultiple(Components, API);

export { Kerdx, Period, Matrix, Func, Components, Template, NeuralNetwork, Icons, API, Ledger, Shadow};