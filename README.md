# Option Dialog

**status** *alpha* - works but has issues, like not being able to style the selected option.

Turns a group of radio inputs into an "option dialog" saving space. Only recommended for a *small* amount of options.

Usage example:

```html
<option-dialog>
    <label slot="option">
        <input class="sr-only" name="grade" type="radio" value="a" >A</label>
    <label slot="option">
        <input class="sr-only" name="grade" type="radio" value="b" >B</label>
    <label slot="option">
        <input class="sr-only" name="grade" type="radio" value="c" >C</label>
</option-dialog>
```

## styles
While the component has build-in styles to style the button and dialog. Styles for the option inputs are up for grabs.
There is an optional icon-only.css which contains styles for icon-based styles as well as styling for inline fieldsets.

## roadmap

 - [ ] Allow external styling of selected option.
 - [ ] left-right screen edge dialog overlap detection.
 - [ ] dialog expand/retract animation.