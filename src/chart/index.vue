<template>
  <div class="c-broken-chart">
    <div class="c-broken-chart-core" :style="{ width: width, height: height }">
      <div class="c-broken-chart-mask" @click="handleClk" @touchstart="handleClk"></div>
      <div
        v-if="tipsInfo.show && false"
        class="c-broken-chart-tips tips-animation"
        :class="{
          'tips-reverse': tipsInfo.reverse,
        }"
        :style="{
          top: tipsInfo.y + 'px',
          left: tipsInfo.x + 'px',
          transform: transformTips,
        }"
      >
        <div class="tooltip-header">
          {{ xAxisData[tipsInfo.xIndex] }}
        </div>
        <div class="tooltip-item first">
          <div class="name">车辆行情价</div>
          <div class="value">{{ showYAxis[tipsInfo.xIndex] }}{{ unit }}</div>
        </div>
        <div class="tooltip-item">
          <div class="name">厂商指导价</div>
          <div class="value">{{ yAxisData2[tipsInfo.xIndex] }}{{ unit }}</div>
        </div>
      </div>
      <svg
        v-if="yLineArr.length"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        class="svg-box"
      >
        <g class="svg-core">
          <line
            :x1="activeLineInfo.x1"
            :y1="activeLineInfo.y1"
            :x2="activeLineInfo.x2"
            :y2="activeLineInfo.y2"
            stroke-dasharray="3 3"
            stroke="rgba(0, 212, 212, 0.5)"
          >
            <animate attributeName="opacity" from="0" to="1" dur="2s" begin="0s" fill="freeze" />
            <animate attributeName="y2" from="0" :to="activeLineInfo.y2" dur="1s" begin="0s" fill="freeze" />
          </line>
          <line
            v-for="(item, index) in yLineArr"
            :key="index"
            :x1="index === yLineArr.length - 1 ? -1 : 0"
            :y1="item"
            :x2="index === yLineArr.length - 1 ? boxWidth + 1 : boxWidth"
            :y2="item"
            :stroke-dasharray="index === yLineArr.length - 1 ? '10 0' : '5 5'"
            stroke="rgba(171, 179, 188, 0.2)"
            :stroke-width="1"
          />
          <polygon class="polygon-animation" fill="#00EBE2" :fill-opacity="0.07" :points="svgP" />
          <path
            class="path-animation"
            :d="svgD1"
            width="10"
            fill="none"
            stroke="#E9EDF2"
            style="stroke-width: 2px"
          ></path>
          <path
            class="path-animation"
            :d="svgD"
            width="10"
            fill="none"
            stroke="rgba(0, 235, 226, 1)"
            style="stroke-width: 2px"
          ></path>
        </g>
      </svg>
      <template v-if="activeLineInfo.y2">
        <div
          class="circle-item"
          :style="{
            left: xBesselArr[xIndex] + 'px',
            top: yBesselArr[xIndex] + 'px',
          }"
        ></div>
        <div
          class="circle-item circle-grey"
          :style="{
            left: xBesselArr2[xIndex] + 'px',
            top: yBesselArr2[xIndex] + 'px',
          }"
        ></div>
      </template>
      <div v-if="svgD" class="c-broken-chart-x">
        <div
          v-for="(item, index) in showXAxis"
          :key="index"
          class="c-broken-chart-x-item"
          :style="{
            left: xBesselArr[index] + 'px',
            transform: item.transformStyle,
          }"
        >
          <!-- 只展示月份 -->
          <div v-if="item.value" class="c-broken-chart-x-item-core">
            {{ item.value }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getApp, createSelectorQuery } from '../utils/miniprogram-api'

export default {
  data() {
    return {
      isWeek: false,
      yWidth: '',
      xIndex: '',
      lineWidth: 0,
      boxWidth: 0,
      boxHeight: 0,
      yDiff: 0,
      xAxisData: [],
      yAxisData: [],
      yAxisArr: [],
      diffNum: 0, // 最大值和最小值的差值
      maxNum: 0, // 最大值
      minNum: 0, // 最小值
      svgD: '',
      svgP: '', // 多边形的坐标 集合
      shimNum: 100,
      yLineArr: [],
      xBesselArr: [],
      yBesselArr: [],
      yAxisGapRatio: 0,
      // tooltip信息
      tipsInfo: {
        show: false,
        x: '',
        y: '',
        xIndex: 0,
        reverse: false,
        reverseY: false,
      },
      activeLineInfo: {
        x1: '',
        y1: '',
        x2: '',
        y2: '',
      },
      sysInfo: getApp().globalData.sysInfo,
      yAxisData2: [],
      svgD1: '',
      xBesselArr2: [],
      yBesselArr2: [],
      showXAxis: [],
      chartMinNum: 0,
      chartMaxNum: 0,
    }
  },
  props: {
    width: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '',
    },
    // x 轴数据
    xAxis: {
      type: Array,
      default: () => [],
    },
    // y轴数据
    yAxis: {
      type: Array,
      default: () => [],
    },
    // y轴在tootip展示的数据
    showYAxis: {
      type: Array,
      default: () => [],
    },
    yAxis2: {
      type: Array,
      default: () => [],
    },
    unit: {
      type: String,
      default: '',
    },
  },
  computed: {
    transformTips() {
      const X = this.tipsInfo.reverse ? '-100%' : '0'
      const Y = this.tipsInfo.reverseY ? '-100%' : '0'
      return `translate(${X}, ${Y})`
    },
    isSingleData() {
      return this.xAxisData.length === 1
    },
  },
  watch: {
    xAxis: {
      handler(newValue, oldValue) {
        if (newValue && newValue.length) {
          this.main()
        }
      },
      immediate: true,
    },
  },
  mounted() {
    // 确保在组件挂载后初始化数据（如果 watch 没有触发）
    this.$nextTick(() => {
      if (this.xAxis && this.xAxis.length && !this.svgD) {
        this.main()
      }
    })
  },
  methods: {
    main() {
      this.initData()
      this.xAxisData = this.xAxis
      this.yAxisData = this.yAxis
      this.yAxisData2 = this.yAxis2
      this.renderInfo()
    },
    initData() {
      this.svgD = ''
      this.svgP = ''
      this.xIndex = ''
      this.yLineArr = []
      this.xBesselArr = []
      this.yBesselArr = []
      this.tipsInfo = {
        show: false,
        x: '',
        y: '',
        xIndex: 0,
        reverse: false,
        reverseY: false,
      }
      this.activeLineInfo = {
        x1: '',
        y1: '',
        x2: '',
        y2: '',
      }
    },
    renderInfo() {
      this.minNum = Math.min(Math.min(...this.yAxisData), Math.min(...this.yAxisData2))
      this.maxNum = Math.max(Math.max(...this.yAxisData), Math.max(...this.yAxisData2))
      this.diffNum = this.maxNum - this.minNum
      this.chartMinNum = this.minNum - this.diffNum * 0.4
      this.chartMaxNum = this.maxNum
      this.getBoxInfo().then((info) => {
        const { width, height } = info // 根据 容器的宽 高 将坐标转化为 贝塞尔曲线
        this.boxWidth = width
        this.boxHeight = height

        const { yLineArr, yAxisArr, yAxisGapRatio } = this.getLineInfo(info)
        this.yAxisArr = yAxisArr
        this.yLineArr = yLineArr
        this.yAxisGapRatio = yAxisGapRatio
        this.getBesselInfo(info, yAxisGapRatio)
        this.calcShowAxis()
        this.getActiveInfo(this.isSingleData ? 1 : this.yAxisData.length - 1)
      })
    },
    // 只展示月份
    calcShowAxis() {
      if (this.xAxisData && this.xAxisData.length) {
        this.showXAxis = []
        if (this.isSingleData) {
          const dateStr = this.xAxisData[0]
          const arr = dateStr.slice(2).split('-')
          arr[1] = arr[1].startsWith('0') ? arr[1].substr(1) : arr[1]

          this.showXAxis.push(
            {
              value: '',
              transformStyle: 'translateX(0)',
            },
            {
              value: arr.join('/'),
              transformStyle: 'translateX(-100%)',
            },
          )
        } else {
          let space = 0
          let labelSpace = 0
          const totalDataPoints = this.xAxisData.length
          const maxLabels = 6

          // 动态计算 labelSpace 和 space
          if (totalDataPoints < maxLabels) {
            labelSpace = 1
            space = 0
          } else {
            labelSpace = Math.ceil(totalDataPoints / maxLabels)
            space = Math.floor(labelSpace / 2)
          }

          this.showXAxis = this.xAxisData.map((dateStr, index) => {
            if (index % labelSpace === space) {
              const arr = dateStr.slice(2).split('-')
              arr[1] = arr[1].startsWith('0') ? arr[1].substr(1) : arr[1]
              return {
                value: arr.join('/'),
                transformStyle:
                  totalDataPoints >= maxLabels
                    ? 'translateX(-50%)'
                    : !index
                    ? 'translateX(0)'
                    : `translateX(${index === this.xAxisData.length - 1 ? -100 : -50}%)`,
              }
            }
            return {
              value: '',
              transformStyle: 'translateX(-50%)',
            }
          })

          if (this.showXAxis[this.showXAxis.length - 1].value) {
            space > 1 &&
              this.showXAxis.forEach((item) => {
                item.transformStyle = 'translateX(-80%)'
              })
            space === 1 && (this.showXAxis[this.showXAxis.length - 1].value = '')
          }
        }
      }
    },
    // 获取选中信息
    getActiveInfo(xIndex) {
      if (this.isSingleData && !xIndex) {
        return
      }
      this.xIndex = xIndex
      this.activeLineInfo.y1 = 0
      this.activeLineInfo.y2 = this.boxHeight
      this.activeLineInfo.x1 = this.xBesselArr[xIndex]
      this.activeLineInfo.x2 = this.xBesselArr[xIndex]
      this.dealWithTipsInfo(xIndex)
    },
    dealWithTipsInfo(xIndex) {
      // 计算tips 的x轴坐标
      const isHighX = xIndex >= this.xBesselArr.length / 2
      this.tipsInfo.reverse = isHighX
      this.tipsInfo.x = this.xBesselArr[xIndex] + (isHighX ? -11 : 11)

      // 计算tips 的Y轴坐标
      const midY = (this.yAxisArr[3] + this.yAxisArr[2]) / 2
      const isHighY = this.yBesselArr[xIndex] < midY
      this.tipsInfo.reverseY = isHighY
      this.tipsInfo.y = this.yBesselArr[xIndex] + (isHighY ? 56 : -50)

      this.tipsInfo.show = true
      this.tipsInfo.xIndex = this.isSingleData ? 0 : xIndex
    },
    handleClk(e) {
      // 处理点击事件，兼容小程序和web
      let clientX = 0
      if (e.detail && e.detail.x !== undefined) {
        // 小程序环境
        clientX = e.detail.x
      } else if (e.clientX !== undefined) {
        // web环境
        clientX = e.clientX
      } else if (e.touches && e.touches[0]) {
        // 触摸事件
        clientX = e.touches[0].clientX
      }

      if (!clientX || this.xBesselArr.length === 0) {
        return
      }

      createSelectorQuery()
        .select('.c-broken-chart-mask')
        .boundingClientRect((rect) => {
          if (!rect || !rect.width) {
            return
          }
          const boxRectX = rect.left // 容器的x轴坐标
          const rRectX = clientX // 点击点的x轴坐标
          const rX = rRectX - boxRectX // 点击点相对于容器的坐标
          let xIndex = 0
          const xGap = this.xBesselArr.length > 1 ? (this.xBesselArr[1] - this.xBesselArr[0]) / 2 : 20
          while (xIndex < this.xBesselArr.length) {
            if (rX - xGap < this.xBesselArr[xIndex] && rX + xGap > this.xBesselArr[xIndex]) {
              this.getActiveInfo(xIndex)
              break
            } else {
              xIndex++
            }
          }
        })
        .exec()
    },
    getLineInfo(info) {
      const { height } = info //  根据容器宽 高 画出来虚线
      const gapNum = 5 // 把容器水平分成6等份
      const yLineArr = []
      const yAxisArr = []
      const yGap = height / gapNum // 每一份的高度
      this.yGap = yGap

      let chartGapNum = (this.chartMaxNum - this.chartMinNum) / gapNum
      let yAxisGapRatio = (this.chartMaxNum - this.chartMinNum) / this.diffNum

      let gapNumIndex = 0
      while (gapNumIndex <= gapNum) {
        yLineArr.push(yGap * gapNumIndex) // 水平虚线根据这个数组画
        yAxisArr.push(this.chartMinNum + chartGapNum * gapNumIndex)
        gapNumIndex++
      }
      yAxisArr.reverse()
      return {
        yLineArr,
        yAxisArr,
        yAxisGapRatio,
      }
    },
    //  将坐标转化为贝塞尔曲线
    getBesselInfo(info) {
      const { width, height } = info // 根据 容器的宽 高 将坐标转化为 贝塞尔曲线
      const xDiff = width / (this.xAxisData.length - 1)
      this.yDiff = height / this.yAxisData.length
      this.svgD = ''
      this.svgP = ''
      this.xBesselArr = []
      this.yBesselArr = []
      const curvatureFactor = 0.8
      // 双线一
      // 处理只有一个数据点的情况
      if (this.isSingleData) {
        const diff = this.chartMaxNum - this.chartMinNum
        let yD = height - ((this.yAxisData[0] - this.chartMinNum) / diff) * height
        yD = isNaN(yD) ? height / 2 : yD // 如果diff为0，确保yD位于中间位置

        this.xBesselArr.push(0, width - 6)
        this.yBesselArr.push(yD, yD)

        this.svgD = `M 0 ${yD} L ${width - 6} ${yD}`
        this.svgP = `0,${yD} ${width - 6},${yD} ${width - 6},${height} 0,${height} 0,${yD}`
      } else {
        // 双线一
        this.yAxisData.forEach((item, index) => {
          let xD = index * xDiff
          const diff = this.chartMaxNum - this.chartMinNum
          const yD = !diff ? 0 : height - ((item - this.chartMinNum) / diff) * height

          !index && (xD = 6)
          index === this.yAxisData.length - 1 && (xD = xD - 6)

          this.xBesselArr.push(xD)
          this.yBesselArr.push(yD)
          if (index === 0) {
            this.svgD += 'M' + ' ' + xD + ' ' + yD
          } else {
            const prevX = this.xBesselArr[index - 1]
            const prevY = this.yBesselArr[index - 1]
            const cp1X = prevX + (xD - prevX) * curvatureFactor
            const cp1Y = prevY
            const cp2X = xD - (xD - prevX) * curvatureFactor
            const cp2Y = yD

            this.svgD += ` C${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${xD} ${yD}`
          }
          this.svgP += xD + ',' + yD + ' '
        })
        this.svgP += this.xBesselArr[this.xBesselArr.length - 1] + ',' + height + ' '
        this.svgP += this.xBesselArr[0] + ',' + height + ' '
        this.svgP += this.xBesselArr[0] + ',' + this.yBesselArr[0]
      }
      // 双线二
      this.xBesselArr2 = []
      this.yBesselArr2 = []
      this.svgD1 = ''

      // 处理只有一个数据点的情况
      if (this.isSingleData) {
        const diff = this.chartMaxNum - this.chartMinNum
        let yD = height - ((this.yAxisData2[0] - this.chartMinNum) / diff) * height
        yD = isNaN(yD) ? height / 2 : yD // 如果diff为0，确保yD位于中间位置

        this.xBesselArr2.push(0, width - 6)
        this.yBesselArr2.push(yD, yD)

        this.svgD1 = `M 0 ${yD} L ${width - 6} ${yD}`
      } else {
        this.yAxisData2.forEach((item, index) => {
          let xD = index * xDiff
          const diff = this.chartMaxNum - this.chartMinNum
          const yD = !diff ? 0 : height - ((item - this.chartMinNum) / diff) * height

          !index && (xD = 6)
          index === this.yAxisData2.length - 1 && (xD = xD - 6)

          this.xBesselArr2.push(xD)
          this.yBesselArr2.push(yD)
          if (index === 0) {
            this.svgD1 += 'M' + ' ' + xD + ' ' + yD
          } else {
            const prevX = this.xBesselArr2[index - 1]
            const prevY = this.yBesselArr2[index - 1]
            const cp1X = prevX + (xD - prevX) * curvatureFactor
            const cp1Y = prevY
            const cp2X = xD - (xD - prevX) * curvatureFactor
            const cp2Y = yD

            this.svgD1 += ` C${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${xD} ${yD}`
          }
        })
      }
    },
    getBoxInfo() {
      return new Promise((resolve, reject) => {
        createSelectorQuery()
          .select('.c-broken-chart-core')
          .boundingClientRect((rect) => {
            resolve({
              width: rect.width,
              height: rect.height,
            })
          })
          .exec()
      })
    },
  },
}
</script>
<style lang="less" scoped>
.c-broken-chart {
  margin-bottom: 33px;
  width: 100%;
  padding: 20px 3px 0;
  box-sizing: border-box;
  display: flex;

  .tips-reverse {
    transform: translate(-100%);
  }

  .c-broken-chart-tips {
    z-index: 1;
    position: absolute;
    color: #232a34;
    font-family: PingFang SC;
    font-weight: 400;
    white-space: nowrap;
    font-size: 12px;
    line-height: 16px;
    padding: 10px 2.1739vw;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.98);
    border: 1px solid rgba(255, 255, 255, 1);
    box-shadow: 0px -1px 10px 0px rgba(35, 93, 101, 0.05), 0px 4px 6px 0px rgba(35, 93, 101, 0.06);

    .tooltip-header {
      font-family: PingFang SC;
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;
      color: #4e535e;
    }

    .tooltip-item {
      display: flex;
      align-items: center;
      font-family: PingFang SC;
      font-size: 12px;
      font-weight: 400;
      line-height: 1;
      color: #1d2129;

      .name {
        margin: 0 1.9324vw 0 1.4493vw;
      }

      .value {
        font-family: BAIDU-NUMBER;
        font-weight: 400;
      }
    }

    .tooltip-item.first {
      margin: 8px 0 10px;

      .value {
        color: #ff4556;
        font-weight: 500;
      }
    }

    .tooltip-item::before {
      display: block;
      content: '';
      width: 1.4493vw;
      height: 1.4493vw;
      border-radius: 50%;
      background-color: #dce4eb;
    }

    .tooltip-item.first::before {
      background-color: #00ebe2;
    }
  }

  .svg-box {
    overflow: visible;
  }

  .svg-core {
    transform-origin: center;
  }

  .c-broken-chart-core {
    flex: 1;
    height: 90%;
    position: relative;
  }

  .c-broken-chart-mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
  }

  .c-broken-chart-y {
    height: 100%;
    top: 0;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #848e99;
    display: flex;
    padding-right: 10px;
    flex-direction: column;
    transform-origin: center;

    &-core {
      width: 35px;
      position: relative;
    }

    &-item {
      width: 100%;
      text-align: right;
      position: absolute;
      margin-top: -10px;
    }
  }

  .c-broken-chart-x {
    width: 100%;
    font-family: PingFang SC;
    font-size: 2.8986vw;
    line-height: 3.8647vw;
    color: #848e99;
    display: flex;
    padding-top: 6px;
    position: relative;

    &-item {
      position: absolute;
      text-align: center;
      white-space: nowrap;
      transform: translateX(-40%);

      &-core {
        line-height: 1;
        display: inline-block;
        align-items: center;
      }
    }
  }
}

.path-animation {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: dash 2.5s linear forwards;
}

.polygon-animation {
  clip-path: inset(0 0 100% 0);
  animation: fill 0.5s linear forwards;
  animation-delay: 1s;
}

.circle-item {
  width: 3.1401vw;
  height: 3.1401vw;
  box-sizing: border-box;
  background-color: #00ebe2;
  border: 0.7246vw solid #fff;
  border-radius: 50%;
  position: absolute;
  z-index: 10;
  transform: translate(-50%, -50%);
  box-shadow: 0 3px 3px rgba(50, 50, 71, 0.06), 0 3px 3px rgba(50, 50, 71, 0.06);
  opacity: 0;
  animation: opacity-animation 0.5s linear forwards;
  animation-delay: 1s;
}

.circle-grey {
  background-color: #e9edf2;
  z-index: 9;
}

.tips-animation {
  opacity: 0;
  animation: opacity-animation 0.5s linear forwards;
  animation-delay: 1.5s;
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fill {
  to {
    clip-path: inset(0 0 0 0);
  }
}

@keyframes opacity-animation {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
