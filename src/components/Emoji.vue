<template>
    <div  v-rawElement="emojiPicker.$el" class="kiwi-inputtool-emoji"/>
</template>

<script>

export default {
    props: ['ircinput'],
    computed: {
        emojiPicker() {
            return window['plugin-emojis'].emojiPicker;
        },
    },
    created() {
        window['plugin-emojis'].emojiPicker.ircinput = this.ircinput;
    },
};

</script>

<style>

.kiwi-inputtool-emoji {
    position: absolute;
    bottom: 22px;
    right: 20px;
    z-index: 10;
}

</style>
