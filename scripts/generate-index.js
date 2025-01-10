// generate-index.js
const fs = require('fs').promises;
const path = require('path');

async function generateArticlesIndex() {
    try {
        const articlesDir = path.join(__dirname,'..', 'articles');
        const files = await fs.readdir(articlesDir);
        
        // 只处理 .md 文件
        const mdFiles = files.filter(file => file.endsWith('.md'));
        
        const articles = await Promise.all(mdFiles.map(async fileName => {
            const filePath = path.join(articlesDir, fileName);
            const content = await fs.readFile(filePath, 'utf8');
            
            // 从文件名提取日期和ID
            const [date, ...titleParts] = fileName.replace('.md', '').split('-');
            const title = titleParts.join('-').replace(/-/g, ' ');
            
            // 从内容中提取元数据
            const metadata = extractMetadata(content);
            const preview = extractPreview(content);
            
            return {
                id: fileName.replace('.md', ''),
                title: metadata.title || title,
                date: metadata.date || date,
                preview: preview,
                tags: metadata.tags || [],
                fileName: fileName
            };
        }));
        
        // 按日期排序（最新的在前面）
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 写入 index.json
        const indexPath = path.join(articlesDir, 'index.json');
        await fs.writeFile(
            indexPath, 
            JSON.stringify({ articles }, null, 2),
            'utf8'
        );
        
        console.log(`成功生成索引，共处理 ${articles.length} 篇文章`);
    } catch (error) {
        console.error('生成索引失败:', error);
    }
}

// 从文章内容中提取元数据
function extractMetadata(content) {
    const metadata = {};
    
    // 处理 YAML front matter
    if (content.startsWith('---')) {
        const endIndex = content.indexOf('---', 3);
        if (endIndex !== -1) {
            const frontMatter = content.slice(3, endIndex);
            frontMatter.split('\n').forEach(line => {
                const [key, ...values] = line.split(':').map(s => s.trim());
                if (key && values.length) {
                    if (key === 'tags') {
                        metadata.tags = values.join(':').split(',').map(t => t.trim());
                    } else {
                        metadata[key] = values.join(':');
                    }
                }
            });
        }
    }
    
    return metadata;
}

// 提取文章预览
function extractPreview(content) {
    // 移除 YAML front matter
    let processedContent = content;
    if (content.startsWith('---')) {
        const endIndex = content.indexOf('---', 3);
        if (endIndex !== -1) {
            processedContent = content.slice(endIndex + 3);
        }
    }
    
    // 移除标题
    processedContent = processedContent.replace(/^#\s+.+$/m, '');
    
    // 获取第一段非空文本
    const match = processedContent.match(/^([^#\n].+?)(?=\n\n|\n#|$)/s);
    return match ? match[1].trim().slice(0, 200) + (match[1].length > 200 ? '...' : '') : '';
}

// 运行生成器
generateArticlesIndex().catch(console.error);