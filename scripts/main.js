// 基础路径配置
const BASE_PATH = '/oreo_blog';

// 加载文章列表
async function loadArticles() {
    try {
        const response = await fetch(`${BASE_PATH}/articles/index.json`);
        const data = await response.json();
        
        const articlesContainer = document.getElementById('articles');
        articlesContainer.innerHTML = ''; // 清空容器
        
        // 生成文章卡片HTML
        data.articles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card';
            
            // 生成预览文本
            const previewHtml = article.preview ? marked.parse(article.preview) : '';
            
            articleCard.innerHTML = `
                <h2 class="article-title">${article.title}</h2>
                <div class="article-meta">
                    发布日期: ${formatDate(article.date)}
                    ${article.tags ? `| 标签: ${article.tags}` : ''}
                </div>
                <div class="article-preview">
                    ${previewHtml}
                </div>
                <a href="${BASE_PATH}/articles/${article.id}.html" class="read-more">阅读更多</a>
            `;
            
            // 处理预览区域的样式
            const previewDiv = articleCard.querySelector('.article-preview');
            // 移除预览中的大标题
            const h1 = previewDiv.querySelector('h1');
            if (h1) h1.remove();
            
            // 限制预览长度
            if (previewDiv.textContent.length > 200) {
                previewDiv.textContent = previewDiv.textContent.slice(0, 200) + '...';
            }
            
            articlesContainer.appendChild(articleCard);
        });
    } catch (error) {
        console.error('加载文章失败:', error);
        console.error(error);
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