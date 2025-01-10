// 加载文章列表
async function loadArticles() {
    try {
        const response = await fetch('/articles/index.json');
        const data = await response.json();
        
        const articlesContainer = document.getElementById('articles');
        
        // 生成文章卡片HTML
        data.articles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card';
            
            articleCard.innerHTML = `
                <h2 class="article-title">${article.title}</h2>
                <div class="article-meta">
                    发布日期: ${formatDate(article.date)}
                    ${article.tags.length ? `| 标签: ${article.tags.join(', ')}` : ''}
                </div>
                <div class="article-preview">
                    ${article.preview}
                </div>
                <a href="/articles/${article.fileName}" class="read-more">阅读更多</a>
            `;
            
            articlesContainer.appendChild(articleCard);
        });
    } catch (error) {
        console.error('加载文章失败:', error);
        document.getElementById('articles').innerHTML = '<p>加载文章失败，请稍后重试。</p>';
    }
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadArticles);