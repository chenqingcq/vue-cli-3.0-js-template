<template>
  <div class="container-room-appoint">
    <div class="header center">
      <div class="bream">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:16px">
          <el-breadcrumb-item :to="{ path: '/main/room' }">{{$t("room.header")}}</el-breadcrumb-item>
          <el-breadcrumb-item>
            {{$t("room.table.overview")}}
            <template v-if="spaceName">
              <span class="spaceName">/ {{spaceName}}</span>
            </template>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="content">
      <div class="calendar-container">
        <Calender @select="select" @get-records="getRecords" :record="recordList"></Calender>
      </div>
      <div class="result">
        <div class="table">
          <div class="title">
            <div class="time">{{selectedTime}}</div>
            <div class="week">{{getDay(selectedDay)}}</div>
          </div>
          <div class="header">
            <div class="time">{{$t("room.overview.time")}}</div>
            <div class="operator" style="margin-right:20px">{{$t("common.operate")}}</div>
          </div>
          <ul class="content">
            <template v-if="tableData.length">
              <li v-for="(item , index) in tableData " :key="`${index}-table`">
                <div class="time details">
                  <template>
                    <div class="date">
                      <span>{{$t('room.overview.time')}}：</span>
                      <span>{{getTime(item)}}</span>
                    </div>
                  </template>
                  <template>
                    <div class="reservator">
                      <span>{{$t('room.overview.appointer')}}:</span>
                      <span>{{item.visitorName || '-'}}</span>
                    </div>
                  </template>
                  <template>
                    <div class="company">
                      <span>{{$t('room.authorize.company')}}:</span>
                      <span>{{item.companyName|| '-'}}</span>
                    </div>
                  </template>
                </div>
                <div class="appointer">
                  <template v-if="item.reserveType == 1">
                    <span class="approve">{{$t('statistics.visitor.approve')}}</span>
                  </template>
                  <template v-else-if="item.reserveType == 3">
                    <span class="agree" @click="handleAgree(item)">{{$t('common.agree')}}</span>
                    <span class="reject" @click="handleReject(item)">{{$t('common.reject')}}</span>
                  </template>
                  <template v-else-if="item.reserveType == 5">
                    <span class="rejected">{{$t('statistics.visitor.reject')}}</span>
                  </template>
                </div>
              </li>
            </template>
            <template v-else>
              <li class="center">{{$t("common.noData")}}</li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Calender from "@/components/calender/Calender";
import {
  querySpaceReserveInfo,
  queryReserveList,
  getReserveList,
  updateReserveNoticeInfo
} from "@/api/room";
import { getDay } from "@/utils/tools";
const LANG = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-LANGUAGE";

export default {
  name: "room-appoint",
  data() {
    return {
      date: "",
      selectedDay: new Date(),
      recordList: [],
      selectedTime: moment(new Date()).format("YYYY-MM-DD"),
      startTime: "",
      endTime: "",
      tableData: []
    };
  },
  computed: {
    spaceName() {
      return this.$route.query.name;
    }
  },
  components: {
    Calender
  },
  methods: {
    handleAgree(item) {
      log(this.startTime, this.endTime);
      let { visitorId, noticeId } = item;
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: `${_this.$t("room.authorize.agree")}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.updateReserveNoticeInfo(noticeId, visitorId, 1);
        }
      });
    },
    handleReject(item) {
      let { visitorId, noticeId } = item;
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: `${_this.$t("room.authorize.reject")}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.updateReserveNoticeInfo(noticeId, visitorId, 2);
        }
      });
    },
    getReserveType(item) {
      let { reserveType } = item;
      if (reserveType == 1) {
        //状态：1已同意；3未操作；5已拒绝
        return "statistics.visitor.approve";
      }
      if (reserveType == 3) {
        return "common.agree";
      }
      if (reserveType == 5) {
        return "statistics.visitor.reject";
      }
    },
    getTime(item) {
      let { startTime, endTime } = item;
      return `${this.formateTime(startTime)} - ${this.formateTime(endTime)}`;
    },
    formateTime(time) {
      return moment(new Date(time)).format("HH:mm:ss");
    },
    getDay(time) {
      let lang = window.localStorage.getItem(LANG) || "zh";
      return getDay(lang, new Date(time).getDay());
    },
    select(dayInfo) {
      let { date, thing } = dayInfo;
      this.selectedDay = this.selectedTime = date;
      this.tableData = thing || [];
    },
    getRecords(time) {
      //获取当月预约列表
      let year = moment(time).format("yyyy");
      let month = moment(time).format("MM");
      let day = new Date(year, month, 0).getDate(); //获取当月多少天
      day = day < 10 ? `0${day}` : day;
      let startTime = `${moment(time).format("YYYY-MM-01")} 00:00:00`;
      let endTime = `${year}-${month}-${day} 23:59:59`;
      // this.querySpaceReserveInfo(this.$route.query.spaceId, startTime, endTime);
      // this.queryReserveList(this.$route.query.spaceId, startTime, endTime);
      this.getReserveList(this.$route.query.spaceId, startTime, endTime);
    },
    async querySpaceReserveInfo(spaceId, startTime, endTime) {
      try {
        let formData = new FormData();
        formData.append("id", spaceId);
        formData.append("startTime", startTime);
        formData.append("endTime", endTime);
        const res = await querySpaceReserveInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          this.recordList = res.data;
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        this.$Message.error(err.toString());
      }
    },
    async updateReserveNoticeInfo(noticeId, visitorId, auth = 1) {
      try {
        let formData = new FormData();
        formData.append("noticeId", noticeId);
        formData.append("visitorId", visitorId);
        formData.append("auth", auth);
        const res = await updateReserveNoticeInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res && res.code == 1) {
          this.getReserveListByDay(
            this.$route.query.spaceId,
            `${this.selectedTime} 00:00:00`,
            `${this.endTime} 23:59:59`
          );
        } else {
          let $1 = this.$t("common.operateError");
          let $2 = this.$t("room.authorize.expired");
          this.$Message.error(`${$1} : ${$2}`);
        }
      } catch (err) {
        this.$Message.error(this.$t("common.operateError"));
      }
    },
    async queryReserveList(spaceId, startTime, endTime) {
      try {
        const res = await queryReserveList({
          spaceId,
          startTime,
          endTime,
          page: 1,
          pageSize: 100
        });
        if (res && res.code == 1) {
          console.log(res);
          this.recordList = res.data.dataList;
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        this.$Message.error(err.toString());
      }
    },
    async getReserveList(spaceId, startTime, endTime) {
      try {
        const res = await getReserveList({
          operateType: "1,3,5",
          noticeType: "8",
          spaceId,
          startTime,
          endTime,
          page: 1,
          pageSize: 100
        });
        if (res && res.code == 1) {
          console.log(res);
          this.recordList = res.data.dataList;
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        this.$Message.error(err.toString());
      }
    },
    async getReserveListByDay(spaceId, startTime, endTime) {
      try {
        const res = await getReserveList({
          operateType: "1,3,5",
          noticeType: "8",
          spaceId,
          startTime,
          endTime,
          page: 1,
          pageSize: 100
        });
        if (res && res.code == 1) {
          console.log(res);
          this.tableData = res.data.dataList;
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        this.$Message.error(err.toString());
      }
    }
  }
};
</script>

<style lang="less" scoped>

.container-room-appoint {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #333;
  font-family: PingFang-SC-Regular;
  > .header {
    height: 60px;
    justify-content: flex-start;
    border-bottom: 1px solid #f0f0f0;
    .bream {
      margin-left: 20px;
      font-size: 16px;
    }
  }
  > .content {
    height: calc(100% - 60px);
    overflow-y: auto;
    padding: 20px;
    display: flex;
    justify-content: flex-start;
    .calendar-container {
      height: 375px;
      position: relative;
    }
    .result {
      width: 440px;
      height: 375px;
      margin-left: 500px;
      margin-top: 10px;
      .table {
        width: 100%;
        height: 100%;
        padding: 15px;
        padding-right: 0px;
        margin-right: 5px;
        overflow: hidden;
        border: solid 1px #ededed;
        > .title {
          display: flex;
          align-items: center;
          font-size: 14px;
          color: #000;
          div {
            margin-right: 15px;
            font-weight: bold;
          }
        }
        > .header {
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #999;
          font-size: 12px;
        }
        > .content {
          color: #333;
          font-size: 14px;
          max-height: calc(100% - 40px);
          border-top: solid 0.3px #dfdfe0;
          overflow-y: auto;
          li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 80px;
            border-bottom: solid 0.3px #dfdfe0;
            .details {
              span {
                &:first-of-type {
                  display: inline-block;
                  min-width: 80px;
                  color: #000;
                }
                &:last-of-type {
                }
              }
            }
            .appointer {
              display: flex;
              align-items: center;
              border: none;
              margin-right: 5px;
              span {
                margin-left: 5px;
                &.approve,
                &.rejected {
                  color: #7f7f7f;
                }
                &.agree {
                  color: #298df8;
                }
                &.reject {
                  color: #d9001b;
                }
              }
            }
            &:hover {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
</style>