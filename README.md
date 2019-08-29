# Loading-Visualization

A CSS and JavaScript library for inserting animated both determinate and indeterminate loading bars and spinners
directly into HTML code.

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

