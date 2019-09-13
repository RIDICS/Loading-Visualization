var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var lv = /** @class */ (function () {
    function lv() {
        this.observer = new MutationObserver(this.callback);
    }
    lv.prototype.initLoaderAll = function () {
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
    };
    lv.prototype.create = function (element) {
        var classes = element.classList;
        for (var i = 0; i < classes.length; i++) {
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
    };
    // automatically detects new elements in DOM and appends divs to them (calls function complete_divs();
    // defining what to do on change of DOM - child mutation
    lv.prototype.callback = function (mutationList, observer) {
        var _this = this;
        mutationList.forEach(function (mutation) {
            if (mutation.type === "childList") {
                try {
                    if (mutation.addedNodes[0].classList.length > 0) {
                        // filling the node with divs when it is empty
                        console.log(mutation.addedNodes[0]);
                        _this.create(mutation.addedNodes[0]);
                    }
                }
                catch (error) { }
            }
        });
    };
    ;
    lv.prototype.startObserving = function () {
        this.observer.observe(document.body, { childList: true, subtree: true });
    };
    return lv;
}());
(function (lv) {
    var ElementBase = /** @class */ (function () {
        function ElementBase(element) {
            this.element = element;
        }
        ElementBase.prototype.show = function () {
            this.element.style.display = null;
        };
        ElementBase.prototype.hide = function () {
            this.element.style.display = "none";
        };
        // resets specified element
        ElementBase.prototype.reset = function (maxValue) {
            this.update('set', 0, maxValue);
        };
        // fills whole loading bar
        ElementBase.prototype.fill = function (maxValue) {
            this.update('set', maxValue, maxValue);
        };
        // adds value to loading bar
        ElementBase.prototype.add = function (addValue, maxValue) {
            this.update('add', addValue, maxValue);
        };
        // fills all spinners with appropriate number of divs
        ElementBase.prototype.initLoader = function (loaderElement, description) {
            // manual addition on specified object
            if (loaderElement.hasChildNodes) {
                this.fillElement(loaderElement, description.className, description.divCount);
            }
        };
        ElementBase.prototype.fillElement = function (element, elementClass, divNumber) {
            for (var i = 0; i < divNumber; i += 1) {
                element.appendChild(document.createElement("DIV"));
            }
            if (elementClass === "lv-determinate_circle" || elementClass === "lv-determninate_line" || elementClass === "lv-determinate_bordered_line") {
                element.lastElementChild.innerHTML = "0";
            }
            if (!element.classList.contains(elementClass)) {
                element.classList.add(elementClass);
            }
        };
        ;
        return ElementBase;
    }());
    lv.ElementBase = ElementBase;
    var Bar = /** @class */ (function (_super) {
        __extends(Bar, _super);
        function Bar(element, barType, classes) {
            if (classes === void 0) { classes = null; }
            var _this = _super.call(this, element) || this;
            _this.divCount = {};
            _this.divCount[BarType.Line] = { className: "lv-line", divCount: 1 };
            _this.divCount[BarType.BorderedLine] = { className: "lv-bordered_line", divCount: 1 };
            _this.divCount[BarType.DeterminateLine] = { className: "lv-determinate_line", divCount: 2 };
            _this.divCount[BarType.DeterminateBorderedLine] = { className: "lv-determinate_bordered_line", divCount: 2 };
            _this.initLoader(element, _this.divCount[barType]);
            element.classList.add(classes);
            return _this;
        }
        Bar.prototype.update = function (type, newValue, maxValue) {
            // getting current width of line from the page
            var line = this.element.firstElementChild;
            var currentWidth = parseInt(line.style.width);
            // protective condition for empty line
            if (isNaN(currentWidth)) {
                currentWidth = 0;
            }
            // end point of the animation
            var goalWidth;
            if (type === "add") {
                goalWidth = currentWidth + Math.round((newValue / maxValue) * 100);
            }
            else if (type === "set") {
                goalWidth = Math.round((newValue / maxValue) * 100);
            }
            // prevent overflow from both sides
            if (goalWidth > 100) {
                goalWidth = 100;
            }
            if (goalWidth < 0) {
                goalWidth = 0;
            }
            var animation = setInterval(frame, 5);
            function frame() {
                if (currentWidth === goalWidth) { // stopping animation when end point is reached
                    clearInterval(animation);
                }
                else if (currentWidth > goalWidth) { // shortening the line
                    currentWidth -= 0.5;
                }
                else { // extending the line
                    currentWidth += 0.5;
                }
                line.style.width = currentWidth + "%";
                // updating the percentage
                this.element.lastElementChild.innerHTML = Math.round(currentWidth).toString();
            }
        };
        return Bar;
    }(ElementBase));
    lv.Bar = Bar;
    var Circle = /** @class */ (function (_super) {
        __extends(Circle, _super);
        function Circle(element, circleType, classes) {
            if (classes === void 0) { classes = null; }
            var _this = _super.call(this, element) || this;
            _this.divCount = {};
            _this.divCount[CircleType.Bars] = { className: "lv-bars", divCount: 8 };
            _this.divCount[CircleType.Squares] = { className: "lv-squares", divCount: 4 };
            _this.divCount[CircleType.Circles] = { className: "lv-circles", divCount: 12 };
            _this.divCount[CircleType.Dots] = { className: "lv-dots", divCount: 4 };
            _this.divCount[CircleType.DeterminateCircle] = { className: "lv-determinate_circle", divCount: 4 };
            _this.divCount[CircleType.Spinner] = { className: "lv-spinner", divCount: 1 };
            _this.divCount[CircleType.Dashed] = { className: "lv-dashed", divCount: 1 };
            _this.initLoader(element, _this.divCount[circleType]);
            element.classList.add(classes);
            return _this;
        }
        Circle.prototype.update = function (type, newValue, maxValue) {
            var rotationOffset = -45; // initial rotation of the spinning div in css
            // separating individual parts of the circle
            var background = this.element.children[0];
            var overlay = this.element.children[1];
            var spinner = this.element.children[2];
            var percentage = this.element.children[3];
            // getting the colors defined in css
            var backgroundColor = window.getComputedStyle(background).borderTopColor;
            var spinnerColor = window.getComputedStyle(spinner).borderTopColor;
            // computing current rotation of spinning part of circle using rotation matrix
            var rotationMatrix = window.getComputedStyle(spinner).getPropertyValue("transform").split("(")[1].split(")")[0].split(",");
            var currentAngle = Math.round(Math.atan2(parseFloat(rotationMatrix[1]), parseFloat(rotationMatrix[0])) * (180 / Math.PI)) - rotationOffset;
            // safety conditions for full and empty circle (360 <=> 0 and that caused problems)
            if (percentage.innerHTML === "100") {
                currentAngle = 360;
            }
            if (currentAngle < 0) {
                currentAngle += 360;
            }
            // end point of the animation
            var goalAngle;
            if (type === "add") {
                goalAngle = currentAngle + Math.round((newValue / maxValue) * 360);
            }
            else if (type === "set") {
                goalAngle = Math.round((newValue / maxValue) * 360);
            }
            // prevent overflow to both sides
            if (goalAngle > 360) {
                goalAngle = 360;
            }
            if (goalAngle < 0) {
                goalAngle = 0;
            }
            var id = setInterval(frame, 3);
            function frame() {
                if (currentAngle === goalAngle) { // stopping the animation when end point is reached
                    clearInterval(id);
                }
                else {
                    if (currentAngle < goalAngle) { // "filling" the circle
                        if (currentAngle === 90) {
                            background.style.borderRightColor = spinnerColor;
                            overlay.style.borderTopColor = "transparent";
                        }
                        else if (currentAngle === 180) {
                            background.style.borderBottomColor = spinnerColor;
                        }
                        else if (currentAngle === 270) {
                            background.style.borderLeftColor = spinnerColor;
                        }
                        currentAngle += 1;
                    }
                    else { // "emptying the circle"
                        if (currentAngle === 270) {
                            background.style.borderLeftColor = backgroundColor;
                        }
                        else if (currentAngle === 180) {
                            background.style.borderBottomColor = backgroundColor;
                        }
                        else if (currentAngle === 90) {
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
        };
        return Circle;
    }(ElementBase));
    lv.Circle = Circle;
    var BarType;
    (function (BarType) {
        BarType[BarType["Line"] = 0] = "Line";
        BarType[BarType["BorderedLine"] = 1] = "BorderedLine";
        BarType[BarType["DeterminateLine"] = 2] = "DeterminateLine";
        BarType[BarType["DeterminateBorderedLine"] = 3] = "DeterminateBorderedLine";
    })(BarType = lv.BarType || (lv.BarType = {}));
    var CircleType;
    (function (CircleType) {
        CircleType[CircleType["Bars"] = 0] = "Bars";
        CircleType[CircleType["Squares"] = 1] = "Squares";
        CircleType[CircleType["Circles"] = 2] = "Circles";
        CircleType[CircleType["Dots"] = 3] = "Dots";
        CircleType[CircleType["DeterminateCircle"] = 4] = "DeterminateCircle";
        CircleType[CircleType["Spinner"] = 5] = "Spinner";
        CircleType[CircleType["Dashed"] = 6] = "Dashed";
    })(CircleType = lv.CircleType || (lv.CircleType = {}));
})(lv || (lv = {}));

//# sourceMappingURL=main.js.map
