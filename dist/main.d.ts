declare class lv {
    /**
     * iterates through all elements and calls function create on them
     */
    initLoaderAll(): void;
    /**
     * returns list of non-main classes (every except the one that specifies the element)
     * @param classList
     * @param notIncludingClass
     */
    private static getModifyingClasses;
    /**
     * decides type of passed element and returns its object
     * @param element - pass existing element or null
     * @param classString - classes separated with one space that specifies type of element, optional, only when passing null instead of element
     */
    static create(element?: HTMLDivElement, classString?: string): lv.ElementBase;
    /**
     * observes for changes in DOM and creates new element's objects
     * @param mutationList
     * @param observer
     */
    private callback;
    /**
     * initializing the observer and starting observation
     */
    private observer;
    constructor();
    startObserving(): void;
    stopObserving(): void;
}
declare namespace lv {
    interface IDescription {
        divCount: number;
        className: string;
    }
    /**
     * specifies functions same for all elements
     */
    export abstract class ElementBase {
        protected element: HTMLDivElement;
        constructor(element: HTMLDivElement);
        show(): void;
        hide(): void;
        remove(): void;
        setLabel(labelText: string): void;
        removeLabel(): void;
        showPercentage(): void;
        hidePercentage(): void;
        setId(idText: string): void;
        removeId(): void;
        /**
         * adds class or classes to element
         * @param classString - string that contains classes separated with one space
         */
        addClass(classString: string): void;
        /**
         * if element contains specified class or classes, it/they are removed
         * @param classString - string that contains classes separated with one space
         */
        removeClass(classString: string): void;
        /**
         * returns DOM element - needed for placing or removing the element with jquery
         */
        getElement(): HTMLDivElement;
        /**
         * updates determinate element
         * @param type
         * @param newValue
         * @param maxValue
         */
        abstract update(type: string, newValue: number, maxValue: number): void;
        /**
         * resets determinate element to 0
         * @param maxValue
         */
        reset(maxValue: number): void;
        /**
         * sets determinate element to 100%
         * @param maxValue
         */
        fill(maxValue: number): void;
        /**
         * adds positive or negative value to a determinate element
         * @param addValue
         * @param maxValue
         */
        add(addValue: number, maxValue: number): void;
        /**
         * sets loading bar to passed value
         * @param value
         * @param maxValue
         */
        set(value: number, maxValue: number): void;
        /**
         * initializes an element
         * @param loaderElement
         * @param description
         */
        initLoader(loaderElement: HTMLDivElement, description: IDescription): void;
        /**
         * fills element with appropriate number of divs
         * @param element
         * @param elementClass
         * @param divNumber
         */
        private fillElement;
    }
    /**
     * class for linear elements
     */
    export class Bar extends ElementBase {
        private divCount;
        /**
         * creates linear element
         * @param element
         * @param barType
         * @param classes
         */
        constructor(element: HTMLDivElement, barType: BarType, classes?: string[]);
        /**
         * type specific update function for linear element
         * @param type
         * @param newValue
         * @param maxValue
         */
        update(type: string, newValue: number, maxValue: number): void;
    }
    /**
     * class for square or circular elements
     */
    export class Circle extends ElementBase {
        private divCount;
        /**
         * creates square or circular element
         * @param element
         * @param circleType
         * @param classes
         */
        constructor(element: HTMLDivElement, circleType: CircleType, classes?: string[]);
        /**
         * type specific update function for non-linear elements
         * @param type
         * @param newValue
         * @param maxValue
         */
        update(type: string, newValue: number, maxValue: number): void;
    }
    /**
     * list of linear elements
     */
    export enum BarType {
        Line = 0,
        BorderedLine = 1,
        DeterminateLine = 2,
        DeterminateBorderedLine = 3
    }
    /**
     * list of non-linear elements
     */
    export enum CircleType {
        Bars = 0,
        Squares = 1,
        Circles = 2,
        Dots = 3,
        DeterminateCircle = 4,
        Spinner = 5,
        Dashed = 6
    }
    export {};
}
