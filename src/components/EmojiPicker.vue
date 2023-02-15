<template>
    <picker
        set="google"
        :data="emojiIndex"
        :title="titleText"
        emoji="point_up"
        class="kiwi-emoji-mart"
        @select="onEmojiSelected"
    />
</template>

<script>
/* global kiwi:true */

import { Picker } from 'emoji-mart-vue-fast';

export default {
    components: {
        Picker,
    },
    props: ['ircinput'],
    data() {
        return {
            titleText: 'test',
        };
    },
    computed: {
        emojiIndex() {
            return kiwi['plugin-emojis'].emojiIndex;
        },
    },
    methods: {
        onEmojiSelected(emoji) {
            console.log('onEmojiSelected', emoji);
            this.ircinput.addImg(
                kiwi['plugin-emojis'].getBestAscii(emoji),
                'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
                {
                    style: `background-position: ${emoji.getPosition()}; height: 1.2em; vertical-align: -0.3em;`,
                    className: 'emoji-set-google emoji-type-image',
                },
            );
        },
    },
};

</script>

<style>

.kiwi-emoji-mart {
    position: absolute;
    bottom: 22px;
    right: 20px;
    z-index: 10;
}

</style>
