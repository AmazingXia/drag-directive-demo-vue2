<template>
  <div class="home-page">
    <h1>Vue2 Cube 指令演示</h1>

    <!-- 导航 -->
    <div class="nav-section">
      <button
        class="nav-button"
        :class="{ active: currentDemo === 'drag' }"
        @click="currentDemo = 'drag'"
      >
        拖拽指令 (v-cube-drag)
      </button>
      <button
        class="nav-button"
        :class="{ active: currentDemo === 'resize' }"
        @click="currentDemo = 'resize'"
      >
        拉伸指令 (v-cube-resizer)
      </button>
      <router-link to="/chart" class="nav-button chart-link">
        图表页面
      </router-link>
    </div>

    <!-- 拖拽指令演示 -->
    <div v-if="currentDemo === 'drag'">
      <!-- 基础用法 -->
      <div class="demo-section">
        <h2>基础用法</h2>
        <button
          class="demo-button"
          @click="boxFlag = !boxFlag"
        >
          {{ boxFlag ? '隐藏盒子' : '显示盒子' }}
        </button>
        <div
          v-if="boxFlag"
          v-cube-drag
          :style="boxStyle"
          class="draggable-box"
        >
          <div class="box-content">
            <div class="close-btn" @click="boxFlag = false">×</div>
            <div>拖拽我</div>
          </div>
        </div>
      </div>

      <!-- 使用修饰符指定拖动位置 -->
      <div class="demo-section">
        <h2>使用修饰符指定拖动位置</h2>
        <button
          class="demo-button"
          @click="modifierBoxFlag = !modifierBoxFlag"
        >
          {{ modifierBoxFlag ? '隐藏盒子' : '显示盒子' }}
        </button>
        <div class="radio-group" v-if="modifierBoxFlag">
          <label v-for="option in typeOptions" :key="option.value">
            <input
              type="radio"
              v-model="type"
              :value="option.value"
            >
            {{ option.label }}
          </label>
        </div>

        <div v-if="modifierBoxFlag && type === 'top'" key="1" v-cube-drag.top="60" :style="boxStyle" class="draggable-box">
          <div class="box-content">
            <div class="close-btn" @click="modifierBoxFlag = false">×</div>
            <div>头部位置拖动</div>
          </div>
        </div>
        <div v-if="modifierBoxFlag && type === 'bottom'" key="2" v-cube-drag.bottom="60" :style="boxStyle" class="draggable-box">
          <div class="box-content">
            <div class="close-btn" @click="modifierBoxFlag = false">×</div>
            <div>底部位置拖动</div>
          </div>
        </div>
        <div v-if="modifierBoxFlag && type === 'left'" key="3" v-cube-drag.left="60" :style="boxStyle" class="draggable-box">
          <div class="box-content">
            <div class="close-btn" @click="modifierBoxFlag = false">×</div>
            <div>左侧位置拖动</div>
          </div>
        </div>
        <div v-if="modifierBoxFlag && type === 'right'" key="4" v-cube-drag.right="60" :style="boxStyle" class="draggable-box">
          <div class="box-content">
            <div class="close-btn" @click="modifierBoxFlag = false">×</div>
            <div>右侧位置拖动</div>
          </div>
        </div>
      </div>

      <!-- 拖动位置自定义 -->
      <div class="demo-section">
        <h2>拖动位置自定义</h2>
        <button
          class="demo-button"
          @click="customBoxFlag = !customBoxFlag"
        >
          {{ customBoxFlag ? '隐藏盒子' : '显示盒子' }}
        </button>
        <div
          v-if="customBoxFlag"
          v-cube-drag="'#dragDiv'"
          class="flexCC"
          :style="boxStyle"
        >
          <div class="box-content">
            <div class="close-btn" @click="customBoxFlag = false">×</div>
            <div id="dragDiv" class="drag-handle">点我可拖动</div>
            <div class="drag-tip">只有点击上方按钮才能拖拽</div>
          </div>
        </div>
      </div>

      <!-- 限定移动的边界 -->
      <div class="demo-section">
        <h2>限定移动的边界</h2>
        <button
          class="demo-button"
          @click="boundaryBoxFlag = !boundaryBoxFlag"
        >
          {{ boundaryBoxFlag ? '隐藏盒子' : '显示盒子' }}
        </button>
        <div v-if="boundaryBoxFlag" :style="containerStyle">
          <div v-cube-drag.inside :style="smallBoxStyle" class="draggable-box">
            无法拖出边框外
          </div>
          <div v-cube-drag :style="smallBoxStyle" class="draggable-box">
            可以拖出边框外
          </div>
        </div>
      </div>
    </div>

    <!-- 拉伸指令演示 -->
    <ResizeDemo v-if="currentDemo === 'resize'" />
  </div>
</template>

<script>
import ResizeDemo from '../resize.vue';

export default {
  name: 'Home',
  components: {
    ResizeDemo
  },
  data() {
    return {
      // 当前演示类型
      currentDemo: 'resize',
      // 基础用法
      boxFlag: false,

      // 修饰符用法
      modifierBoxFlag: false,
      type: 'none',
      typeOptions: [
        { value: 'none', label: '隐藏' },
        { value: 'top', label: '头部' },
        { value: 'bottom', label: '底部' },
        { value: 'left', label: '左侧' },
        { value: 'right', label: '右侧' }
      ],

      // 自定义拖拽区域
      customBoxFlag: false,

      // 边界限制
      boundaryBoxFlag: false,

      // 样式定义
      boxStyle: {
        position: 'fixed',
        height: '300px',
        width: '300px',
        backgroundColor: 'aqua',
        top: 'calc(50% - 150px)',
        left: 'calc(50% - 150px)',
        zIndex: '9999',
        border: '2px solid #409EFF',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333'
      },

      containerStyle: {
        position: 'fixed',
        height: '300px',
        width: '300px',
        border: '1px solid #409EFF',
        top: 'calc(50% - 150px)',
        left: 'calc(50% - 150px)',
        backgroundColor: 'white',
        zIndex: '999'
      },

      smallBoxStyle: {
        position: 'absolute',
        height: '100px',
        width: '100px',
        backgroundColor: 'aqua',
        border: '1px solid #409EFF',
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#333'
      }
    }
  }
}
</script>

<style>
.nav-section {
  margin-bottom: 30px;
  text-align: center;
}

.nav-button {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #ddd;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
}

.nav-button:hover {
  background-color: #e0e0e0;
}

.nav-button.active {
  background-color: #409EFF;
  color: white;
  border-color: #409EFF;
}

.chart-link {
  background-color: #67C23A;
  color: white;
}

.chart-link:hover {
  background-color: #85ce61;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.demo-section h2 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #409EFF;
  padding-bottom: 10px;
}

.demo-button {
  background-color: #409EFF;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 20px;
}

.demo-button:hover {
  background-color: #66b1ff;
}

.radio-group {
  margin-bottom: 20px;
}

.radio-group label {
  margin-right: 20px;
  cursor: pointer;
}

.radio-group input[type="radio"] {
  margin-right: 5px;
}

.draggable-box {
  user-select: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.box-content {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  background-color: #ff4757;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  z-index: 10;
}

.close-btn:hover {
  background-color: #ff3742;
}

.drag-handle {
  background-color: #409EFF;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: move;
  font-weight: bold;
}

.flexCC {
  display: flex;
  justify-content: center;
  align-items: center;
}

.mb-30 {
  margin-bottom: 30px;
}
</style>

