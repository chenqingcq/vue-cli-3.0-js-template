<template>
  <div class="container-statistics-stranger">
    <div class="visitor-list">
      <div class="title center">
        <div class="text">
          <span>{{$t('statistics.stranger.recent')}}</span>
        </div>
        <div class="more" @click="watchMore(2,2)">{{$t('statistics.staff.more')}}</div>
      </div>
      <div class="content">
        <template v-if="strangerList.length">
          <li v-for="(item ,index) in strangerList" :key="`${index}-visitor-list`">
            <img
              :src="getAvator(item.picture)"
              @click="handleZoom(item.picture)"
              :title="item.visitorName"
              alt
              class="picturePath"
            />
            <div class="desc">
              <div class="details">
                <div class="item">
                  <span>{{$t('statistics.staff.accessTime')}}:</span>
                  <span>{{item.time}}</span>
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
              @change="queryStrangerRecordStatistics"
            ></el-date-picker>
            <span class="center" style="margin:0px 5px">-</span>
            <el-date-picker
              v-model="endTime"
              :clearable="false"
              style="width:200px"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              :placeholder="$t('excel.export.endTime')"
              @change="queryStrangerRecordStatistics"
            ></el-date-picker>
          </div>
          <div class="groups center" v-if="getAgencyType == 3">
            <el-select
              v-model="companyId"
              filterable
              :placeholder="$t('statistics.staff.selectCompany')"
              style="margin:0px 20px;width:180px;height:28px;border:none"
              @visible-change="queryCompanyList"
            >
              <el-option
                v-for="item in companyList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
                @click.native="handleSelectChange"
              ></el-option>
            </el-select>
          </div>
          <div class="export center" v-if="false" @click="report">{{$t('common.export')}}</div>
        </div>
      </div>
      <div class="content">
        <div class="item middle">
          <div class="title center">
            <img :src="accessIcon" alt @click="queryStrangerRecordStatistics" />
            {{$t('statistics.staff.accessCount')}}
          </div>
          <div id="statistics-access"></div>
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
  queryStrangerRecord,
  reportStrangerRecord,
  queryGroupInfoByType
} from "@/api/personnel";
import { queryStrangerRecordStatistics } from "@/api/statistics";
const LANG = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-LANGUAGE";

export default {
  name: "statistics-stranger",
  data() {
    return {
      backIcon: require("@/assets/svg/arrow-left.svg"),
      accessIcon: require("@/assets/svg/access.svg"),
      notebookIcon: require("@/assets/svg/notebook.svg"),
      originIcon: require("@/assets/svg/origin.svg"),
      recordTotal: 0,
      currentPage: 1,
      groupId: "",
      recordId: "",
      searchName: "",
      companyId: "",
      startTime: moment(new Date().getTime() - 30 * 24 * 60 * 60 * 1000).format(
        "YYYY-MM-DD 00:00:00"
      ),
      endTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      groupsList: [],
      companyList: [],
      strangerList: [],
      statisticsStateInstance: null,
      statisticsAccessRecord: [],
      statisticsAccessInstance: null,
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
          x: 20,
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
              //设置x轴坐标线的样式
              show: true,
              lineStyle: {
                type: "solid",
                // type: "dotted",
                color: "#298df8", //x轴坐标线的颜色
                width: 1 //轴坐标线的宽度
              },
              axisLabel: {
                textStyle: {
                  color: "#298df8"
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
            stack: "总量",
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
      }
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
      this.$router.push(`/main/stranger/list?currentIndex=1`, () => {
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
        let accessDom = document.querySelector("#statistics-access");
        if (accessDom) {
          this.statisticsAccessInstance = echarts.init(accessDom);
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
    setOptions(data) {
      return new Promise(resolve => {
        let accessTimeArray = this.statisticsAccessRecord
          .map(i => moment(i.day).format("MM-DD"))
          .reverse();
        let accessDataArray = this.statisticsAccessRecord
          .map(i => i.count)
          .reverse();
        this.statisticsAccessOptions.xAxis[0].data = accessTimeArray;
        this.statisticsAccessOptions.series[0].data = accessDataArray;
        resolve();
      });
    },
    drawEcharts() {
      this.initEcharts()
        .then(() => {
          return this.setOptions();
        })
        .then(() => {
          if (this.statisticsAccessInstance) {
            this.statisticsAccessInstance.setOption(
              this.statisticsAccessOptions
            );
          }
        });
    },
    handleSelectChange(show) {
      if (!show) return;
      this.queryStrangerRecordStatistics();
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

        const res = await reportStrangerRecord(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1 && res.data) {
          let { url } = res.data;
          url && this.download(url, "strangerAccessRecord-excel");
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async queryStrangerRecordStatistics() {
      try {
        let formData = new FormData();
        formData.append("companyId", this.companyId);
        formData.append("groupId", this.groupId);
        formData.append("startTime", this.startTime);
        formData.append("endTime", this.endTime);
        formData.append("page", this.currentPage);
        const res = await queryStrangerRecordStatistics(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          console.log(res);
          this.statisticsAccessRecord = res.data;
          this.drawEcharts();
        } else {
          this.$Message.error(this.$t("common.searchError"));
          this.statisticsAccessRecord = [];
        }
      } catch (err) {
        this.statisticsAccessRecord = [];
        this.$Message.error(this.$t("common.searchError"));
      } finally {
        this.$Spin.hide();
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
        const res = await queryStrangerRecord(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          this.strangerList = res.data.slice(0, 6);
        } else {
          this.$Message.error(this.$t("common.searchError"));
          this.strangerList = [];
        }
      } catch (err) {
        console.log(err);
        this.strangerList = [];
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async queryCompanyList(show) {
      if (!show) return;
      try {
        let formData = new FormData();
        formData.append("groupType", "");
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
    }
  },
  mounted() {
    this.getRecentRecord();
    this.queryStrangerRecordStatistics();
    this.$ebus.$on("/main/statistics/stranger", () => {
      this.getRecentRecord();
      this.queryStrangerRecordStatistics();
    });
    window.addEventListener("resize", () => {
      if (this.$route.path.includes("/main/statistics/stranger")) {
        this.throttle(1000, this.drawEcharts);
      }
    });
  },
  beforeDestroy() {
    this.$ebus.$off("/main/statistics/staff");
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
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    &:hover {
      cursor: pointer;
    }
  }
}
.container-statistics-stranger {
  width: 100%;
  height: 100%;
  > .visitor-list {
    background: #fff;
    height: 200px;
    padding: 0px 20px;
    > .content {
      width: 100%;
      height: 140px;
      display: flex;
      align-items: center;
      overflow-x: auto;
      overflow-y: hidden;
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
          display: flex;
          align-items: center;
          width: 230px;
          height: 90%;
          padding-left: 15px;
          color: #666;
          .details {
            height: 80%;
            .item {
              height: calc(100% / 3);
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
    height: calc(100% - 220px);
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
      padding: 0px 20px;
      > .item {
        width: 100%;
        height: calc((100% - 60px) / 2);
        min-height: 230px;
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
        &.top {
          #statistics-state {
            height: calc(100% - 48px);
            padding-right: 15px;
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