<template>
  <div id="resize-demo">
    <h1>Vue2 Cube-Resizer 指令演示</h1>

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
        v-show="boxFlag"
        v-cube-resizer
        :style="boxStyle"
        class="resizable-box"
      >
        <div class="box-content">
          <div class="close-btn" @click="boxFlag = false">×</div>
          <div>拉伸我</div>
        </div>
      </div>
    </div>

    <!-- 限定移动的边界 -->
    <div class="demo-section">
      <h2>限定拉伸的边界</h2>
      <button
        class="demo-button"
        @click="boundaryBoxFlag = !boundaryBoxFlag"
      >
        {{ boundaryBoxFlag ? '隐藏盒子' : '显示盒子' }}
      </button>
      <div v-show="boundaryBoxFlag" :style="containerStyle">
        <div v-cube-resizer.inside :style="smallBoxStyle" class="resizable-box">
          <div class="box-content">
            <div class="close-btn" @click="boundaryBoxFlag = false">×</div>
            <div>无法拉伸出边框外</div>
          </div>
        </div>
        <div v-cube-resizer :style="smallBoxStyle" class="resizable-box">
          <div class="box-content">
            <div class="close-btn" @click="boundaryBoxFlag = false">×</div>
            <div>可以拉伸出边框外</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 拉伸位置配置 -->
    <div class="demo-section">
      <h2>拉伸位置配置</h2>
      <div class="radio-group">
        <label v-for="option in typeOptions" :key="option.value">
          <input
            type="radio"
            v-model="type"
            :value="option.value"
          >
          {{ option.label }}
        </label>
      </div>

      <div v-if="type === 'north'" key="1" v-cube-resizer.north="60" :style="boxStyle" class="resizable-box">
        <div class="box-content">
          <div class="close-btn" @click="type = 'none'">×</div>
          <div>头部拉伸</div>
        </div>
      </div>
      <div v-if="type === 'south'" key="2" v-cube-resizer.south="60" :style="boxStyle" class="resizable-box">
        <div class="box-content">
          <div class="close-btn" @click="type = 'none'">×</div>
          <div>底部拉伸</div>
        </div>
      </div>
      <div v-if="type === 'west'" key="3" v-cube-resizer.west="60" :style="boxStyle" class="resizable-box">
        <div class="box-content">
          <div class="close-btn" @click="type = 'none'">×</div>
          <div>左侧拉伸</div>
        </div>
      </div>
      <div v-if="type === 'east'" key="4" v-cube-resizer.east="60" :style="boxStyle" class="resizable-box">
        <div class="box-content">
          <div class="close-btn" @click="type = 'none'">×</div>
          <div>右侧拉伸</div>
        </div>
      </div>
      <div v-if="type === 'northwest'" key="5" v-cube-resizer.northwest="60" :style="boxStyle" class="resizable-box">
        <div class="box-content">
          <div class="close-btn" @click="type = 'none'">×</div>
          <div>左上角可拉伸</div>
        </div>
      </div>
      <div v-if="type === 'southwest'" key="6" v-cube-resizer.southwest="60" :style="boxStyle" class="resizable-box">
        <div class="box-content">
          <div class="close-btn" @click="type = 'none'">×</div>
          <div>左下角可拉伸</div>
        </div>
      </div>
      <div v-if="type === 'northeast'" key="7" v-cube-resizer.northeast="60" :style="boxStyle" class="resizable-box">
        <div class="box-content">
          <div class="close-btn" @click="type = 'none'">×</div>
          <div>右上角可拉伸</div>
        </div>
      </div>
      <div v-if="type === 'southeast'" key="8" v-cube-resizer.southeast="60" :style="boxStyle" class="resizable-box">
        <div class="box-content">
          <div class="close-btn" @click="type = 'none'">×</div>
          <div>右下角可拉伸</div>
        </div>
      </div>
    </div>

    <!-- 组合使用拖拽和拉伸 -->
    <div class="demo-section">
      <h2>组合使用拖拽和拉伸</h2>
      <button
        class="demo-button"
        @click="comboBoxFlag = !comboBoxFlag"
      >
        {{ comboBoxFlag ? '隐藏盒子' : '显示盒子' }}
      </button>
      <div
        v-if="comboBoxFlag"
        v-cube-drag
        v-cube-resizer
        :style="boxStyle"
        class="resizable-box draggable-box"
      >
        <div class="box-content">
          <div class="close-btn" @click="comboBoxFlag = false">×</div>
          <div>可拖拽可拉伸</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResizeDemo',
  data() {
    return {
      // 基础用法
      boxFlag: false,

      // 边界限制
      boundaryBoxFlag: false,

      // 修饰符用法
      type: 'none',
      typeOptions: [
        { value: 'none', label: '隐藏' },
        { value: 'north', label: '头部' },
        { value: 'south', label: '底部' },
        { value: 'west', label: '左侧' },
        { value: 'east', label: '右侧' },
        { value: 'northwest', label: '左上角' },
        { value: 'southwest', label: '左下角' },
        { value: 'northeast', label: '右上角' },
        { value: 'southeast', label: '右下角' }
      ],

      // 组合使用
      comboBoxFlag: false,

      // 样式定义
      boxStyle: {
        position: 'fixed',
        height: '300px',
        width: '300px',
        backgroundColor: 'aqua',
        top: 'calc(50% - 150px)',
        left: 'calc(50% - 150px)',
        zIndex: '9999',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#333',
        minHeight: '100px',
        minWidth: '100px',
        maxHeight: '600px',
        maxWidth: '600px'
      },


      containerStyle: {
        position: 'fixed',
        height: '300px',
        width: '300px',
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
        borderRadius: '4px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#333',
        minHeight: '50px',
        minWidth: '50px',
        maxHeight: '200px',
        maxWidth: '200px'
      },

    }
  },


  methods: {
    // 这里可以添加其他需要的方法
  }
}
</script>

<style scoped>
#resize-demo {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
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
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 20px;
}

.demo-button:hover {
  background-color: #66b1ff;
}

.demo-button.secondary {
  background-color: #909399;
  margin-left: 10px;
}

.demo-button.secondary:hover {
  background-color: #a6a9ad;
}

.demo-tip {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f0f9ff;
  border-left: 4px solid #409EFF;
  border-radius: 4px;
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

.resizable-box {
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

.draggable-box {
  cursor: move;
}
</style>
