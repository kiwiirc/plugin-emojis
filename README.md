# KiwiIRC - Emoji Plugin

### Status - In development

This plugin adds an emoji picker to KiwiIRC's UI. 

This plugin requires yarn.

### Installation

    $ git clone https://github.com/kiwiirc/plugin-emojis.git
    $ cd plugin-emojis
    $ yarn install
    $ yarn build

Copy the built `dist/main.js` file to your kiwi plugins folders.

Next, add the following config parameter to /your/kiwi/folder/static/config.json

    "plugins": [
        {"name": "emojis", "url": "static/plugins/emojis.js"} 
    ]
   
