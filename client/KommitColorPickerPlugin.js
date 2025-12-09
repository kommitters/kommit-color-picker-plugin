'use strict';

const domify = require('min-dom/lib/domify');
const { getDi } = require('bpmn-js/lib/util/ModelUtil');
const Pickr = require('@simonwep/pickr');

const COLORS = [
    // Row 1
    { label: 'Black', fill: '#000000' },
    { label: 'Dark Grey 4', fill: '#434343' },
    { label: 'Dark Grey 3', fill: '#666666' },
    { label: 'Dark Grey 2', fill: '#999999' },
    { label: 'Dark Grey 1', fill: '#B7B7B7' },
    { label: 'Grey', fill: '#CCCCCC' },
    { label: 'Light Grey 1', fill: '#D9D9D9' },
    { label: 'Light Grey 2', fill: '#EFEFEF' },
    { label: 'Light Grey 3', fill: '#F3F3F3' },
    { label: 'White', fill: '#FFFFFF' },

    // Row 2
    { label: 'Red Berry', fill: '#980000' },
    { label: 'Red', fill: '#FF0000' },
    { label: 'Orange', fill: '#FF9900' },
    { label: 'Yellow', fill: '#FFFF00' },
    { label: 'Green', fill: '#00FF00' },
    { label: 'Cyan', fill: '#00FFFF' },
    { label: 'Cornflower Blue', fill: '#4A86E8' },
    { label: 'Blue', fill: '#0000FF' },
    { label: 'Purple', fill: '#9900FF' },
    { label: 'Magenta', fill: '#FF00FF' },

    // Row 3
    { label: 'Light Red Berry 3', fill: '#E6B8AF' },
    { label: 'Light Red 3', fill: '#F4CCCC' },
    { label: 'Light Orange 3', fill: '#FCE5CD' },
    { label: 'Light Yellow 3', fill: '#FFF2CC' },
    { label: 'Light Green 3', fill: '#D9EAD3' },
    { label: 'Light Cyan 3', fill: '#D0E0E3' },
    { label: 'Light Cornflower Blue 3', fill: '#C9DAF8' },
    { label: 'Light Blue 3', fill: '#CFE2F3' },
    { label: 'Light Purple 3', fill: '#D9D2E9' },
    { label: 'Light Magenta 3', fill: '#EAD1DC' },

    // Row 4
    { label: 'Light Red Berry 2', fill: '#DD7E6B' },
    { label: 'Light Red 2', fill: '#EA9999' },
    { label: 'Light Orange 2', fill: '#F9CB9C' },
    { label: 'Light Yellow 2', fill: '#FFE599' },
    { label: 'Light Green 2', fill: '#B6D7A8' },
    { label: 'Light Cyan 2', fill: '#A2C4C9' },
    { label: 'Light Cornflower Blue 2', fill: '#A4C2F4' },
    { label: 'Light Blue 2', fill: '#9FC5E8' },
    { label: 'Light Purple 2', fill: '#B4A7D6' },
    { label: 'Light Magenta 2', fill: '#D5A6BD' },

    // Row 5
    { label: 'Light Red Berry 1', fill: '#CC4125' },
    { label: 'Light Red 1', fill: '#E06666' },
    { label: 'Light Orange 1', fill: '#F6B26B' },
    { label: 'Light Yellow 1', fill: '#FFD966' },
    { label: 'Light Green 1', fill: '#93C47D' },
    { label: 'Light Cyan 1', fill: '#76A5AF' },
    { label: 'Light Cornflower Blue 1', fill: '#6D9EEB' },
    { label: 'Light Blue 1', fill: '#6FA8DC' },
    { label: 'Light Purple 1', fill: '#8E7CC3' },
    { label: 'Light Magenta 1', fill: '#C27BA0' },

    // Row 6
    { label: 'Dark Red Berry 1', fill: '#A61C00' },
    { label: 'Dark Red 1', fill: '#CC0000' },
    { label: 'Dark Orange 1', fill: '#E69138' },
    { label: 'Dark Yellow 1', fill: '#F1C232' },
    { label: 'Dark Green 1', fill: '#6AA84F' },
    { label: 'Dark Cyan 1', fill: '#45818E' },
    { label: 'Dark Cornflower Blue 1', fill: '#3C78D8' },
    { label: 'Dark Blue 1', fill: '#3D85C6' },
    { label: 'Dark Purple 1', fill: '#674EA7' },
    { label: 'Dark Magenta 1', fill: '#A64D79' },

    // Row 7
    { label: 'Dark Red Berry 2', fill: '#85200C' },
    { label: 'Dark Red 2', fill: '#990000' },
    { label: 'Dark Orange 2', fill: '#B45F06' },
    { label: 'Dark Yellow 2', fill: '#BF9000' },
    { label: 'Dark Green 2', fill: '#38761D' },
    { label: 'Dark Cyan 2', fill: '#134F5C' },
    { label: 'Dark Cornflower Blue 2', fill: '#1155CC' },
    { label: 'Dark Blue 2', fill: '#0B5394' },
    { label: 'Dark Purple 2', fill: '#351C75' },
    { label: 'Dark Magenta 2', fill: '#741B47' },

    // Row 8
    { label: 'Dark Red Berry 3', fill: '#5B0F00' },
    { label: 'Dark Red 3', fill: '#660000' },
    { label: 'Dark Orange 3', fill: '#783F04' },
    { label: 'Dark Yellow 3', fill: '#7F6000' },
    { label: 'Dark Green 3', fill: '#274E13' },
    { label: 'Dark Cyan 3', fill: '#0C343D' },
    { label: 'Dark Cornflower Blue 3', fill: '#1C4587' },
    { label: 'Dark Blue 3', fill: '#073763' },
    { label: 'Dark Purple 3', fill: '#20124D' },
    { label: 'Dark Magenta 3', fill: '#4C1130' }
];

class KommitColorPickerPlugin {
    constructor(eventBus, bpmnRules, editorActions, canvas, commandStack, bpmnFactory) {
        this.commandStack = commandStack;
        this.bpmnFactory = bpmnFactory;
        this.activeModes = new Set(['fill']); // 'fill', 'stroke', 'text'
        this.isActive = false;
        this.pickerContainer = null;
        this.selectedElement = null;
        this.customColors = this.loadCustomColors();

        editorActions.register({
            toggleColorPicker: () => {
                this.toggle(canvas);
            }
        });

        eventBus.on('selection.changed', (e) => {
            this.selectedElement = e.newSelection[0];
        });
    }

    loadCustomColors() {
        try {
            const stored = localStorage.getItem('camunda-modeler-plugin-preset-colors-custom');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to load custom colors', e);
            return [];
        }
    }

    saveCustomColors() {
        try {
            // Unify case to avoid duplicates like #ffffff vs #FFFFFF
            const uniqueColors = [...new Set(this.customColors.map(c => c.toLowerCase()))];
            localStorage.setItem('camunda-modeler-plugin-preset-colors-custom', JSON.stringify(uniqueColors));

            // Reload into memory to ensure consistency
            this.customColors = uniqueColors;
        } catch (e) {
            console.error('Failed to save custom colors', e);
        }
    }

    toggle(canvas) {
        if (this.isActive) {
            this.close();
        } else {
            this.isActive = true;
            this.addPicker(canvas.getContainer().parentNode);
        }
    }

    close() {
        if (this.pickerContainer) {
            this.pickerContainer.remove();
            this.pickerContainer = null;
        }
        this.isActive = false;
    }

    createColorButton(fill, label) {
        // Ensure hex includes #
        if (fill && !fill.startsWith('#')) {
            fill = '#' + fill;
        }

        const button = domify(`<div class="color-button" style="background-color: ${fill}" title="${label || fill}"></div>`);

        button.addEventListener('click', () => {
            if (!this.selectedElement) return;
            this.applyColor(fill);
        });

        return button;
    }

    addPicker(container) {
        const markup = `
      <div class="kommit-color-picker-container">
        <div class="picker-header">Color Picker By Kommit</div>
        <div class="picker-toolbar">
          <button class="mode-button ${this.activeModes.has('fill') ? 'active' : ''}" data-mode="fill" title="Background Color">
            <div class="icon-fill"></div>
          </button>
          <button class="mode-button ${this.activeModes.has('stroke') ? 'active' : ''}" data-mode="stroke" title="Border Color">
            <div class="icon-stroke"></div>
          </button>
          <button class="mode-button ${this.activeModes.has('text') ? 'active' : ''}" data-mode="text" title="Text Color">
            <div class="icon-text">T</div>
          </button>
        </div>
        <div class="picker-grid"></div>
      </div>
    `;

        this.pickerContainer = domify(markup);
        const grid = this.pickerContainer.querySelector('.picker-grid');
        const toolbar = this.pickerContainer.querySelector('.picker-toolbar');

        // Toolbar logic
        const buttons = toolbar.querySelectorAll('.mode-button');
        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                if (this.activeModes.has(mode)) {
                    this.activeModes.delete(mode);
                    btn.classList.remove('active');
                } else {
                    this.activeModes.add(mode);
                    btn.classList.add('active');
                }
            });
        });

        // Standard Colors
        COLORS.forEach((color) => {
            grid.appendChild(this.createColorButton(color.fill, color.label));
        });

        const separator = domify('<div class="separator"></div>');
        grid.appendChild(separator);

        // Custom Colors
        this.customColors.forEach((colorFill) => {
            grid.appendChild(this.createColorButton(colorFill, 'Custom Color'));
        });

        // Custom Color Picker Button
        const customButton = domify('<div class="color-button custom-color-button" title="Custom Color"></div>');
        grid.appendChild(customButton);

        // Reset Button
        const resetButton = domify('<div class="color-button reset-button" title="Reset Custom Colors"></div>');

        resetButton.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();

            // Wrap in setTimeout to avoid blocking event loop causing weird focus loss behavior
            setTimeout(() => {
                if (confirm('Remove all custom colors?')) {
                    localStorage.removeItem('camunda-modeler-plugin-preset-colors-custom');
                    this.customColors = [];

                    let separatorFound = false;
                    const children = Array.from(grid.children);
                    children.forEach(child => {
                        if (child.classList.contains('separator')) {
                            separatorFound = true;
                            return; // keep separator
                        }
                        if (separatorFound) {
                            if (!child.classList.contains('custom-color-button') && !child.classList.contains('reset-button')) {
                                grid.removeChild(child);
                            }
                        }
                    });
                }
            }, 10);
        };

        grid.appendChild(resetButton);

        // @simonwep/pickr plugin
        const pickr = Pickr.create({
            el: customButton,
            theme: 'monolith',
            useAsButton: true,
            swatches: [],
            position: 'bottom-middle',
            components: {
                preview: false,
                opacity: false,
                hue: true,
                interaction: {
                    hex: true,
                    rgba: true,
                    hsla: false,
                    input: true,
                    save: true
                }
            }
        });

        pickr.on('save', (color, instance) => {
            const hexColor = color.toHEXA().toString();

            // Apply immediately
            this.applyColor(hexColor);

            // Save if not exists
            if (!this.customColors.includes(hexColor.toLowerCase())) {
                this.customColors.push(hexColor);
                this.saveCustomColors();

                // Append new button BEFORE the custom picker button
                // grid.lastChild is the customButton
                const newBtn = this.createColorButton(hexColor, 'Custom Color');
                grid.insertBefore(newBtn, customButton);
            }

            instance.hide();
        });

        container.appendChild(this.pickerContainer);
        this.makeDraggable(this.pickerContainer);
    }

    applyColor(color) {
        if (!this.selectedElement) return;

        const colorData = {};

        // 1. Collect Fill/Stroke for main element
        if (this.activeModes.has('fill')) {
            colorData.fill = color;
        }
        if (this.activeModes.has('stroke')) {
            colorData.stroke = color;
        }

        if (Object.keys(colorData).length > 0) {
            this.commandStack.execute('element.setColor', {
                elements: [this.selectedElement],
                colors: colorData
            });
        }

        // 2. Handle Text (potentially separate)
        if (this.activeModes.has('text')) {
            this.handleTextColoring({ fill: color });
        }
    }

    handleTextColoring(color) {
        const element = this.selectedElement;

        // 1. External Label (e.g. Sequence Flow, some Events)
        if (element.label) {
            this.commandStack.execute('element.setColor', {
                elements: [element.label],
                colors: { stroke: color.fill }
            });
            return;
        }

        // 2. Internal Label (e.g. Task, SubProcess)
        const di = getDi(element);
        if (!di) return;

        if (di.label) {
            // If DI label exists, update its color property
            this.commandStack.execute('element.updateModdleProperties', {
                element: element,
                moddleElement: di.label,
                properties: { color: color.fill }
            });
        } else {
            // If no DI label exists, create one
            const newLabel = this.bpmnFactory.create('bpmndi:BPMNLabel', {
                bounds: this.bpmnFactory.create('dc:Bounds')
            });
            newLabel.color = color.fill;

            this.commandStack.execute('element.updateProperties', {
                element: element,
                properties: {
                    di: { label: newLabel }
                }
            });
        }
    }

    makeDraggable(element) {
        const header = element.querySelector('.picker-header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

KommitColorPickerPlugin.$inject = ['eventBus', 'bpmnRules', 'editorActions', 'canvas', 'commandStack', 'bpmnFactory'];

module.exports = {
    __init__: ['kommitColorPickerPlugin'],
    kommitColorPickerPlugin: ['type', KommitColorPickerPlugin]
};
