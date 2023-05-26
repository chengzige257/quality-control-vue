<template>
  <el-form @keyup.enter="initList" size="small" style="display: flex;justify-content: space-around">
    <el-form-item label="产品名:">
      <el-input v-model="condition.productName"/>
    </el-form-item>
    <el-form-item label="状态:">
      <el-select size="small" style="width: 250px" fit-input-width v-model="condition.statusId" clearable placeholder="Select">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="部门:">
      <el-input v-model="condition.departmentName"/>
    </el-form-item>
    <el-form-item label="日期:">
      <el-date-picker
          v-model="condition.checkoutDate"
          type="date"
          size="small"
      />
    </el-form-item>
    <el-button type="primary" size="small" @click="initList">筛选</el-button>
    <el-button type="primary" size="small" @click="">重置</el-button>
<!--    <el-button type="primary" size="small" @click="" :loading="isDownloading">-->
<!--      <template v-if="isDownloading">-->
<!--        导出中-->
<!--      </template>-->
<!--      <template v-else>-->
<!--        导出数据<el-icon class="el-icon&#45;&#45;right"><Download /></el-icon>-->
<!--      </template>-->
<!--    </el-button>-->
  </el-form>
  <n-data-table
      v-loading="loadingData"
      :striped="true"
      :columns="columns"
      :data="list"
      :bordered="false"
      :row-props="rowProps"
  />
  <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="x"
      :y="y"
      :options="rightClickOptions"
      :show="showDropdown"
      :on-clickoutside="onClickOutside"
      @select="handleSelect"
  />
  <div v-show="this.total!==0" style="margin-top: 10px">
    <el-pagination
        style="float: right"
        v-model:current-page="this.current"
        v-model:page-size="this.size"
        :page-sizes="[10, 20, 50, 100]"
        :small=false
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
        @size-change="initList"
        @current-change="initList"
    />
  </div>
</template>

<script>
import axios from "axios";
import {h, nextTick} from "vue";
import {NGradientText, NTag} from "naive-ui";
import {NNumberAnimation} from "naive-ui/es/number-animation";

export default {
  name: "BelowStandard",

  data(){
    return{
      currentRow: null,
      x: 0,
      y: 0,
      showDropdown: false,
      rightClickOptions: [
        {
          label: () => h("span", { style: { color: "blue" },onClick: (e)=>{this.$router.push('/product/'+this.currentRow.id)}}, "详情"),
          key: "edit",
        },
        {
          label: () => h("span", { style: { color: "red" },onClick: (e)=>{console.log(this.currentRow)}}, "删除"),
          key: "delete"
        }
      ],
      options: [
        {
          value: '',
          label: '全部'
        },
        {
          value: 1,
          label: '原因分析'
        },
        {
          value: 2,
          label: '选择处置方案'
        },
        {
          value: 12,
          label: '签名'
        },
        {
          value: 3,
          label: '审批处置方案'
        },
        {
          value: 4,
          label: '实施处置方案'
        },
        {
          value: 8,
          label: '提交纠正措施报告'
        },
        {
          value: 9,
          label: '审批异常措施报告'
        },
        {
          value: 10,
          label: '提交纠正措施报告(无需审批)'
        },
        {
          value: 11,
          label: '改善确认'
        },
        {
          value: 5,
          label: '结束'
        }
      ],
      loadingData: false,
      columns: [
        {
          minWidth: '100px',
          key: 'id',
          align: "center",
          title (column) {
            return h(
                NGradientText,
                {
                  size: '16',
                  type: 'success',
                  style: {'font-weight': 1000}
                },
                { default: () => '单号' }
            )
          }
        },
        {
          title (column) {
            return h(
                NGradientText,
                {
                  size: '16',
                  type: 'success',
                  style: {'font-weight': 1000}
                },
                { default: () => '产品名' }
            )
          },
          key: 'productName',
          align: "center"
        },
        {
          title (column) {
            return h(
                NGradientText,
                {
                  size: '16',
                  type: 'success',
                  style: {'font-weight': 1000}
                },
                { default: () => '型号' }
            )
          },
          key: 'specificationsModels',
          align: "center"
        },
        {
          align: "center",
          title (column) {
            return h(
                NGradientText,
                {
                  size: '16',
                  type: 'success',
                  style: {'font-weight': 1000}
                },
                { default: () => '数量' }
            )
          },
          key: 'belowStandardCount',
          render(row) {
            return h(
                NNumberAnimation,
                {
                  active: true,
                  from: 0,
                  to: row.belowStandardCount
                },
            );
          }
        },
        {
          align: "center",
          title (column) {
            return h(
                NGradientText,
                {
                  size: '16',
                  type: 'success',
                  style: {'font-weight': 1000}
                },
                { default: () => '部门' }
            )
          },
          key: 'departmentName'
        },
        {
          align: "center",
          title (column) {
            return h(
                NGradientText,
                {
                  size: '16',
                  type: 'success',
                  style: {'font-weight': 1000}
                },
                { default: () => '校验人员' }
            )
          },
          key: 'checkoutPeople'
        },
        {
          align: "center",
          title (column) {
            return h(
                NGradientText,
                {
                  size: '16',
                  type: 'success',
                  style: {'font-weight': 1000}
                },
                { default: () => '校验日期' }
            )
          },
          key: 'checkoutDate'
        },
        {
          align: "center",
          title (column) {
            return h(
                NGradientText,
                {
                  size: '16',
                  type: 'success',
                  style: {'font-weight': 1000}
                },
                { default: () => '描述' }
            )
          },
          key: 'belowStandardDesc',
          ellipsis: {
            tooltip: true,
          },
        },
        {
          align: "center",
          title (column) {
            return h(
                NGradientText,
                {
                  size: '16',
                  type: 'success',
                  style: {'font-weight': 1000}
                },
                { default: () => '分析人员' }
            )
          },
          key: 'analysePeople'
        },
        {
          align: "center",
          title (column) {
            return h(
                NGradientText,
                {
                  size: '16',
                  type: 'success',
                  style: {'font-weight': 1000}
                },
                { default: () => '状态' }
            )
          },
          key: 'statusName',
          render(row) {
            return h(
                NTag,
                {
                  style: {
                    marginRight: "6px"
                  },
                  size: "small",
                  type: "info",
                  bordered: false
                },
                {
                  default: () => row.statusName
                }
            );
          }
        },
      ],
      total: 0,
      current: 1,
      size: 10,
      isDownloading: false,
      list: [],
      condition: {
        departmentName: "",
        productName: '',
        statusId: '',
        checkoutDate: null
      },
      rowProps: (row) => {
        return {
          onContextmenu: (e) => {
            this.currentRow = row
            e.preventDefault();
            this.showDropdown = false;
            nextTick().then(() => {
              this.showDropdown = true;
              this.x = e.clientX;
              this.y = e.clientY;
            });
          }
        };
      }
    }
  },
  methods:{
    handleSelect(){
      this.showDropdown = false;
    },
    onClickOutside() {
      this.showDropdown = false;
    },
    initList(){
      this.loadingData = true
      if(this.condition.checkoutDate!==null) {
        this.condition.checkoutDate = this.$global.dateFormat('YYYY-mm-dd',new Date(this.condition.checkoutDate))
      }
      axios.post('/api/admin/belowStandard',this.condition,{
        params: {
          current: this.current,
          size: this.size
        }
      }).then(response=>{
        if(response.data.flag){
          this.loadingData = false
          this.list = response.data.data.recordList
          this.total = response.data.data.count
        }
      })
    }
  },
  mounted() {
    this.initList()
  }
}
</script>

<style scoped>

</style>