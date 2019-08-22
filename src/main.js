// waits for all elements to load so they can be read/modified
document.addEventListener("DOMContentLoaded", function(event) {
    complete_divs();
    // saving references of determinate loading bars into attributes of class progress
    progress.line_element = document.getElementsByClassName("lv-definite_line")[0].firstElementChild;
    progress.line_end_element = document.getElementsByClassName("lv-definite_bordered_line")[0].firstElementChild;
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
        "lv-definite_bordered_line": 1
    };
    // iterates through everything and adds specified number of divs
    for(let key in objects) {
        let objectsOfClass = document.getElementsByClassName(key);
        for(let i = 0; i < objectsOfClass.length; i += 1) {
            for(let n = 0; n < objects[key]; n += 1) {
                objectsOfClass.item(i).appendChild(document.createElement("DIV"));
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
};

// adds specified value to loading bars
progress.add_value = function(n) {
    // check if adding will not overflow maximum value
    if (progress.current_value + n <= progress.max_value) {
        transfer();
        progress.current_value += n;
        progress.update_line();
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
