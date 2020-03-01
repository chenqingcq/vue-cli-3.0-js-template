<template>
  <div class="container-room-authorize">
    <div class="header center">
      <div class="title">{{$t('room.authorize.title')}}</div>
    </div>
    <div class="operate center">
      <div class="item">
        <!-- <Button
          type="error"
          style="height:28px;margin-right:15px"
          class="center"
          @click="handleDeleteInBatch"
          :disabled="disabled"
        >{{$t('common.dltInbatch')}}</Button> -->
        <el-select
          v-if="getAgencyType == 3"
          v-model="companyId"
          filterable
          :clearable="true"
          :placeholder="$t('statistics.staff.selectCompany')"
          style="width:150px;height:28px;border:none;margin:0px 15px;"
          @change="handleListChange"
          @visible-change="handleListShow"
        >
          <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select
          v-model="operateType"
          filterable
          :placeholder="$t('common.select')"
          style="width:150px;height:28px;border:none;margin-right:15px;"
          @change="handleTypeChange"
        >
          <el-option
            v-for="item in operates"
            :key="item.value"
            :label="$t(item.label)"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="item">
        <el-date-picker
          v-model="startTime"
          style="width:200px"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          :clearable="false"
          :placeholder="$t('excel.export.startTime')"
          @change="queryReserveNoticeInfo"
        ></el-date-picker>
        <span class="center" style="margin:0px 5px">-</span>
        <el-date-picker
          v-model="endTime"
          :clearable="false"
          style="width:200px"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          :placeholder="$t('excel.export.endTime')"
          @change="queryReserveNoticeInfo"
        ></el-date-picker>
        <el-input
          :placeholder="$t('room.table.search')"
          v-model.trim="spaceName"
          class="input-with-select"
          @keydown.enter.native="search"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <Button
          v-if="operateType == 1"
          type="primary"
          style="height:28px;padding:0px 20px;margin-left:20px"
          class="center"
          @click="handleExport"
          :disabled="!tableData.length"
        >{{$t('common.export')}}</Button>
      </div>
    </div>
    <div class="content">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        class="room-list"
      >
        <!-- <el-table-column type="selection" width="60"></el-table-column> -->

        <el-table-column
          prop="picturePath"
          :label="$t('room.table.picture')"
          width="120"
          style="margin-right:20px"
        >
          <template slot-scope="scope">
            <img
              :src="getAvator(scope.row.headPath)"
              @click="preview(scope.row.headPath)"
              alt
              class="haadPath"
            />
          </template>
        </el-table-column>
        <el-table-column :label="$t('room.authorize.time')" width="220" style="color:red">
          <template slot-scope="scope">
            <template v-if="scope.row. spaceReserveTimeType == 1">
              <div class="_center">{{$t('room.authorize.times')}} : {{scope.row.reserveTimes}}</div>
            </template>
            <template v-else>
              <div class="_center">{{scope.row.startTime| fomateTime}}</div>
              <div class="center">
                <span style="margin-left:-40px">-</span>
              </div>
              <div class="_center">{{scope.row.endTime | fomateTime}}</div>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="spaceName" :label="$t('room.authorize.space')"></el-table-column>
        <el-table-column prop="name" :label="$t('room.authorize.name')"></el-table-column>
        <el-table-column prop="companyName" :label="$t('room.authorize.company')"></el-table-column>
        <el-table-column prop="groupName" :label="$t('room.authorize.group')" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" :label="$t('common.operate')">
          <template slot-scope="scope">
            <template v-if="operateType == 1">
              <el-button
                @click="handleCancel(scope.row)"
                type="text"
                size="small"
              >{{$t('common.cancel')}}</el-button>
            </template>
            <template v-if="operateType == 3">
              <el-button
                @click="handleAgree(scope.row)"
                type="text"
                size="small"
              >{{$t('common.agree')}}</el-button>
              <el-button
                @click="handleReject(scope.row)"
                type="text"
                size="small"
                style="color:#ff5b5b;"
              >{{$t('common.reject')}}</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import {
  queryReserveNoticeInfo,
  updateReserveNoticeInfo,
  cancelReserveNotice,
  deleteReserve,
  deleteSpace,
  reportReserve
} from "@/api/room";
import { queryGroupInfoByType } from "@/api/personnel";

const LANG = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-LANGUAGE";

export default {
  name: "room-list",
  data() {
    return {
      operateType: 3,
      startTime: moment(new Date() - 7 * 24 * 60 * 60 * 1000).format(
        "YYYY-MM-DD 00:00:00"
      ),
      endTime: moment(new Date()).format("YYYY-MM-DD 24:00:00"),
      disabled: false,
      currentPage: 1,
      companyId: "",
      pageSize: 20,
      total: 0,
      spaceName: "",
      list: [],
      tableData: [],
      multipleSelection: [],
      operates: [
        {
          value: 1,
          label: "statistics.visitor.approve"
        },
        {
          value: 3,
          label: "statistics.visitor.pedding"
        }
      ]
    };
  },
  watch: {
    multipleSelection: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val && val.length) {
          this.disabled = false;
        } else {
          this.disabled = true;
        }
      }
    }
  },
  computed: {
    ...mapGetters(["getAgencyInfo", "getAgencyType"])
  },
  methods: {
    formateTime(time, type = "YYYY-MM-DD HH:mm:ss") {
      return moment(time).format(type);
    },
    getStatus(status) {
      if (status == 1) {
        //状态：1已同意；3未操作；5已拒绝
        return "statistics.visitor.approve";
      }
      if (status == 3) {
        return "statistics.visitor.pedding";
      }
      if (status == 5) {
        return "statistics.visitor.reject";
      }
    },
    getGroup(item) {
      let { name, type } = item;
      if (name == "默认分组") {
        return type == 1
          ? `${this.$t("common.default")} (${this.$t("excel.export.staff")})`
          : `${this.$t("common.default")} (${this.$t("excel.export.visitor")})`;
      }
      return name;
    },
    handleListChange() {
      this.currentPage = 1;
      this.queryReserveNoticeInfo();
    },
    handleTypeChange() {
      this.currentPage = 1;
      this.queryReserveNoticeInfo();
    },
    handleListShow(show) {
      if (show) {
        this.queryGroupInfoByType();
      }
    },
    formateRobots(robots) {
      let selected = [];
      if (robots && robots.length) {
        robots.forEach(item => {
          selected.push(item.identifier);
        });
      }
      return selected.toString();
    },
    getAvator(picture) {
      return `${process.env.VUE_APP_BASE_API}${picture}`;
    },
    preview(picture) {
      this.$previewImg({
        src: `${process.env.VUE_APP_BASE_API}${picture}`,
        style: {
          width: 500,
          height: 400,
          objectFit: "contain"
        }
      });
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.queryReserveNoticeInfo();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleDeleteInBatch() {
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: `${_this.$t("common.confirm")}${_this.$t("common.delete")}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          console.log(_this.multipleSelection);
          let reserveIdSet = [];
          _this.multipleSelection.forEach(item => {
            reserveIdSet.push(item.id);
          });
          _this.deleteReserve(reserveIdSet);
        }
      });
    },
    search() {
      console.log(this.spaceName);
      this.currentPage = 1;
      this.queryReserveNoticeInfo();
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    addRoom() {
      this.$router.push({
        path: "/main/room/add"
      });
    },
    handleCancel(row) {
      let {
        id,
        name,
        spaceName,
        startTime,
        endTime,
        reserveTimes,
        spaceReserveTimeType
      } = row;
      console.log(row);
      let _this = this;
      let content =
        spaceReserveTimeType == 1
          ? `
          <div style="min-width:280px;padding-bottom:10px;text-align:left">
            <span>${_this.$t("room.authorize.name")} : </span>
            <span>${name}</span></br>
            <span>${_this.$t("room.authorize.space")} : </span>
            <span>${spaceName}</span></br>
            <span>${_this.$t("room.authorize.time")} : </span>  
            <span>${reserveTimes} </span>
          </div>
        `
          : `
          <div style="min-width:280px;padding-bottom:10px;text-align:left">
            <span>${_this.$t("room.authorize.name")} : </span>
            <span>${name}</span></br>
            <span>${_this.$t("room.authorize.space")} : </span>
            <span>${spaceName}</span></br>
            <span>${_this.$t("room.authorize.time")} : </span>  
            <span>${_this.formateTime(startTime, "MM-DD HH:mm")} - </span>
            <span>${_this.formateTime(endTime, "MM-DD HH:mm")} </span></br>
          </div>
        `;
      this.$toast({
        title: `${_this.$t("room.authorize.cancel")}?`,
        content: content,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          // _this.cancelReserveNotice(id);
          _this.deleteReserve([id]);
        }
      });
    },
    handleAgree(row) {
      let { visitorId, id } = row;
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: `${_this.$t("room.authorize.agree")}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.updateReserveNoticeInfo(id, visitorId, 1);
        }
      });
    },
    handleReject(row) {
      console.log(row);
      let { visitorId, id } = row;
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: `${_this.$t("room.authorize.reject")}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.updateReserveNoticeInfo(id, visitorId, 2);
        }
      });
    },
    handleExport() {
      this.reportReserve();
    },
    download(url, fileName) {
      let link = document.createElement("a");
      link.download = fileName;
      link.href = `${process.env.VUE_APP_BASE_API}${url}`;
      link.click();
    },
    async cancelReserveNotice(id) {
      try {
        let formData = new FormData();
        formData.append("id", id);
        const res = await cancelReserveNotice(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          console.log(res);
          this.$Message.success(this.$t("common.operateSuccess"));
          this.queryReserveNoticeInfo();
        } else {
          this.$Message.error(this.$t("common.operateError") + res.msg);
        }
      } catch (err) {
        this.$Message.error(this.$t("common.operateError"));
      }
    },
    async deleteReserve(idSet) {
      let { extraToken } = this.getAgencyInfo || {};
      try {
        const res = await deleteReserve({
          spaceReserveIds: idSet,
          msToken: extraToken
        });
        if (res.code == 1) {
          console.log(res);
          this.$Message.success(this.$t("common.operateSuccess"));
          this.queryReserveNoticeInfo();
        } else {
          let msg = res.message && res.message.replace(/[a-zA-Z0-9]+/g, "");
          this.$Message.error(msg);
        }
      } catch (err) {
        this.$Message.error(this.$t("common.operateError"));
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
        if (res.code == 1) {
          console.log(res);
          this.$Message.success(this.$t("common.operateSuccess"));
          this.queryReserveNoticeInfo();
        } else {
          let $1 = this.$t("common.operateError");
          let $2 = this.$t("room.authorize.expired");
          this.$Message.error(`${$1} : ${$2}`);
        }
      } catch (err) {
        this.$Message.error(this.$t("common.operateError"));
      }
    },
    async deleteSpace(spaceId) {
      try {
        let formData = new FormData();
        formData.append("spaceId", spaceId);
        const res = await deleteSpace(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          this.queryReserveNoticeInfo();
          this.$Message.success(this.$t("common.deleteSuccess"));
        } else {
          this.$Message.error(this.$t("common.deleteFailure"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.deleteFailure"));
      }
    },
    async queryReserveNoticeInfo() {
      try {
        let formData = new FormData();
        formData.append("searchName", this.spaceName);
        formData.append("operateType", this.operateType);
        formData.append("page", this.currentPage);
        formData.append("startTime", this.startTime);
        formData.append("endTime", this.endTime);
        formData.append("companyId", this.companyId);
        const res = await queryReserveNoticeInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          this.tableData = res.data;
          this.total = res.count;
        } else {
          this.$Message.error(this.$t("common.searchError"));
          this.tableData = [];
          this.total = 0;
        }
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async reportReserve() {
      try {
        let formData = new FormData();
        let language = window.localStorage.getItem(LANG) || "zh";

        formData.append("searchName", this.spaceName);
        formData.append("operateType", this.operateType);
        formData.append("startTime", this.startTime);
        formData.append("endTime", this.endTime);
        formData.append("companyId", this.companyId);
        formData.append("language", language);
        const res = await reportReserve(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          let { url } = res.data;
          url && this.download(url, "reservation-excel");
        } else {
          this.$Message.error(this.$t("excel.export.error"));
        }
      } catch (err) {
        this.$Message.error(this.$t("excel.export.error"));
      }
    },
    async queryGroupInfoByType() {
      try {
        let formData = new FormData();
        formData.append("groupType", "");
        const res = await queryGroupInfoByType(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          this.list = res.data.map(item => {
            if (item) {
              return {
                label: this.getGroup(item),
                value: item.id
              };
            }
          });
        } else {
          this.$Message.error(this.$t("common.searchError"));
          this.list = [];
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.searchError"));
      }
    }
  },
  mounted() {
    this.queryReserveNoticeInfo();
    this.$ebus.$on("/main/room/authorize", () => {
      this.queryReserveNoticeInfo();
    });
  },
  beforeDestroy() {
    this.$ebus.$off("/main/room/authorize");
  }
};
</script>

<style lang="less" scoped>
.haadPath {
  display: inline-block;
  width: 120px;
  height: 80px;
  object-fit: contain;
}
.container-room-authorize {
  width: 100%;
  height: 100%;
  > div {
    padding-left: 20px;
    &.header {
      padding-left: 0;
      height: 60px;
      justify-content: flex-start;
      border-bottom: 1px solid #f0f0f0;
      .title {
        font-size: 16px;
        margin-left: 20px;
      }
    }
    &.operate {
      justify-content: flex-start;
      height: 60px;
      display: flex;
      justify-content: space-between;
      > .item {
        flex: 1;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 100%;
        .input-with-select {
          width: 192px;
          margin-left: 20px;
        }
      }
    }
    &.content {
      height: calc(100% - 120px - 68px);
      overflow-y: auto;
    }
    &.pagination {
      padding: 0px 20px;
      height: 68px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>