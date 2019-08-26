// waits for all elements to load so they can be read/modified
document.addEventListener("DOMContentLoaded", function(event) {
    complete_divs();
    // saving references of determinate loading bars into attributes of class progress
    progress.line_element = document.getElementsByClassName("lv-definite_line")[0].firstElementChild;
    progress.line_end_element = document.getElementsByClassName("lv-definite_bordered_line")[0].firstElementChild;
    progress.circle_divs = document.getElementsByClassName("lv-definite_circle")[0].children;
    progress.circle_background = progress.circle_divs[0];
    progress.circle_spinner = progress.circle_divs[2];
    progress.circle_overlay = progress.circle_divs[1];
    progress.circle_percentage = progress.circle_divs[3];
    // loading colours currently used on definite circle
    progress.circle_background_color = window.getComputedStyle(progress.circle_overlay).borderTopColor;
    progress.circle_spinner_color = window.getComputedStyle(progress.circle_spinner).borderTopColor;
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
        "lv-definite_line": 1,
        "lv-definite_bordered_line": 1,
        "lv-definite_circle": 4,
        "lv-spinner": 1
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

// saves current value as previous for future update
function transfer() {
    progress.previous_value = progress.current_value;
}

// class, stores values and other parameters of determinate loading bars
let progress = {
    max_value: 200,
    previous_value: 0,
    current_value: 0,
};

// resets all loading bars
progress.reset = function() {
    transfer();
    progress.current_value = 0;
    progress.update_line();
    progress.reset_circle();
};

// adds specified value to loading bars
progress.add_value = function(n) {
    // check if adding will not overflow maximum value
    if (progress.current_value + n <= progress.max_value) {
        transfer();
        progress.current_value += n;
        progress.update_line();
        progress.update_circle();
    }
};

// removes specified value from loading bars
progress.remove_value = function(n) {
    // check if removing will not lower value under zero
    if (progress.current_value - n >= 0) {
        transfer();
        progress.current_value -= n;
        progress.update_line();
    }
};

// sets value of loading bars to specified number
progress.set_value = function(n) {
    // check if value is between zero and maximum
    if (n >= 0 && n <= progress.max_value) {
        transfer();
        progress.current_value = n;
        progress.update_line();
    }
};

// fills whole loading bar
progress.fill = function() {
    transfer();
    progress.current_value = progress.max_value;
    progress.update_line();
    progress.update_circle();
};

progress.reset_circle = function() {
    progress.circle_background.style.borderColor = progress.circle_background_color;
    progress.circle_overlay.style.borderTopColor = progress.circle_background_color;
    progress.circle_spinner.style.transform = "rotate(-45deg)";
    progress.circle_percentage.innerHTML = "0%";
};

progress.update_circle = function() {
    let deg = Math.round((progress.previous_value / progress.max_value) * 360);
    let goal = Math.round((progress.current_value / progress.max_value) * 360);
    let id = setInterval(frame, 3);
    let offset = -45;
    function frame() {
        if (deg === goal) {
            clearInterval(id);
        } else {
            if (deg === 90) {
                progress.circle_background.style.borderRightColor = progress.circle_spinner_color;
                progress.circle_overlay.style.borderTopColor = "transparent";
            } else if (deg === 180) {
                progress.circle_background.style.borderBottomColor = progress.circle_spinner_color;
            } else if (deg === 270) {
                progress.circle_background.style.borderLeftColor = progress.circle_spinner_color;
            }
            deg += 0.5;
            progress.circle_spinner.style.transform = "rotate(" + (offset + deg).toString() + "deg)";
            progress.circle_percentage.innerHTML = (Math.round((deg / 360) * 100)).toString() + '%';
        }
    }
};

// handles animating changes of progress bars
progress.update_line = function() {
    // starting point
    let width = Math.round((progress.previous_value / progress.max_value) * 100);
    // ending point
    let goal = Math.round((progress.current_value / progress.max_value) * 100);
    // setting animation
    let id = setInterval(frame, 10);
    function frame() {
        // stop animation when goal was reached
        if (width === goal) {
            clearInterval(id)
        // increasing the bar's width
        } else if (width < goal) {
            width += 0.5;
            progress.line_element.style.width = width + '%';
            progress.line_end_element.style.width = width + '%';
        // decreasing the bar's width
        } else {
            width -= 0.5;
            progress.line_element.style.width = width + '%';
            progress.line_end_element.style.width = width + '%';
        }
    }
};
