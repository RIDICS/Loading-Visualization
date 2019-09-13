class lv {
    public initLoaderAll(): void {
        // iterates through everything and adds specified number of divs
        // for(let key in this.elements) {
        //     let elementsOfClass: HTMLCollectionOf<HTMLDivElement> = <HTMLCollectionOf<HTMLDivElement>>document.getElementsByClassName(key);
        //     console.log(elementsOfClass);
        //     for(let i = 0; i < elementsOfClass.length; i += 1) {
        //         // condition if the div is empty <=> new; otherwise the divs are not added
        //         if (!elementsOfClass.item(i).hasChildNodes()) {
        //             this.fillElement(elementsOfClass.item(i), key, this.elements[key]);
        //         }
        //     }
        // }

    }

    public create(element: HTMLDivElement): lv.ElementBase {
        let classes: DOMTokenList = element.classList;
        for (let i = 0; i < classes.length; i++) {
            switch (classes[i]) {
                case "lv-bars":
                    return new lv.Circle(element, lv.CircleType.Bars);
                case "lv-squares":
                    return new lv.Circle(element, lv.CircleType.Squares);
                case "lv-circles":
                    return new lv.Circle(element, lv.CircleType.Circles);
                case "lv-dots":
                    return new lv.Circle(element, lv.CircleType.Dots);
                case "lv-spinner":
                    return new lv.Circle(element, lv.CircleType.Spinner);
                case "lv-dashed":
                    return new lv.Circle(element, lv.CircleType.Dashed);
                case "lv-determinate_circle":
                    return new lv.Circle(element, lv.CircleType.DeterminateCircle);
                case "lv-line":
                    return new lv.Bar(element, lv.BarType.Line);
                case "lv-bordered_line":
                    return new lv.Bar(element, lv.BarType.BorderedLine);
                case "lv-determinate_line":
                    return new lv.Bar(element, lv.BarType.DeterminateLine);
                case "lv-determinate_bordered_line":
                    return new lv.Bar(element, lv.BarType.DeterminateBorderedLine);
            }
        }
        return null;
    }
    // automatically detects new elements in DOM and appends divs to them (calls function complete_divs();
    // defining what to do on change of DOM - child mutation
    private callback(mutationList, observer: MutationObserver): void {
        mutationList.forEach(function(mutation) {
            if (mutation.type === "childList") {
                try {
                    if (mutation.addedNodes[0].classList.length > 0) {
                        // filling the node with divs when it is empty
                        console.log(mutation.addedNodes[0]);
                        this.create(mutation.addedNodes[0]);
                    }
                } catch (error) {}
            }
        });
    };
    // initializing the observer and starting observation
    private observer: MutationObserver;
    constructor() {
        this.observer = new MutationObserver(this.callback);
    }
    public startObserving() {
        this.observer.observe(document.body, {childList: true, subtree: true});
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
    export abstract class ElementBase {
        
        protected element: HTMLDivElement;
        
        constructor(element: HTMLDivElement) {
            this.element = element;
        }

        public show(): void {
            this.element.style.display = null;
        }

        public hide(): void {
            this.element.style.display = "none";
        }

        public abstract update(type: string, newValue: number, maxValue: number): void;

        // resets specified element
        public reset(maxValue: number): void {
                this.update('set', 0, maxValue);
        }

        // fills whole loading bar
        public fill(maxValue: number): void {
                this.update('set', maxValue, maxValue);
        }

        // adds value to loading bar
        public add(addValue: number, maxValue: number): void {
                this.update('add', addValue, maxValue);
        }

        // fills all spinners with appropriate number of divs
        public initLoader(loaderElement: HTMLDivElement, description: IDescription): void {
            // manual addition on specified object
            if (loaderElement.hasChildNodes) {
                this.fillElement(loaderElement, description.className, description.divCount);
            }
        }

        private fillElement(element: HTMLElement, elementClass: string, divNumber: number): void {
            for (let i = 0; i < divNumber; i += 1) {
                element.appendChild(document.createElement("DIV"));
            }
            if (elementClass === "lv-determinate_circle" || elementClass === "lv-determninate_line" || elementClass === "lv-determinate_bordered_line") {
                element.lastElementChild.innerHTML = "0";
            }
            if (!element.classList.contains(elementClass)) {
                element.classList.add(elementClass);
            }
        };
    }

    export class Bar extends ElementBase {
        private divCount: IDictionary = {};

        constructor(element: HTMLDivElement, barType: BarType, classes: string = null) {
            super(element);
            this.divCount[BarType.Line] = {className: "lv-line", divCount: 1};
            this.divCount[BarType.BorderedLine] = {className: "lv-bordered_line", divCount: 1};
            this.divCount[BarType.DeterminateLine] = {className: "lv-determinate_line", divCount: 2};
            this.divCount[BarType.DeterminateBorderedLine] = {className: "lv-determinate_bordered_line", divCount: 2};
            this.initLoader(element, this.divCount[barType]);
            element.classList.add(classes);
        }

        update(type: string, newValue: number, maxValue: number): void {
            // getting current width of line from the page
            let line: HTMLDivElement = <HTMLDivElement>this.element.firstElementChild;
            let currentWidth: number = parseInt(line.style.width);
            // protective condition for empty line
            if (isNaN(currentWidth)) {
                currentWidth = 0;
            }
            // end point of the animation
            let goalWidth: number;
            if (type === "add") {
                goalWidth = currentWidth + Math.round((newValue / maxValue) * 100);
            } else if (type === "set") {
                goalWidth = Math.round((newValue / maxValue) * 100);
            }
            // prevent overflow from both sides
            if (goalWidth > 100) {
                goalWidth = 100;
            }
            if (goalWidth < 0) {
                goalWidth = 0;
            }
            let animation = setInterval(frame, 5);
            function frame() {
                if (currentWidth === goalWidth) { // stopping animation when end point is reached
                    clearInterval(animation);
                } else if (currentWidth > goalWidth) { // shortening the line
                    currentWidth -= 0.5;
                } else { // extending the line
                    currentWidth += 0.5;
                }
                line.style.width = currentWidth + "%";
                // updating the percentage
                this.element.lastElementChild.innerHTML = Math.round(currentWidth).toString();
            }
        }

    }
    export class Circle extends ElementBase {

        private divCount: IDictionary = {};

        constructor(element: HTMLDivElement, circleType: CircleType, classes: string = null) {
            super(element);
            this.divCount[CircleType.Bars] = {className: "lv-bars", divCount: 8};
            this.divCount[CircleType.Squares] = {className: "lv-squares", divCount: 4};
            this.divCount[CircleType.Circles] = {className: "lv-circles", divCount: 12};
            this.divCount[CircleType.Dots] = {className: "lv-dots", divCount: 4};
            this.divCount[CircleType.DeterminateCircle] = {className: "lv-determinate_circle", divCount: 4};
            this.divCount[CircleType.Spinner] = {className: "lv-spinner", divCount: 1};
            this.divCount[CircleType.Dashed] = {className: "lv-dashed", divCount: 1};
            this.initLoader(element, this.divCount[circleType]);
            element.classList.add(classes);
        }

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
    export enum BarType {
        Line,
        BorderedLine,
        DeterminateLine,
        DeterminateBorderedLine,
    }
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