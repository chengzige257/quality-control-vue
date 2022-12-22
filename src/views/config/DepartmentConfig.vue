<template>
  <div class="gridContainer">
    <div class="item1">
      <table class="container cannotselect">
        <thead>
        <tr>
          <th><h1>部门名称</h1></th>
          <th><h1>班组长</h1></th>
          <th><h1>检验人员</h1></th>
          <th><h1>原因分析人员</h1></th>
          <th><h1>技术评审人</h1></th>
          <th><h1>纠正人</h1></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in department">
          <td><el-icon @click="deleteDepartment(item)" style="float: left"><DeleteFilled /></el-icon>{{item.name}}<el-icon @click="openModifyDepartment(item)" style="color: #4DC3FA" size="small"><Edit /></el-icon></td>
          <td :class="{click: currentBoxTr === item.id&&currentBoxProp === prop[1]}" @click="clickBox(item,prop[1])">
            {{item.sectionHeadName}}
            <el-icon style="color: #4DC3FA;position: relative;bottom: 3px" @click.stop="removePeople(item,prop[1])" v-show="item.sectionHeadName !== null" size="small">
              <CloseBold />
            </el-icon>
          </td>
          <td :class="{click: currentBoxTr === item.id&&currentBoxProp === prop[2]}" @click="clickBox(item,prop[2])">
            {{item.checkoutPeopleName}}
            <el-icon style="color: #4DC3FA;position: relative;bottom: 3px" @click.stop="removePeople(item,prop[2])" v-show="item.checkoutPeopleName !== null" size="small">
              <CloseBold />
            </el-icon>
          </td>
          <td :class="{click: currentBoxTr === item.id&&currentBoxProp === prop[3]}" @click="clickBox(item,prop[3])">
            {{item.analysePeopleName}}
            <el-icon style="color: #4DC3FA;position: relative;bottom: 3px" @click.stop="removePeople(item,prop[3])" v-show="item.analysePeopleName !== null" size="small">
              <CloseBold />
            </el-icon>
          </td>
          <td :class="{click: currentBoxTr === item.id&&currentBoxProp === prop[4]}" @click="clickBox(item,prop[4])">
            {{item.judgePeopleName}}
            <el-icon style="color: #4DC3FA;position: relative;bottom: 3px" @click.stop="removePeople(item,prop[4])" v-show="item.judgePeopleName !== null" size="small">
              <CloseBold />
            </el-icon>
          </td>
          <td :class="{click: currentBoxTr === item.id&&currentBoxProp === prop[5]}" @click="clickBox(item,prop[5])">
            {{item.correctionPeopleName}}
            <el-icon style="color: #4DC3FA;position: relative;bottom: 3px" @click.stop="removePeople(item,prop[5])" v-show="item.correctionPeopleName !== null" size="small">
              <CloseBold />
            </el-icon>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="el-table-classify">
      <button class="custom-btn btn-8" @click="newDepartmentDialogVisible = true"><span style="height: 100%">新建部门</span></button>
      <el-table  :v-loading="loading" :data="filterData" stripe height="300px">
        <el-table-column prop="name" label="姓名"/>
        <el-table-column prop="account" label="账号"/>
        <el-table-column prop="mail" label="邮箱"/>
        <el-table-column align="right">
          <template #header>
            <div style="display: flex;">
              <el-input v-model="this.search" size="small" placeholder="search" />
            </div>
          </template>
          <template #default="scope">
            <el-button
                size="small"
                type="danger"
                @click="changePeople(scope.row)"
            >替换</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog @close="closeModifyDepartment" v-model="modifyDepartmentVisible" width="30%" center>
    <el-input v-model="modifyDepartment.name"></el-input>
  </el-dialog>
  <el-dialog @close="newDepartmentName=''" v-model="newDepartmentDialogVisible" width="30%" center>
    <el-input placeholder="please input new department name" v-model="newDepartmentName"></el-input>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="newDepartmentDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addDepartment">
          添加
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import axios from "axios";
export default {
  name: "DepartmentConfig",
  mounted() {
    this.initDepartment()
  },
  methods: {
    deleteDepartment(item){
      axios.delete("/api/department",{
        params: {
          departmentId: item.id
        }
      }).then(response=>{
        if(response.data.flag) {
          this.department = this.department.filter(depart=>depart.id!==item.id)
        }
      })
    },
    addDepartment(){
      axios.post('/api/department',null,{
        params: {
          departmentName: this.newDepartmentName
        }
      }).then(response=>{
        if(response.data.flag) {
          this.initDepartment()
          this.newDepartmentDialogVisible = false
        }
      })
    },
    removePeople(item,prop) {
      item[prop] = null
      let peopleIdProp = this.getPeopleIdProp(prop)
      item[peopleIdProp] = null
      this.update(item)
    },
    changePeople(newPeople) {
      let selectDepartment
      this.department.forEach(depart=>{
        if(depart.id === this.currentBoxTr) {
          selectDepartment =depart
        }
      })
      let selectProp = this.getPeopleIdProp(this.currentBoxProp)
      selectDepartment[selectProp] = newPeople.id
      selectDepartment[this.currentBoxProp] = newPeople.name
      this.update(selectDepartment)
    },
    closeModifyDepartment() {
      axios.put('/api/department',this.modifyDepartment).then(response=>{
        if(response.data.flag) {
          this.modifyDepartmentVisible = false
        }else{
          this.modifyDepartmentVisible = true
        }
      })
    },
    openModifyDepartment(item) {
      this.modifyDepartment = item
      this.modifyDepartmentVisible = true
    },
    update(item) {
      axios.put('/api/department',item).then(response=>{
        if(response.data.flag) {

        }
      })
    },
    initDepartment() {
      axios.get('/api/department').then(response=>{
        if(response.data.flag) {
          this.department = response.data.data.reverse()
        }
      })
    },
    clickBox(item,prop){
      this.currentBoxTr = item.id
      this.currentBoxProp = prop
    },
    getPeopleIdProp(prop) {
      return prop.substr(0,prop.length-4)
    }
  },
  computed: {
    filterData() {
      return this.classifyUser.filter(
          (user) =>
              !this.search ||
              user.name.toLowerCase().includes(this.search.toLowerCase()) || user.mail.toLowerCase().includes(this.search.toLowerCase()) || user.account.toLowerCase().includes(this.search.toLowerCase())
      )
    },
  },
  watch: {
    currentBoxProp: {
      handler(newVal, oldVal) {
        this.loading = true
        axios.get('/api/user/classify/role',{
          params: {
            prop: newVal
          }
        }).then(response=>{
          if(response.data.flag) {
            this.classifyUser = response.data.data
            this.search = ''
            this.loading = false
          }
        })
      },
    }
  },
  data: function() {
    return {
      newDepartmentDialogVisible: false,
      newDepartmentName: '',
      loading: false,
      search: '',
      classifyUser: [],
      prop: ['name','sectionHeadName','checkoutPeopleName','analysePeopleName','judgePeopleName','correctionPeopleName'],
      currentBoxTr: -1,
      currentBoxProp: null,
      department: [],
      modifyDepartment: null,
      modifyDepartmentVisible: false
    }
  }
}
</script>

<style scoped>

@import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,700);

.custom-btn {
  text-align: center;
  margin: 20px;
  width: 130px;
  height: 40px;
  color: #f5f5f5;
  border-radius: 5px;
  padding: 10px 25px;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  box-shadow:inset 2px 2px 2px 0px rgba(255,255,255,.5),
  7px 7px 20px 0px rgba(0,0,0,.1),
  4px 4px 5px 0px rgba(0,0,0,.1);
  outline: none;
}
.btn-8 {
  background-color: #f0ecfc;
  background-image: linear-gradient(315deg, #f0ecfc 0%, #c797eb 74%);
  line-height: 42px;
  padding: 0;
  border: none;
}
.btn-8 span {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}
.btn-8:before,
.btn-8:after {
  position: absolute;
  content: "";
  right: 0;
  bottom: 0;
  background: #c797eb;
  /*box-shadow:  4px 4px 6px 0 rgba(255,255,255,.5),
              -4px -4px 6px 0 rgba(116, 125, 136, .2),
    inset -4px -4px 6px 0 rgba(255,255,255,.5),
    inset 4px 4px 6px 0 rgba(116, 125, 136, .3);*/
  transition: all 0.3s ease;
}
.btn-8:before{
  height: 0%;
  width: 2px;
}
.btn-8:after {
  width: 0%;
  height: 2px;
}
.btn-8:hover:before {
  height: 100%;
}
.btn-8:hover:after {
  width: 100%;
}
.btn-8:hover{
  background: transparent;
}
.btn-8 span:hover{
  color: #c797eb;
}
.btn-8 span:before,
.btn-8 span:after {
  position: absolute;
  content: "";
  left: 0;
  top: 0;
  background: #c797eb;
  transition: all 0.3s ease;
}
.btn-8 span:before {
  width: 2px;
  height: 0%;
}
.btn-8 span:after {
  height: 2px;
  width: 0%;
}
.btn-8 span:hover:before {
  height: 100%;
}
.btn-8 span:hover:after {
  width: 100%;
}


h1 {

  font-size:3em;
  font-weight: 300;
  line-height:1em;
  text-align: center;
  color: #4DC3FA;
}

.container th h1 {
  font-weight: bold;
  font-size: 0.9em;
  text-align: center;
}

.container td {
  font-weight: normal;
  font-size: 0.9em;
  -webkit-box-shadow: 0 2px 2px -2px #0E1119;
  -moz-box-shadow: 0 2px 2px -2px #0E1119;
  box-shadow: 0 2px 2px -2px #0E1119;
}
.gridContainer {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 0px 0px;
  grid-template-areas:
    "."
    ".";
}
.item1{
  overflow: scroll;
}
.container {
  height: 100%;
  text-align: center;
  width: 100%;
  margin: 0 auto;
  display: table;
}
.el-table-classify {

}

.container td, .container th {
  padding-bottom: 0.5%;
  padding-top: 0.5%;
  padding-left: 0.5%;
}

.container tr:nth-child(odd) {
  background-color: #323C50;
}

.container tr:nth-child(even) {
  background-color: #2C3446;
}

.container th {
  background-color: #1F2739;
}
.container td { color: rgb(221, 2, 255); }
.container td:first-child { color: #FB667A; }


.container tr:hover {
  background-color: #464A52;
  -webkit-box-shadow: 0 6px 6px -6px #0E1119;
  -moz-box-shadow: 0 6px 6px -6px #0E1119;
  box-shadow: 0 6px 6px -6px #0E1119;
}

.click {
  background-color: #FFF842;
  color: #403E10;
  font-weight: bold;

  box-shadow: #7F7C21 -1px 1px, #7F7C21 2px 2px, #7F7C21 -3px 3px, #7F7C21 -4px 4px, #7F7C21 -5px 5px, #7F7C21 -6px 6px;
  transform: translate3d(6px, -6px, 0);

  transition-delay: 0s;
  transition-duration: 0.2s;
  transition-property: all;
  transition-timing-function: linear;
}

@media (max-width: 800px) {
  .container td:nth-child(4),
  .container th:nth-child(4) { display: none; }
}
</style>