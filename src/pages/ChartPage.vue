<template>
  <div class="chart-page">
    <div class="header">
      <h1>图表展示页面</h1>
      <router-link to="/" class="back-btn">返回首页</router-link>
    </div>
    <div class="chart-container">
      <Chart
        :width="chartWidth"
        :height="chartHeight"
        :x-axis="xAxisData"
        :y-axis="yAxisData"
        :y-axis2="yAxisData2"
        :show-y-axis="showYAxisData"
        :unit="unit"
      />
    </div>
  </div>
</template>

<script>
import Chart from '../chart/index.vue'

export default {
  name: 'ChartPage',
  components: {
    Chart
  },
  data() {
    return {
      chartWidth: '100%',
      chartHeight: '400px',
      unit: '万元',
      // 初始化X轴数据（日期）
      xAxisData: [
        '2024-01',
        '2024-02',
        '2024-03',
        '2024-04',
        '2024-05',
        '2024-06',
        '2024-07',
        '2024-08',
        '2024-09',
        '2024-10',
        '2024-11',
        '2024-12'
      ],
      // Y轴数据（车辆行情价）
      yAxisData: [
        15.8,
        16.2,
        15.9,
        16.5,
        16.8,
        17.2,
        17.0,
        17.5,
        17.8,
        18.2,
        18.0,
        18.5
      ],
      // Y轴数据2（厂商指导价）
      yAxisData2: [
        18.0,
        18.0,
        18.0,
        18.0,
        18.0,
        18.0,
        18.0,
        18.0,
        18.0,
        18.0,
        18.0,
        18.0
      ],
      // 在tooltip中显示的Y轴数据
      showYAxisData: [
        15.8,
        16.2,
        15.9,
        16.5,
        16.8,
        17.2,
        17.0,
        17.5,
        17.8,
        18.2,
        18.0,
        18.5
      ]
    }
  },
  mounted() {
    // 可以在这里异步加载数据
    // this.loadChartData()
  },
  methods: {
    // 示例：异步加载数据的方法
    async loadChartData() {
      // 模拟API调用
      // const response = await fetch('/api/chart-data')
      // const data = await response.json()
      // this.xAxisData = data.xAxis
      // this.yAxisData = data.yAxis
      // this.yAxisData2 = data.yAxis2
      // this.showYAxisData = data.showYAxis
    }
  }
}
</script>

<style lang="less" scoped>
.chart-page {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
  box-sizing: border-box;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h1 {
    margin: 0;
    font-size: 24px;
    color: #333;
  }

  .back-btn {
    padding: 8px 16px;
    background-color: #409EFF;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #66b1ff;
    }
  }
}

.chart-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>

