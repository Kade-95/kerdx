import { Func } from './Func.js';
import { ObjectLibrary } from './../functions/Objects.js';

let func = new Func();
let objectLibrary = ObjectLibrary();

class Ledger {
    constructor(element, props, childProps) {
        this.props = props || {};
        this.childProps = childProps || {};
        this.working = false;
        this.staged = {};
        this.children = { main: element };

        element.ledger = [];
        element.monitor();
        element.addEventListener('attributesChanged', data => {
            this.updateNodes(data.detail);
        });
    }

    addNode(params) {
        let key = this.generatePrivateKey();
        let node = this.children.main.cloneNode(true);

        this.children[this.generatePublicKey()] = node;
        node.ledger = JSON.parse(JSON.stringify(this.children.main.ledger));
        node.monitor();
        node.addEventListener('attributesChanged', data => {
            this.updateNodes(data.detail);
        });
    }

    removeNode(key) {
        this.children[key].remove();
        delete this.children[key];
    }

    copyNode() {

    }

    changedAlready(node, data) {
        let value = JSON.stringify(node.ledger).includes(JSON.stringify(data));
        return value;
    }

    updateClasses(data, params) {
        let classList = data.target.classList.toString().split(' ').join(',');
        let element = params.node;
        let change = { attribute: data.attributeName, change: classList };
        if (func.isset(params.target)) {
            change.target = params.target;
            element = params.node.find(params.target);
        }

        if (func.isnull(element)) {
            return;
        }

        if (!this.changedAlready(params.node, change)) {
            if (data.target != element) {
                element.addClasses(classList);
            }
            this.updateLedger(params.node, change);
        }
    }

    updateStyle(data, params) {
        let element = params.node;
        let style = data.target.css();
        let change = { attribute: data.attributeName, change: { [data.attributeName]: style } };
        if (func.isset(params.target)) {
            change.target = params.target;
            element = params.node.find(params.target);
        }

        if (func.isnull(element)) {
            return;
        }

        if (!this.changedAlready(params.node, change)) {
            if (params.isTopNode) {
                for (let n in style) {
                    if (!func.isset(this.props.style[n]) || this.props.style[n] == -1) {
                        delete style[n];
                    }
                }
            }
            else {
                for (let n in style) {
                    if (!func.isset(this.childProps[params.id].style[n]) || this.childProps[params.id].style[n] == -1) {
                        delete style[n];
                    }
                }
            }

            if (Object.keys(style).length > 0) {
                if (data.target != element) {
                    element.css(style);
                }
                this.updateLedger(params.node, change);
            }
        }
    }

    updateAttribute(data, params) {
        let element = params.node;
        let attribute = data.target.getAttribute(data.attributeName);
        let change = { attribute: data.attributeName, change: { [data.attributeName]: attribute } };
        if (func.isset(params.target)) {
            change.target = params.target;
            element = params.node.find(params.target);
        }

        if (func.isnull(element)) {
            return;
        }

        if (!this.changedAlready(params.node, change)) {
            if (data.target != element) {
                element.setAttribute(data.attributeName, attribute);
            }
            this.updateLedger(params.node, change);
        }
    }

    updateNodes(data) {
        let attribute, classList, style, change, identifier;

        let isTopNode = Object.values(this.children).includes(data.target);

        for (let i in this.children) {
            if (isTopNode) {
                let isProp = func.isset(this.props[data.attributeName]) && this.props[data.attributeName] != -1;

                if (data.attributeName == 'class' && isProp) {
                    this.updateClasses(data, { node: this.children[i], isTopNode });
                }
                else if (data.attributeName == 'style') {
                    if (func.isset(this.props.style)) {
                        this.updateStyle(data, { node: this.children[i], isTopNode });
                    }
                }
                else {
                    if (isProp) {
                        this.updateAttribute(data, { node: this.children[i], isTopNode });
                    }
                }
            }
            else {
                let { id, nodeName } = data.target;
                if (id == '' || !func.isset(this.childProps[id])) {
                    return;
                }
                identifier = `${nodeName}#${id}`;
                let isProp = func.isset(this.childProps[id][data.attributeName]) && this.childProps[id][data.attributeName] != -1;
                if (data.attributeName == 'class' && isProp) {
                    this.updateClasses(data, { node: this.children[i], isTopNode, target: identifier });
                }
                else if (data.attributeName == 'style') {
                    if (func.isset(this.childProps[id].style)) {
                        this.updateStyle(data, { node: this.children[i], isTopNode, target: identifier, id });
                    }
                }
                else {
                    if (isProp) {
                        this.updateAttribute(data, { node: this.children[i], isTopNode, target: identifier });
                    }
                }
            }
        }
    }

    updateLedger(node, data) {
        console.log(node, data);
        node.ledger.push(data);
    }

    generatePublicKey() {
        let key, flag = true;

        while (flag) {
            key = func.generateRandom(12);
            flag = Object.keys(this.children).includes(key);
        }

        return key;
    }

    generatePrivateKey() {
        let key, find = '';

        while (func.isset(find)) {
            key = func.generateRandom(200);
            find = objectLibrary.find(this.children, (child) => {
                return child.privateKey == key;
            });
        }

        return key;
    }
}

export { Ledger };