import { Emoji, Picker } from 'emoji-mart-vue'

kiwi.plugin('emoji', function (kiwi, log) {

    const sprites = new Image();
    sprites.onload = function () {
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

      const MyComponent = window.kiwi.Vue.extend({
        template: `
          <div>
              <picker set="emojione" native="true" :style="{ position: 'absolute', zIndex: 10, bottom: '60px', right: '20px' }" title="Pick your emoji…" emoji="point_up"  @select="onEmojiSelected" />
          </div>`,
        components: {
          Picker
        },
        props: ['emoji', 'ircinput'],
        data () {
          return {
            c: document.createElement('canvas'),
            x: null
          }
        },
        mounted () {
          this.x = this.c.getContext('2d');
          sprites.setAttribute('crossOrigin', 'Anonymous')
          
        },
        methods: {
          onEmojiSelected (emoji) {
            this.$nextTick(function () {
              emojiTool.controlinput.$refs.input.insertText(emoji.native);
              if (window.bgp) {
                this.c.width = 64;
                this.c.height = 64;
                let bgp = window.bgp.split(' ');
                let posX = (bgp[0].substring(0, bgp[0].length-1) / 102) * sprites.width;
                let posY = (bgp[1].substring(0, bgp[1].length-1) / 102) * sprites.height;
                this.x.drawImage(sprites, posX, posY, 32, 32, 0, 0, 64, 64);
                let dataURL = this.c.toDataURL();
                emojiTool.controlinput.$refs.input.addImg(emoji.colons, dataURL);
              }
            });
          }
        }
      });

      var emojiPicker = new MyComponent();
      emojiPicker.$mount();
      emojiPicker.$el.addEventListener('click', function(e) {
          e = e || window.event;
          var target = e.target || e.srcElement;
          window.bgp = target.style.backgroundPosition;
      }, false);

      function showEmojiPicker() {
          document.querySelector('body').appendChild(emojiPicker.$el);
          pickerVisible = true;
      }


      function hideEmojiPicker() {
          document.querySelector('body').removeChild(emojiPicker.$el);
          pickerVisible = false;
      }
  }
 sprites.src = 'static/plugins/plugin-emoji/32.png';
})
