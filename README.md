# Loading-Visualization

A CSS and JavaScript library for inserting animated both determinate and indeterminate loading bars and spinners
directly into HTML code. The goal of this library is simple usage with a lot of variability. So for inserting spinner
into the page is used one line of code, specifically inserting `div` with class names that specify its properties. 
The library also provides JavaScript tools to manipulate with determinate loading bars and color settings.

## Installation

There are two files necessary for the library to function properly and have all its functionality - **main.css** and
**main.js**. They are both located in the `dist/` directory and they need to be linked in the html file.


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
// for spinners with multiple parts choose the darkest shade of chosen color you want to use, others will be lighter
$bars_color: #4b0049; // color of the darkest bar
$squares_color: #00064b; // color of the darkest square
$dots_color: #004c00; // color of the darkest pulsating dot

// how much will the color lighten; when x = 0, all parts will be the same color
$bars_scale: 5;  //0 <= x <= 14
$squares_scale: 10;  // 0 <= x <= 33
$dots_scale: 10;  // 0 <= x <= 33
```

Each scale variable has a range in which its value has to be to work properly. If zero is entered the color will not
scale and all parts of the element will have the same color as defined in the color variable. The higher the number, 
the bigger the difference between colors of the two next parts.

## Usage

### Basics

An element is inserted into HTML content with `<div class="name_of_element"></div>` and can be expanded with optional
parameters. There are 8 indeterminate spinners and bars:

1. `lv-bars`
2. `lv-squares`
3. `lv-circles`
4. `lv-dots`
5. `lv-spinner`
6. `lv-dashed`
7. `lv-line`
8. `lv-bordered_line`

and 3 determinate spinners and bars:

1. `lv-determinate_circle`
2. `lv-determinate_line`
3. `lv-determinate_bordered_line`

Examples can be see in the DEMO web page.

### Sizing

There are multiple predefined sizes for each element type, which can be added to class parameter of the `div`. If there is none specified, the element will occupy whole 
space of his container. In this case it is important that for elements *1-6 indeterminate and 1 determinate* the
container should be square, so it is not deformed.

The predefined sizes for elements *1-6 indeterminate and 1 determinate* are:

* `lg` -> 200x200px
* `md` -> 100x100px
* `sm` -> 50x50px
* `tiny` -> 30x30px

For *7-8 indeterminate and 2-3 determinate* is predefined only width, height is variable: 

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
turns it off if the element is too small. If the argument is omitted or set to *false* the percentage counter will not 
be shown.

### Example usage

This can be inserted anywhere in the body of the document.

```html
<div class="lv-bars lg lv-mid lvt-5 lvb-3" data-label="Loading..."></div>
<div class="lv-determinate_circle md lv-right lvt-5 lvb-1" data-label="Loading..." data-percentage="true"></div>
```

## Controlling the determinate bars

There are two basic functions: `lvUpdateBar`, which can handle changes in linear elements (*determinate 2-3*), and `lvUpdateCircle`,
which can handle changes in circular elements (*determinate 1*).

```javascript
lvUpdateBar(type, barElement, newValue, maxValue);
lvUpdateCircle(type, circleElement, newValue, maxValue);
```
* `type` ... `add` (add value to current value) or `set` (set bar to some value)
* `barElement` / `circleElement` ... element in DOM, on which should be applied the change (easiest selection by `id`)
* `newValue` ... value to add or set
* `maxValue` ... value that represents 100%

Then there are few predefined functions to make things easier: `lvReset`, which resets the loading to zero, `lvFill`, 
which fills the whole loading to 100%, and `lvAdd`, which handles addition or deletion.

```javascript
lvReset(type, element, maxValue);
```
* `type` ... `bar` or `circle` depending on the element to change
* `element` ... element in DOM, on which should be applied the change (easiest selection by `id`)
* `maxValue` ... value that represents 100%

```javascript
lvFill(type, element, maxValue);
```
* `type` ... `bar` or `circle` depending on the element to change
* `element` ... element in DOM, on which should be applied the change (easiest selection by `id`)
* `maxValue` ... value that represents 100%

```javascript
lvAdd(type, element, addValue, maxValue))
```
* `type` ... `bar` or `circle` depending on the element to change
* `element` ... element in DOM, on which should be applied the change (easiest selection by `id`)
* `addValue` ... any real number to add or remove from present value (add ... positive numbers, remove ... negative numbers)
* `maxValue` ... value that represents 100%

The library has automatic detections of changes in DOM and it allows elements to be added dynamically using Javascript
or another mean.
