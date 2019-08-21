
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

document.addEventListener("DOMContentLoaded", function(event) {
    progress.line_element = document.getElementsByClassName("definite_line")[0].firstElementChild;
    progress.line_end_element = document.getElementsByClassName("line_end")[0].firstElementChild;
});