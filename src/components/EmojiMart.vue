<template>
    <picker
        set="google"
        :data="emojiIndex"
        :native="useNative"
        :title="titleText"
        emoji="point_up"
        @select="onEmojiSelected"
    />
</template>

<script>

import { Picker } from 'emoji-mart-vue-fast';

export default {
    components: {
        Picker,
    },
    props: ['ircinput'],
    data() {
        return {
            useNative: false,
            titleText: 'test',
        };
    },
    computed: {
        emojiIndex() {
            return window['plugin-emojis'].emojiIndex;
        },
    },
    methods: {
        onEmojiSelected(emoji) {
            this.ircinput.addImg(
                window['plugin-emojis'].getBestAscii(emoji),
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
