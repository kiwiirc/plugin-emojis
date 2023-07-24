/* global kiwi:true */

import { EmojiIndex } from 'emoji-mart-vue-fast';
import 'emoji-mart-vue-fast/css/emoji-mart.css';
import EmojiData from 'emoji-mart-vue-fast/data/all.json';
import EmojiPicker from './components/EmojiPicker.vue';
import * as config from './config.js';
import * as EmojiProvider from './libs/EmojiProvider.js';

kiwi.plugin('emojis', (kiwi) => {
    config.setDefaults(kiwi);

    const emojiIndex = new EmojiIndex(EmojiData, {
        include: config.setting('categoryInclude'),
        exclude: config.setting('categoryExclude'),
        custom: config.setting('customEmojis'),
        recent: config.setting('frequentlyUsedList'),
        recentLength: config.setting('frequentlyUsedLength'),
    });
    kiwi['plugin-emojis'] = Object.create(null);
    kiwi['plugin-emojis'].emojiIndex = emojiIndex;

    kiwi.replaceModule('libs/EmojiProvider', EmojiProvider);
    kiwi.replaceModule('components/inputtools/Emoji', EmojiPicker);

    kiwi.state.$once('network.connecting', () => {
        // Preload emoji sheet
        const img = document.createElement('img');
        img.className = `emoji-set-${config.setting('emojiSet')} emoji-type-image`;
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
