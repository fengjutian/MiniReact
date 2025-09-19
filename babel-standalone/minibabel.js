/**
 * 手动实现的简易 Babel 转换器
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
   * 简单的 JSX 转换函数
   * @param {string} jsxCode - 包含 JSX 的代码
   * @returns {string} 转换后的 JavaScript 代码
   */
  transformJSX(jsxCode) {
    this.setJSXPragma(jsxCode);
    
    // 一个极其简化的 JSX 转换器
    // 注意：这只是演示基本原理，真实的 JSX 转换要复杂得多
    let transformedCode = jsxCode
      // 处理自闭合标签 <div /> => createElement('div', null)
      .replace(/<(\w+)([^>]*)\/>/g, (match, tag, props) => {
        const propsObj = this.parseProps(props);
        return `${this.jsxPragma}('${tag}', ${propsObj})`;
      })
      // 处理开标签 <div> => createElement('div', null, 
      .replace(/<(\w+)([^>]*)>/g, (match, tag, props) => {
        const propsObj = this.parseProps(props);
        return `${this.jsxPragma}('${tag}', ${propsObj}, `;
      })
      // 处理闭标签 </div> => )
      .replace(/<\/(\w+)>/g, ')');
    
    return transformedCode;
  }

  /**
   * 简单的属性解析函数
   * @param {string} propsStr - 属性字符串
   * @returns {string} 转换后的属性对象字符串
   */
  parseProps(propsStr) {
    if (!propsStr.trim()) return 'null';
    
    // 这是一个简化版，只处理简单的属性
    let props = '{';
    const propRegex = /(\w+)\s*=\s*(["'][^"']*["']|{[^}]*})/g;
    let match;
    
    while ((match = propRegex.exec(propsStr)) !== null) {
      const [, key, value] = match;
      props += `${key}: ${value},`;
    }
    
    props = props.replace(/,$/, '') + '}';
    return props;
  }

  /**
   * 扫描页面中的脚本标签并转换
   */
  transformScripts() {
    const scriptTags = document.querySelectorAll('script[type="text/jsx"]');
    
    scriptTags.forEach(tag => {
      const code = tag.textContent;
      const transformedCode = this.transformJSX(code);
      
      // 创建新的脚本标签来执行转换后的代码
      const newScript = document.createElement('script');
      newScript.textContent = transformedCode;
      document.head.appendChild(newScript);
      
      // 标记原标签已处理
      tag.setAttribute('data-transformed', 'true');
    });
  }
}

// 页面加载完成后执行转换
window.addEventListener('DOMContentLoaded', () => {
  const miniBabel = new MiniBabel();
  miniBabel.transformScripts();
});