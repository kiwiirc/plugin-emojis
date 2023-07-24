# KiwiIRC - Emoji Plugin

This plugin adds an emoji picker to KiwiIRC's UI.

This plugin requires yarn.

### Installation

    $ git clone https://github.com/kiwiirc/plugin-emojis.git
    $ cd plugin-emojis
    $ yarn && yarn build

Copy the built `dist/*.js` file to your kiwi plugins folders.

Next, add the following config parameter to `/your/kiwi/folder/static/config.json`

    "plugins": [
        {"name": "emoji", "url": "static/plugins/plugin-emoji-prelim.js"}
    ]


Optionally, you may include (in config.json) these settings,
changing the values as needed. Any or all of these may be
omitted, as these defaults are used if not specified.

```json
{
    "plugin-emojis": {
        "sendNativeEmojis": true,
        "imageTitle": "name", // 'name', 'colons', 'native', ''
        "emojiSet": "google", // 'apple', 'google', 'twitter', 'facebook', 'native'
        "pickerProps": {
            "emoji": "point_up",
            "title": "",
            "perLine": 8,
            "i18n": {
                "search": "Searchy",
                "notfound": "No Emoji Found",
                "categories": {
                    "search": "Search Results",
                    "recent": "Frequently Used",
                    "smileys": "Ugly Smileys & Emoticon",
                    "people": "People & Body",
                    "nature": "Animals & Nature",
                    "foods": "Food & Drink",
                    "activity": "Activity",
                    "places": "Travel & Places",
                    "objects": "Objects",
                    "symbols": "Symbols",
                    "flags": "Flags",
                    "custom": "Custom",
                }
            }
        },
        "frequentlyUsedLength": 16,
        // Do NOT include the following 3 options unless you intend to set them
        // doing so would change the default behavour of the plugin
        "frequentlyUsedList": [],
        "categoryInclude": [],
        "categoryExclude": [],
        "customEmojis": [
            {
                "name": "Kiwi IRC",
                "short_names": ["kiwiirc"],
                "text": "",
                "emoticons": [],
                "keywords": [],
                "imageUrl": "static/favicon.png",
            },
        ],
    },
}
```

This plugin is powered by [emoji-mart-vue-fast](https://github.com/serebrov/emoji-mart-vue)
