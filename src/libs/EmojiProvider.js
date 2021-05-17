/* global _:true */
/* global kiwi:true */

export default class EmojiProvider {
    constructor(emojiIndex) {
        const state = kiwi.state;
        this.emojiLocation = state.setting('emojiLocation');
        this.emojiList = state.setting('emojis');
        this.emojiIndex = emojiIndex;
    }

    matchEmoji(word) {
        const emoji = this.getEmoji(word);
        if (!emoji) {
            return false;
        }
        return {
            index: 0,
            match: word,
            type: 'emoji',
            meta: {
                emoji: emoji,
            },
        };
    }

    blockToHtml(block, isSingle, showEmoticons) {
        if (!showEmoticons) {
            return block.content;
        }

        const emoji = block.meta.emoji;
        const classes = 'kiwi-messagelist-emoji emoji-set-google emoji-type-image' + (isSingle ? ' kiwi-messagelist-emoji--single' : '');
        const src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        const style = `background-position: ${emoji.mart.getPosition()}; height: 1.2em; vertical-align: -0.3em;`
        return `<img class="${classes}" src="${src}" alt="${block.content}" title="${block.content}" style="${style}" />`;
    }

    getEmoji(word) {
        let emojiRaw = null;
        if (this.emojiIndex._emoticons.hasOwnProperty && this.emojiIndex._emoticons.hasOwnProperty(word)) {
            emojiRaw = this.emojiIndex.findEmoji(this.emojiIndex._emoticons[word]);
        }

        if (word.indexOf(':') === 0 && word.lastIndexOf(':') === word.length -1) {
            emojiRaw = this.emojiIndex.findEmoji(word);
        }

        if (!emojiRaw) {
            return false;
        }

        let emoji = {
            ascii: word, // emojiRaw.native
            code: emojiRaw.unified,
            url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            imgProps: {
                style: `background-position: ${emojiRaw.getPosition()}; height: 1.2em; vertical-align: -0.3em;`,
                className: 'emoji-set-google emoji-type-image',
            },
            mart: emojiRaw,
        };
        return emoji;
    }
}
