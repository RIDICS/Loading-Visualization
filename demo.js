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
    let loader = new lv();
    //loader.initLoaderAll();
    loader.startObserving();
    let element = document.createElement("DIV");
    element.classList.add("lv-determinate_circle");
    element.classList.add("lg");
    document.body.appendChild(element);
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
        $("#infinite").removeClass("active");
        $("#finite").addClass("active");
        $("#finite_container").attr("hidden", false);
    });
    $("#infinite").unbind().click(function(event) {
        resetFinite();
        $("#finite_container").attr("hidden", true);
        $("#finite").removeClass("active");
        $("#infinite").addClass("active");
        $("#infinite_container").attr("hidden", false);
    });
    let spinners = document.getElementsByClassName("lv-determinate_circle");
    let lines = document.getElementsByClassName("lv-determinate_line");
    let borderedLines = document.getElementsByClassName("lv-determinate_bordered_line");
    $("#fill_spinner").unbind().click(function(event) {
        event.preventDefault();
        for(let spinner of spinners) {
            lv.fill('circle', spinner, 200);
        }
    });
    $("#add_spinner").unbind().click(function (event) {
       event.preventDefault();
       for(let spinner of spinners) {
           lv.add('circle', spinner, 5, 200);
       }
    });
    $("#remove_spinner").unbind().click(function (event) {
        event.preventDefault();
        for(let spinner of spinners) {
            lv.add('circle', spinner, -10, 200);
        }
    });
    $("#reset_spinner").unbind().click(function (event) {
        event.preventDefault();
        for(let spinner of spinners) {
            lv.reset('circle', spinner, 200);
        }
    });
    $("#fill_line").unbind().click(function(event) {
        event.preventDefault();
        for(let line of lines) {
            lv.fill('bar', line, 200);
        }
    });
    $("#add_line").unbind().click(function (event) {
        event.preventDefault();
        for(let line of lines) {
            lv.add('bar', line, 5, 200);
        }
    });
    $("#remove_line").unbind().click(function (event) {
        event.preventDefault();
        for(let line of lines) {
            lv.add('bar', line, -10, 200);
        }
    });
    $("#reset_line").unbind().click(function (event) {
        event.preventDefault();
        for(let line of lines) {
            lv.reset('bar', line, 200);
        }
    });
    $("#fill_bordered_line").unbind().click(function(event) {
        event.preventDefault();
        for(let line of borderedLines) {
            lv.fill('bar', line, 200);
        }
    });
    $("#add_bordered_line").unbind().click(function (event) {
        event.preventDefault();
        for(let line of borderedLines) {
            lv.add('bar', line, 5, 200);
        }
    });
    $("#remove_bordered_line").unbind().click(function (event) {
        event.preventDefault();
        for(let line of borderedLines) {
            lv.add('bar', line, -10, 200);
        }
    });
    $("#reset_bordered_line").unbind().click(function (event) {
        event.preventDefault();
        for(let line of borderedLines) {
            lv.reset('bar', line, 200);
        }
    });
});