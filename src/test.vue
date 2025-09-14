Resizer 拉伸指令
该指令只适用于使用绝对定位或固定定位独立的弹窗盒子，可以与v-cube-drag指令配合使用

基础用法

<template>
  <div>
    <cube-button
      plain
      type="primary"
      @click="boxFlag = !boxFlag"
      >{{ boxFlag? '隐藏盒子': '显示盒子'}}</cube-button
    >
    <div v-show="boxFlag"  v-cube-resizer :style="boxStyle"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      boxFlag: false,
      boxStyle: {
        position: 'fixed',
        height: '300px',
        width: '300px',
        backgroundColor: 'aqua',
        left: 'calc(50% - 150px)',
        top: 'calc(50% - 150px)',
        zIndex: '9999'
      }
    }
  }
}
</script>


限定移动的边界
可以使用inside修饰符把拉伸范围限定在祖先标签内,该祖先为top或left所相对的标签

<template>
  <div>
    <cube-button plain type="primary" @click="boxFlag = !boxFlag">
      {{ boxFlag ? '隐藏盒子' : '显示盒子' }}
    </cube-button>
    <div v-show="boxFlag" :style="containerStyle">
      <div  v-cube-resizer.inside :style="boxStyle"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      boxFlag: false,
      containerStyle: {
        position: 'fixed',
        height: '300px',
        width: '300px',
        top: 'calc(50% - 150px)',
        left: 'calc(50% - 150px)',
        zIndex: '9999',
        backgroundColor: 'white',
        border: '1px solid #409EFF',
        zIndex: '999'
      },
      boxStyle: {
        position: 'absolute',
        height: '100px',
        width: '100px',
        backgroundColor: 'aqua'
      }
    }
  }
}
</script>


拉伸位置配置

拉伸位置配置
可以将指令的绑定值设置为css选择器来指定可拉伸的部位


隐藏
头部
底部
左侧
右侧
左上角
左下角
右上角
右下角

<template>
  <div>
    <cube-radio-group v-model="type" size="mini" class="mb-30">
    <cube-radio-button label="none">隐藏</cube-radio-button>
    <cube-radio-button label="north">头部</cube-radio-button>
    <cube-radio-button label="south">底部</cube-radio-button>
    <cube-radio-button label="west">左侧</cube-radio-button>
    <cube-radio-button label="east">右侧</cube-radio-button>
    <cube-radio-button label="northwest">左上角</cube-radio-button>
    <cube-radio-button label="southwest">左下角</cube-radio-button>
    <cube-radio-button label="northeast">右上角</cube-radio-button>
    <cube-radio-button label="southeast">右下角</cube-radio-button>
  </cube-radio-group>
    <div v-if="type === 'north'" key="1" v-cube-resizer.north="60" :style="boxStyle">头部拉伸</div>
    <div v-if="type === 'south'" key="2" v-cube-resizer.south="60" :style="boxStyle">底部拉伸</div>
    <div v-if="type === 'west'" key="3" v-cube-resizer.west="60" :style="boxStyle">左侧拉伸</div>
    <div v-if="type === 'east'" key="4" v-cube-resizer.east="60" :style="boxStyle">右侧拉伸</div>
    <div v-if="type === 'northwest'" key="5" v-cube-resizer.northwest="60" :style="boxStyle">左上角可拉伸</div>
    <div v-if="type === 'southwest'" key="6" v-cube-resizer.southwest="60" :style="boxStyle">左下角可拉伸</div>
     <div v-if="type === 'northeast'" key="7" v-cube-resizer.northeast="60" :style="boxStyle">右上角可拉伸</div>
    <div  v-if="type === 'southeast'" key="8" v-cube-resizer.southeast="60" :style="boxStyle">右下角可拉伸</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      type: 'none',
      boxStyle: {
        position: 'fixed',
        height: '300px',
        width: '300px',
        backgroundColor: 'aqua',
        top: 'calc(50% - 150px)',
        left: 'calc(50% - 150px)',
        zIndex: '999'
      }
    }
  }
}
</script>


Modifiers
名称	说明
inside	设置inside后只能在定位的组件内拉伸，无法超出边界
north	允许头部拉伸，可与其他修饰符合用
south	允许底部拉伸，可与其他修饰符合用
west	允许左侧拉伸，可与其他修饰符合用
east	允许右侧拉伸，可与其他修饰符合用
northwest	允许左上角可拉伸，可与其他修饰符合用
southwest	允许左下角可拉伸，可与其他修饰符合用
northeast	允许右上角可拉伸，可与其他修饰符合用
southeast	允许右下角可拉伸，可与其他修饰符合用