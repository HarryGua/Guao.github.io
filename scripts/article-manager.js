// scripts/article-manager.js
const fs = require('fs').promises;
const path = require('path');
const matter = require('gray-matter');

// 更新文章索引
async function updateArticlesIndex() {
    const articlesDir = path.join(__dirname, '..', 'articles');
    
    try {
        // 读取所有 .md 文件
        const files = await fs.readdir(articlesDir);
        const mdFiles = files.filter(file => file.endsWith('.md'));
        
        // 解析每个文件的元数据
        const articles = await Promise.all(mdFiles.map(async fileName => {
            const filePath = path.join(articlesDir, fileName);
            const content = await fs.readFile(filePath, 'utf8');
            const { data, excerpt } = matter(content, { excerpt: true });
            
            return {
                id: path.basename(fileName, '.md'),
                title: data.title,
                date: data.date,
                preview: excerpt || '',
                tags: data.tags || [],
                fileName
            };
        }));
        
        // 按日期排序
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 更新 index.json
        const indexPath = path.join(articlesDir, 'index.json');
        await fs.writeFile(
            indexPath,
            JSON.stringify({ articles }, null, 2),
            'utf8'
        );
        
        console.log('✨ 文章索引已更新');
        return true;
        
    } catch (error) {
        console.error('❌ 更新索引失败:', error);
        return false;
    }
}

// 启动文件监听
function startWatcher() {
    const chokidar = require('chokidar');
    const articlesGlob = path.join(__dirname, '..', 'articles', '**', '*.md');
    
    console.log('👀 开始监听文章变化...');
    
    const watcher = chokidar.watch(articlesGlob, {
        persistent: true,
        ignoreInitial: false
    });
    
    watcher
        .on('add', path => {
            console.log(`📝 新增文章: ${path}`);
            updateArticlesIndex();
        })
        .on('change', path => {
            console.log(`📝 更新文章: ${path}`);
            updateArticlesIndex();
        })
        .on('unlink', path => {
            console.log(`🗑️ 删除文章: ${path}`);
            updateArticlesIndex();
        });
}

// 主函数
async function main() {
    const mode = process.argv[2];
    
    if (mode === 'build') {
        // 仅构建索引
        console.log('🏗️ 开始构建文章索引...');
        const success = await updateArticlesIndex();
        process.exit(success ? 0 : 1);
    } else {
        // 启动监听模式
        startWatcher();
    }
}

main().catch(error => {
    console.error('❌ 程序运行错误:', error);
    process.exit(1);
});
