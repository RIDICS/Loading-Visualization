document.addEventListener("DOMContentLoaded", function(event) {
    init();
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