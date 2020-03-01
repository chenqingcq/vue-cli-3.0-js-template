<template>
  <div class="container-staff-list">
    <div class="header center">
      <div class="title">
        <div
          v-for="(item, index) in buttons"
          :class="['center' , {active:currentIndex == index}]"
          :key="item.i18n"
          @click="handleIndexChange(index)"
        >{{$t(item.i18n)}}</div>
      </div>
    </div>
    <template v-if="currentIndex == 0 ">
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
                :label="$t(item.label )"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="groups center" v-if="getAgencyType == 2">
            <span style="margin-right:20px">{{$t('statistics.staff.group')}}</span>
            <el-select
              v-model="groupId"
              filterable
              :placeholder="$t('statistics.staff.selectGroup')"
              style="width:160px;height:28px;border:none"
              @visible-change="queryGroupInfoByType"
              @change="handleGroupChange"
            >
              <el-option
                v-for="item in groupsList"
                :key="item.value"
                :label="$t(item.label)"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="item" style="margin-right:80px">
          <el-input
            :placeholder="$t('common.search')"
            v-model.trim="staffName"
            class="input-with-select"
            @keydown.enter.native="search"
          >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
          <Button
            type="primary"
            style="height:28px;padding:0px 20px;margin-left:20px"
            class="center"
            @click="handleExportStaffList"
            :disabled="!tableData.length"
          >{{$t('common.export')}}</Button>
        </div>
      </div>
      <div class="content">
        <el-table
          id="staffTable"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          row-key="visitorId"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" :reserve-selection="true"></el-table-column>
          <el-table-column prop="picturePath" :label="$t('personnel.staff.picture')" width="160">
            <template slot-scope="scope">
              <img
                :src="getAvator(scope.row.visitorPicture)"
                @click="preview(scope.row.visitorPicture)"
                alt
                class="haadPath"
              />
            </template>
          </el-table-column>
          <el-table-column prop="visitorName" :label="$t('personnel.staff.name')"></el-table-column>
          <el-table-column prop="visitorGroupName" :label="$t('personnel.staff.group')"></el-table-column>
          <el-table-column :label="$t('personnel.staff.$register')">
            <template slot-scope="scope">{{formateTime( scope.row.visitorCreateTime )}}</template>
          </el-table-column>
          <el-table-column :label="$t('personnel.staff.deadLine')" show-overflow-tooltip>
            <template slot-scope="scope">{{ formateTime( scope.row.visitorDueTime) }}</template>
          </el-table-column>
          <el-table-column fixed="right" :label="$t('common.operate')">
            <template slot-scope="scope">
              <el-button
                @click="handleEdit(scope.row)"
                type="text"
                size="small"
              >{{$t('common.edit')}}</el-button>
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
    </template>
    <template v-if="currentIndex == 1">
      <div class="operate center">
        <div class="item">
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
          <div class="groups center" v-if="getAgencyType == 2">
            <span style="margin-right:20px">{{$t("statistics.staff.group")}}</span>
            <el-select
              v-model="groupId"
              filterable
              :placeholder="$t('statistics.staff.selectGroup')"
              style="width:160px;height:28px;border:none"
              @visible-change="queryGroupInfoByType"
              @change="handleGroupChange"
            >
              <el-option
                v-for="item in groupsList"
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
              style="width:200px;height:28px"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              :clearable="false"
              :placeholder="$t('excel.export.startTime')"
              @change="handleTimeChange"
            ></el-date-picker>
            <span class="center" style="margin:0px 5px">-</span>
            <el-date-picker
              v-model="endTime"
              :clearable="false"
              style="width:200px;height:28px"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              :placeholder="$t('excel.export.endTime')"
              @change="handleTimeChange"
            ></el-date-picker>
          </div>
          <el-input
            :placeholder="$t('common.search')"
            v-model.trim="staffName"
            class="input-with-select"
            @keydown.enter.native="search"
          >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
          <Button
            type="primary"
            style="height:28px;padding:0px 20px;margin-left:20px"
            class="center"
            @click="handleExportStaffRecord"
            :disabled="!recordList.length"
          >{{$t('common.export')}}</Button>
        </div>
      </div>
      <div class="content" id="staff-list-record">
        <el-table :data="recordList" tooltip-effect="dark" style="width: 100%">
          <el-table-column width="55"></el-table-column>
          <el-table-column :label="$t('personnel.staff.picture')" width="160">
            <template slot-scope="scope">
              <img
                :src="getAvator(scope.row.picture)"
                @click="preview(scope.row.picture)"
                alt
                class="haadPath"
              />
            </template>
          </el-table-column>
          <el-table-column prop="visitorName" :label="$t('personnel.staff.name')">
            <template slot-scope="scope">
              <span>{{scope.row.visitorName}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('personnel.staff.group')">
            <template slot-scope="scope">{{formateGroup( scope.row.groupName )}}</template>
          </el-table-column>
          <el-table-column :label="$t('agency.list.name')">
            <template slot-scope="scope">
              <span>{{scope.row.companyName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="robotName" :label="$t('personnel.stranger.list.robotName')">
            <template slot-scope="scope">
              <span>{{scope.row.robotName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="time" :label="$t('personnel.stranger.list.time')">
            <template slot-scope="scope">
              <span>{{scope.row.time}}</span>
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
          :total="recordTotal"
        ></el-pagination>
      </div>
    </template>
    <template v-if="currentIndex == 2">
      <div class="panel">
        <Register :uesrType="uesrType"></Register>
      </div>
    </template>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import Register from "@/components/RegisterInBatch";
import {
  queryStaffInfo,
  queryStaffRecord,
  queryGroupInfoByType,
  deleteStaff,
  reportStaffRecord,
  reportStaff
} from "@/api/personnel";

const LANG = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-LANGUAGE";

export default {
  name: "staff-list",
  data() {
    return {
      companyId: "",
      groupId: "",
      uesrType: "1",
      startTime: moment(new Date() - 30 * 24 * 60 * 60 * 1000).format(
        "YYYY-MM-DD 00:00:00"
      ),
      endTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      currentIndex: 0,
      disabled: false,
      staffName: "",
      currentPage: 1,
      pageSize: 20,
      total: 0,
      recordTotal: 0,
      tableData: [],
      recordList: [],
      group: [],
      groupsList: [],
      companyList: [],
      multipleSelection: [],
      buttons: [
        {
          i18n: "personnel.staff.list",
          router: ""
        },
        {
          i18n: "personnel.staff.record",
          router: ""
        },
        {
          i18n: "personnel.staff.register",
          router: ""
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
  components: {
    Register
  },
  methods: {
    formateGroup(groupName) {
      return groupName && groupName.includes("默认")
        ? this.$t("common.default")
        : groupName;
    },
    handleExportStaffList() {
      this.reportStaff();
    },
    handleExportStaffRecord() {
      this.reportStaffRecord();
    },
    download(url, fileName) {
      let link = document.createElement("a");
      link.download = fileName;
      link.href = `${process.env.VUE_APP_BASE_API}${url}`;
      link.click();
    },
    handleTimeChange() {
      this.currentPage = 1;
      this.queryStaffRecord();
    },
    handleCompanyChange() {
      this.currentPage = 1;
      if (this.currentIndex == 0) {
        this.queryStaffInfo();
      }
      if (this.currentIndex == 1) {
        this.queryStaffRecord();
      }
    },
    handleGroupChange() {
      this.currentPage = 1;
      if (this.currentIndex == 0) {
        this.queryStaffInfo();
      }
      if (this.currentIndex == 1) {
        this.queryStaffRecord();
      }
    },
    handleIndexChange(index) {
      this.tableData = [];
      this.total = 0;
      this.groupId = this.companyId = "";
      this.currentIndex = index;
      this.currentPage = 1;
      if (index == 0) {
        this.queryStaffInfo();
      }
      if (index == 1) {
        console.log("获取活动记录");
        this.queryStaffRecord();
      }
    },
    formateTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    getType(type) {
      console.log(type, "?");
      if (type == 1) {
        return this.$t("personnel.staff.in");
      }
      if (type == 2) {
        return this.$t("personnel.staff.out");
      }
      return "-";
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
      if (this.currentIndex == 0) {
        this.queryStaffInfo();
      }
      if (this.currentIndex == 1) {
        this.queryStaffRecord();
      }
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    search() {
      this.currentPage = 1;
      if (this.currentIndex == 0) {
        this.queryStaffInfo();
      }
      if (this.currentIndex == 1) {
        this.queryStaffRecord();
      }
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    handleViewRecord(row) {
      console.log(row, "查看详情");
    },
    handleDeleteRecord(row) {
      let { visitorName, visitorId } = row;
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: `${_this.$t("common.delete")}${visitorName}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          console.log("删除记录");
        }
      });
    },
    handleEdit(row) {
      console.log(row);
      let { visitorId, visitorName } = row;
      this.$router.push({
        path: "/main/staff/edit",
        query: {
          visitorId,
          visitorName
        }
      });
    },
    handleDelete(row) {
      console.log(row);
      let { visitorName, visitorId } = row;
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: `${_this.$t("common.delete")}${visitorName}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.deleteStaff(visitorId);
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
          let visitorIdSet = [];
          _this.multipleSelection.forEach(visitor => {
            visitorIdSet.push(visitor.visitorId);
          });
          if (_this.currentIndex == 0) {
            _this.deleteStaff(visitorIdSet.toString());
          }
        }
      });
    },
    async reportStaffRecord() {
      try {
        let formData = new FormData();
        let language = window.localStorage.getItem(LANG) || "zh";

        formData.append("searchName", this.staffName);
        formData.append("groupId", this.groupId);
        formData.append("recordId", this.recordId || "");
        formData.append("startTime", this.startTime);
        formData.append("endTime", this.endTime);
        formData.append("companyId", this.companyId);
        formData.append("language", language);
        const res = await reportStaffRecord(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          let { url } = res.data;
          url && this.download(url, "staff-list-excel");
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async reportStaff() {
      try {
        let formData = new FormData();
        let language = window.localStorage.getItem(LANG) || "zh";
        formData.append("searchName", this.staffName);
        formData.append("groupId", this.groupId);
        formData.append("recordId", this.recordId || "");
        formData.append("startTime", this.startTime);
        formData.append("endTime", this.endTime);
        formData.append("companyId", this.companyId);
        formData.append("language", language);

        const res = await reportStaff(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1 && res.data) {
          let { url } = res.data;
          url && this.download(url, "staffList");
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async deleteStaff(visitorId) {
      try {
        let formData = new FormData();
        formData.append("visitorId", visitorId);
        const res = await deleteStaff(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          console.log(res);
          this.$Message.success(this.$t("common.deleteSuccess"));
          this.queryStaffInfo();
        } else {
          this.$Message.error(this.$t("common.deleteFailure"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.deleteFailure"));
      }
    },
    async queryStaffRecord() {
      try {
        let formData = new FormData();
        formData.append("companyId", this.companyId);
        formData.append("groupId", this.groupId);
        formData.append("searchName", this.staffName);
        formData.append("startTime", this.startTime);
        formData.append("endTime", this.endTime);
        formData.append("page", this.currentPage);
        const res = await queryStaffRecord(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          this.recordList = res.data;
          this.recordTotal = res.count;
        } else {
          this.$Message.error(this.$t("common.searchError"));
          this.recordList = [];
        }
      } catch (err) {
        console.log(err);
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
    },
    async queryGroupInfoByType(show) {
      if (!show) return;
      try {
        let formData = new FormData();
        if (this.getAgencyType == 2) {
          formData.append("groupType", "1");
        }
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
            value: "",
            label: "statistics.staff.all"
          });
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async queryStaffInfo() {
      try {
        let formData = new FormData();
        formData.append("searchName", this.staffName);
        formData.append("page", this.currentPage);
        formData.append("companyId", this.companyId);
        formData.append("groupId", this.groupId);
        const res = await queryStaffInfo(formData, {
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
      this.currentIndex = this.$route.query.currentIndex || 0;
      if (this.currentIndex == 1) {
        this.queryStaffRecord();
      } else {
        this.queryStaffInfo();
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.init();
    });
  },
  mounted() {
    this.init();
    this.$ebus.$on("/main/staff/list", () => {
      this.init();
    });
  },
  beforeDestroy() {
    this.$ebus.$off("/main/staff/list");
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
.container-staff-list {
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
        font-size: 12px;
        width: 100%;
        display: flex;
        align-items: center;
        > div {
          width: auto;
          height: 28px;
          margin-left: 20px;
          color: #c5c8ce;
          background-color: #f7f7f7;
          border: 1px solid #dcdee2;
          padding: 0px 10px;
          &.active {
            background: #298df8;
            color: #fff;
            border: none;
          }
          &:hover {
            cursor: pointer;
          }
        }
      }
    }
    &.operate {
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
    &.panel {
      width: 100%;
      height: calc(100% - 60px);
      padding: 0 20px;
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