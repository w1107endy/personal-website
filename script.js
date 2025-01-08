// 處理 Notion API 回傳的資料
function processNotionData(data) {
    if (!data || !data.results) {
        console.error('No valid data received');
        return [];
    }

    return data.results.map(item => {
        try {
            return {
                id: item.id,
                title: item.properties.Title.title[0]?.plain_text || '無標題',
                publisher: item.properties.Publisher.rich_text[0]?.plain_text || '無出版者',
                date: item.properties.Date.date?.start || '',
                url: item.url || '#',
                tags: item.properties.Tags.multi_select.map(tag => tag.name) || [],
                lead: item.properties.Lead?.rich_text[0]?.plain_text || ''
            };
        } catch (error) {
            console.error('Error processing item:', error);
            return null;
        }
    }).filter(item => item !== null);
}

// 建立 HTML 元素
function createArticleElement(article) {
    console.log('Creating article element:', article);
    
    return `
        <div class="article-card">
            <h2 class="article-title">
                <a href="article.html?id=${article.id}" class="article-link">${article.title}</a>
            </h2>
            <div class="article-meta">
                <span class="publisher">${article.publisher}</span>
                <span class="date">${formatDate(article.date)}</span>
            </div>
            <p class="article-lead">${article.lead}</p>
            <div class="article-footer">
                <div class="tags">
                    ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <a href="article.html?id=${article.id}" class="read-more">Read →</a>
            </div>
        </div>
    `;
}

// 格式化日期
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW');
} 