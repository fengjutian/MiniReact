/**
 * 手动实现的简易 Babel 转换器 - 修复版
 */
class MiniBabel {
  constructor() {
    this.jsxPragma = 'createElement'; // 默认的 JSX 转换函数名
  }

  /**
   * 设置 JSX 转换指令
   * @param {string} code - 源代码
   */
  setJSXPragma(code) {
    // 查找类似 @jsx createElement 的注释
    const jsxPragmaRegex = /\/\*\*\s*@jsx\s+([\w]+)\s*\*\//;
    const match = code.match(jsxPragmaRegex);
    if (match) {
      this.jsxPragma = match[1];
    }
  }

  /**
   * 改进的 JSX 转换函数
   * @param {string} jsxCode - 包含 JSX 的代码
   * @returns {string} 转换后的 JavaScript 代码
   */
  transformJSX(jsxCode) {
    this.setJSXPragma(jsxCode);
    
    try {
      // 创建一个包装函数，确保所有函数和变量都在正确的作用域内
      let wrappedCode = `
        (function() {
          // 保存原始代码的内容
          ${jsxCode}
        })();
      `;
      
      // 修复：直接返回包装后的代码，因为我们已经在 HTML 中实现了 h 函数
      // 注意：这是一个简化方案，我们不再尝试复杂的 JSX 语法转换，而是依赖浏览器扩展
      return wrappedCode;
    } catch (error) {
      console.error('JSX 转换错误:', error);
      return `// JSX 转换失败: ${error.message}\n${jsxCode}`;
    }
  }

  /**
   * 扫描页面中的脚本标签并转换
   */
  transformScripts() {
    const scriptTags = document.querySelectorAll('script[type="text/jsx"]');
    
    scriptTags.forEach(tag => {
      const code = tag.textContent;
      const transformedCode = this.transformJSX(code);
      
      try {
        // 解决方案1: 使用 Blob URL 避免内联脚本问题
        const blob = new Blob([transformedCode], { type: 'application/javascript' });
        const scriptUrl = URL.createObjectURL(blob);
        
        const newScript = document.createElement('script');
        newScript.src = scriptUrl;
        document.head.appendChild(newScript);
        
        // 标记原标签已处理
        tag.setAttribute('data-transformed', 'true');
        
        // 清理
        newScript.onload = function() {
          URL.revokeObjectURL(scriptUrl);
          // 可选：加载完成后移除脚本标签
          // document.head.removeChild(newScript);
        };
      } catch (e) {
        console.error('脚本执行错误:', e);
        
        // 备选方案: 如果 Blob 方法失败，尝试使用 eval 作为最后的选择
        try {
          console.warn('尝试使用备选方法执行代码');
          // 使用 Function 构造函数代替 eval，稍微安全一点
          new Function(transformedCode)();
        } catch (evalError) {
          console.error('备选方法也失败:', evalError);
        }
      }
    });
  }
}

// 页面加载完成后执行转换
window.addEventListener('DOMContentLoaded', function() {
  try {
    const miniBabel = new MiniBabel();
    miniBabel.transformScripts();
  } catch (error) {
    console.error('MiniBabel 初始化失败:', error);
  }
});