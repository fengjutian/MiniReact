# MiniReact

## 项目介绍

MiniReact 是一个简化版的 React 框架实现，旨在帮助开发者理解现代前端框架的核心概念和工作原理。这个项目通过一系列迭代版本，逐步实现了 React 的主要功能特性，从最基础的虚拟 DOM 和状态管理，到更高级的 Fiber 调度、Portal 和 Fragment 等特性。

## 项目结构

项目包含以下主要文件：

- `MiniReact-1.html` - 基础版实现，包含核心的状态管理和渲染功能
- `MiniReact-2.html` - 增加 useEffect 钩子支持
- `MiniReact-3.html` - 实现 DOM diff 算法，优化渲染性能
- `MiniReact-4.html` - 完善 key diff 列表支持
- `MiniReact-5.html` - 添加 Fragment、Portal 和模拟 Fiber 调度
- `MiniReact-5.1.html` - 优化 key 替换逻辑和增加交互功能
- `MiniReact-6.html` - 最终交互式演示版本

## 版本功能演进

### MiniReact 1 - 基础实现
```javascript
// 核心功能：
- useState 钩子函数
- createElement 函数处理 JSX
- 基础的 render 函数
- 函数组件支持
```
<mcfile name="MiniReact-1.html" path="d:\GitHub\MiniReact\MiniReact-1.html"></mcfile>

### MiniReact 2 - 添加 useEffect
```javascript
// 新增功能：
- useEffect 副作用钩子
- 依赖项追踪系统
- 组件渲染后的副作用执行
```
<mcfile name="MiniReact-2.html" path="d:\GitHub\MiniReact\MiniReact-2.html"></mcfile>

### MiniReact 3 - DOM Diff 实现
```javascript
// 新增功能：
- 虚拟 DOM 比对算法
- 节点复用机制
- useEffect 清理函数支持
- 性能优化
```
<mcfile name="MiniReact-3.html" path="d:\GitHub\MiniReact\MiniReact-3.html"></mcfile>

### MiniReact 4 - Key Diff 支持
```javascript
// 新增功能：
- 基于 key 的列表元素识别
- 更高效的列表更新
- 减少不必要的 DOM 操作
```
<mcfile name="MiniReact-4.html" path="d:\GitHub\MiniReact\MiniReact-4.html"></mcfile>

### MiniReact 5 - 高级特性
```javascript
// 新增功能：
- Fragment 支持（<>...</>）
- Portal 支持（跨 DOM 渲染）
- 模拟 Fiber 调度（异步渲染）
- 嵌套组件局部刷新
```
<mcfile name="MiniReact-5.html" path="d:\GitHub\MiniReact\MiniReact-5.html"></mcfile>

### MiniReact 5.1 - 优化版本
```javascript
// 优化功能：
- 改进的 key 替换逻辑
- 增强的交互演示
- 更多操作功能（排序、更新、删除）
```
<mcfile name="MiniReact-5.1.html" path="d:\GitHub\MiniReact\MiniReact-5.1.html"></mcfile>

### MiniReact 6 - 最终交互版本
```javascript
// 最终特性：
- 完整的交互式演示
- 优化的代码结构
- 详细的功能注释
- 稳定的运行体验
```
<mcfile name="MiniReact-6.html" path="d:\GitHub\MiniReact\MiniReact-6.html"></mcfile>

## 核心概念解析

### 1. 虚拟 DOM

MiniReact 通过 JavaScript 对象表示 DOM 结构，实现了高效的 DOM 更新机制：

```javascript
function createElement(tag, props, ...children) {
  return { tag, props: props || {}, children: children.flat() };
}
```
<mcsymbol name="createElement" filename="MiniReact-1.html" path="d:\GitHub\MiniReact\MiniReact-1.html" startline="42" type="function"></mcsymbol>

### 2. 状态管理

使用简洁的数组实现了类似 React 的 Hooks 状态管理：

```javascript
let state = [];
let stateIndex = 0;

function useState(initial) {
  const currentIndex = stateIndex;
  state[currentIndex] = state[currentIndex] ?? initial;

  function setState(newState) {
    state[currentIndex] = newState;
    rerender();
  }

  stateIndex++;
  return [state[currentIndex], setState];
}
```
<mcsymbol name="useState" filename="MiniReact-1.html" path="d:\GitHub\MiniReact\MiniReact-1.html" startline="18" type="function"></mcsymbol>

### 3. 副作用处理

实现了依赖追踪和副作用执行机制：

```javascript
function useEffect(callback, deps) {
  const currentIndex = stateIndex;
  const prevDeps = effectDeps[currentIndex];
  let hasChanged = true;

  if (prevDeps) {
    hasChanged = deps.some((d, i) => d !== prevDeps[i]);
  }

  if (hasChanged) {
    if (cleanupEffects[currentIndex]) cleanupEffects[currentIndex]();
    const cleanup = callback();
    cleanupEffects[currentIndex] = typeof cleanup === 'function' ? cleanup : null;
    effectDeps[currentIndex] = deps;
  }

  stateIndex++;
}
```
<mcsymbol name="useEffect" filename="MiniReact-2.html" path="d:\GitHub\MiniReact\MiniReact-2.html" startline="18" type="function"></mcsymbol>

### 4. DOM Diff 算法

通过比较新旧虚拟节点，最小化 DOM 操作：

```javascript
function render(vnode, container, oldNode = null) {
  // 删除节点
  if (vnode === null || vnode === undefined) {
    if (oldNode && oldNode.el) container.removeChild(oldNode.el);
    return null;
  }

  // 文本节点处理
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    // ...处理文本节点更新...
  }

  // 函数组件处理
  if (typeof vnode.tag === 'function') {
    // ...处理组件渲染...
  }

  // 普通元素处理和属性更新
  // ...

  // 子节点 diff
  // ...
}
```
<mcsymbol name="render" filename="MiniReact-3.html" path="d:\GitHub\MiniReact\MiniReact-3.html" startline="53" type="function"></mcsymbol>

### 5. Fiber 调度模拟

通过 requestIdleCallback 实现异步渲染，避免阻塞主线程：

```javascript
function workLoop(deadline) {
  while (nextUnitOfWork && deadline.timeRemaining() > 1) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (nextUnitOfWork) {
    requestIdleCallback(workLoop);
  } else if (wipRoot) {
    commitRoot();
  }
}
```
<mcsymbol name="workLoop" filename="MiniReact-5.html" path="d:\GitHub\MiniReact\MiniReact-5.html" startline="201" type="function"></mcsymbol>

## 如何运行

1. 直接在浏览器中打开对应的 HTML 文件即可运行各个版本
2. 每个 HTML 文件都是独立的，包含完整的 MiniReact 实现和演示组件
3. 打开浏览器控制台可以查看组件生命周期和状态变化日志

## 学习价值

这个项目适合以下人群学习：

- 想了解 React 底层实现原理的前端开发者
- 对虚拟 DOM、Hooks 和 diff 算法感兴趣的学习者
- 希望提升 JavaScript 编程能力和框架设计思维的开发者

通过学习 MiniReact 的实现，您可以更深入地理解现代前端框架的核心概念，并将这些知识应用到实际开发中。

## 示例组件

每个版本都包含了简单的演示组件，如计数器和待办事项列表：

```javascript
function Counter({ initial = 0 }) {
  const [count, setCount] = useState(initial);
  
  useEffect(() => {
    console.log('Count updated:', count);
    return () => console.log('Cleanup count:', count);
  }, [count]);
  
  return (
    <div>
      <h2>Counter: {count}</h2>
      <button onClick={() => setCount(count + 1)}>+</button>
      <button onClick={() => setCount(count - 1)}>-</button>
    </div>
  );
}
```
<mcsymbol name="Counter" filename="MiniReact-3.html" path="d:\GitHub\MiniReact\MiniReact-3.html" startline="143" type="function"></mcsymbol>

## 注意事项

- 这是一个教学性质的简化实现，不建议在生产环境中使用
- 真实的 React 框架包含更多的优化和特性
- 每个版本都是在前一个版本的基础上逐步构建的，建议按顺序学习

---

通过这个 MiniReact 项目，您可以一步步了解现代前端框架的核心工作原理，从基础的状态管理到高级的 Fiber 调度算法。希望这个项目能帮助您更深入地理解 React 和前端框架设计！
        
