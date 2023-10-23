<template>
    <picker
        v-bind="pickerProps"
        :set="emojiSet"
        :data="emojiIndex"
        class="kiwi-emoji-mart"
        @select="onEmojiSelected"
    />
</template>

<script>
/* global kiwi:true */

import { Picker } from 'emoji-mart-vue-fast/src';
import * as config from '../config.js';

export default {
    components: {
        Picker,
    },
    props: ['ircinput'],
    computed: {
        emojiIndex() {
            return kiwi['plugin-emojis'].emojiIndex;
        },
        pickerProps() {
            return config.setting('pickerProps');
        },
        emojiSet() {
            return config.setting('emojiSet');
        },
    },
    methods: {
        getBestAscii(emoji) {
            if (config.setting('sendNativeEmojis') && emoji.native) {
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
        },
        onEmojiSelected(emoji) {
            if (emoji.imageUrl) {
                // custom emojis
                this.ircinput.addImg(
                    this.getBestAscii(emoji),
                    emoji.imageUrl,
                );
                return;
            }

            this.ircinput.addImg(
                this.getBestAscii(emoji),
                'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                {
                    style: `background-position: ${emoji.getPosition()}; height: 1.2em; vertical-align: -0.3em;`,
                    className: `emoji-set-${config.setting('emojiSet')} emoji-type-image`,
                },
            );
        },
    },
};
</script>

<style>
.kiwi-emoji-mart {
    position: absolute;
    bottom: 4px;
    right: 0;
    z-index: 10;
}

.kiwi-controlinput--show-tools--inline .kiwi-emoji-mart {
    right: 20px;
}

@media screen and (max-width: 769px) {
    .kiwi-emoji-mart {
        right: 4px;
    }
}
</style>
