// scripts/create-post.js
const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createPost() {
    try {
        console.log('📝 创建新文章\n');
        
        // 获取用户输入
        const title = await question('文章标题: ');
        const tags = await question('标签 (用逗号分隔): ');
        
        // 生成文件名
        const date = new Date().toISOString().split('T')[0];
        const fileName = `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
        
        // 读取模板
        const templatePath = path.join(__dirname, '..', 'template', 'YYYY-MM-DD-文章标题.md');
        let template = await fs.readFile(templatePath, 'utf8');
        
        // 替换模板内容
        template = template.replace(/文章标题/g, title)
                         .replace(/YYYY-MM-DD/g, date)
                         .replace(/标签1, 标签2, 标签3/, tags);
        
        // 保存文件
        const filePath = path.join(__dirname, '..', 'articles', fileName);
        await fs.writeFile(filePath, template, 'utf8');
        
        console.log(`\n✨ 文章已创建: ${fileName}`);
        
        // 运行索引构建
        const { spawn } = require('child_process');
        const build = spawn('npm', ['run', 'build-index'], {
            stdio: 'inherit',
            shell: true
        });
        
        build.on('close', (code) => {
            if (code === 0) {
                console.log('✨ 文章索引已更新');
            } else {
                console.error('❌ 更新索引失败');
            }
            rl.close();
        });
        
    } catch (error) {
        console.error('❌ 创建文章失败:', error);
        rl.close();
    }
}

createPost();
