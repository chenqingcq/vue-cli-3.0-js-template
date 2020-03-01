<template>
  <div class="container-statistics-visitor">
    <div class="visitor-list">
      <div class="title center">
        <div class="text">
          <span>{{$t('statistics.visitor.recent')}}</span>
        </div>
        <div class="more" @click="watchMore(2,1)">{{$t('statistics.staff.more')}}</div>
      </div>
      <div class="content">
        <template v-if="visitorList.length">
          <li v-for="(item ,index) in visitorList" :key="`${index}-visitor-list`">
            <img
              :src="getAvator(item.picture)"
              @click="handleZoom(item.picture)"
              :title="item.visitorName"
              alt
              class="picturePath"
            />
            <div class="desc">
              <div class="top">
                <img
                  :src="getAvator(item.visitorHeadPath)"
                  :title="item.visitorName"
                  alt
                  class="headPath"
                />
                <div class="info">
                  <div class="name">{{item.visitorName}}</div>
                  <div class="group">{{formateGroup(item.groupName)}}</div>
                </div>
              </div>
              <div class="details">
                <div class="item">
                  <span>{{$t('statistics.staff.accessTime')}}:</span>
                  <span>{{item.time}}</span>
                </div>
                <div class="item">
                  <span>{{$t('statistics.staff.deadLine')}}:</span>
                  <span>{{item.dueTime}}</span>
                </div>
                <div class="item">
                  <span>{{$t('statistics.staff.robot')}}:</span>
                  <span>{{item.robotName}}</span>
                </div>
                <div class="item">
                  <span>{{$t('statistics.staff.type')}}:</span>
                  <span>{{getType(item.type)}}</span>
                </div>
              </div>
            </div>
          </li>
        </template>
        <template v-else>
          <div class="center" style="width:100%">{{$t('common.noData')}}</div>
        </template>
      </div>
    </div>
    <div class="panel">
      <div class="header">
        <div class="title center">{{$t('statistics.visitor.data')}}</div>
        <div class="operation">
          <div class="time">
            <el-date-picker
              v-model="startTime"
              style="width:200px"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :clearable="false"
              :placeholder="$t('excel.export.startTime')"
              @change="queryVisitorRecordStatistics"
            ></el-date-picker>
            <span class="center" style="margin:0px 5px">-</span>
            <el-date-picker
              v-model="endTime"
              :clearable="false"
              style="width:200px"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              :placeholder="$t('excel.export.endTime')"
              @change="queryVisitorRecordStatistics"
            ></el-date-picker>
          </div>
          <div class="groups center" v-if="getAgencyType == 2">
            <el-select
              v-model="groupId"
              filterable
              :placeholder="$t('statistics.staff.selectGroup')"
              style="margin:0px 20px;width:180px;height:28px;border:none"
              @visible-change="queryGroupInfoByType"
              @change="queryVisitorRecordStatistics"
            >
              <el-option
                v-for="item in groupsList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="groups center" v-if="getAgencyType == 3">
            <el-select
              v-model="companyId"
              filterable
              :placeholder="$t('statistics.staff.selectCompany')"
              style="margin:0px 20px;width:180px;height:28px;border:none"
              @visible-change="queryCompanyList"
              @change="queryVisitorRecordStatistics"
            >
              <el-option
                v-for="item in companyList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="export center" @click="report">{{$t('common.export')}}</div>
        </div>
      </div>
      <div class="content">
        <div class="item middle">
          <div class="title center">
            <img :src="accessIcon" alt @click="queryVisitorRecordStatistics" />
            {{$t('statistics.staff.accessCount')}}
          </div>
          <div id="statistics-access"></div>
        </div>
        <div class="item bottom">
          <div class="left">
            <div class="title center">
              <img :src="notebookIcon" alt @click="queryVisitorApplyStatistics" />
              {{$t('statistics.visitor.registerState')}}
            </div>
            <div class="content" id="statistics-register-state"></div>
          </div>
          <div class="right">
            <div class="title center">
              <img :src="originIcon" alt @click="queryVisitorRegisterChannelStatistics" />
              {{$t('statistics.visitor.originSource')}}
            </div>
            <div class="content" id="statistics-register-origin"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from "echarts";
import moment from "moment";
import { mapGetters } from "vuex";

import {
  queryVisitorRecord,
  queryGroupInfoByType,
  reportVisitorRecord
} from "@/api/personnel";

import {
  queryVisitorRecordStatistics,
  queryVisitorApplyStatistics,
  queryVisitorRegisterChannelStatistics
} from "@/api/statistics";

let visitorAccessRecordList = [];
let visitorApplicationSheetDataSource = {};
let visitorApplicationOriginDataSource = {};
let LANG = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-LANGUAGE";

export default {
  name: "statistics-visitor",
  data() {
    let _this = this;
    return {
      backIcon: require("@/assets/svg/arrow-left.svg"),
      accessIcon: require("@/assets/svg/access.svg"),
      notebookIcon: require("@/assets/svg/notebook.svg"),
      originIcon: require("@/assets/svg/origin.svg"),
      recordTotal: 0,
      currentPage: 1,
      companyId: "",
      recordId: "",
      searchName: "",
      startTime: moment(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).format(
        "YYYY-MM-DD 00:00:00"
      ),
      endTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      groupId: "",
      groupsList: [],
      companyList: [],
      visitorList: [],
      statisticsAccessInstance: null,
      statisticsRegInstance: null,
      statisticsOriginInstance: null,
      statisticsRegOptions: null,
      statisticsAccessOptions: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        legend: {
          data: [],
          x: "left"
        },
        color: ["#0080ff", "#4cd5ce"],
        toolbox: {
          feature: {
            // saveAsImage: {}
          }
        },
        grid: {
          x: 10,
          y: 10,
          x2: 20,
          y2: 0,
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisTick: {
              //y轴刻度线
              show: true,
              lineStyle: {
                color: "#298df8",
                type: "solid",
                width: 1,
                height: 1,
                borderRadius: 8,
                shadowColor: "rgba(0, 0, 0, 0.5)",
                shadowBlur: 10
              }
            },
            axisLine: {
              //设置y轴坐标线的样式
              show: true,
              lineStyle: {
                type: "solid",
                // type: "dotted",
                color: "#298df8", //y轴坐标线的颜色
                width: 1 //轴坐标线的宽度
              },
              axisLabel: {
                textStyle: {
                  color: "#fff"
                }
              }
            },
            data: []
          }
        ],
        yAxis: [
          {
            show: true,
            type: "value",
            axisTick: {
              //y轴刻度线
              show: true,
              textStyle: {
                color: "#298df8"
              }
            },
            axisLabel: {
              // formatter: function(value) {
              //   var texts = [];
              //   return texts;
              // },
              textStyle: {
                color: "#298df8"
              }
            },
            axisLine: { show: true } //轴线不显示
          }
        ],
        series: [
          {
            name: "",
            type: "line",
            stack: "",
            smooth: true,
            position: "right",
            itemStyle: {
              normal: {
                //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#81befd" // 0% 处的颜色
                  },
                  {
                    offset: 0.4,
                    color: "#e4f2ff" // 100% 处的颜色
                  },
                  {
                    offset: 1,
                    color: "#fff" // 100% 处的颜色
                  }
                ]), //背景渐变色
                lineStyle: {
                  // 系列级个性化折线样式
                  width: 2,
                  type: "solid",
                  color: "#45A6D9" //折线的颜色
                }
              },
              emphasis: {
                color: "#0180ff",
                lineStyle: {
                  // 系列级个性化折线样式
                  width: 1,
                  type: "dotted",
                  color: "0180ff"
                }
              }
            }, //线条样式
            symbolSize: 0, //折线点的大小
            label: {
              normal: {
                show: false,
                position: "top"
              }
            },
            areaStyle: { normal: {} },
            data: []
          }
        ]
      },
      statisticsOriginOptions: null
    };
  },
  computed: {
    ...mapGetters(["getAgencyType"])
  },
  methods: {
    handleZoom(picture) {
      this.$previewImg({
        src: `${process.env.VUE_APP_BASE_API}${picture}`,
        style: {
          width: 500,
          height: 400,
          objectFit: "contain"
        }
      });
    },
    formateGroup(groupName) {
      return groupName == "默认分组" ? this.$t("common.default") : groupName;
    },
    watchMore(index, subIndex) {
      this.$router.push(`/main/visitor/list?currentIndex=1`, () => {
        this.$ebus.$emit("statistics-jump-to-personnel", index, subIndex);
      });
    },
    getAvator(picture) {
      return `${process.env.VUE_APP_BASE_API}${picture}`;
    },
    getType(type) {
      return Math.random() > 0.5
        ? this.$t("personnel.staff.in")
        : this.$t("personnel.staff.out");
    },
    initEcharts() {
      return new Promise(resolve => {
        if (this.statisticsAccessInstance) {
          this.statisticsAccessInstance.dispose();
          this.statisticsAccessInstance = null;
        }
        if (this.statisticsRegInstance) {
          this.statisticsRegInstance.dispose();
          this.statisticsRegInstance = null;
        }
        if (this.statisticsOriginInstance) {
          this.statisticsOriginInstance.dispose();
          this.statisticsOriginInstance = null;
        }
        let stateDom = document.querySelector("#statistics-state");
        let accessDom = document.querySelector("#statistics-access");
        let regstateDom = document.querySelector("#statistics-register-state");
        let regOriginDom = document.querySelector(
          "#statistics-register-origin"
        );
        if (accessDom) {
          this.statisticsAccessInstance = echarts.init(accessDom);
        }
        if (regstateDom) {
          this.statisticsRegInstance = echarts.init(regstateDom);
        }
        if (regOriginDom) {
          this.statisticsOriginInstance = echarts.init(regOriginDom);
        }
        resolve();
      });
    },
    throttle(delay = 500, callback) {
      //500s之内不用重复刷新
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        callback.call(this, arguments);
      }, delay);
    },
    download(url, fileName) {
      let link = document.createElement("a");
      link.download = fileName;
      link.href = `${process.env.VUE_APP_BASE_API}${url}`;
      link.click();
    },
    async report() {
      try {
        let formData = new FormData();
        let language = window.localStorage.getItem(LANG) || "zh";

        formData.append("searchName", this.searchName);
        formData.append("groupId", this.groupId);
        formData.append("startTime", this.startTime);
        formData.append("recordId", this.recordId);
        formData.append("endTime", this.endTime);
        formData.append("companyId", this.companyId);
        formData.append("language", language);
        const res = await reportVisitorRecord(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1 && res.data) {
          let { url } = res.data;
          url && this.download(url, "visitorAccessRecord-excel");
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async queryVisitorRegisterChannelStatistics() {
      try {
        let formData = new FormData();
        formData.append("companyId", this.companyId);
        formData.append("groupId", this.groupId);
        const res = await queryVisitorRegisterChannelStatistics(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          console.log(res);
          visitorApplicationOriginDataSource = res.data;
          this.drawVisitorApplicationOriginEcharts();
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async queryVisitorApplyStatistics() {
      try {
        let formData = new FormData();
        formData.append("companyId", this.companyId);
        formData.append("groupId", this.groupId);
        const res = await queryVisitorApplyStatistics(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          console.log(res, "/regstate");
          visitorApplicationSheetDataSource = res.data;
          this.drawVisitorApplicationSheetEcharts();
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async queryVisitorRecordStatistics() {
      try {
        let formData = new FormData();
        formData.append("companyId", this.companyId);
        formData.append("groupId", this.groupId);
        formData.append("startTime", this.startTime);
        formData.append("endTime", this.endTime);
        const res = await queryVisitorRecordStatistics(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          console.log(res);
          visitorAccessRecordList = res.data;
          this.drawVisitorRecordEcharts();
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async getRecentRecord(type = "YYYY-MM-DD HH:mm:ss") {
      /**
       * 获取过去一周记录 取前6条
       */
      try {
        let startTime = new Date().getTime() - 7 * 24 * 60 * 60 * 1000;
        let endTime = new Date();
        let formData = new FormData();
        formData.append("companyId", "");
        formData.append("groupId", "");
        formData.append("searchName", "");
        formData.append("startTime", moment(startTime).format(type));
        formData.append("endTime", moment(endTime).format(type));
        formData.append("page", this.currentPage);
        const res = await queryVisitorRecord(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          this.visitorList = res.data.slice(0, 6);
        } else {
          this.$Message.error(this.$t("common.searchError"));
          this.visitorList = [];
        }
      } catch (err) {
        console.log(err);
        this.visitorList = [];
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async queryCompanyList(show) {
      if (!show) return;
      try {
        let formData = new FormData();
        // formData.append("groupType", "");
        const res = await queryGroupInfoByType(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          this.companyList = res.data.map(item => {
            if (item) {
              return {
                value: item.id,
                label: item.name
              };
            }
          });
          this.companyList.unshift({
            value: "",
            label: "statistics.staff.all"
          });
        } else {
          this.$Message.error(this.$t("common.searchError"));
          this.companyList = [];
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async queryGroupInfoByType() {
      try {
        let formData = new FormData();
        formData.append("groupType", "2");
        const res = await queryGroupInfoByType(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          this.groupsList = res.data.map(item => {
            if (item) {
              return {
                value: item.id,
                label: item.name == "默认分组" ? "common.default" : item.name
              };
            }
          });
          this.groupsList.unshift({
            label: "statistics.staff.all",
            value: ""
          });
        } else {
          this.$Message.error(this.$t("common.searchError"));
          this.groupsList = [];
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    setVisitorRecordOption() {
      return new Promise(resolve => {
        let accessTimeArray = visitorAccessRecordList
          .map(i => moment(i.day).format("MM-DD"))
          .reverse();
        let accessDataArray = visitorAccessRecordList
          .map(i => i.count)
          .reverse();
        this.statisticsAccessOptions.xAxis[0].data = accessTimeArray;
        this.statisticsAccessOptions.series[0].data = accessDataArray;
        resolve();
      });
    },
    drawVisitorRecordEcharts() {
      this.setVisitorRecordOption().then(() => {
        if (this.statisticsAccessInstance) {
          this.statisticsAccessInstance.setOption(this.statisticsAccessOptions);
        }
      });
    },
    setVisitorApplicationSheetOption() {
      let _this = this;
      return new Promise(resolve => {
        let {
          approvedNum,
          noApprovedNum,
          rejectedNum
        } = visitorApplicationSheetDataSource;
        let dataSource = [
          {
            name: _this.$t("statistics.visitor.approve"),
            value: approvedNum
          },
          {
            name: _this.$t("statistics.visitor.pedding"),
            value: noApprovedNum
          },
          {
            name: _this.$t("statistics.visitor.reject"),
            value: rejectedNum
          }
        ];
        let labelList = dataSource.map(item => {
          return item.name;
        });
        let randomColor = [];
        for (let i = 0; i < 6; i++) {
          let color = `#${Math.random()
            .toString(16)
            .substr(-6)}`;
          randomColor.push(color);
        }
        this.statisticsRegOptions = {
          tooltip: {
            //提示框，可以在全局也可以在
            trigger: "item", //提示框的样式
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            color: "#000", //提示框的背景色
            textStyle: {
              //提示的字体样式
              color: "black"
            }
          },
          legend: {
            //图例
            orient: "vertical", //图例的布局，竖直    horizontal为水平
            x: "left", //图例显示在右边
            data: [...labelList],
            formatter(name) {
              console.log(name, dataSource);
              let target;
              let total = 0;
              let rate = 0;
              for (let i = 0; i < dataSource.length; i++) {
                total = total + dataSource[i].value;
                if (dataSource[i].name === name) {
                  target = dataSource[i].value;
                }
              }
              if (total > 0) {
                rate = ((target / total) * 100).toFixed(1) + "%";
              } else {
                rate = "0%";
              }
              return `${name}    ${target}  (${rate})`;
            },
            textStyle: {
              //图例文字的样式
              color: "#333", //文字颜色
              fontSize: 12 //文字大小
            }
          },
          grid: {
            x: 0,
            y: 0,
            x2: 0,
            y2: 0,
            containLabel: true
          },
          series: [
            {
              name: "",
              type: "pie", //环形图的type和饼图相同
              // radius: ["50%", "90%"], //饼图的半径，第一个为内半径，第二个为外半径
              radius: ["40px", "80px"], //饼图的半径，第一个为内半径，第二个为外半径
              center: ["75%", "53%"], //设置餠图位置
              avoidLabelOverlap: false,
              color: [...randomColor],
              label: {
                normal: {
                  //正常的样式
                  show: false,
                  position: "left"
                },
                emphasis: {
                  //选中时候的样式
                  show: false,
                  textStyle: {
                    fontSize: "20",
                    fontWeight: "bold"
                  }
                }
              }, //提示文字
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [...dataSource]
            }
          ]
        };
        resolve();
      });
    },
    drawVisitorApplicationSheetEcharts() {
      this.setVisitorApplicationSheetOption().then(() => {
        if (this.statisticsRegInstance) {
          this.statisticsRegInstance.setOption(this.statisticsRegOptions);
        }
      });
    },
    setVisitorApplicationOriginOption() {
      return new Promise(resolve => {
        let _this = this;
        let {
          registerType1,
          registerType2,
          registerType3,
          registerType4,
          registerType5,
          registerType6,
          registerType7,
          registerType8,
          registerType9,
          registerType10
        } = visitorApplicationOriginDataSource;
        let dataSource = [
          {
            name: _this.$t("statistics.visitor.registerType1"),
            value: registerType1
          },
          {
            name: _this.$t("statistics.visitor.registerType2"),
            value: registerType2
          },
          {
            name: _this.$t("statistics.visitor.registerType3"),
            value: registerType3
          },
          {
            name: _this.$t("statistics.visitor.registerType4"),
            value: registerType4
          },
          {
            name: _this.$t("statistics.visitor.registerType5"),
            value: registerType5
          },
          {
            name: _this.$t("statistics.visitor.registerType6"),
            value: registerType6
          },
          {
            name: _this.$t("statistics.visitor.registerType7"),
            value: registerType7
          },
          {
            name: _this.$t("statistics.visitor.registerType8"),
            value: registerType8
          },
          {
            name: _this.$t("statistics.visitor.registerType9"),
            value: registerType9
          }
        ];
        let labelList = dataSource.map(item => {
          return item.name;
        });
        let randomColor = [];
        for (let i = 0; i < 6; i++) {
          let color = `#${Math.random()
            .toString(16)
            .substr(-6)}`;
          randomColor.push(color);
        }
        this.statisticsOriginOptions = {
          tooltip: {
            //提示框，可以在全局也可以在
            trigger: "item", //提示框的样式
            formatter: "{a} <br/>{b}: {c} ({d}%)",
            color: "#000", //提示框的背景色
            textStyle: {
              //提示的字体样式
              color: "black"
            }
          },
          legend: {
            //图例
            orient: "vertical", //图例的布局，竖直    horizontal为水平
            x: "left", //图例显示在右边
            data: [...labelList],
            formatter(name) {
              console.log(name);
              let target;
              let total = 0;
              let rate = 0;
              for (let i = 0; i < dataSource.length; i++) {
                total = total + dataSource[i].value;
                if (dataSource[i].name === name) {
                  target = dataSource[i].value;
                }
              }
              if (total > 0) {
                rate = ((target / total) * 100).toFixed(1) + "%";
              } else {
                rate = "0%";
              }
              return `${name}    ${target}  (${rate})`;
            },
            textStyle: {
              //图例文字的样式
              color: "#333", //文字颜色
              fontSize: 12 //文字大小
            }
          },
          calculable: true,
          grid: {
            // left: "10%",
            // right: "5%",
            // bottom: "0%",
            x: 180,
            y: 60,
            x2: 80,
            y2: 0,
            containLabel: true
          },
          series: [
            {
              name: "",
              type: "pie", //环形图的type和饼图相同
              // radius: ["50%", "90%"], //饼图的半径，第一个为内半径，第二个为外半径
              radius: ["40px", "80px"], //饼图的半径，第一个为内半径，第二个为外半径
              center: ["75%", "53%"], //设置餠图位置
              avoidLabelOverlap: false,
              color: [...randomColor],
              label: {
                normal: {
                  //正常的样式
                  show: false,
                  position: "right"
                },
                emphasis: {
                  //选中时候的样式
                  show: false,
                  textStyle: {
                    fontSize: "20",
                    fontWeight: "bold"
                  }
                }
              }, //提示文字
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: [...dataSource]
            }
          ]
        };
        resolve();
      });
    },
    drawVisitorApplicationOriginEcharts() {
      this.setVisitorApplicationOriginOption().then(() => {
        if (this.statisticsOriginInstance) {
          this.statisticsOriginInstance.setOption(this.statisticsOriginOptions);
        }
      });
    },
    queryVisitorStatistics() {
      this.getRecentRecord();
      this.queryVisitorApplyStatistics();
      this.queryVisitorRecordStatistics();
      this.queryVisitorRegisterChannelStatistics();
    }
  },
  mounted() {
    this.initEcharts().then(this.queryVisitorStatistics);
    this.$ebus.$on("/main/statistics/visitor", () => {
      this.initEcharts().then(this.queryVisitorStatistics);
    });
    this.$ebus.$on("changeLang", () => {
      this.drawVisitorApplicationSheetEcharts();
      this.drawVisitorApplicationOriginEcharts();
    });
    window.addEventListener("resize", () => {
      if (this.$route.path.includes("/main/statistics/visitor")) {
        this.throttle(1000, () => {
          this.initEcharts().then(() => {
            this.drawVisitorRecordEcharts();
            this.drawVisitorApplicationSheetEcharts();
            this.drawVisitorApplicationOriginEcharts();
          });
        });
      }
    });
  },
  beforeDestroy() {
    this.$ebus.$off("/main/statistics/visitor");
    this.$ebus.$off("changeLang");
  }
};
</script>
<style lang="less" scoped>
.title {
  font-size: 16px;
  color: #333;
  height: 48px;
  white-space: nowrap;
  > .text {
    width: auto;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    &:hover {
      cursor: pointer;
    }
  }
}
.container-statistics-visitor {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  > .visitor-list {
    background: #fff;
    height: 200px;
    padding: 0px 20px;
    > .content {
      width: 100%;
      height: 160px;
      display: flex;
      align-items: center;
      overflow: auto;
      li {
        width: 350px;
        height: 100%;
        display: flex;
        align-items: center;
        background: #eaeef4;
        margin-right: 20px;
        padding-left: 10px;
        > img {
          display: inline-block;
          width: 120px;
          height: 90%;
          object-fit: contain;
          &:hover {
            cursor: pointer;
          }
        }
        > .desc {
          display: inline-block;
          width: 230px;
          height: 90%;
          padding-left: 15px;
          color: #666;
          .top {
            display: flex;
            align-items: flex-start;
            img {
              display: inline-block;
              width: 45px;
              height: 45px;
              border-radius: 50%;
              object-fit: cover;
            }
            .info {
              margin-left: 20px;
              > div {
                margin-bottom: 5px;
              }
            }
          }
          .details {
            .item {
              span {
                &:first-of-type {
                  display: inline-block;
                  width: 60px;
                }
                &:last-of-type {
                }
              }
            }
          }
        }
      }
    }
    > .title {
      display: flex;
      height: 48px;
      justify-content: space-between;
      align-items: center;
      .more {
        color: #298df8;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  > .panel {
    margin-top: 20px;
    background: #fff;
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      border-bottom: 1px solid #f0f0f0;
      .title {
        width: 100px;
        margin: 0px 20px;
        justify-content: flex-start;
      }
      .operation {
        width: calc(100% - 100px);
        height: 28px;
        margin: 0px 20px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .time {
          display: flex;
          flex-wrap: nowrap;
        }
        .groups {
        }
        .export {
          width: auto;
          height: 28px;
          padding: 0 20px;
          margin-left: 20px;
          background: #298df8;
          border: 1px solid #ccc;
          color: #fff;
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
    .content {
      height: 100%;
      min-height: 200px;
      padding: 0px 20px;
      > .item {
        height: 250px;
        border-bottom: 1px solid #f0f0f0;
        .title {
          line-height: 48px;
          justify-content: flex-start;
          img {
            margin-right: 10px;
            display: inline-block;
            width: 24px;
            object-fit: contain;
            &:hover {
              cursor: pointer;
            }
          }
        }
        &.middle {
          #statistics-access {
            height: calc(100% - 48px);
          }
        }
        &.bottom {
          display: flex;
          justify-content: space-between;
          border: none;
          overflow-x: hidden;
          overflow-y: auto;
          > div {
            width: 50%;
            height: 100%;
            .content {
              border: 1px solid #f0f0f0;
              height: calc(100% - 48px - 10px);
              width: calc(100% - 40px);
            }
            &.right {
              margin-left: 60px;
            }
          }
        }
      }
    }
  }
}
</style>