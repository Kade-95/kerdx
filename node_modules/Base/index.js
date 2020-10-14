import { Func } from './classes/Func';
import { Matrix } from './classes/Matrix';
import { NeuralNetwork } from './classes/NeuralNetwork';
import { Template } from './classes/Template';
import { Components } from './classes/Components';
import { ColorPicker } from './classes/ColorPicker';
import { Period } from './classes/Period';
import { Icons } from './Icons';
import { Shadow } from './functions/Shadow';
import { ArrayLibrary } from './functions/Array';
import { ObjectLibrary } from './functions/Objects';
import { MathsLibrary } from './functions/Math';
import { AnalysisLibrary } from './functions/Analytics';
import { Compression } from './functions/Compression';
import { Tree } from './classes/Tree';

class Base extends Components {
    constructor() {
        super();
        this.Matrix = Matrix;
        this.NeuralNetwork = NeuralNetwork;
        this.Shadow = Shadow;
        this.colorHandler = new ColorPicker();
        this.array = ArrayLibrary();
        this.object = ObjectLibrary();
        this.math = MathsLibrary();
        this.analytics = AnalysisLibrary();
        this.icons = Icons;

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
};
