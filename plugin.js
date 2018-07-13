import { Picker } from 'emoji-mart-vue'

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

    const MyComponent = window.kiwi.Vue.extend({
      template: `
        <div>
            <picker set="emojione" :style="{ position: 'absolute', zIndex: 10, bottom: '60px', right: '20px' }" title="Pick your emoji…" emoji="point_up"  @select="onEmojiSelected" />
        </div>`,
      components: {
        Picker
      },
      props: ['emoji', 'ircinput'],
      data () {
        return {
          sprites: new Image(),
          c: document.createElement('canvas'),
          x: null
        }
      },
      mounted () {
        this.x = this.c.getContext('2d');
        this.sprites.setAttribute('crossOrigin', 'Anonymous')
        this.sprites.src = './static/plugins/plugin-emoji/32.png';
      },
      methods: {
        onEmojiSelected (emoji) {
          this.$nextTick(function () {
            if (window.bgp) {
              this.c.width = 64;
              this.c.height = 64;
              let bgp = window.bgp.split(' ');
              let posX = (bgp[0].substring(0, bgp[0].length-1) / 102) * this.sprites.width;
              let posY = (bgp[1].substring(0, bgp[1].length-1) / 102) * this.sprites.height;
              this.x.drawImage(this.sprites, posX, posY, 32, 32, 0, 0, 64, 64);
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
})