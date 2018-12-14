# KiwiIRC - Emoji Plugin

### Status - In development

This plugin adds an emoji picker to KiwiIRC's UI. 

This plugin requires yarn.

### Installation

    $ git clone https://github.com/kiwiirc/plugin-emojis.git
    $ cd plugin-emojis
    $ yarn & yarn build

Copy the built `dist/main.js` file to your kiwi plugins folders.

Next, add the following config parameter to /your/kiwi/folder/static/config.json

    "plugins": [
        {"name": "emojis", "url": "static/plugins/dist/plugin-emoji.min.js"} 
    ]


Optionally, you may include (in config.json) these settings,
changing the values as needed. Any or all of these may be
omitted, as these defaults are used if not specified.

    "pluginEmojis": {
        "include": [
            "recent",
            "people",
            "nature",
            "foods",
            "activity",
            "places",
            "objects",
            "symbols",
            "flags",
            "custom"
        ],
        "exclude": [],
        "titleText": "Pick your emoji\u2026",
        "searchText": "Search for",
        "categoriesSearchResultsText": "Search Results",
        "categoriesRecentText": "Recent",
        "categoriesPeopleText": "People",
        "categoriesNatureText": "Nature",
        "categoriesFoodsText": "Foods",
        "categoriesActivityText": "Activity",
        "categoriesPlacesText": "Places",
        "categoriesObjectsText": "Objects",
        "categoriesSymbolsText": "Symbols",
        "categoriesFlagsText": "Flags",
        "categoriesCustomText": "Custom"
    },
   
