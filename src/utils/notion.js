import { Client } from '@notionhq/client';

const notion = new Client({
  auth: import.meta.env.NOTION_API_KEY
});

export async function getWorksFromNotion() {
  try {
    const response = await notion.databases.query({
      database_id: import.meta.env.WORKS_DATABASE_ID,
      sorts: [
        {
          property: 'Title',
          direction: 'ascending',
        },
      ],
    });

    return response.results.map(page => ({
      title: page.properties.Title.title[0]?.text.content || '',
      description: page.properties.Description.rich_text[0]?.text.content || '',
      image: page.properties.Image?.files[0]?.file?.url || '',
      link: page.properties.Link?.url || '',
      tags: page.properties.Tags?.multi_select?.map(tag => tag.name) || []
    }));
  } catch (error) {
    console.error('Error fetching works from Notion:', error);
    return [];
  }
} 