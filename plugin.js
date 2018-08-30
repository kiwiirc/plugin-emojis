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
  let isWindowsLessThan10 = platform.os.family.substring(0, 7).toLowerCase === 'windows' && platform.os.version < 10; 
  kiwi.on('message.poststyle', (event) => {
  if ( platform.name !== 'IE' && !isWindowsLessThan10) return;
    if (event.message.type !== 'privmsg') return;
    let splitter = new GraphemeSplitter();
    let split = splitter.splitGraphemes(event.message.html);
    for(let i = 0; i < split.length; ++i) {
      if (split[i].length > 1) {
        let img = emojione.unicodeToImage(split[i]);
        split[i] = img.substring(0,4) + ' style="width:16px;"' + img.substring(4);
      }
    }
    event.message.html = split.join('');
  });

  const MyComponent = window.kiwi.Vue.extend({
    template: `
      <div>
          <picker set="emojione" :native="useNative()" :style="{ position: 'absolute', zIndex: 10, bottom: '60px', right: '20px' }" title="Pick your emoji…" emoji="point_up"  @select="onEmojiSelected" />
      </div>`,
    components: {
      Picker
    },
    props: ['emoji', 'ircinput'],
    methods: {
      useNative () {
          return platform.name !== 'IE' && !isWindowsLessThan10;
      },
      onEmojiSelected (emoji) {
        this.$nextTick(function () {
          if(this.useNative()) {
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
