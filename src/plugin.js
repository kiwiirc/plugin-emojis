/* global kiwi:true */

import * as config from './config.js';
import * as EmojiData from 'emoji-mart-vue-fast/data/google.json';
import { EmojiIndex } from 'emoji-mart-vue-fast';
import 'emoji-mart-vue-fast/css/emoji-mart.css';
import platform from 'platform';
import GraphemeSplitter from 'grapheme-splitter';
import EmojiInputTool from './components/Emoji.vue';
import EmojiMart from './components/EmojiMart.vue';
import EmojiProvider from './libs/EmojiProvider.js';

kiwi.plugin('emojis', (kiwi) => {
    config.setDefaults();

    const provider = kiwi.require('libs/EmojiProvider');
    const emojiIndex = new EmojiIndex(EmojiData);
    provider.registerPlugin(EmojiProvider, [emojiIndex]);

    window['plugin-emojis'] = Object.create(null);
    window['plugin-emojis'].emojiIndex = emojiIndex;

    window['plugin-emojis'].getBestAscii = (emoji) => {
        if (emoji.emoticons && emoji.emoticons.length > 0) {
            for (let i = 0; i < emoji.emoticons.length; i++) {
                // Try to find a emoticon starting with a colon
                if (emoji.emoticons[i].indexOf(':') === 0) {
                    return emoji.emoticons[i];
                }
            }
            return emoji.emoticons[0];
        }
        return ':' + emoji.short_names.reduce((a, b) => a.length <= b.length ? a : b) + ':';
    };

    const emojiPicker = kiwi.Vue.extend(EmojiMart);

    kiwi.replaceModule('components/inputtools/Emoji', EmojiInputTool);

    kiwi.state.$once('network.connecting', () => {
        // Create new picker and pre-mount it
        window['plugin-emojis'].emojiPicker = new emojiPicker();
        window['plugin-emojis'].emojiPicker.$mount();

        // Preload emoji sheet
        const img = document.createElement("IMG");
        img.className = 'emoji-set-google emoji-type-image';
        img.style = 'width: 1px; height: 1px; position: absolute; left: -10px;';
        document.body.appendChild(img);

        // Two ticks are required to append the child
        // and start loading the background-image
        kiwi.Vue.nextTick(() => {
            kiwi.Vue.nextTick(() => {
                document.body.removeChild(img);
            });
        });
    });
});

