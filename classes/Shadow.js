import { Func } from './Func.js';
let func = new Func();

class Shadow {
    constructor(element) {
        this.element = element.cloneNode(true);
        this.children = [element];
        this.properties = {};
        this.childProperties = {};
    }

    updateNewElementChildProperties(element, propertyCollection) {
        let children, positions;
        for (let identifier in propertyCollection) {
            for (let childProperties of propertyCollection[identifier]) {
                positions = this.setPositions(childProperties.positions);
                children = this.getChildren(identifier, element, positions);
                for (let j = 0; j < children.length; j++) {
                    children[j].setProperties(childProperties.properties);
                }
            }
        }
    }

    updateNewElementChildAttributes(element, attributeCollection) {
        let children, positions;
        for (let identifier in attributeCollection) {
            for (let childAtrributes of attributeCollection[identifier]) {
                positions = this.setPositions(childAtrributes.positions);
                children = this.getChildren(identifier, element, positions);
                for (let j = 0; j < children.length; j++) {
                    children[j].setAttributes(childAtrributes.attributes);
                }
            }
        }
    }

    setPositions(positions) {
        positions = positions || 1;//init count
        if (!Array.isArray(positions)) {
            positions = func.range(positions);
        }

        return positions;
    }

    createElement(params) {
        let element = this.element.cloneNode(true);
        this.children.push(element);

        this.prepareElement(element, params);
        return element;
    }

    prepareElement(element, params = {}) {
        if (func.isset(params.childDetails)) {
            if (func.isset(params.childDetails.attributes)) {
                this.updateNewElementChildAttributes(element, params.childDetails.attributes);
            }

            if (func.isset(params.childDetails.properties)) {
                this.updateNewElementChildProperties(element, params.childDetails.properties);
            }
        }

        if (func.isset(params.details)) {
            if (func.isset(params.details.attributes)) {
                element.setAttributes(params.details.attributes);
            }

            if (func.isset(params.details.properties)) {
                element.setProperties(params.details.properties);
            }
        }

        this.updateNewElementChildProperties(element, this.childProperties);
        element.setProperties(this.properties);

        this.makeCloneable(element);
    }

    removeElement(element, flag) {
        let children = [];
        let position = this.children.indexOf(element);
        for (let i = 0; i < this.children.lengt; i++) {
            if (position != i) {
                children.push(this.children[i]);
            }
        }
        this.children = children;
    }

    cloneElement(position, params) {
        let element = this.children[position].cloneNode(true);
        this.children.push(element);

        this.prepareElement(element, params);
        return element;
    }

    makeCloneable(element) {
        let position = this.children.indexOf(element);
        if (position == -1) {
            return;
        }

        element.unitClone = (params) => {
            return this.cloneElement(position, params)
        }
    }

    get length() {
        return this.children.length;
    }

    setProperties(properties) {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].setProperties(properties);
        }
        this.element.setProperties(properties);
        for (let i in properties) {
            this.properties[i] = properties[i];
        }
    }

    css(style) {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].css(style);
        }
        this.element.css(style);
    }

    setAttributes(attributes) {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].setAttributes(attributes);
        }
        this.element.setAttributes(attributes);
    }

    addClasses(classes) {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].addClasses(classes);
        }
        this.element.addClasses(classes);
    }

    removeClasses(classes) {
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].removeClasses(classes);
        }
        this.element.removeClasses(classes);
    }

    getChildren(identifier, element, positions) {
        let collection = [];
        let children = element.findAll(identifier);//get the children matching identifier in each element
        if (children.length > 0) {//if not empty
            for (let j = 0; j < positions.length; j++) {
                if (func.isset(children[positions[j]])) {//if available
                    collection.push(children[positions[j]]);
                }
            }
        }
        return collection;
    }

    childCss(identifier, style, positions) {
        positions = this.setPositions(positions);

        let children;
        for (let i = 0; i < this.children.length; i++) {
            children = this.getChildren(identifier, this.children[i], positions);

            for (let j = 0; j < children.length; j++) {
                children[j].css(style);
            }
        }

        children = this.getChildren(identifier, this.element, positions);

        for (let j = 0; j < children.length; j++) {
            children[j].css(style);
        }
    }

    setChildProperties(identifier, properties, positions) {
        positions = this.setPositions(positions);

        let children;
        for (let i = 0; i < this.children.length; i++) {
            children = this.getChildren(identifier, this.children[i], positions);

            for (let j = 0; j < children.length; j++) {
                children[j].setProperties(properties);
            }
        }

        children = this.getChildren(identifier, this.element, positions);
        for (let j = 0; j < children.length; j++) {
            children[j].setProperties(properties);
        }

        this.childProperties[identifier] = this.childProperties[identifier] || [];
        this.childProperties[identifier].push({ properties, positions });
    }

    setChildAttributes(identifier, attributes, positions) {
        positions = this.setPositions(positions);

        let children;
        for (let i = 0; i < this.children.length; i++) {
            children = this.getChildren(identifier, this.children[i], positions);

            for (let j = 0; j < children.length; j++) {
                children[j].setAttributes(attributes);
            }
        }

        children = this.getChildren(identifier, this.element, positions);

        for (let j = 0; j < children.length; j++) {
            children[j].setAttributes(attributes);
        }
    }

    addClassesToChild(identifier, classes, positions) {
        positions = this.setPositions(positions);

        let children;
        for (let i = 0; i < this.children.length; i++) {
            children = this.getChildren(identifier, this.children[i], positions);

            for (let j = 0; j < children.length; j++) {
                children[j].addClasses(classes);
            }
        }

        children = this.getChildren(identifier, this.element, positions);

        for (let j = 0; j < children.length; j++) {
            children[j].addClasses(classes);
        }
    }

    removeClassesFromChild(identifier, classes, positions) {
        positions = this.setPositions(positions);

        let children;
        for (let i = 0; i < this.children.length; i++) {
            children = this.getChildren(identifier, this.children[i], positions);

            for (let j = 0; j < children.length; j++) {
                children[j].removeClasses(classes);
            }
        }

        children = this.getChildren(identifier, this.element, positions);

        for (let j = 0; j < children.length; j++) {
            children[j].removeClasses(classes);
        }
    }
}

export { Shadow };