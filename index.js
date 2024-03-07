const express = require('express');
const axios = require('axios');

const app = express();

app.get('/getTimeStories', async (req, res) => {
    try {
        const url = 'https://time.com';
        const response = await axios.get(url);
        const stories = extractStories(response.data);

        res.json(stories);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error has occured' });
    }
});

function extractStories(html) {
    const stories = [];
    const itemRegex = /<li class="latest-stories__item"[^>]*>(.*?)<\/li>/gs;
    const titleRegex = /<h3 class="latest-stories__item-headline"[^>]*>(.*?)<\/h3>/;
    const linkRegex = /<a[^>]*href=(['"])(.*?)\1[^>]*>(.*?)<\/a>/gs;

    let match;
    while ((match = itemRegex.exec(html)) !== null) {
        const itemContent = match[1];
        //console.log('Item Content:', itemContent); 
        const titleMatch = titleRegex.exec(itemContent);

    
        linkRegex.lastIndex = 0;
        let linkMatch;
        while ((linkMatch = linkRegex.exec(itemContent)) !== null) {
            //console.log('Link Match:', linkMatch); 

            if (titleMatch && linkMatch && linkMatch[2]) {
                const title = titleMatch[1].trim();
                const link = "https://time.com"+linkMatch[2];
                stories.push({ title, link });
            }
        }
    }

    return stories;
}


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
