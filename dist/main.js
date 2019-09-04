function lv(){}
// fills all spinners with appropriate number of divs
lv.completeDivs = function() {
    // list of all possible objects with the number of divs that are supposed to be in them
    let objects = {
        "lv-bars": 8,
        "lv-squares": 4,
        "lv-bordered_line": 1,
        "lv-circles": 12,
        "lv-line": 1,
        "lv-dots": 4,
        "lv-determinate_line": 2,
        "lv-determinate_bordered_line": 2,
        "lv-determinate_circle": 4,
        "lv-spinner": 1,
        "lv-dashed": 1
    };
    // iterates through everything and adds specified number of divs
    for(let key in objects) {
        let objectsOfClass = document.getElementsByClassName(key);
        for(let i = 0; i < objectsOfClass.length; i += 1) {
            // condition if the div is empty <=> new; otherwise the divs are not added
            if (!objectsOfClass.item(i).hasChildNodes()) {
                for (let n = 0; n < objects[key]; n += 1) {
                    objectsOfClass.item(i).appendChild(document.createElement("DIV"));
                }
                if (objectsOfClass.item(i).className.includes("lv-determinate_circle") || objectsOfClass.item(i).className.includes("lv-determinate_line") || objectsOfClass.item(i).className.includes("lv-determinate_bordered_line")) {
                    objectsOfClass.item(i).lastElementChild.innerHTML = "0";
                }
            }
        }
    }
};

// extends or shortens any BAR specified as a first argument
lv.updateBar = function(type, barElement, newValue, maxValue) {
    // getting current width of line from the page
    let currentWidth = parseInt(barElement.firstElementChild.style.width);
    // protective condition for empty line
    if (isNaN(currentWidth)) {
        currentWidth = 0;
    }
    // end point of the animation
    let goalWidth;
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
        barElement.firstElementChild.style.width = currentWidth + "%";
        // updating the percentage
        barElement.lastElementChild.innerHTML = Math.round(currentWidth).toString();
    }
};

// controls change of any CIRCLE bar specified as first argument
lv.updateCircle = function(type, circleElement, newValue, maxValue) {
    let rotationOffset = -45; // initial rotation of the spinning div in css
    // separating individual parts of the circle
    let background = circleElement.children[0];
    let overlay = circleElement.children[1];
    let spinner = circleElement.children[2];
    let percentage = circleElement.children[3];
    // getting the colors defined in css
    let backgroundColor = window.getComputedStyle(background).borderTopColor;
    let spinnerColor = window.getComputedStyle(spinner).borderTopColor;
    // computing current rotation of spinning part of circle using rotation matrix
    let rotationMatrix = window.getComputedStyle(spinner).getPropertyValue("transform").split("(")[1].split(")")[0].split(",");
    let currentAngle = Math.round(Math.atan2(parseFloat(rotationMatrix[1]), parseFloat(rotationMatrix[0])) * (180 / Math.PI)) - rotationOffset;
    // safety conditions for full and empty circle (360 <=> 0 and that caused problems)
    if (percentage.innerHTML === "100") {
        currentAngle = 360;
    }
    if (currentAngle < 0) {
        currentAngle += 360;
    }
    // end point of the animation
    let goalAngle;
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
};

// resets specified element
lv.reset = function(type, element, maxValue) {
    if (type === "bar") {
        lv.updateBar('set', element, 0, maxValue);
    } else if (type === "circle") {
        lv.updateCircle('set', element, 0, maxValue);
    }
};

// fills whole loading bar
lv.fill = function(type, element, maxValue) {
    if (type === "bar") {
        lv.updateBar('set', element, maxValue, maxValue);
    } else if (type === "circle") {
        lv.updateCircle('set', element, maxValue, maxValue);
    }
};

// adds value to loading bar
lv.add = function(type, element, addValue, maxValue) {
    if (type === "bar") {
        lv.updateBar('add', element, addValue, maxValue);
    } else if (type === "circle") {
        lv.updateCircle('add', element, addValue, maxValue);
    }
};

// automatically detects new elements in DOM and appends divs to them (calls function complete_divs();
lv.config = {childList: true, subtree: true};
// defining what to do on change of DOM - child mutation
lv.callback = function(mutationList, observer) {
    mutationList.forEach(function(mutation) {
        if (mutation.type === "childList") {
            try {
                if (mutation.addedNodes[0].classList.length > 0) {
                    // filling the node with divs when it is empty
                    lv.completeDivs();
                }
            } catch (error) {}
        }
    });
};
// initializing the observer and starting observation
lv.observer = new MutationObserver(lv.callback);
lv.observer.observe(document, lv.config);
