<template>
  <div class="container-room-list">
    <div class="header center">
      <div class="title">{{$t('room.header')}}</div>
    </div>
    <div class="operate center">
      <div class="item center">
        <Button
          type="primary"
          style="height:28px;margin-right:20px"
          class="center"
          @click="addRoom"
        >{{$t('room.table.add')}}</Button>
        <Button
          type="error"
          style="height:28px"
          class="center"
          @click="handleDeleteInBatch"
          :disabled="disabled"
        >{{$t('common.dltInbatch')}}</Button>
      </div>
      <div class="item center">
        <el-input
          :placeholder="$t('room.table.search')"
          v-model.trim="spaceName"
          class="input-with-select"
          @keydown.enter.native="search"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
    </div>
    <template>
      <div class="content">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%;"
          class="room-list"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="120"></el-table-column>
          <el-table-column
            prop="picturePath"
            :label="$t('room.authorize.avator')"
            width="120"
            style="margin-right:20px"
          >
            <template slot-scope="scope">
              <img
                :src="getAvator(scope.row.spacePics)"
                @click="handleZoom(scope.row.spacePics)"
                alt
                class="haadPath"
              />
            </template>
          </el-table-column>
          <el-table-column width="80"></el-table-column>
          <el-table-column prop="name" :label="$t('room.table.name')"></el-table-column>
          <el-table-column prop="address" :label="$t('agency.add.address')"></el-table-column>
          <el-table-column prop="isFree" :label="$t('room.table.isFree')">
            <template slot-scope="scope">
              <span :class="['isFree' , {active:scope.row.isFree}]">{{isFree(scope.row.isFree)}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('room.table.equip')">
            <template slot-scope="scope">{{ formateRobots(scope.row.robotNameMap) }}</template>
          </el-table-column>
          <el-table-column prop="readNoticeTime" :label="$t('room.table.remindHour')"></el-table-column>
          <el-table-column prop="unchangeTime" :label="$t('room.table.cancelTime')"></el-table-column>
          <el-table-column :label="$t('room.table.rules')">
            <template slot-scope="scope">{{ formateReserveRules(scope.row) }}</template>
          </el-table-column>
          <!-- <el-table-column :label="$t('room.table.time')">
            <template slot-scope="scope">{{ formateTimeRules(scope.row) }}</template>
          </el-table-column>-->
          <el-table-column prop="remark" :label="$t('room.edit.remark')"></el-table-column>
          <el-table-column :label="$t('common.operate')" width="280">
            <template slot-scope="scope">
              <el-button
                @click="handleAppoint(scope.row)"
                type="text"
                size="small"
              >{{$t('room.table.overview')}}</el-button>
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
    </template>
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
import {
  querySpaceInfo,
  deleteSpace,
  deleteSpace2,
  getSpaceList
} from "@/api/room";

export default {
  spaceName: "room-list",
  data() {
    return {
      disabled: false,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      spaceName: "",
      tableData: [],
      multipleSelection: [],
      roomListOptions: [
        {
          value: "1",
          label: "personnel.add.noRepeatable"
        },
        {
          value: "2",
          label: "personnel.add.repeatable"
        },
        {
          value: "3",
          label: "personnel.add.noAppoint"
        }
      ],
      timeListOptions: [
        {
          value: "1",
          label: "personnel.add.byTime"
        },
        {
          value: "2",
          label: "personnel.add.byDay"
        },
        {
          value: "3",
          label: "personnel.add.byWeek"
        },
        {
          value: "4",
          label: "personnel.add.byMon"
        },
        {
          value: "5",
          label: "personnel.add.byTimes"
        }
      ],
      accessListOptions: [
        {
          value: "1",
          label: "personnel.add.open"
        },
        {
          value: "2",
          label: "personnel.add.close"
        },
        {
          value: "3",
          label: "personnel.add.authorized"
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
  methods: {
    handleZoom(pictures) {
      this.$previewImg({
        src: `${process.env.VUE_APP_BASE_API}${pictures
          .toString()
          .split(",")
          .slice(-1)}`,
        style: {
          width: 500,
          height: 400,
          objectFit: "contain"
        }
      });
    },
    formateRobots(robots) {
      return Object.values(robots).join("/");
    },
    isFree(status) {
      return status ? this.$t("room.table.yes") : this.$t("room.table.no");
    },
    getAvator(pictures) {
      if (pictures) {
        return `${process.env.VUE_APP_BASE_API}${pictures
          .toString()
          .split(",")
          .slice(-1)}`;
      }
    },
    formateReserveRules(row) {
      let { reserveRules, permit } = row;
      let rule = this.roomListOptions.find(
        space => space.value == reserveRules
      );
      let access = this.accessListOptions.find(space => space.value == permit);
      return (access && this.$t(access.label)) || (rule && this.$t(rule.label));
    },
    formateTimeRules(row) {
      let { reserveTimeType, permit } = row;
      let time = this.timeListOptions.find(
        space => space.value == reserveTimeType
      );
      let access = this.accessListOptions.find(space => space.value == permit);
      return time && this.$t(time.label);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      // this.querySpaceInfo();
      this.getSpaceList();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleDeleteInBatch() {
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: `${_this.$t("personnel.stranger.list.delete")}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          let spaceIdSet = [];
          _this.multipleSelection.forEach(space => {
            spaceIdSet.push(space.spaceId);
          });
          // _this.deleteSpace(spaceIdSet.toString());
          _this.deleteSpace2(spaceIdSet);
        }
      });
    },
    search() {
      console.log(this.spaceName);
      this.currentPage = 1;
      // this.querySpaceInfo();
      this.getSpaceList();
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    handleAppoint(row) {
      console.log(row);
    },
    addRoom() {
      this.$router.push({
        path: "/main/room/add"
      });
    },
    handleAppoint(row) {
      let { name, spaceId } = row;
      this.$router.push({
        path: "/main/room/appoint",
        query: {
          spaceId,
          name
        }
      });
    },
    handleEdit(row) {
      console.log(row);
      let { spaceId, name } = row;
      this.$router.push({
        path: "/main/room/edit",
        query: {
          spaceId,
          spaceName: name
        }
      });
    },
    handleDelete(row) {
      console.log(row);
      let { name, spaceId } = row;
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: `${_this.$t("common.delete")} ${name}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          // _this.deleteSpace(spaceId);
          _this.deleteSpace2([spaceId]);
        }
      });
    },
    async deleteSpace(spaceId) {
      try {
        let formData = new FormData();
        formData.append("spaceId", spaceId);
        const res = await deleteSpace(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          // this.querySpaceInfo();
          this.getSpaceList();
          this.$Message.success(this.$t("common.deleteSuccess"));
        } else {
          this.$Message.error(this.$t("common.deleteFailure"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.deleteFailure"));
      }
    },
    async deleteSpace2(spaceIds) {
      try {
        const res = await deleteSpace2({
          spaceIds
        });
        if (res.code == 1) {
          // this.querySpaceInfo();
          this.getSpaceList();
          this.$Message.success(this.$t("common.deleteSuccess"));
        } else {
          this.$Message.error(this.$t("common.deleteFailure") + res.message);
        }
      } catch (err) {
        this.$Message.error(this.$t("common.deleteFailure"));
      }
    },
    async querySpaceInfo() {
      try {
        let formData = new FormData();
        formData.append("searchName", this.spaceName);
        formData.append("page", this.currentPage);
        const res = await querySpaceInfo(formData, {
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
    async getSpaceList() {
      try {
        const res = await getSpaceList({
          spaceName: this.spaceName,
          page: this.currentPage,
          pageSize: this.pageSize
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          this.tableData = res.data.dataList;
          this.total = res.data.count;
        } else {
          this.$Message.error(this.$t("common.searchError"));
          this.tableData = [];
          this.total = 0;
        }
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    }
  },
  mounted() {
    // this.querySpaceInfo();
    this.getSpaceList();
    this.$ebus.$on("/main/room/list", () => {
      // this.querySpaceInfo();
      this.getSpaceList();
    });
  },
  beforeDestroy() {
    this.$ebus.$off("/main/room/list");
  }
};
</script>

<style lang="less" scoped>
.isFree {
  color: #ff5566;
  &.active {
    color: #5cbb55;
  }
}
.haadPath {
  display: inline-block;
  width: 120px;
  height: 80px;
  object-fit: contain;
}
.container-room-list {
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
      justify-content: space-between;
      height: 60px;
      .item {
        flex: 1 auto;
        justify-content: flex-start;
        .input-with-select {
          width: 192px;
          margin-left: 20px;
        }
      }
    }
    &.content {
      width: 100%;
      height: calc(100% - 120px - 68px);
      overflow-y: auto;
      overflow-x: auto;
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