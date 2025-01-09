
const articles = [
    {
        title: "第一篇博客文章",
        date: "2024-01-05",
        preview: "这是我的第一篇博客文章。在这里，我将分享我的想法和经验...",
        id: 1
    },
    {
        title: "第二篇博客文章",
        date: "2024-01-04",
        preview: "今天我想分享一些有趣的想法...",
        id: 2
    }
];

// 渲染文章列表
function renderArticles() {
    const articlesContainer = document.getElementById('articles');
    articles.forEach(article => {
        const articleElement = document.createElement('div');
        articleElement.className = 'article-card';
        articleElement.innerHTML = `
            <h2 class="article-title">${article.title}</h2>
            <div class="article-meta">发布于 ${article.date}</div>
            <p class="article-preview">${article.preview}</p>
            <a href="#" class="read-more" onclick="readArticle(${article.id}); return false;">阅读更多</a>
        `;
        articlesContainer.appendChild(articleElement);
    });
}

// 阅读文章详情
function readArticle(id) {
    console.log(`Reading article ${id}`);
    // 这里可以添加跳转到文章详情页的逻辑
    alert('此功能正在开发中...');
}

// 页面加载完成后渲染文章
document.addEventListener('DOMContentLoaded', renderArticles);
