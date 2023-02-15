/* global kiwi:true */
/* global _:true */

let configBase = 'plugin-emojis';
let defaultConfig = {
    sendNativeEmojis: false,
};

export function setDefaults(kiwi) {
    kiwi.setConfigDefaults(configBase, defaultConfig);
}

export function setting(name) {
    return kiwi.state.setting([configBase, name].join('.'));
}

export function getSetting(name) {
    return kiwi.state.getSetting(['settings', configBase, name].join('.'));
}

export function setSetting(name, value) {
    return kiwi.state.setSetting(['settings', configBase, name].join('.'), value);
}
