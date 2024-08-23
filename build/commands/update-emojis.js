const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const fetch = require('node-fetch');

const utils = require('../utils');

const emojisDir = utils.pathResolve('src/res/animated_emojis/');

if (!fs.existsSync(emojisDir)) {
    fs.mkdirSync(emojisDir);
}

async function getGoogleEmojiList() {
    const response = await fetch('https://googlefonts.github.io/noto-emoji-animation/data/api.json');
    if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data = await response.json();

    return data.icons.map((icon) => ({
        codepoint: icon.codepoint,
        name: icon.tags[0].slice(1, -1),
    }));
}

async function downloadEmoji(codepoint, gifPath) {
    const url = `https://fonts.gstatic.com/s/e/notoemoji/latest/${codepoint}/512.gif`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch emoji: ${response.statusText}`);
    }

    const gifBuffer = await response.buffer();

    // Resize the GIF to 64px and save it to the emojis directory
    await sharp(gifBuffer, { animated: true })
        .resize(64)
        .toFile(gifPath);
}

(async () => {
    try {
        const localDataPath = path.join(emojisDir, 'data.json');
        const localOut = {};
        const local = {};

        try {
            const localRaw = await fs.promises.readFile(localDataPath);
            Object.assign(local, JSON.parse(localRaw));
        } catch (error) {
            console.error(`Could not read local data.json: ${error.message}`);
        }

        const emojis = await getGoogleEmojiList();

        for (let i = 0; i < emojis.length; i++) {
            const { codepoint, name } = emojis[i];
            const unified = codepoint.toUpperCase().replace(/_/g, '-');
            const gifPath = path.join(emojisDir, `${codepoint}.gif`);

            if (local[unified] && fs.existsSync(gifPath)) {
                localOut[unified] = 1;
                continue;
            }

            if (localOut[unified]) {
                continue;
            }

            console.log(`Downloading ${name} (${codepoint})`);
            try {
                // eslint-disable-next-line no-await-in-loop
                await downloadEmoji(codepoint, gifPath);
            } catch (error) {
                console.error(`Could not get emoji ${name} (${codepoint}): ${error.message}`);
            }

            localOut[unified] = 1;
        }

        await fs.promises.writeFile(localDataPath, JSON.stringify(localOut));
    } catch (error) {
        console.error(`Failed to update emojis: ${error.message}`);
    }
})();
