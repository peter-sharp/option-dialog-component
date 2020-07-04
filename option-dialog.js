const template = document.createElement('template')
template.innerHTML = /*html*/`<button class="button"></button>
<section class="dialog dialog--up" od-dialog>
    <div class="tail tail--up" od-dialog-tail></div>
    <slot name="option"></slot>
</section>`;

const style = document.createElement('style')
style.innerHTML = /*css*/`
:host {
    position: relative;
    display: inline-block;
}
.button {
    background-color: hsla(0,0%,0%,0.05);
    border: solid 0.1em hsla(0,0%,0%,0.1);
    border-radius: 999px;
    font-size: 1.3em;
    line-height: 1em;
    padding: 0.3em;
    transition: transform 200ms ease;
}

.placeholder {
    align-items: center;
    display: inline-block;
    display: inline-flex;
    justify-content: center;
    height: 1em;
    padding: 0.3em;
    width: 1em;
}
.placeholder:before {
    content: " ⃛";
    color: rgba(0,0,0, 0.4);
    display: inline-block;
    line-height: 0.1;
    position: relative;
    font-size: 1.8em;
    text-align: center;
    top: 0.15em;
}

.button:hover,
.button:focus {
    background-color: rgba(0,0,0, 0.09);
    transform: scale(1.1);
}

.dialog {
    --background-color: hsl(0,100%,100%);
    --border-color: #555;
    --border-size: 0.1em;
    --tail-size: 0.66em;
    background-color: var(--background-color);
    border-radius: 999px;
    border: var(--border-size) solid var(--border-color);
    display: none;
    left: -50%;
    padding: 0.5em;
    position: absolute;
    width: max-content;
}

.dialog--up {
    bottom: calc(100% + (var(--tail-size) * 1.6));
}
.dialog--down {
    top: calc(100% + (var(--tail-size) * 1.6));
}

.tail {
    height: 0;
    position: absolute;
    width: 0;
    left: 2.3em;
}
.tail:before {
    content: ' ';
    display: block;
    height: 0;
    position: absolute;
    width: 0;
}

.tail--up {
    border-left: var(--tail-size) solid transparent;
    border-right: var(--tail-size) solid transparent;
    border-top: calc(var(--tail-size) / 0.66) solid var(--border-color);
    top: 100%;
}
.tail--up:before {
    border-left: var(--tail-size) solid transparent;
    border-right: var(--tail-size) solid transparent;
    border-top: calc(var(--tail-size) / 0.66) solid var(--background-color);
    left: calc( -1 * var(--tail-size));
    top: calc(-1 * 1em - var(--border-size) * 2);
}
.tail--down {
    border-left: var(--tail-size) solid transparent;
    border-right: var(--tail-size) solid transparent;
    border-bottom: calc(var(--tail-size) / 0.66) solid var(--border-color);
    bottom: 100%;
}
.tail--down:before {
    border-left: var(--tail-size) solid transparent;
    border-right: var(--tail-size) solid transparent;
    border-bottom: calc(var(--tail-size) / 0.66) solid var(--background-color);
    left: calc( -1 * var(--tail-size));
    top: calc( var(--border-size) * 2 );
}
.show {
    display: block;
}

/* TODO use the one from global stylesheet */
.sr-only {
    opacity: 0;
    position: absolute;
    width: 1px;
    height: 1px;
    clip-path: polygon(0 0);
}

.radio-group__icon {
    font-style: normal;
    border-radius: 999px;
    display: inline-block;
    padding: 0.3em;
}
`;

class OptionDialog extends HTMLElement {
    constructor() {
        super()
        const state = {
            dialogOpen: false,
            selectedOption: null,
            direction: 'up'
        }
        const shadow = this.attachShadow({ mode: 'open' })
        shadow.appendChild(template.content.cloneNode(true));
        shadow.appendChild(style.cloneNode(true));

        const button = shadow.querySelector('button');
        const dialog = shadow.querySelector('[od-dialog]');
        const dialogTail = shadow.querySelector('[od-dialog-tail]');
        
        state.selectedOption = getSelectedOption()
        render(state);
        function getSelectedOption() {
            const options = shadow.querySelector('[name="option"]').assignedNodes();
            return options.filter(isControlChecked)[0] || fallbackOption();
        }
        function fallbackOption() {
            const option = document.createElement('label')
            const placeholder = document.createElement('i')
            placeholder.className = 'placeholder';
            option.appendChild(placeholder);
            return option
        }

        //return everything but the control
        function getLabelContents(label) {
            const fragment = document.createDocumentFragment();
            for(let child of label.childNodes) {
                if(child !== label.control) fragment.appendChild(child)
            }
            return fragment;
        }

        function isControlChecked(x) {
            return x.control.checked
        }

        button.addEventListener('click', function showDialog(ev){
            state.dialogOpen = !state.dialogOpen;
            state.direction = getDialogDirection();
            render(state);
        });

        dialog.addEventListener('change', function updateSelectedOption() {
            state.selectedOption = getSelectedOption()
            state.dialogOpen = false;
            render(state);
        });

        function render(state) {
            dialog.classList.toggle('show', state.dialogOpen);
            replaceChild(button, getLabelContents(state.selectedOption.cloneNode(true)));
            dialog.classList.remove('dialog--up')
            dialog.classList.remove('dialog--down')
            dialogTail.classList.remove('tail--up')
            dialogTail.classList.remove('tail--down')
            dialog.classList.add(`dialog--${state.direction}`)
            dialogTail.classList.add(`tail--${state.direction}`)
        }

        function replaceChild(parent, newChild) {
            parent.innerHTML = null;
            parent.appendChild(newChild);
        }

        function getDialogDirection() {
            const min = 0;
            const dialogHeightEstimate = 100;
            const { top } = button.getBoundingClientRect();
            let direction = 'up'
            if (min > (top - dialogHeightEstimate)) {
                direction = 'down';
            } 
            return direction;
        }
    }
}

OptionDialog.is = 'option-dialog';

customElements.define(OptionDialog.is, OptionDialog);