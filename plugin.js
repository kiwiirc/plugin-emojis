import emojione from 'emojione'
import { Emoji, Picker } from 'emoji-mart-vue'
import platform from 'platform'
import GraphemeSplitter from 'grapheme-splitter'

// polyfill
if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }
        
        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

kiwi.plugin('emoji', function (kiwi, log) {

    let include = [];
    let exclude = [];
    let titleText = '';
    let searchText = '';
    let categoriesSearchResultsText = '';
    let categoriesRecentText = '';
    let categoriesPeopleText = '';
    let categoriesNatureText = '';
    let categoriesFoodsText = '';
    let categoriesActivityText = '';
    let categoriesPlacesText = '';
    let categoriesObjectsText = '';
    let categoriesSymbolsText = '';
    let categoriesFlagsText = '';
    let categoriesCustomText = '';

    if(kiwi.state.setting('pluginEmojis.include')) {
        include = kiwi.state.setting('pluginEmojis.include');
    } else {
        include = [
            'search',
            'recent',
            'people',
            'nature',
            'foods', 
            'activity',
            'places',
            'objects',
            'symbols',
            'flags',
            'custom'
        ]
    }

    if(kiwi.state.setting('pluginEmojis.exclude')) {
        exclude = kiwi.state.setting('pluginEmojis.exclude');
    } else {
        exclude = [];
    }

    if(kiwi.state.setting('pluginEmojis.titleText')) {
        titleText = kiwi.state.setting('pluginEmojis.titleText');
    } else {
        titleText = 'Pick your emoji\u2026';
    }

    if(kiwi.state.setting('pluginEmojis.searchText')) {
        searchText = kiwi.state.setting('pluginEmojis.searchText');
    } else {
        searchText = 'Search for';
    }

    if(kiwi.state.setting('pluginEmojis.categoriesSearchResultsText')) {
        categoriesSearchResultsText = kiwi.state.setting('pluginEmojis.categoriesSearchResultsText');
    } else {
        categoriesSearchResultsText = 'Search Results';
    }

    if(kiwi.state.setting('pluginEmojis.categoriesRecentText')) {
        categoriesRecentText = kiwi.state.setting('pluginEmojis.categoriesRecentText');
    } else {
        categoriesRecentText = 'Recent';
    }

    if(kiwi.state.setting('pluginEmojis.categoriesPeopleText')) {
        categoriesPeopleText = kiwi.state.setting('pluginEmojis.categoriesPeopleText');
    } else {
        categoriesPeopleText = 'People';
    }

    if(kiwi.state.setting('pluginEmojis.categoriesNatureText')) {
        categoriesNatureText = kiwi.state.setting('pluginEmojis.categoriesNatureText');
    } else {
        categoriesNatureText = 'Nature';
    }

    if(kiwi.state.setting('pluginEmojis.categoriesFoodsText')) {
        categoriesFoodsText = kiwi.state.setting('pluginEmojis.categoriesFoodsText');
    } else {
        categoriesFoodsText = 'Foods';
    }

    if(kiwi.state.setting('pluginEmojis.categoriesActivityText')) {
        categoriesActivityText = kiwi.state.setting('pluginEmojis.categoriesActivityText');
    } else {
        categoriesActivityText = 'Activity';
    }

    if(kiwi.state.setting('pluginEmojis.categoriesPlacesText')) {
        categoriesPlacesText = kiwi.state.setting('pluginEmojis.categoriesPlacesText');
    } else {
        categoriesPlacesText = 'Places';
    }

    if(kiwi.state.setting('pluginEmojis.categoriesObjectsText')) {
        categoriesObjectsText = kiwi.state.setting('pluginEmojis.categoriesObjectsText');
    } else {
        categoriesObjectsText = 'Objects';
    }

    if(kiwi.state.setting('pluginEmojis.categoriesSymbolsText')) {
        categoriesSymbolsText = kiwi.state.setting('pluginEmojis.categoriesSymbolsText');
    } else {
        categoriesSymbolsText = 'Symbols';
    }

    if(kiwi.state.setting('pluginEmojis.categoriesFlagsText')) {
        categoriesFlagsText = kiwi.state.setting('pluginEmojis.categoriesFlagsText');
    } else {
        categoriesFlagsText = 'Flags';
    }

    if(kiwi.state.setting('pluginEmojis.categoriesCustomText')) {
        categoriesCustomText = kiwi.state.setting('pluginEmojis.categoriesCustomText');
    } else {
        categoriesCustomText = 'Custom';
    }

    function createElementFromHTML(htmlString) {
        var div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild; 
    }

    emojione.imagePathPNG = kiwi.state.settings.emojiLocation;
    const emojiTool = document.createElement('i');
    emojiTool.className = 'fa fa-thumbs-up';
    kiwi.addUi('input', emojiTool);
    emojiTool.onclick = function (e){
        if (pickerVisible) {
            hideEmojiPicker();
        } else {
            showEmojiPicker();
        }
    }

    let pickerVisible = false;
    let useNative = (platform.os.family.substring(0, 7).toLowerCase() === 'windows' && platform.os.version >=10) ||
                    (platform.os.family.substring(0, 4).toLowerCase() === 'os x');
    kiwi.on('message.poststyle', (event) => {
        if (event.message.type !== 'privmsg') return;
        let splitter = new GraphemeSplitter();
        let split = splitter.splitGraphemes(event.message.html);
        for(let i = 0; i < split.length; ++i) {
            if (split[i].length > 1) {
                let img = emojione.unicodeToImage(split[i]);
                if(img.substring(0,4) === '<img') split[i] = img.substring(0,4) + (split.length === 1 ? ' style="width:32px; line-height: 2em;"' : ' style="width: 16px; line-height:1em;"') + img.substring(4);
            }
        }
        event.message.html = split.join('');
    });

    const MyComponent = window.kiwi.Vue.extend({
        template: `
            <div>
                    <picker
                        set="emojione"
                        :native="useNative"
                        :style="{ position: 'absolute', zIndex: 10, bottom: '60px', right: '20px' }"
                        :title="titleText"
                        emoji="point_up"
                        :include="include"
                        :exclude="exclude"
                        :i18n="{
                            search: searchText,
                            categories: {
                                search: categoriesSearchResultsText,
                                recent: categoriesRecentText,
                                people: categoriesPeopleText,
                                nature: categoriesNatureText,
                                foods: categoriesFoodsText,
                                activity: categoriesActivityText,
                                places: categoriesPlacesText,
                                objects: categoriesObjectsText,
                                symbols: categoriesSymbolsText,
                                flags: categoriesFlagsText,
                                custom: categoriesCustomText
                            }
                        }"
                        @select="onEmojiSelected"
                    />
            </div>`,
        components: {
            Picker
        },
        data() {
            return {
                include,
                exclude,
                titleText,
                searchText,
                categoriesSearchResultsText,
                categoriesRecentText,
                categoriesPeopleText,
                categoriesNatureText,
                categoriesFoodsText,
                categoriesActivityText,
                categoriesPlacesText,
                categoriesObjectsText,
                categoriesSymbolsText,
                categoriesFlagsText,
                categoriesCustomText,
                useNative
            }
        },
        props: ['emoji', 'ircinput'],
        methods: {
            onEmojiSelected (emoji) {
                this.$nextTick(function () {
                    if(this.useNative) {
                        emojiTool.controlinput.$refs.input.insertText(emoji.native);
                    } else {
                        let img = createElementFromHTML(emojione.unicodeToImage(emoji.native));
                        emojiTool.controlinput.$refs.input.addImg(emoji.native, img.src);
                    }
                });
            }
        }
    });

    var emojiPicker = new MyComponent();
    emojiPicker.$mount();

    function showEmojiPicker() {
        document.querySelector('body').appendChild(emojiPicker.$el);
        pickerVisible = true;
    }

    function hideEmojiPicker() {
        document.querySelector('body').removeChild(emojiPicker.$el);
        pickerVisible = false;
    }

    kiwi.on('document.clicked', function (e) {
        if (pickerVisible && e.target.className !== 'fa fa-thumbs-up') hideEmojiPicker();
    });
})
