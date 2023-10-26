/* global kiwi:true */

import GraphemeSplitter from 'grapheme-splitter';
import * as config from '../config.js';

const graphemeSplitter = new GraphemeSplitter();
let emojiListMap;

export function matchEmoji(word) {
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

export function blockToHtml(block, isSingle, showEmoticons) {
    if (!showEmoticons) {
        return block.content;
    }

    const emoji = block.meta.emoji;
    const html = [`<img src="${emoji.url}" alt="${block.content}"`];

    const imageTitle = config.setting('imageTitle');
    if (imageTitle && emoji.mart[imageTitle]) {
        html.push(`title="${emoji.mart[imageTitle]}"`);
    }

    const classes = ['kiwi-messagelist-emoji'];
    if (isSingle) {
        classes.push('kiwi-messagelist-emoji--single');
    }
    if (emoji.imgProps.className) {
        classes.push(emoji.imgProps.className);
    }
    html.push(`class="${classes.join(' ')}"`);

    if (emoji.imgProps.style) {
        html.push(`style="${emoji.imgProps.style}"`);
    }

    html.push('/>');

    return html.join(' ');
}

export function getEmojis(word) {
    const emojiIndex = kiwi['plugin-emojis'].emojiIndex;
    if (!emojiListMap) {
        const emojiList = kiwi.state.setting('emojis');
        emojiListMap = getEmojiListMap(emojiList, emojiIndex);
    }

    const parseEmoticons = config.setting('parseEmoticons');
    const parseColons = config.setting('parseColons');
    const parseNative = config.setting('parseNative');

    // eslint-disable-next-line no-underscore-dangle
    const emoticons = emojiIndex._emoticons;
    const emojis = [];
    let emojiRaw = null;
    let index = 0;
    let match = '';

    if (parseEmoticons && emoticons.hasOwnProperty(word)) {
        emojiRaw = emojiIndex.findEmoji(emoticons[word]);
        match = word;
    } else if (parseEmoticons && emojiListMap.hasOwnProperty(word)) {
        emojiRaw = emojiIndex.findEmoji(emojiListMap[word]);
        match = word;
    } else if (parseColons && word.indexOf(':') === 0 && word.lastIndexOf(':') === word.length - 1) {
        emojiRaw = emojiIndex.findEmoji(word);
        match = word;
    } else if (parseNative) {
        emojiRaw = emojiIndex.nativeEmoji(word);
        match = word;
    }

    if (emojiRaw) {
        emojis.push(makeEmojiObj(
            emojiRaw,
            match,
            index,
        ));
    } else if (parseNative && /\p{Extended_Pictographic}/u.test(word)) {
        const graphemes = graphemeSplitter.splitGraphemes(word);
        for (let i = 0; i < graphemes.length; i++) {
            const grapheme = graphemes[i];
            const emoji = emojiIndex.nativeEmoji(grapheme);
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

function makeEmojiObj(emojiRaw, match, index) {
    const emojiObj = {
        ascii: match,
        url: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        imgProps: {
            style: `background-position: ${emojiRaw.getPosition()}; height: 1.2em; vertical-align: -0.3em;`,
            className: `emoji-set-${config.setting('emojiSet')} emoji-type-image`,
        },
        mart: emojiRaw,
        matchDetail: {
            index,
            match,
        },
    };

    if (emojiRaw.imageUrl) {
        emojiObj.url = emojiRaw.imageUrl;
        emojiObj.imgProps = {};
    }

    return emojiObj;
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
