<template>
  <div style="height: 100%;width: 100%">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="月趋势" name="first">
        <el-date-picker
            style="width: 350px;"
            @change="changeDate"
            value-format="YYYY-M"
            v-model="monthRange"
            type="monthrange"
            range-separator="To"
            start-placeholder="Start month"
            end-placeholder="End month"
        />
        <div style="width: 100%;height: 700px" id="monthTrend"></div>
      </el-tab-pane>
      <el-tab-pane label="部门完成量" name="second">
        <div style="width: 100%">
          <el-date-picker
              @change="monthChange"
              value-format="YYYY-MM"
              style="width: 120px;"
              v-model="month"
              type="month"
          />
          <div v-show="departmentPerformanceShow" style="width: 1500px;height: 700px;" id="departmentPerformance"></div>
          <el-empty v-show="!departmentPerformanceShow" description="当月无任务" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="校验人员活跃榜" name="third">
        <div style="width: 1500px;height: 700px;" id="checkout"></div>
      </el-tab-pane>
      <el-tab-pane label="原因分析人员活跃榜" name="fourth">
        <div style="width: 1500px;height: 700px;" id="reason"></div>
      </el-tab-pane>
      <el-tab-pane label="技术评审人活跃榜" name="fifth">
        <div style="width: 1500px;height: 700px;" id="judge"></div>
      </el-tab-pane>
      <el-tab-pane label="评论区活跃度" name="sixth">
        <div style="width: 1500px;height: 350px;" id="belowStandard"></div>
        <div style="width: 1500px;height: 350px;" id="user"></div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "DailyStatistics",
  created() {
    let dateArray = this.getDate(6)
    this.monthRange.push(dateArray[5])
    this.monthRange.push(dateArray[0])
    this.month = this.$global.dateFormat('YYYY-mm',new Date())
  },
  mounted() {
    this.initMonthTrend()
    this.initDepartmentPerformance()
    this.initCheckout()
    this.initReason()
    this.initJudge()
    this.initMostActive()
    this.initActiveUser()
  },
  data(){
    return{
      departmentPerformanceShow: true,
      month: '',
      monthRange: [],
      activeName: 'first'
    }
  },
  methods:{
    initMostActive(){
      axios.get('/api/active/belowStandard').then(response=>{
        if(response.data.flag) {
          var chartDom = document.getElementById('belowStandard');
          var myChart = this.$echarts.init(chartDom);
          var option;
          let x = []
          let y = []
          response.data.data.forEach(item=>{
            x.push(item.name)
            y.push(item.value)
          })
          option = {
            title: {
              text: '前5个评论最激烈的流程'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {},
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: x,
            },
            series: [
              {
                name: '评论数',
                type: 'bar',
                data: y,
                color: [
                  'rgba(19,107,23,0.63)',
                ]
              }
            ]
          };

          option && myChart.setOption(option);
        }
      })
    },
    initActiveUser(){
      axios.get('/api/active/user').then(response=>{
        if(response.data.flag) {
          var chartDom = document.getElementById('user');
          var myChart = this.$echarts.init(chartDom);
          var option;
          let x = []
          let y = []
          response.data.data.forEach(item=>{
            x.push(item.name)
            y.push(item.value)
          })
          option = {
            title: {
              text: '发言最频繁的5人'
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {},
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: x,
            },
            series: [
              {
                name: '发言次数',
                type: 'bar',
                data: y,
                color: [
                  'rgba(30,42,72,0.84)',
                ]
              }
            ]
          };

          option && myChart.setOption(option);
        }
      })
    },
    monthChange(month){
      this.month = month
      this.initDepartmentPerformance()
    },
    handleClick(item){
      // console.log(item)
    },
    initDepartmentPerformance(){
      if(this.month===null||this.month.length<1)
        return
      axios.get("/api/department/performance",{
        params: {
          date: this.month
        }
      }).then(response=>{
        if(response.data.flag) {
          var chartDom = document.getElementById('departmentPerformance');
          var myChart = this.$echarts.init(chartDom);
          var option;
          option = {
            title: {
              text: '当月各部门处理任务扇形统计图',
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                type: 'pie',
                radius: '50%',
                data: response.data.data,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          };
          option && myChart.setOption(option);
          if(response.data.data.length === 0){
            this.departmentPerformanceShow = false
          }else{
            this.departmentPerformanceShow = true
          }
        }
      })
    },
    initMonthTrend(){
      axios.get('/api/month/belowStandard',{
        params: {
          begin: this.monthRange[0],
          end: this.monthRange[1]
        }
      }).then(response=>{
        if(response.data.flag) {
          let x = []
          let y = []
          response.data.data.forEach(item=>{
            x.push(item.name)
            y.push(item.value)
          })
          var chartDom = document.getElementById('monthTrend');
          var myChart = this.$echarts.init(chartDom);
          var option;
          option = {
            tooltip: {
              trigger: 'item',
              formatter: '{c}'
            },
            xAxis: {
              type: 'category',
              data: x,
              name: "月份"
            },
            title: {
                left: 'center',
                text: '每月产生不合格品数量趋势图'
            },
            yAxis: {
              type: 'value',
              name: "数量"
            },
            series: [
              {
                data: y,
                type: 'line',
              }
            ]
          };

          option && myChart.setOption(option);
        }
      })
    },
    changeDate(date){
      this.initMonthTrend()
    },
    getDate(count) {     //这是我自定义的方法,哪里需要直接调用就可以
      let date = new Date()
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let newYear = 0
      let newMonth = 0
      let newDateArr = []
      for (let i = 0; i < count; i++) {         //这里是获取前六个月,所以循环6次,根据需要修改
        if (month - i < 1) {            //这里的判断是如果当前月份往前推到了去年  需要做的处理
          newYear = year - 1
          newMonth = month - i + 12 >= 10 ? month - i + 12 : '0' + (month - i + 12)
          newDateArr.push(newYear + '-' + newMonth)      //这里拼接格式化,在时间中间加了个-,根据实际需求来
        } else {
          newMonth = month - i >= 10 ? month - i : '0' + (month - i)   //这里是对月份小于10做加前面加0处理
          newDateArr.push(year + '-' + newMonth)
        }
      }
      return newDateArr    //这里就最后得到当前年月前六个月组成的时间数组,根据需要赋值使用即可
    },
    initCheckout(){
      axios.get('/api/performance/checkout').then(response=>{
        if(response.data.flag) {
          var chartDom = document.getElementById('checkout');
          var myChart = this.$echarts.init(chartDom);
          var option;
          let x = []
          let y = []
          response.data.data.forEach(item=>{
            x.push(item.name)
            y.push(item.value)
          })
          option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {},
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: x,
            },
            series: [
              {
                name: '任务处理量',
                type: 'bar',
                data: y,
                color: [
                  '#73b9bc',
                  '#dd6b66',
                  '#759aa0',
                  '#e69d87',
                  '#8dc1a9',
                  '#ea7e53',
                  '#eedd78',
                  '#73a373',

                  '#7289ab',
                  '#91ca8c',
                  '#f49f42'
                ]
              }
            ]
          };

          option && myChart.setOption(option);
        }
      })
    },
    initReason(){
      axios.get('/api/performance/reason').then(response=>{
        if(response.data.flag) {
          var chartDom = document.getElementById('reason');
          var myChart = this.$echarts.init(chartDom);
          var option;
          let x = []
          let y = []
          response.data.data.forEach(item=>{
            x.push(item.name)
            y.push(item.value)
          })
          option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {},
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: x,
            },
            series: [
              {
                name: '任务处理量',
                type: 'bar',
                data: y,
                color: [
                  '#7289ab',
                ]
              }
            ]
          };

          option && myChart.setOption(option);
        }
      })
    },
    initJudge(){
      axios.get('/api/performance/judge').then(response=>{
        if(response.data.flag) {
          var chartDom = document.getElementById('judge');
          var myChart = this.$echarts.init(chartDom);
          var option;
          let x = []
          let y = []
          response.data.data.forEach(item=>{
            x.push(item.name)
            y.push(item.value)
          })
          option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {},
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01]
            },
            yAxis: {
              type: 'category',
              data: x,
            },
            series: [
              {
                name: '任务处理量',
                type: 'bar',
                data: y,
                color: [
                  '#13386b',
                ]
              }
            ]
          };

          option && myChart.setOption(option);
        }
      })
    }
  }
}
</script>

<style scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>