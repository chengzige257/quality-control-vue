<template>
  <n-collapse>
    <n-collapse-item title="不合格品基本信息" name="1">
      <div>
        <n-grid :x-gap="12" :y-gap="20" :cols="4">
          <n-grid-item>
            <n-text class="myLabel" type="success">单号：</n-text>{{detail.belowStandard.id}}
          </n-grid-item>
          <n-grid-item>
            <n-text class="myLabel" type="success">所属部门：</n-text>{{detail.belowStandard.departmentName}}
          </n-grid-item>
          <n-grid-item>
            <n-text class="myLabel" type="success">校验人员：</n-text>{{detail.belowStandard.checkoutPeople}}
          </n-grid-item>
          <n-grid-item>
            <n-text class="myLabel" type="success">校验日期：</n-text>{{detail.belowStandard.checkoutDate}}
          </n-grid-item>
          <n-grid-item>
            <n-text class="myLabel" type="success">产品名称：</n-text>{{detail.belowStandard.productName}}
          </n-grid-item>
          <n-grid-item>
            <n-text class="myLabel" type="success">规格型号：</n-text>{{detail.belowStandard.specificationsModels}}
          </n-grid-item>
          <n-grid-item>
            <n-text class="myLabel" type="success">零件编号：</n-text>{{detail.belowStandard.partNumber}}
          </n-grid-item>
          <n-grid-item>
            <n-text class="myLabel" type="success">产品数量：</n-text>{{detail.belowStandard.belowStandardCount}}
          </n-grid-item>
          <n-grid-item>
            <n-text class="myLabel" type="success">工单号：</n-text>{{detail.belowStandard.jobNumber}}
          </n-grid-item>
          <n-grid-item>
            <n-text class="myLabel" type="success">图号：</n-text>{{detail.belowStandard.chartNumber}}
          </n-grid-item>
          <n-grid-item>
          </n-grid-item>
          <n-grid-item>
          </n-grid-item>
          <n-grid-item>
            <n-text class="myLabel" type="success">工序名：</n-text>{{detail.belowStandard.processName}}
          </n-grid-item>
          <n-grid-item>
            <n-text class="myLabel" type="success">工序负责人：</n-text>{{detail.belowStandard.processPeople}}
          </n-grid-item>
          <n-grid-item>
            <n-text class="myLabel" type="success">加工日期：</n-text>{{detail.belowStandard.processDate}}
          </n-grid-item>
          <n-grid-item>

          </n-grid-item>


          <n-grid-item>
            <n-text class="myLabel" type="success">指定原因分析人员：</n-text>{{detail.belowStandard.analysePeople}}
          </n-grid-item>
        </n-grid>
        <n-grid style="margin-top: 20px" :cols="1">
          <n-grid-item>
            <n-text class="myLabel" type="success">内容描述：</n-text>{{detail.belowStandard.belowStandardDesc}}
          </n-grid-item>
        </n-grid>
        <n-grid style="margin-top: 20px" :cols="1">
          <n-grid-item>
            <n-text class="myLabel" type="success">验收规范：</n-text>{{detail.belowStandard.standardsAcceptance}}
          </n-grid-item>
        </n-grid>
      </div>

    </n-collapse-item>

    <n-collapse-item v-show="detail.reason!==null" title="原因分析" name="2">
      <div>
        <n-grid :x-gap="12" :y-gap="20" :cols="3">
          <n-grid-item>
            <n-text class="myLabel" type="success">分析人：</n-text>{{detail.belowStandard.analysePeople}}
          </n-grid-item>
          <n-grid-item>
            <n-text class="myLabel" type="success">分析时间：</n-text>{{detail.reason.analyseTime}}
          </n-grid-item>
          <n-grid-item>
            <n-text class="myLabel" type="success">指定技术评审人：</n-text>{{detail.reason.judgePeople}}
          </n-grid-item>
        </n-grid>
        <n-grid style="margin-top: 20px" :x-gap="12" :y-gap="20" :cols="1">
          <n-grid-item>
            <n-text class="myLabel" type="success">原因描述：</n-text>{{detail.reason.reasonDesc}}
          </n-grid-item>
        </n-grid>
        <n-grid style="margin-top: 20px" :x-gap="12" :y-gap="20" :cols="1">
          <n-grid-item>
            <n-text class="myLabel" type="success">佐证图片：</n-text>
            <div class="demo-image__lazy">
              <el-image @click="previewIndex = index" :initial-index="previewIndex"
                        fit="cover" :zoom-rate="1.2" :preview-src-list="detail.reason.analysePictures" v-for="(url,index) in detail.reason.analysePictures" :key="url" :src="url" lazy />
            </div>
          </n-grid-item>
        </n-grid>
      </div>
    </n-collapse-item>

    <n-collapse-item v-show="detail.disposalMethod!==null" title="处置方案" name="3">
      <div>
        <n-grid :x-gap="12" :y-gap="20" :cols="3">
          <n-grid-item>
            <n-text class="myLabel" type="success">所选处置方案：</n-text>{{detail.disposalMethod.disposalMethodName}}
          </n-grid-item>
          <n-grid-item>
            <n-text class="myLabel" type="success">指定纠正人：</n-text>{{detail.disposalMethod.correctionPeople}}
          </n-grid-item>
          <n-grid-item style="font-size: 25px">
            <n-text style="font-size: 14px" class="myLabel" type="success">损失金额：</n-text><n-number-animation style=": 1000px" :show-separator="true" :from="0" :to="detail.disposalMethod.damageMoney" />
          </n-grid-item>
        </n-grid>
        <n-grid style="margin-top: 20px" :x-gap="12" :y-gap="20" :cols="1">
          <n-grid-item>
            <n-text class="myLabel" type="success">处置方案描述：</n-text>{{detail.disposalMethod.disposalMethodDesc}}
          </n-grid-item>
        </n-grid>

        <n-grid style="margin-top: 20px" :x-gap="12" :y-gap="20" :cols="1">
          <n-grid-item>
            <n-text class="myLabel" type="success">处置工序：</n-text>
          </n-grid-item>
          <template v-if="detail.disposalMethod.disposalProcesses !== null">
            <n-grid-item v-for="(item,index) in detail.disposalMethod.disposalProcesses">
              <div style="display: flex;justify-content: space-around">
                <span><n-text type="info">工序 {{index}}：</n-text>{{item.processName}}</span>
                <span><n-text type="info">负责人 {{index}}：</n-text>{{item.chargePeople}}</span>
                <span><n-text type="info">持续时间 {{index}}：</n-text>{{item.duration}}</span>
                <span><n-text type="info">工序要求 {{index}}：</n-text>{{item.processRequired}}</span>
              </div>
            </n-grid-item>
          </template>
          <template v-else>
            <n-grid-item>
              <div style="display: flex;justify-content: center">
                <span>无处置工序</span>
              </div>
            </n-grid-item>
          </template>
        </n-grid>

        <n-grid style="margin-top: 20px" :x-gap="12" :y-gap="20" :cols="1">
          <n-grid-item>
            <n-text class="myLabel" type="success">管理者签名：</n-text>
          </n-grid-item>
        </n-grid>

        <n-grid style="margin-top: 20px" :x-gap="12" :y-gap="20" :cols="4">
          <n-grid-item>
              <span class="demo-image__preview">
                <n-text type="info">{{detail.disposalMethod.technicalApprover}}：</n-text>
                  <el-image
                      style="width: 200px; height: 100px"
                      :src="detail.disposalMethod.technicalApproverSignature"
                      :zoom-rate="1.2"
                      :preview-src-list="[detail.disposalMethod.technicalApproverSignature]"
                      :initial-index="1"
                      fit="cover"
                  />
              </span>
          </n-grid-item>
          <n-grid-item>
              <span class="demo-image__preview">
                <n-text type="info">{{detail.disposalMethod.projectManager}}：</n-text>
                  <el-image
                      style="width: 200px; height: 100px"
                      :src="detail.disposalMethod.projectManagerSignature"
                      :zoom-rate="1.2"
                      :preview-src-list="[detail.disposalMethod.projectManagerSignature]"
                      :initial-index="1"
                      fit="cover"
                  />
              </span>
          </n-grid-item>
          <n-grid-item>
              <span class="demo-image__preview">
                <n-text type="info">{{detail.disposalMethod.qualityInspector}}：</n-text>
                  <el-image
                      style="width: 200px; height: 100px"
                      :src="detail.disposalMethod.qualityInspectorSignature"
                      :zoom-rate="1.2"
                      :preview-src-list="[detail.disposalMethod.qualityInspectorSignature]"
                      :initial-index="1"
                      fit="cover"
                  />
              </span>
          </n-grid-item>
          <n-grid-item>
              <span class="demo-image__preview">
                <n-text type="info">{{detail.disposalMethod.productionCenterLeader}}：</n-text>
                  <el-image
                      style="width: 200px; height: 100px"
                      :src="detail.disposalMethod.productionCenterLeaderSignature"
                      :zoom-rate="1.2"
                      :preview-src-list="[detail.disposalMethod.productionCenterLeaderSignature]"
                      :initial-index="1"
                      fit="cover"
                  />
              </span>
          </n-grid-item>
        </n-grid>

      </div>
    </n-collapse-item>

    <n-collapse-item v-show="detail.exceptionPhenomena!==null" name="4">
      <template #header>
        <n-text style="font-weight: 1000" type="error">
          异常
        </n-text>
      </template>
      <n-grid :x-gap="12" :y-gap="20" :cols="1">
        <n-grid-item>
          <n-text class="myLabel" type="success">异常现象描述：</n-text>{{detail.exceptionPhenomena.phenomenaDesc}}
        </n-grid-item>
      </n-grid>
      <n-grid style="margin-top: 20px" :x-gap="12" :y-gap="20" :cols="1">
        <n-grid-item>
          <n-text class="myLabel" type="success">原因：</n-text>{{detail.exceptionPhenomena.reason}}
        </n-grid-item>
      </n-grid>
      <n-grid style="margin-top: 20px" :x-gap="12" :y-gap="20" :cols="1">
        <n-grid-item>
          <n-text class="myLabel" type="success">改善要求：</n-text>{{detail.exceptionPhenomena.improveRequirement}}
        </n-grid-item>
      </n-grid>
      <n-grid style="margin-top: 20px" :x-gap="12" :y-gap="20" :cols="1">
        <n-grid-item>
          <n-text class="myLabel" type="success">填写日期：</n-text>{{detail.exceptionPhenomena.fillingDate}}
        </n-grid-item>
      </n-grid>
    </n-collapse-item>

    <n-collapse-item v-show="detail.exceptionPhenomena!==null&&detail.exceptionPhenomena.sheduledFinishDate!==null" name="5">
      <template #header>
        <n-text style="font-weight: 1000">
          纠正措施报告
        </n-text>
      </template>
      <n-grid :x-gap="12" :y-gap="20" :cols="1">
        <n-grid-item>
          <n-text class="myLabel" type="success">预计完成时间：</n-text>{{detail.exceptionPhenomena.scheduledFinishDate}}
        </n-grid-item>
      </n-grid>
      <n-grid style="margin-top: 20px" :x-gap="12" :y-gap="20" :cols="10">
        <n-grid-item>
          <n-text class="myLabel" type="success">纠正措施报告：</n-text>
        </n-grid-item>
        <n-grid-item :span="9">
          <div  v-for="(item,index) in detail.exceptionPhenomena.preventiveMeasuresReports">
            <a :href="item.reportSrc" target="_blank">{{item.reportName}}</a>
          </div>
        </n-grid-item>
      </n-grid>
    </n-collapse-item>

    <n-collapse-item v-show="detail.exceptionPhenomena!==null&&detail.exceptionPhenomena.improveConfirmOpinion!==null" name="6">
      <template #header>
        <n-text style="font-weight: 1000">
          改善意见
        </n-text>
      </template>
      <n-grid :x-gap="12" :y-gap="20" :cols="1">
        <n-grid-item>
          <n-text class="myLabel" type="success">改善确认意见：</n-text>{{detail.exceptionPhenomena.improveConfirmOpinion}}
        </n-grid-item>
      </n-grid>
      <n-grid :x-gap="12" :y-gap="20" :cols="1">
        <n-grid-item>
          <n-text class="myLabel" type="success">改善确认附件：</n-text><a :href="detail.exceptionPhenomena.improveConfirmAttachment" target="_blank">{{detail.exceptionPhenomena.attachmentName}}</a>
        </n-grid-item>
      </n-grid>
    </n-collapse-item>
  </n-collapse>
</template>

<script>
import axios from "axios";

export default {
  name: "BelowStandardDetail",
  data(){
    return{
      previewIndex: 0,
      detail: {
        belowStandard: {},
        reason: {},
        disposalMethod: {},
        exceptionPhenomena: {},
        isCollect: true,
        collectCount: 0
      }
    }
  },
  methods: {
    initBelowStandardDetail(){
      axios.get('/api/belowStandard/detail/'+this.$route.params.id).then(response=>{
        if(response.data.flag){
          this.detail = response.data.data
        }
      })
    }
  },
  mounted() {
    this.initBelowStandardDetail()
  }
}
</script>

<style scoped>
.myLabel{
  font-weight: 1000;
}
.demo-image__lazy {
  height: 400px;
  overflow-y: auto;
}
.demo-image__lazy .el-image {
  display: block;
  min-height: 200px;
  margin-bottom: 10px;
}
.demo-image__lazy .el-image:last-child {
  margin-bottom: 0;
}
</style>