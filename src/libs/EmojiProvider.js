/* global _:true */
/* global kiwi:true */

import GraphemeSplitter from 'grapheme-splitter';

export default class EmojiProvider {
    constructor(emojiIndex) {
        const state = kiwi.state;
        this.emojiLocation = state.setting('emojiLocation');
        this.emojiList = state.setting('emojis');
        this.emojiIndex = emojiIndex;

        this.splitter = new GraphemeSplitter();
    }

    matchEmoji(word) {
        const emoji = this.getEmoji(word);
        if (!emoji) {
            return false;
        }

        console.log('match', {
            index: emoji.matchDetail.index,
            match: emoji.matchDetail.match,
            type: 'emoji',
            meta: {
                emoji: emoji,
            },
        });

        return {
            index: emoji.matchDetail.index,
            match: emoji.matchDetail.match,
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
        console.log('getEmoji', word);
        let emojiRaw = null;
        let index = 0;
        let match = '';

        if (this.emojiIndex._emoticons.hasOwnProperty && this.emojiIndex._emoticons.hasOwnProperty(word)) {
            emojiRaw = this.emojiIndex.findEmoji(this.emojiIndex._emoticons[word]);
            match = word;
        }

        if (!emojiRaw && word.indexOf(':') === 0 && word.lastIndexOf(':') === word.length -1) {
            emojiRaw = this.emojiIndex.findEmoji(word);
            match = word;
        }

        if (!emojiRaw) {
            emojiRaw = this.emojiIndex.nativeEmoji(word);
            match = word;
        }

        if (!emojiRaw && /\p{Extended_Pictographic}/u.test(word)) {
            let graphemes = this.splitter.splitGraphemes(word);
            for (const grapheme of graphemes) {
                console.log('grapheme', grapheme);
                let emoji = this.emojiIndex.nativeEmoji(grapheme);
                if (emoji) {
                    index = word.indexOf(grapheme);
                    match = grapheme;
                    console.log('match', emoji);
                    emojiRaw = emoji;
                    break;
                }
            }
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
            matchDetail: {
                index,
                match,
            }
        };
        return emoji;
    }
}
