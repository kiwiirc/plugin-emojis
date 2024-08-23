# KiwiIRC - Emojis Plugin

This plugin adds an advanced emoji picker to Kiwi IRC's UI. It also parses incoming emojis and replaces them for images to allow for a consistent emojis experience.

> powered by [emoji-mart-vue-fast](https://github.com/serebrov/emoji-mart-vue)

> animated emojis powered by [noto-emoji-animation](https://googlefonts.github.io/noto-emoji-animation/)

## Building from source

### Dependencies

* node (https://nodejs.org/)
* yarn (https://yarnpkg.com/)

### Building for production
``` bash
git clone https://github.com/kiwiirc/plugin-emojis.git
cd plugin-emojis
yarn && yarn build
```

### Installing
Copy the built files from `dist/` to your kiwi plugins folders.

Next, add the following config parameter to `/your/kiwi/folder/static/config.json`

``` json
"plugins": [
    {"name": "emojis", "url": "static/plugins/plugin-emojis-prelim.js"}
]
```

> note: `plugin-emojis-prelim.js` prevents the plugin from loading on mobiles as they normally have an emoji picker built into their keyboards,
> if you would just like the emoji picker to always be loaded then use `plugin-emojis.js`

### Configuring

Optionally, you may include (in config.json) these settings,
changing the values as needed. Any or all of these may be
omitted, as these defaults are used if not specified.

```json
{
    "plugin-emojis": {
        "sendNativeEmojis": true,
        "parseEmoticons": true,
        "parseColons": true,
        "parseNative": true,
        "imageTitle": "name", // 'name', 'colons', 'native', ''
        "emojiSet": "google", // 'apple', 'google', 'twitter', 'facebook', 'native'
        "pickerProps": {
            "emoji": "point_up",
            "title": "",
            "perLine": 8,
            "i18n": {
                "search": "Search",
                "notfound": "No Emoji Found",
                "categories": {
                    "search": "Search Results",
                    "recent": "Frequently Used",
                    "smileys": "Smileys & Emoticon",
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
        // DO NOT include the following 3 options unless you intend to set them
        // doing so would change the default behaviour of the plugin
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
        // This option will enable the included animated emojis
        // or allow existing emojis to be replaced by customised ones on a different url
        // using external emojis will come with a performance penalty over the default emoji sheet
        "externalEnabled": true,
        // This option controls how external emojis are displayed in the emoji picker
        // valid options are: "all", "hover", "none"
        // note: "all" will put great load on the server and users internet connect as it will
        // attempt to download all the external emojis when the picker is opened (around 30MB for the included animated emojis)
        "externalPicker": "none",
        // DO NOT include externalUrl unless you intend to set it
        // doing so would override the default automatically generated url based on plugin location
        // If your wanting to use another server you can provide a custom url
        // %CODEPOINT% will be replaced with the google emojis code point eg "1f44f_1f3fc"
        // %UNIFIED% will be replaced with the emoji mart unified code eg "1F44F-1F3FC"
        // Although included for demonstration it is not recommended to use fonts.gstatic.com url due to the emojis being 512x512
        // where as the included ones have been resized to 64x64 to make the file sizes much smaller
        "externalUrl": "https://fonts.gstatic.com/s/e/notoemoji/latest/%CODEPOINT%/512.gif",
        // DO NOT include externalEmojis unless you intend to set it
        // doing so would override the animated emojis being used
        // this object should use emoji-marts unified codes eg "1F44F-1F3FC"
        "externalEmojis": { "1F604": 1 }
    },
}
```

## License

[Licensed under the Apache License, Version 2.0](LICENSE).
