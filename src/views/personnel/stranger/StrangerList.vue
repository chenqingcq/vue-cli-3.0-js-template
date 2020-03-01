<template>
  <div class="container-stranger-list">
    <div class="header center">
      <div class="title">{{$t('personnel.stranger.title')}}</div>
    </div>
    <div class="operate center">
      <div class="item">
        <Button
          type="error"
          style="height:28px"
          class="center"
          :disabled="disabled"
          @click="handleDeleteInbatch"
        >{{$t('common.dltInbatch')}}</Button>
        <div class="groups center" v-if="getAgencyType == 3">
          <span style="margin-right:20px">{{$t("room.authorize.company")}}</span>
          <el-select
            v-model="companyId"
            filterable
            :placeholder="$t('statistics.staff.selectCompany')"
            style="width:180px;height:28px;border:none"
            @visible-change="queryCompanyList"
            @change="handleCompanyChange"
          >
            <el-option
              v-for="item in companyList"
              :key="item.value"
              :label="$t(item.label)"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="item" style="margin-right:80px">
        <div class="time">
          <el-date-picker
            v-model="startTime"
            :clearable="false"
            style="width:200px"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :placeholder="$t('excel.export.startTime')"
            @change="handleTimeChange"
          ></el-date-picker>
          <span class="center" style="margin:0px 5px">-</span>
          <el-date-picker
            v-model="endTime"
            :clearable="false"
            style="width:200px"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            :placeholder="$t('excel.export.endTime')"
            @change="handleTimeChange"
          ></el-date-picker>
        </div>
        <el-input
          style="width:250px"
          :placeholder="$t('personnel.stranger.list.searchRobot')"
          v-model.trim="strangerName"
          class="input-with-select"
          @keydown.enter.native="search"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
        <Button
          v-if="false"
          type="primary"
          style="height:28px;padding:0px 20px;margin-left:20px"
          class="center"
          @click="report"
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="picturePath" :label="$t('personnel.staff.picture')" width="120">
          <template slot-scope="scope">
            <img
              :src="getAvator(scope.row.picture)"
              @click="preview(scope.row.picture)"
              alt
              class="haadPath"
            />
          </template>
        </el-table-column>
        <el-table-column :label="$t('personnel.staff.name')">
          <template slot-scope="scope">
            <div>{{getStrangerName(scope.row.strangerName)}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('personnel.staff.type')">
          <template slot-scope="scope">
            <span>{{getType(scope.row.recordType)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="robotName" :label="$t('personnel.stranger.list.robotName')"></el-table-column>
        <el-table-column :label="$t('personnel.stranger.list.time')">
          <template slot-scope="scope">{{ formateTime( scope.row.visitorDueTime) }}</template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('common.operate')" width="160">
          <template slot-scope="scope">
            <el-button
              @click="handleDelete(scope.row)"
              type="text"
              size="small"
              style="color:#ff5b5b;"
            >{{$t('common.delete')}}</el-button>
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
const LANG = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-LANGUAGE";

import {
  queryStrangerRecord,
  reportStrangerRecord,
  queryGroupInfoByType,
  deleteStrangerRecord
} from "@/api/personnel";
export default {
  name: "visitor-list",
  data() {
    return {
      companyId: "",
      startTime: moment(new Date() - 30 * 24 * 60 * 60 * 1000).format(
        "YYYY-MM-DD 00:00:00"
      ),
      endTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      disabled: false,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      strangerName: "",
      tableData: [],
      multipleSelection: [],
      companyList: []
    };
  },
  computed: {
    ...mapGetters(["getAgencyType"])
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
  methods: {
    handleCompanyChange() {
      this.currentPage = 1;
      this.queryStrangerRecord();
    },
    handleTimeChange() {
      this.currentPage = 1;
      this.queryStrangerRecord();
    },
    getStrangerName(name) {
      return name == "陌生人" ? this.$t("personnel.stranger.list.name") : name;
    },
    getType(type) {
      let IN = this.$t("personnel.staff.in");
      let OUT = this.$t("personnel.staff.out");
      return Math.random() > 0.5 ? IN : OUT;
    },
    formateTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    getAvator(picture) {
      if (picture) {
        return `${process.env.VUE_APP_BASE_API}${picture}`;
      }
      return require("@/assets/svg/pic_personnel.svg");
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
      this.queryStrangerRecord();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    search() {
      console.log(this.strangerName);
      this.currentPage = 1;
      this.queryStrangerRecord();
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    handleDelete(row) {
      let { recordId } = row;
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: `${_this.$t("personnel.stranger.list.delete")}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.deleteStrangerRecord(recordId);
        }
      });
    },
    handleDeleteInbatch() {
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: `${_this.$t("personnel.stranger.list.delete")}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          let strangerSet = [];
          _this.multipleSelection.forEach(item => {
            strangerSet.push(item.recordId);
          });
          _this.deleteStrangerRecord(strangerSet.toString());
        }
      });
    },
    download(url, fileName) {
      let link = document.createElement("a");
      link.download = fileName;
      link.href = `${process.env.VUE_APP_BASE_API}${url}`;
      link.click();
    },
    async deleteStrangerRecord(recordId) {
      try {
        let formData = new FormData();
        formData.append("recordId", recordId);
        const res = await deleteStrangerRecord(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          console.log(res);
          this.$Message.success(this.$t("common.deleteSuccess"));
          this.queryStrangerRecord();
        } else {
          this.$Message.error(this.$t("common.deleteFailure"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.deleteFailure"));
      }
    },
    async report() {
      try {
        let formData = new FormData();
        let language = window.localStorage.getItem(LANG) || "zh";
        formData.append("searchName", this.strangerName);
        formData.append("companyId", this.companyId);
        formData.append("startTime", this.startTime);
        formData.append("endTime", this.endTime);
        formData.append("recordId", "");
        formData.append("language", language);
        const res = await reportStrangerRecord(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          let { url } = res.data;
          url && this.download(url, "stranger-list-excel");
        } else {
          this.$Message.error(this.$t("excel.export.error") + res.msg);
        }
      } catch (err) {
        this.$Message.error(this.$t("excel.export.error") + err);
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
    },
    async queryStrangerRecord() {
      try {
        let formData = new FormData();
        formData.append("searchName", this.strangerName);
        formData.append("page", this.currentPage);
        formData.append("companyId", this.companyId);
        formData.append("startTime", this.startTime);
        formData.append("endTime", this.endTime);
        const res = await queryStrangerRecord(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          this.tableData = res.data;
          this.total = res.count;
        } else {
          this.$Message.error(this.$t("common.searchError"));
          this.tableData = [];
        }
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    init() {
      this.queryStrangerRecord();
      // let watchmore = this.$route.query.currentIndex || 0;
      // if (watchmore) {
      //   this.queryStrangerRecord(startTime);
      // } else {
      //   this.queryStrangerRecord();
      // }
    }
  },
  mounted() {
    this.init();
    this.$ebus.$on("/main/stranger/list", () => {
      this.init();
    });
  },
  beforeDestroy() {
    this.$ebus.$off("/main/stranger/list");
  }
};
</script>

<style lang="less" scoped>
.haadPath {
  display: inline-block;
  width: 40px;
  height: 40px;
  object-fit: cover;
}
.container-stranger-list {
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
      width: 100%;
      justify-content: space-between;
      height: 60px;
      .item {
        width: auto;
        flex: 1;
        display: flex;
        align-items: center;
        height: 100%;
        .time {
          display: flex;
          align-items: center;
        }
        .groups {
          margin-left: 20px;
        }
      }
      .input-with-select {
        width: 192px;
        margin-left: 20px;
      }
    }
    &.content {
      height: calc(100% - 155px - 30px);
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