// waits for all elements to load so they can be read/modified
document.addEventListener("DOMContentLoaded", function(event) {
    complete_divs();
    // saving references of determinate loading bars into attributes of class progress
    progress.line_element = document.getElementsByClassName("lv-determinate_line")[0];
    progress.line_end_element = document.getElementsByClassName("lv-determinate_bordered_line")[0];
    progress.circle = document.getElementsByClassName("lv-determinate_circle")[0];
});

// fills all spinners with appropriate number of divs
function complete_divs() {
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
            }
        }
    }
}

// automatically detects new elements in DOM and appends divs to them (calls function complete_divs();
const config = {childList: true, subtree: true};
// defining what to do on change of DOM - child mutation
const callback = function(mutationList, observer) {
    mutationList.forEach(function(mutation) {
        if (mutation.type === "childList") {
            try {
                if (mutation.addedNodes[0].classList.length > 0) {
                    // filling the node with divs when it is empty
                    complete_divs();
                }
            } catch (error) {}
        }
    });
};
// initializing the observer and starting observation
const observer = new MutationObserver(callback);
observer.observe(document, config);



// help class and function to demonstrate
let progress = {
    max_value: 200,
    previous_value: 0,
    current_value: 0,
};
function add() {
    let child = document.createElement("DIV");
    child.className = "lv-spinner mid lg mtop-3";
    document.getElementById("container").appendChild(child);
}



// extends or shortens any BAR specified as a first argument
const lvUpdateBar = function(barElement, newValue, maxValue) {
    // getting current width of line from the page
    let currentWidth = parseInt(barElement.firstElementChild.style.width);
    // protective condition for empty line
    if (isNaN(currentWidth)) {
        currentWidth = 0;
    }
    // end point of the animation
    let goalWidth = Math.round((newValue / maxValue) * 100);
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
        barElement.lastElementChild.innerHTML = currentWidth;
    }
};

// controls change of any CIRCLE bar specified as first argument
const lvUpdateCircle = function(circleElement, newValue, maxValue) {
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
    let goalAngle = Math.round((newValue / maxValue) * 360);
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

// saves current value as previous for future update
function transfer() {
    progress.previous_value = progress.current_value;
}

// resets all loading bars
progress.reset = function() {
    progress.previous_value = 0;
    progress.current_value = 0;
    lvUpdateCircle(progress.circle, 0, progress.max_value);
    lvUpdateBar(progress.line_element, 0, progress.max_value);
};

// fills whole loading bar
progress.fill = function() {
    transfer();
    progress.current_value = progress.max_value;
    lvUpdateBar(progress.line_element, progress.max_value, progress.max_value);
    lvUpdateCircle(progress.circle, progress.max_value, progress.max_value);
};

// adds specified value to loading bars
progress.add_value = function(n) {
    // check if adding will not overflow maximum value
    if (progress.current_value + n <= progress.max_value) {
        progress.current_value += n;
    } else {
        progress.current_value = progress.max_value;
    }
    transfer();
    lvUpdateBar(progress.line_element, progress.current_value, progress.max_value);
    lvUpdateCircle(progress.circle, progress.current_value, progress.max_value);
};

// removes specified value from loading bars
progress.remove_value = function(n) {
    // check if removing will not lower value under zero
    if (progress.current_value - n >= 0) {
        progress.current_value -= n;
    } else {
        progress.current_value = 0;

    }
    transfer();
    lvUpdateBar(progress.line_element, progress.current_value, progress.max_value);
    lvUpdateCircle(progress.circle, progress.current_value, progress.max_value);
};

// sets value of loading bars to specified number
progress.set_value = function(n) {
    // check if value is between zero and maximum
    if (n >= 0 && n <= progress.max_value) {
        transfer();
        progress.current_value = n;
        lvUpdateCircle(progress.circle, progress.current_value, progress.max_value);
        lvUpdateBar(progress.line_element, progress.current_value, progress.max_value);
    }
};





