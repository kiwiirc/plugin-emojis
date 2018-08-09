import { Emoji, Picker } from 'emoji-mart-vue'
import emojione from 'emojione'
import platform from 'platform'

kiwi.plugin('emoji', function (kiwi, log) {

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

    kiwi.on('message.poststyle', (event) => {
      if ( platform.name !== 'IE') return;
      if (event.message.type !== 'privmsg') return;
      let split = [...event.message.html];
      for(let i = 0; i < split.length; ++i) {
        if (split[i].length > 1) {
          let unified = ((split[i].charCodeAt(0) - 0xD800) * 0x400 + split[i].charCodeAt(1) - 0xDC00 + 0x10000).toString(16);
          split[i] = `<img width=16 src="${kiwi.state.settings.emojiLocation + unified}.png">`;
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
            return platform.name !== 'IE';
        },
        onEmojiSelected (emoji) {
          this.$nextTick(function () {
            if(this.useNative()) {
              emojiTool.controlinput.$refs.input.insertText(emoji.native);
            } else {
              emojiTool.controlinput.$refs.input.addImg(emoji.native, kiwi.state.settings.emojiLocation + emoji.unified + '.png');
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
})
