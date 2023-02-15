/* global kiwi:true */

import { EmojiIndex } from 'emoji-mart-vue-fast';
import 'emoji-mart-vue-fast/css/emoji-mart.css';
import EmojiData from 'emoji-mart-vue-fast/data/google.json';
import * as config from './config.js';
import EmojiPicker from './components/EmojiPicker.vue';
import EmojiProvider from './libs/EmojiProvider.js';

kiwi.plugin('emojis', (kiwi) => {
    config.setDefaults(kiwi);

    const provider = kiwi.require('libs/EmojiProvider');
    const emojiIndex = new EmojiIndex(EmojiData);

    provider.registerPlugin(EmojiProvider, emojiIndex);

    console.log('emojiIndex', emojiIndex);

    kiwi['plugin-emojis'] = Object.create(null);
    kiwi['plugin-emojis'].emojiIndex = emojiIndex;

    kiwi['plugin-emojis'].getBestAscii = (emoji) => {
        if (config.setting('sendNativeEmojis')) {
            return emoji.native;
        }

        if (emoji.colons.includes('::')) {
            // Emoji has skin tone, always use colons
            return emoji.colons;
        }

        if (emoji.emoticons && emoji.emoticons.length > 0) {
            // Emoji has emoticons find the best
            for (let i = 0; i < emoji.emoticons.length; i++) {
                // Try to find a emoticon starting with a colon
                if (emoji.emoticons[i].indexOf(':') === 0) {
                    return emoji.emoticons[i];
                }
            }
            return emoji.emoticons[0];
        }

        // No emoticon was found, use colons
        return emoji.colons;
    };

    kiwi.replaceModule('components/inputtools/Emoji', EmojiPicker);

    kiwi.state.$once('network.connecting', () => {
        // Preload emoji sheet
        const img = document.createElement('img');
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
