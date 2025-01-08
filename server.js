const express = require('express');
const cors = require('cors');
const { Client } = require('@notionhq/client');
require('dotenv').config();

const app = express();
app.use(cors());

const notion = new Client({
    auth: process.env.NOTION_API_KEY
});

const PORT = 3000;

// 文章列表路由
app.get('/api/articles', async (req, res) => {
    try {
        console.log('Fetching articles...');
        
        const response = await notion.databases.query({
            database_id: '1749e598e5ae808a9962c86c7738141c',
            sorts: [
                {
                    property: 'Date',
                    direction: 'descending',
                }
            ],
        });

        console.log('Articles fetched:', response.results.length);
        res.json(response.results);
    } catch (error) {
        console.error('Error fetching articles:', error);
        res.status(500).json({ error: error.message });
    }
});

// 單篇文章路由
app.get('/api/notion-page/:pageId', async (req, res) => {
    try {
        const pageId = req.params.pageId;
        const page = await notion.pages.retrieve({ page_id: pageId });
        const blocks = await notion.blocks.children.list({
            block_id: pageId,
            page_size: 100,
        });
        
        const response = {
            properties: page.properties,
            content: blocks.results
        };
        
        res.json(response);
    } catch (error) {
        console.error('Error fetching Notion page:', error);
        res.status(500).json({ error: error.message });
    }
});

// About 頁面路由
app.get('/api/about', async (req, res) => {
    try {
        const response = await notion.databases.query({
            database_id: '1759e598e5ae80018f0dddf1b43d0333',
            filter: {
                property: "Name",
                title: {
                    equals: "About"
                }
            }
        });

        if (response.results.length === 0) {
            throw new Error('About content not found');
        }

        const aboutContent = response.results[0].properties.Content.rich_text[0]?.plain_text || '';
        res.json({ content: aboutContent });
    } catch (error) {
        console.error('Error fetching about content:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('Environment variables loaded:', {
        NOTION_DATABASE_ID: process.env.NOTION_DATABASE_ID ? 'Set' : 'Not set',
        NOTION_API_KEY: process.env.NOTION_API_KEY ? 'Set' : 'Not set'
    });
}); 