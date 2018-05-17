import { Picker } from 'emoji-mart-vue'

const MyComponent = window.kiwi.Vue.extend({
  template: `
    <div>
        <picker @click="onImgClick" set="emojione" :style="{ position: 'absolute', zIndex: 10, bottom: '60px', right: '20px' }" title="Pick your emoji…" emoji="point_up"  @select="onEmojiSelected" />
    </div>`,
  components: {
    Picker
  },
  props: ['emoji', 'ircinput'],
  data: function data () {
    return {
    }
  },
  methods: {
    onEmojiSelected (emoji) {
      console.log(emoji);
    },
    onImgClick: function onImgClick(event) {
      this.ircinput.addImg(emoji.native,".");
    }
  }
});


function showEmojiPicker() {
    let emoji = new MyComponent();
    emoji.$mount();
    document.querySelector('body').appendChild(emoji.$el);
}


function hideEmojiPicker() {
    let emoji = new MyComponent();
    emoji.$mount();
    document.querySelector('body').appendChild(emoji.$el);
}



kiwi.plugin('emoji', function (kiwi, log) {
    const emojiTool = document.createElement('i');
    emojiTool.className = 'fa fa-ambulance';
    kiwi.addUi('input', emojiTool);
    emojiTool.onclick = function(e){
        showEmojiPicker();
    }
})