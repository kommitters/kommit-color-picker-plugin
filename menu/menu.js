'use strict';

module.exports = (electronApp, menuState) => {
    return [{
        label: 'Toggle Color Picker',
        accelerator: 'CommandOrControl+Shift+P',
        enabled: () => menuState.bpmn,
        action: () => {
            electronApp.emit('menu:action', 'toggleColorPicker');
        }
    }];
};
