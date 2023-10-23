/* eslint-disable */
/* global kiwi:true */

if (!kiwi.state.setting('forceShowEmojiPicker') && isMobile()) {
    console.log("[plugin-emojis] Mobile browser detected. Blocking installation of emoji plugin (because mobile OS's have their own emoji pickers)");
} else {
    const script = document.createElement('script');
    script.src = getBasePath() + 'plugin-emojis.js';
    document.getElementsByTagName('head')[0].appendChild(script);
}

function getBasePath() {
    const scripts = document.getElementsByTagName('script');
    const scriptPath = scripts[scripts.length - 1].src;
    return scriptPath.substring(0, scriptPath.lastIndexOf('/') + 1);
}

function isMobile() {
    return /\b(Android|iPhone|iPad|iPod|webOS|Windows Phone|BlackBerry|IEMobile)\b/i.test(navigator.userAgent);
}
