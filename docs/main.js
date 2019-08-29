const infinite = [
    'bars',
    'squares',
    'circles',
    'dots',
    'spinner',
    'dashed',
    'line',
    'bordered_line'
];
const finite = [
    'spinner2',
    'line2',
    'bordered_line2'
];

function resetInfinite() {
    for (let element of infinite) {
        $("#" + element).attr("hidden", true);
    }
}

function resetFinite() {
    for (let element of finite) {
        $("#" + element).attr("hidden", true);
    }
}
$(document).ready(function() {
    for (let element of infinite) {
        $("#" + element + "_button").unbind().click(function(event) {
            event.preventDefault();
            resetInfinite();
            $("#" + element).attr("hidden", false);
        });
    }
    for (let element of finite) {
        $("#" + element + "_button").unbind().click(function(event) {
            event.preventDefault();
            resetFinite();
            $("#" + element).attr("hidden", false);
        });
    }
    $("#finite").unbind().click(function(event) {
        resetInfinite();
        $("#infinite_container").attr("hidden", true);
        $("#finite_container").attr("hidden", false);
    });
    $("#infinite").unbind().click(function(event) {
        resetFinite();
        $("#finite_container").attr("hidden", true);
        $("#infinite_container").attr("hidden", false);
    });
    let spinners = document.getElementsByClassName("lv-determinate_circle");
    let lines = document.getElementsByClassName("lv-determinate_line");
    let borderedLines = document.getElementsByClassName("lv-determinate_bordered_line");
    $("#fill_spinner").unbind().click(function(event) {
        event.preventDefault();
        for(let spinner of spinners) {
            lvFill('circle', spinner, 200);
        }
    });
    $("#add_spinner").unbind().click(function (event) {
       event.preventDefault();
       for(let spinner of spinners) {
           lvAdd('circle', spinner, 5, 200);
       }
    });
    $("#remove_spinner").unbind().click(function (event) {
        event.preventDefault();
        for(let spinner of spinners) {
            lvAdd('circle', spinner, -10, 200);
        }
    });
    $("#reset_spinner").unbind().click(function (event) {
        event.preventDefault();
        for(let spinner of spinners) {
            lvReset('circle', spinner, 200);
        }
    });
    $("#fill_line").unbind().click(function(event) {
        event.preventDefault();
        for(let line of lines) {
            lvFill('bar', line, 200);
        }
    });
    $("#add_line").unbind().click(function (event) {
        event.preventDefault();
        for(let line of lines) {
            lvAdd('bar', line, 5, 200);
        }
    });
    $("#remove_line").unbind().click(function (event) {
        event.preventDefault();
        for(let line of lines) {
            lvAdd('bar', line, -10, 200);
        }
    });
    $("#reset_line").unbind().click(function (event) {
        event.preventDefault();
        for(let line of lines) {
            lvReset('bar', line, 200);
        }
    });
    $("#fill_bordered_line").unbind().click(function(event) {
        event.preventDefault();
        for(let line of borderedLines) {
            lvFill('bar', line, 200);
        }
    });
    $("#add_bordered_line").unbind().click(function (event) {
        event.preventDefault();
        for(let line of borderedLines) {
            lvAdd('bar', line, 5, 200);
        }
    });
    $("#remove_bordered_line").unbind().click(function (event) {
        event.preventDefault();
        for(let line of borderedLines) {
            lvAdd('bar', line, -10, 200);
        }
    });
    $("#reset_bordered_line").unbind().click(function (event) {
        event.preventDefault();
        for(let line of borderedLines) {
            lvReset('bar', line, 200);
        }
    });
});