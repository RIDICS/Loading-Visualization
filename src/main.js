document.addEventListener("DOMContentLoaded", function(event) {
    init();
    progress.line_element = document.getElementsByClassName("definite_line")[0].firstElementChild;
    progress.line_end_element = document.getElementsByClassName("line_end")[0].firstElementChild;
});
// fills all spinners with appropriate number of divs
function init() {
    // list of all possible objects with the number of divs that are supposed to be in them
    let objects = {
        "bars": 8,
        "squares": 4,
        "line": 1,
        "circles": 12,
        "borderless_line": 1,
        "dots": 4,
        "definite_line": 1,
        "line_end": 1
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
function transfer() {
    progress.previous_value = progress.current_value;
}

let progress = {
    max_value: 200,
    previous_value: 0,
    current_value: 0,
};

progress.reset = function() {
    transfer();
    progress.current_value = 0;
    progress.update_line();
};

progress.add_value = function(n) {
    if (progress.current_value + n <= progress.max_value) {
        transfer();
        progress.current_value += n;
        progress.update_line();
    }
};

progress.remove_value = function(n) {
    if (progress.current_value - n >= 0) {
        transfer();
        progress.current_value -= n;
        progress.update_line();
    }
};

progress.set_value = function(n) {
    if (n >= 0 && n <= progress.max_value) {
        transfer();
        progress.current_value = n;
        progress.update_line();
    }
};

progress.fill = function() {
    transfer();
    progress.current_value = progress.max_value;
    progress.update_line();
};

progress.update_line = function() {
    let width = Math.round((progress.previous_value / progress.max_value) * 100);
    let goal = Math.round((progress.current_value / progress.max_value) * 100);
    let id = setInterval(frame, 10);
    function frame() {
        if (width === goal) {
            clearInterval(id)
        } else if (width < goal) {
            width += 0.5;
            progress.line_element.style.width = width + '%';
            progress.line_end_element.style.width = width + '%';
        } else {
            width -= 0.5;
            progress.line_element.style.width = width + '%';
            progress.line_end_element.style.width = width + '%';
        }
    }
};
