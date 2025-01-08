// Notion API configuration
const NOTION_TOKEN = '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';
const DATABASE_ID = '1739e598e5ae805a87a8d35908b732dc';
const NOTION_API_VERSION = '2022-06-28';

// Function to fetch data from Notion
async function fetchNotionData() {
    try {
        const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_TOKEN}`,
                'Content-Type': 'application/json',
                'Notion-Version': NOTION_API_VERSION
            },
            body: JSON.stringify({
                sorts: [
                    {
                        property: 'Date',
                        direction: 'descending'
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching data from Notion:', error);
        return [];
    }
}

// Function to process and format the Notion data
function processNotionData(results) {
    return results.map(page => {
        return {
            id: page.id,
            title: page.properties.Title?.title[0]?.plain_text || '',
            date: page.properties.Date?.date?.start || '',
            // Add more properties as needed
        };
    });
}

// Export functions
module.exports = {
    fetchNotionData,
    processNotionData
}; 