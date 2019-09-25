# Loading-Visualization

A CSS and JavaScript library for inserting animated both determinate and indeterminate loading bars and spinners
directly into HTML code. The goal of this library is simple usage with a lot of variability. So for inserting spinner
into the page is used one line of code, specifically inserting `div` with class names that specify its properties. 
The library also provides JavaScript tools to manipulate with determinate loading bars and color settings.

## Installation

This library is available at *GitHub* or at *npm*.
There are two files necessary for the library to function properly and have all its functionality - **main.css** and
**main.js**. They are both located in the `dist/` directory and they need to be linked in the html file.

## npm

[npm page with package](https://www.npmjs.com/package/loading-visualization)

## Demo

[DEMO web page with usage examples](https://ridics.github.io/Loading-Visualization)

## Color configuration

Colors of individual types of elements can be configured in `src/main.scss` on the top. There are multiple variables
which define individual parts of an element. After making changes, the `.scss` file has to be **recompiled**. If there is
`yarn` installed, the command `yarn gulp` can be used in the commandline in the main directory to compile it.

Here is an example of correctly filled color variables for normal elements:
```scss
// setting colors
$line_background: lightgray; // color of the bar when it's empty
$line_color: #000000; // color of the bar when it has some progress
$bordered_line_color: #14c100; // color of border and line of bordered indeterminate bar
$determinate_line_background: lightgray; // color of the bar when it's empty
$determinate_line_color: #004c00; // color of determinate bar when it has some progress
$determinate_bordered_line_border: #F39C12; // color of border of bordered determinate bar
$determinate_bordered_line_color: #3498DB; // color of line of bordered determinate bar
$circles_color: #ae8300; // color of darkest dot, the animation is based on fading the color
$spinner_shadow: darkgrey; // base color of the spinner
$spinner_color: #343a40; // color of the moving part of the spinner
$determinate_circle_background: darkgrey; // base color of the spinner
$determinate_circle_color: #343a40; // color of the moving part of the spinner
$dashed_color: #138D75; // color of the dashed element
```

There are three special spinners, **bars**, **squares** and **dots**. These can be configured to consist of multiple 
shades of one color. To their color variable is inserted the darkest of these shades, the rest is scaled to lighter
shades based on **scale** variable.

```scss
// for spinners with multiple parts choose the darkest shade of chosen color, other colors will be lighter
$bars_color: #4b0049; // color of the darkest bar
$squares_color: #00064b; // color of the darkest square
$dots_color: #004c00; // color of the darkest pulsating dot
```

Each scale variable has a range in which its value has to be to work properly. If zero is entered the color will not
scale and all parts of the element will have the same color as defined in the color variable. The higher the number, 
the bigger the difference between colors of the two next parts.

```scss
// how much will the color lighten; when x = 0, all parts will be the same color
$bars_scale: 5;  // 0 <= x <= 14
$squares_scale: 10;  // 0 <= x <= 33
$dots_scale: 10;  // 0 <= x <= 33
```

## Creating elements

### Element basics

An element is inserted into HTML content with `<div class="name_of_element"></div>` and can be specified more with some 
optional parameters (more below).

There are two types of elements - **determinate**, which show progress and range from 0 to 100%, and **indeterminate**,
which do not represent any value and move infinitely until they are removed or hidden.

There are 8 indeterminate bars and spinners:

1. `lv-bars`
2. `lv-squares`
3. `lv-circles`
4. `lv-dots`
5. `lv-spinner`
6. `lv-dashed`
7. `lv-line`
8. `lv-bordered_line`

and 3 determinate bars and spinners:

1. `lv-determinate_circle`
2. `lv-determinate_line`
3. `lv-determinate_bordered_line`

Examples can be seen in the [DEMO](https://ridics.github.io/Loading-Visualization) web page.

There are more possible ways to insert them into the page. One is inserting the code directly to HTML. Another one is to
insert it into HTML with JavaScript or JQuery.

### Initialization

After an element is inserted into the HTML code, it has to be initialized.

#### Automatic initialization

This library provides a method to automatically initialize new elements. This can be done by following commands:

```javascript
let loader = new lv();
loader.startObserving();
```

These two lines start an observer, which watches for newly created elements and automatically initializes them. However,
if there already are some not initialized elements in the HTML code before starting the observer, the command should be 
a little different to initialize them all:

```javascript
let loader = new lv();
loader.initLoaderAll();
loader.startObserving();
```

After setting this up all new elements are automatically initialized and shown.

#### Manual initialization

If the automatic initialization is not set up, it has to be done manually for each element separately. To achieve this, 
it is necessary to select an element to initialize and pass it as a parameter to a **create** function. If hide and show
and other functions will be used in the future, it is also necessary to assign the create function to a variable.
If not, just calling the **create** function is enough. Example manual initialization could look like this:

```javascript
// with assignment to variable
let element = lv.create(document.getElementById("element_id"));
// without assignment to variable
lv.create(document.getElementById("element_id"));
``` 

If JQuery is used to select the element, it is necessary to add `[0]` next to it, because JQuery returns finds as a collection
and not as element, so the element would not be initialized.

```javascript
// using JQuery
let element = lv.create($("#element_id")[0]);
```

### Sizing

There are multiple predefined sizes for each element type, which can be added to the class parameter of the `div`. If there is none specified, the element will occupy whole 
space of his container. In this case it is important that for elements *1.-6. indeterminate and 1. determinate* the
container should be square, so it is not deformed.

The predefined sizes for elements *1.-6. indeterminate and 1. determinate* are:

* `lg` -> 200x200px
* `md` -> 100x100px
* `sm` -> 50x50px
* `tiny` -> 30x30px

For *7.-8. indeterminate and 2.-3. determinate* is predefined only width, height is variable: 

* `lg` -> 1000px
* `md` -> 600px
* `sm` -> 300px

There should be always up to one sizing parameter per element.

### Positioning

There are predefined parameters for positioning the element inside its container. They can be also put inside the class
argument of the `div`.

There are relative parameters:

* `lv-left` -> align the element on the left side
* `lv-mid` -> align the element to the middle
* `lv-right` -> align the element on the right side

And there are absolute parameters:

* `lvt-{1-5}` -> add space on top side of the element {10-30-50-80-100px}
* `lvr-{1-5}` -> add space on the right side of the element {10-30-50-80-100px}
* `lvb-{1-5}` -> add space on the bottom side of the element {10-30-50-80-100px}
* `lvl-{1-5}` -> add space on the left side of the element {10-30-50-80-100px}

Relative and absolute parameters cannot be used together, but there can be multiple absolutes in one class.

### Labels

This additional parameter adds a label to an element. It is configured by adding `data-label="label_text"` as a `<div>`
attribute. This inserts *label_text* either below, inside or next to an element based on its size. This can be added both to 
determinate and indeterminate elements.

### Percentage

This additional parameter adds a percentage counter to an element. It is configured by adding `data-percentage="true"`
as a `<div>` attribute. This inserts a counter either inside or next to an element based on its shape or automatically
turns it off if the element is too small. If the argument is omitted or set to anything else than `"true"` the percentage 
counter will not be shown.

### Example usage

This can be inserted anywhere in the body of the document.

```html
<div class="lv-bars lg lv-mid lvt-5 lvb-3" data-label="Loading..."></div>
<div class="lv-determinate_circle md lv-right lvt-5 lvb-1" data-label="Loading..." data-percentage="true"></div>
```

## Control of elements

### Visibility of elements

All types of elements have their `hide` and `show` functions. However, to use them it is necessary to assign creation of the element to a variable
as described in the *initialization* section. All elements are visible by default.

```javascript
let element = lv.create(selected_element);
// hides element
element.hide();
// shows element
element.show();
```

Each element has also its `remove()` function, which removes the element from the page permanently. After calling this
function the element cannot be shown again and it is necessary to create new element (even the `html` code of the removed
element is permanently gone).

```javascript
// element is visible
let element = lv.create(selected_element);
// element is hidden
element.hide();
// element is visible
element.show();
// element is removed
element.remove();
// element cannot be made visible again
element.show();
```

### Label control

There are provided functions to change or remove labels with JavaScript. They are called on the element object as well as
`hide()`, `remove()` and `show()` functions. The functions are:

```javascript
// shows label and sets it to text passed as a parameter
element.setLabel("new_label");
// removes label from the element
element.removeLabel();
```

This is possible for all element types. More about labels is described above.

### Percentage control


There are provided functions to show or hide percentages with JavaScript. They are called on the element object as well as
`hide()`, `remove()` and `show()` functions. The functions are:

```javascript
// shows percentage
element.showPercentage();
// hides percentage
element.hidePercentage();
```

This functionality applies only on determinate loading elements. The functions can be called on indeterminate elements but
they will have no effect. More about percentages is described above.

### Controlling the indeterminate bars and spinners

There is no simple way provided to control or stop the animation of indeterminate spinners and bars. They can be hidden using the 'hide()' function, removed completely using the `remove()` function or made visible using the `show()` function.

### Controlling the determinate bars and spinners

Again, to control determinate bars and spinners the element has to be assigned to variable.

There is an universal `update` function, which can set or add any value to the spinner. It updates both linear and non-linear
elements and its called directly on the variable, where is saved the element.

```javascript
element.update(type, value, maxValue);
```
* `type` ... "add" or "set", if the value should be added to current or set to a new one
* `value` ... number to add or set
* `maxValue` ... value that represents 100% of the progress

Then there are 4 functions to make updating bar easier:

```javascript
element.fill(maxValue);
```
* `maxValue` ... value that represents 100% of the progress

```javascript
element.reset(maxValue);
```
* `maxValue` ... value that represents 100% of the progress

```javascript
element.add(value, maxValue);
```
* `value` ... number to add to current state
* `maxValue` ... value that represents 100% of the progress

```javascript
element.set(value, maxValue);
```
* `value` ... number to add or set
* `maxValue` ... value that represents 100% of the progress

