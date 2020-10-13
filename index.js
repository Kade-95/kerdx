import {
    Base,
    ColorPicker,
    Period,
    Matrix,
    Func,
    Components,
    Template,
    NeuralNetwork,
    Icons,
    Shadow,
    ArrayLibrary,
    ObjectLibrary,
    MathsLibrary,
    AnalysisLibrary,
    Compression,
    Tree
} from 'https://kade-95.github.io/Base/index.js';

import { API } from './classes/API.js';
import { Database } from './functions/Database.js';

class Kerdx extends Base {
    constructor() {
        super();
        this.currentPage = location.href;
        this.styles = [
            'https://kade-95.github.io/kerdx/css/table.css',
            'https://kade-95.github.io/kerdx/css/cell.css',
            'https://kade-95.github.io/kerdx/css/form.css',
            'https://kade-95.github.io/kerdx/css/picker.css',
            'https://kade-95.github.io/kerdx/css/select.css',
            'https://kade-95.github.io/kerdx/css/json.css',
            'https://kade-95.github.io/kerdx/css/popup.css'
        ];
        for (let style of this.styles) {
            this.loadCss(style);
        }
    }
}

export {
    Kerdx,
    ColorPicker,
    Period,
    Matrix,
    Func,
    Components,
    Template,
    NeuralNetwork,
    Icons,
    API,
    Shadow,
    ArrayLibrary,
    ObjectLibrary,
    MathsLibrary,
    AnalysisLibrary,
    Database,
    Compression,
    Tree
};
