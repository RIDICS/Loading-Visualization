class lv {
    /**
     * iterates through all elements and calls function create on them
     */
    public initLoaderAll(): void {
        let divs = document.getElementsByTagName("DIV");
        for (let i = 0; i < divs.length; i++) {
            if (!divs[i].hasChildNodes()) {
                lv.create(<HTMLDivElement>divs[i]);
            }
        }
    }

    /**
     * returns list of non-main classes (every except the one that specifies the element)
     * @param classList
     * @param notIncludingClass
     */
    private static getModifyingClasses(classList: Array<string>, notIncludingClass: string): string[] {
        let modifyingClasses: string[] = [];
        for (let i = 0; i < classList.length; i++) {
            if (classList[i] != notIncludingClass) {
                modifyingClasses.push(classList[i]);
            }
        }
        return modifyingClasses;
    }

    /**
     * decides type of passed element and returns its object
     * @param element - pass existing element or null
     * @param classString - classes separated with one space that specifies type of element, optional, only when passing null instead of element
     */
    public static create(element: HTMLDivElement = null, classString?: string): lv.ElementBase {
        let classes : Array<string> = [];
        if (element != null) {
            let listOfClasses = element.classList;
            for (let i = 0; i < listOfClasses.length; i++) {
                classes.push(listOfClasses[i]);
            }
        } else if (classString != null) {
            classes = classString.split(" ");
        }
        for (let i = 0; i < classes.length; i++) {
            switch (classes[i]) {
                case "lv-bars":
                    return new lv.Circle(element, lv.CircleType.Bars, lv.getModifyingClasses(classes, "lv-bars"));
                case "lv-squares":
                    return new lv.Circle(element, lv.CircleType.Squares, lv.getModifyingClasses(classes, "lv-squares"));
                case "lv-circles":
                    return new lv.Circle(element, lv.CircleType.Circles, lv.getModifyingClasses(classes, "lv-circles"));
                case "lv-dots":
                    return new lv.Circle(element, lv.CircleType.Dots, lv.getModifyingClasses(classes, "lv-dots"));
                case "lv-spinner":
                    return new lv.Circle(element, lv.CircleType.Spinner, lv.getModifyingClasses(classes, "lv-spinner"));
                case "lv-dashed":
                    return new lv.Circle(element, lv.CircleType.Dashed, lv.getModifyingClasses(classes, "lv-dashed"));
                case "lv-determinate_circle":
                    return new lv.Circle(element, lv.CircleType.DeterminateCircle, lv.getModifyingClasses(classes, "lv-determinate_circle"));
                case "lv-line":
                    return new lv.Bar(element, lv.BarType.Line, lv.getModifyingClasses(classes, "lv-line"));
                case "lv-bordered_line":
                    return new lv.Bar(element, lv.BarType.BorderedLine, lv.getModifyingClasses(classes, "lv-bordered_line"));
                case "lv-determinate_line":
                    return new lv.Bar(element, lv.BarType.DeterminateLine, lv.getModifyingClasses(classes, "lv-determinate_line"));
                case "lv-determinate_bordered_line":
                    return new lv.Bar(element, lv.BarType.DeterminateBorderedLine, lv.getModifyingClasses(classes, "lv-determinate_bordered_line"));
            }
        }
        return null;
    }

    /**
     * observes for changes in DOM and creates new element's objects
     * @param mutationList
     * @param observer
     */
    private callback(mutationList, observer: MutationObserver): void {
        for (let i = 0; i < mutationList.length; i++) {
            if (mutationList[i].type === "childList") {
                try {
                    if (mutationList[i].addedNodes[0].classList.length > 0) {
                        // filling the node with divs when it is empty
                        lv.create(mutationList[i].addedNodes[0]);
                    }
                } catch (error) {}
            }
        }
    };

    /**
     * initializing the observer and starting observation
     */
    private observer: MutationObserver;
    constructor() {
        this.observer = new MutationObserver(this.callback);
    }
    public startObserving() {
        this.observer.observe(document.body, {childList: true, subtree: true});
    }
    public stopObserving() {
        this.observer.disconnect();
    }
}
namespace lv {
    interface IDictionary {
        [key: number]: IDescription;
    }
    interface IDescription {
        divCount: number;
        className: string;
    }

    /**
     * specifies functions same for all elements
     */
    export abstract class ElementBase {
        
        protected element: HTMLDivElement;
        
        constructor(element: HTMLDivElement) {
            this.element = element === null ? document.createElement('div') : element;
        }

        public show(): void {
            this.element.style.display = null;
        }

        public hide(): void {
            this.element.style.display = "none";
        }

        public remove(): void {
            this.element.parentNode.removeChild(this.element);
        }

        public setLabel(labelText: string): void {
            this.element.setAttribute("data-label", labelText);
        }

        public removeLabel(): void {
            this.element.removeAttribute("data-label");
        }

        public showPercentage(): void {
            this.element.setAttribute("data-percentage", "true");
        }

        public hidePercentage(): void {
            this.element.removeAttribute("data-percentage");
        }

        public setId(idText: string): void {
            this.element.setAttribute("id", idText);
        }

        public removeId(): void {
            this.element.removeAttribute("id");
        }

        /**
         * adds class or classes to element
         * @param classString - string that contains classes separated with one space
         */
        public addClass(classString: string): void {
            let classList = classString.split(" ");
            for (let i = 0; i < classList.length; i++) {
                this.element.classList.add(classList[i]);
            }
        }

        /**
         * if element contains specified class or classes, it/they are removed
         * @param classString - string that contains classes separated with one space
         */
        public removeClass(classString: string): void {
            let classList = classString.split(" ");
            for (let i = 0; i < classList.length; i++) {
                if (this.element.classList.contains(classList[i])) {
                    this.element.classList.remove(classList[i]);
                }
            }
        }

        /**
         * returns DOM element - needed for placing or removing the element with jquery
         */
        public getElement(): HTMLDivElement {
            return this.element;
        }

        /**
         * updates determinate element
         * @param type
         * @param newValue
         * @param maxValue
         */
        public abstract update(type: string, newValue: number, maxValue: number): void;

        /**
         * resets determinate element to 0
         * @param maxValue
         */
        public reset(maxValue: number): void {
                this.update('set', 0, maxValue);
        }

        /**
         * sets determinate element to 100%
         * @param maxValue
         */
        public fill(maxValue: number): void {
                this.update('set', maxValue, maxValue);
        }

        /**
         * adds positive or negative value to a determinate element
         * @param addValue
         * @param maxValue
         */
        public add(addValue: number, maxValue: number): void {
                this.update('add', addValue, maxValue);
        }

        /**
         * sets loading bar to passed value
         * @param value
         * @param maxValue
         */
        public set(value: number, maxValue: number): void {
                this.update('set', value, maxValue);
        }

        /**
         * initializes an element
         * @param loaderElement
         * @param description
         */
        public initLoader(loaderElement: HTMLDivElement, description: IDescription): void {
            // manual addition on specified object
            if (!loaderElement.hasChildNodes()) {
                this.fillElement(loaderElement, description.className, description.divCount);
            }
        }

        /**
         * fills element with appropriate number of divs
         * @param element
         * @param elementClass
         * @param divNumber
         */
        private fillElement(element: HTMLElement, elementClass: string, divNumber: number): void {
            for (let i = 0; i < divNumber; i += 1) {
                element.appendChild(document.createElement("DIV"));
            }
            if (elementClass === "lv-determinate_circle" || elementClass === "lv-determinate_line" || elementClass === "lv-determinate_bordered_line") {
                element.lastElementChild.innerHTML = "0";
            }
            if (!element.classList.contains(elementClass)) {
                element.classList.add(elementClass);
            }
        };
    }

    /**
     * class for linear elements
     */
    export class Bar extends ElementBase {
        private divCount: IDictionary = {};

        /**
         * creates linear element
         * @param element
         * @param barType
         * @param classes
         */
        constructor(element: HTMLDivElement, barType: BarType, classes: string[] = null) {
            super(element);
            this.divCount[BarType.Line] = {className: "lv-line", divCount: 1};
            this.divCount[BarType.BorderedLine] = {className: "lv-bordered_line", divCount: 1};
            this.divCount[BarType.DeterminateLine] = {className: "lv-determinate_line", divCount: 2};
            this.divCount[BarType.DeterminateBorderedLine] = {className: "lv-determinate_bordered_line", divCount: 2};
            this.initLoader(this.element, this.divCount[barType]);
            for (let i = 0; i < classes.length; i++) {
                this.element.classList.add(classes[i]);
            }
        }

        /**
         * type specific update function for linear element
         * @param type
         * @param newValue
         * @param maxValue
         */
        update(type: string, newValue: number, maxValue: number): void {
            // getting current width of line from the page
            let line: HTMLDivElement = <HTMLDivElement>this.element.firstElementChild;
            let percentage: HTMLDivElement = <HTMLDivElement>this.element.lastElementChild;
            let currentWidth: number = parseFloat(line.style.width);
            // protective condition for empty line
            if (isNaN(currentWidth)) {
                currentWidth = 0;
            }
            // end point of the animation
            let goalWidth: number;
            if (type === "add") {
                goalWidth = currentWidth + Math.round((newValue / maxValue) * 1000) / 10;
            } else if (type === "set") {
                goalWidth = Math.round((newValue / maxValue) * 1000) / 10;
            }
            // prevent overflow from both sides
            if (goalWidth > 100) {
                goalWidth = 100.0;
            }
            if (goalWidth < 0) {
                goalWidth = 0;
            }
            let animation = setInterval(frame, 5);
            function frame() {
                if (currentWidth > goalWidth) { // shortening the line
                    if (currentWidth < goalWidth + 0.01) {
                        clearInterval(animation);
                    } else {
                        currentWidth -= 0.1;
                    }
                } else { // extending the line
                    if (currentWidth > goalWidth - 0.01) {
                        clearInterval(animation);
                    } else {
                        currentWidth += 0.1;
                    }
                }
                line.style.width = currentWidth + "%";
                // updating the percentage
                percentage.innerHTML = currentWidth.toFixed(1);
            }
        }

    }

    /**
     * class for square or circular elements
     */
    export class Circle extends ElementBase {

        private divCount: IDictionary = {};

        /**
         * creates square or circular element
         * @param element
         * @param circleType
         * @param classes
         */
        constructor(element: HTMLDivElement, circleType: CircleType, classes: string[] = null) {
            super(element);
            this.divCount[CircleType.Bars] = {className: "lv-bars", divCount: 8};
            this.divCount[CircleType.Squares] = {className: "lv-squares", divCount: 4};
            this.divCount[CircleType.Circles] = {className: "lv-circles", divCount: 12};
            this.divCount[CircleType.Dots] = {className: "lv-dots", divCount: 4};
            this.divCount[CircleType.DeterminateCircle] = {className: "lv-determinate_circle", divCount: 4};
            this.divCount[CircleType.Spinner] = {className: "lv-spinner", divCount: 1};
            this.divCount[CircleType.Dashed] = {className: "lv-dashed", divCount: 1};
            this.initLoader(this.element, this.divCount[circleType]);
            for (let i = 0; i < classes.length; i++) {
                this.element.classList.add(classes[i]);
            }
        }

        /**
         * type specific update function for non-linear elements
         * @param type
         * @param newValue
         * @param maxValue
         */
        update(type: string, newValue: number, maxValue: number): void {
            let rotationOffset: number = -45; // initial rotation of the spinning div in css
            // separating individual parts of the circle
            let background: HTMLDivElement = <HTMLDivElement>this.element.children[0];
            let overlay: HTMLDivElement = <HTMLDivElement>this.element.children[1];
            let spinner: HTMLDivElement = <HTMLDivElement>this.element.children[2];
            let percentage: HTMLDivElement = <HTMLDivElement>this.element.children[3];
            // getting the colors defined in css
            let backgroundColor: string = window.getComputedStyle(background).borderTopColor;
            let spinnerColor: string = window.getComputedStyle(spinner).borderTopColor;
            // computing current rotation of spinning part of circle using rotation matrix
            let rotationMatrix = window.getComputedStyle(spinner).getPropertyValue("transform").split("(")[1].split(")")[0].split(",");
            let currentAngle: number = Math.round(Math.atan2(parseFloat(rotationMatrix[1]), parseFloat(rotationMatrix[0])) * (180 / Math.PI)) - rotationOffset;
            // safety conditions for full and empty circle (360 <=> 0 and that caused problems)
            if (percentage.innerHTML === "100") {
                currentAngle = 360;
            }
            if (currentAngle < 0) {
                currentAngle += 360;
            }
            // end point of the animation
            let goalAngle: number;
            if (type === "add") {
                goalAngle = currentAngle + Math.round((newValue / maxValue) * 360);
            } else if (type === "set") {
                goalAngle = Math.round((newValue / maxValue) * 360);
            }
            // prevent overflow to both sides
            if (goalAngle > 360) {
                goalAngle = 360;
            }
            if (goalAngle < 0) {
                goalAngle = 0;
            }
            let id = setInterval(frame, 3);
            function frame() {
                if (currentAngle === goalAngle) { // stopping the animation when end point is reached
                    clearInterval(id);
                } else {
                    if (currentAngle < goalAngle) { // "filling" the circle
                        if (currentAngle === 90) {
                            background.style.borderRightColor = spinnerColor;
                            overlay.style.borderTopColor = "transparent";
                        } else if (currentAngle === 180) {
                            background.style.borderBottomColor = spinnerColor;
                        } else if (currentAngle === 270) {
                            background.style.borderLeftColor = spinnerColor;
                        }
                        currentAngle += 1;
                    } else { // "emptying the circle"
                        if (currentAngle === 270) {
                            background.style.borderLeftColor = backgroundColor;
                        } else if (currentAngle === 180) {
                            background.style.borderBottomColor = backgroundColor;
                        } else if (currentAngle === 90) {
                            background.style.borderRightColor = backgroundColor;
                            overlay.style.borderTopColor = backgroundColor;
                        }
                        currentAngle -= 1;
                    }
                    // rotating the circle
                    spinner.style.transform = "rotate(" + (rotationOffset + currentAngle).toString() + "deg)";
                    // updating percentage
                    percentage.innerHTML = (Math.round((currentAngle / 360) * 100)).toString();
                }
            }
        }

    }

    /**
     * list of linear elements
     */
    export enum BarType {
        Line,
        BorderedLine,
        DeterminateLine,
        DeterminateBorderedLine,
    }

    /**
     * list of non-linear elements
     */
    export enum CircleType {
        Bars,
        Squares,
        Circles,
        Dots,
        DeterminateCircle,
        Spinner,
        Dashed,
    }
}