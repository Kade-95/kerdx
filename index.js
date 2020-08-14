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
import { ArrayLibrary } from './functions/Array.js';
import { ObjectLibrary } from './functions/Objects.js';
import { MathsLibrary } from './functions/Math.js';
import { AnalysisLibrary } from './functions/Analytics.js';
import { Database } from './functions/Database.js';

class Kerdx extends Components {
    constructor() {
        super();
        this.Matrix = Matrix;
        this.NeuralNetwork = NeuralNetwork;
        this.Shadow = Shadow;
        this.colorHandler = new ColorPicker();
        this.api = new API();
        this.array = ArrayLibrary();
        this.object = ObjectLibrary();
        this.math = MathsLibrary();
        this.analytics = AnalysisLibrary();
        this.database = Database;
        this.icons = Icons;
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

// let R = extendMultiple(Components, API);

export {
    Kerdx,
    Period,
    Matrix,
    Func,
    Components,
    Template,
    NeuralNetwork,
    Icons,
    API,
    Ledger,
    Shadow,
    ArrayLibrary,
    ObjectLibrary,
    MathsLibrary,
    AnalysisLibrary,
    Database
};

window.kerdx = new Kerdx();