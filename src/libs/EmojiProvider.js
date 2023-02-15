/* global kiwi:true */

import GraphemeSplitter from 'grapheme-splitter';

const graphemeSplitter = new GraphemeSplitter();
let emojiListMap;

export default class EmojiProvider {
    constructor(emojiIndex) {
        this.emojiIndex = emojiIndex;

        if (!emojiListMap) {
            const emojiList = kiwi.state.setting('emojis');
            emojiListMap = getEmojiListMap(emojiList, emojiIndex);
        }
    }

    static setEmojiListMap(newMap) {
        Object.assign(emojiListMap, newMap);
    }

    matchEmoji(word) {
        const emojis = this.getEmojis(word);
        if (!emojis.length) {
            return false;
        }

        const matchObjs = [];

        emojis.forEach((emoji) => {
            matchObjs.push({
                index: emoji.matchDetail.index,
                match: emoji.matchDetail.match,
                type: 'emoji',
                meta: {
                    emoji: emoji,
                },
            });
        });

        return matchObjs;
    }

    blockToHtml(block, isSingle, showEmoticons) {
        if (!showEmoticons) {
            return block.content;
        }

        const emoji = block.meta.emoji;
        const classes = 'kiwi-messagelist-emoji emoji-set-google emoji-type-image' + (isSingle ? ' kiwi-messagelist-emoji--single' : '');
        const src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        const style = `background-position: ${emoji.mart.getPosition()}; height: 1.2em; vertical-align: -0.3em;`;
        return `<img class="${classes}" src="${src}" alt="${block.content}" title="${block.content}" style="${style}" />`;
    }

    getEmojis(word) {
        // eslint-disable-next-line no-underscore-dangle
        const emoticons = this.emojiIndex._emoticons;
        const emojis = [];
        let emojiRaw = null;
        let index = 0;
        let match = '';

        if (emoticons.hasOwnProperty(word)) {
            emojiRaw = this.emojiIndex.findEmoji(emoticons[word]);
            match = word;
        } else if (emojiListMap.hasOwnProperty(word)) {
            emojiRaw = this.emojiIndex.findEmoji(emojiListMap[word]);
            match = word;
        } else if (word.indexOf(':') === 0 && word.lastIndexOf(':') === word.length - 1) {
            emojiRaw = this.emojiIndex.findEmoji(word);
            match = word;
        } else {
            emojiRaw = this.emojiIndex.nativeEmoji(word);
            match = word;
        }

        if (emojiRaw) {
            emojis.push(makeEmojiObj(
                emojiRaw,
                match,
                index,
            ));
        } else if (/\p{Extended_Pictographic}/u.test(word)) {
            const graphemes = graphemeSplitter.splitGraphemes(word);
            for (let i = 0; i < graphemes.length; i++) {
                const grapheme = graphemes[i];
                const emoji = this.emojiIndex.nativeEmoji(grapheme);
                if (!emoji) {
                    continue;
                }
                const graphemeIndex = graphemes.slice(0, i).reduce((a, g) => a + g.length, 0);
                emojis.push(makeEmojiObj(
                    emoji,
                    grapheme,
                    graphemeIndex,
                ));
            }
        }

        return emojis;
    }
}

function makeEmojiObj(emojiRaw, match, index) {
    return {
        ascii: match, // emojiRaw.native
        code: emojiRaw.colons,
        url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        imgProps: {
            style: `background-position: ${emojiRaw.getPosition()}; height: 1.2em; vertical-align: -0.3em;`,
            className: 'emoji-set-google emoji-type-image',
        },
        mart: emojiRaw,
        matchDetail: {
            index,
            match,
        },
    };
}

function getEmojiListMap(emojiList, emojiIndex) {
    const emojiListUnified = Object.create(null);
    const newEmojiListMap = {};

    Object.entries(emojiList).forEach(([key, value]) => {
        const id = value.split('.')[0];
        if (!emojiListUnified[id]) {
            emojiListUnified[id] = [];
        }
        emojiListUnified[id].push(key);
    });
    // eslint-disable-next-line no-underscore-dangle
    Object.values(emojiIndex._emojis).forEach((e) => {
        if (emojiListUnified[e.unified]) {
            emojiListUnified[e.unified].forEach((emoticon) => {
                newEmojiListMap[emoticon] = e.id;
            });
        }
    });
    return newEmojiListMap;
}
