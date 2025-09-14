# Vue2 Cube-Drag 指令演示

这是一个Vue2项目，演示了自定义拖拽指令 `v-cube-drag` 的使用方法。

## 功能特性

### 基础拖拽
- 支持整个元素拖拽
- 支持指定选择器区域拖拽

### 修饰符支持
- `inside`: 限制在父容器内拖拽，无法超出边界
- `top`: 限制在顶部区域拖拽
- `bottom`: 限制在底部区域拖拽
- `left`: 限制在左侧区域拖拽
- `right`: 限制在右侧区域拖拽

### 值支持
- 支持CSS选择器，指定触发拖拽的具体元素
- 支持数值，用于方位修饰符的范围限制

## 安装和运行

```bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build
```

## 使用方法

### 基础用法
```vue
<template>
  <div v-cube-drag :style="boxStyle">拖拽我</div>
</template>
```

### 指定拖拽区域
```vue
<template>
  <div v-cube-drag="'#dragHandle'" :style="boxStyle">
    <div id="dragHandle">点击这里拖拽</div>
    <div>这里不能拖拽</div>
  </div>
</template>
```

### 限制拖拽范围
```vue
<template>
  <!-- 限制在父容器内 -->
  <div class="container">
    <div v-cube-drag.inside :style="boxStyle">无法拖出容器</div>
  </div>

  <!-- 限制在顶部区域 -->
  <div v-cube-drag.top="100" :style="boxStyle">只能在顶部100px内拖拽</div>

  <!-- 限制在底部区域 -->
  <div v-cube-drag.bottom="100" :style="boxStyle">只能在底部100px内拖拽</div>
</template>
```

## 指令参数

| 参数 | 类型 | 说明 |
|------|------|------|
| value | String/Number | CSS选择器或数值范围 |
| modifiers | Object | 修饰符对象 |

## 修饰符说明

| 修饰符 | 说明 |
|--------|------|
| inside | 限制在父容器内拖拽 |
| top | 限制在顶部区域拖拽 |
| bottom | 限制在底部区域拖拽 |
| left | 限制在左侧区域拖拽 |
| right | 限制在右侧区域拖拽 |

## 注意事项

1. 被拖拽的元素需要设置 `position: fixed` 或 `position: absolute`
2. 使用 `inside` 修饰符时，需要确保父容器有明确的边界
3. 方位修饰符配合数值使用时，数值表示限制范围
4. 拖拽元素会自动设置 `cursor: move` 样式
