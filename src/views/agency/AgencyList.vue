<template>
  <div class="container-room-list">
    <div class="header center">
      <div class="title">{{$t('agency.title')}}</div>
    </div>
    <div class="operate center">
      <div class="item center">
        <Button
          v-if="getAgencyType == 3"
          type="primary"
          style="height:28px;margin-right:20px"
          class="center"
          @click="addAgency"
        >{{$t('agency.list.add')}}</Button>
        <Button
          v-if="getAgencyType == 3"
          type="error"
          style="height:28px"
          class="center"
          @click="handleDeleteInBatch"
          :disabled="disabled"
        >{{$t('common.dltInbatch')}}</Button>
      </div>
      <div class="item center">
        <el-input
          :placeholder="$t('agency.list.search')"
          v-model.trim="agencyName"
          class="input-with-select"
          @keydown.enter.native="search"
          style="margin-left:150px"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
    </div>
    <div class="content" v-if="getAgencyType == 3">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        class="room-list"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="120"></el-table-column>
        <el-table-column
          prop="picturePath"
          :label="$t('agency.list.logo')"
          width="160"
          style="margin-right:20px"
        >
          <template slot-scope="scope">
            <img :src="getAvator(scope.row.agencyLogo)" alt class="haadPath" />
          </template>
        </el-table-column>
        <el-table-column prop="agencyName" :label="$t('agency.list.name')" width="140"></el-table-column>
        <el-table-column prop="agencyRobotNum" :label="$t('agency.list.robots')"></el-table-column>
        <el-table-column prop="agencyAccount" :label="$t('agency.list.account')"></el-table-column>
        <el-table-column prop="agencyManagerNum" :label="$t('agency.list.subAccount')"></el-table-column>
        <el-table-column prop="agencyRemark" :label="$t('room.edit.remark')" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" :label="$t('common.operate')">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small">{{$t('common.edit')}}</el-button>
            <el-button
              v-if="getAgencyType == 3"
              @click="handleDelete(scope.row)"
              type="text"
              size="small"
              style="color:#ff5b5b;"
            >{{$t('common.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="content" v-if="getAgencyType == 2">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        class="room-list"
      >
        <el-table-column
          prop="picturePath"
          :label="$t('agency.list.logo')"
          width="140"
          style="margin-right:20px"
        >
          <template slot-scope="scope">
            <img
              :src="getAvator(scope.row.agencyLogo)"
              @click="handleZoom(scope.row.agencyLogo)"
              alt
              class="haadPath"
            />
          </template>
        </el-table-column>
        <el-table-column width="80"></el-table-column>
        <el-table-column prop="agencyName" :label="$t('agency.list.name')"></el-table-column>
        <el-table-column prop="agencyRobotNum" :label="$t('agency.list.robots')"></el-table-column>
        <el-table-column prop="agencyAccount" :label="$t('agency.list.account')"></el-table-column>
        <el-table-column prop="agencyManagerNum" :label="$t('agency.list.subAccount')"></el-table-column>
        <el-table-column prop="agencyRemark" :label="$t('room.edit.remark')" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" :label="$t('common.operate')">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small">{{$t('common.edit')}}</el-button>
            <el-button
              v-if="getAgencyType == 3"
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
import { mapGetters } from "vuex";
import { queryAgencyInfo, deleteAgency } from "@/api/agency";

export default {
  name: "room-list",
  data() {
    return {
      disabled: false,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      agencyName: "",
      tableData: [],
      multipleSelection: []
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
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.queryAgencyInfo();
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
          let agencyIdSet = [];
          _this.multipleSelection.forEach(item => {
            agencyIdSet.push(item.agencyId);
          });
          _this.deleteAgency(agencyIdSet.toString());
        }
      });
    },
    search() {
      console.log(this.agencyName);
      this.currentPage = 1;
      this.queryAgencyInfo();
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    handleAppoint(row) {
      console.log(row);
    },
    addAgency() {
      this.$router.push({
        path: "/main/agency/add"
      });
    },
    handleEdit(row) {
      console.log(row);
      let { agencyId } = row;
      this.$router.push({
        path: "/main/agency/edit",
        query: {
          agencyId
        }
      });
    },
    handleDelete(row) {
      console.log(row);
      let { agencyName, agencyId } = row;
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: `${_this.$t("common.delete")} ${agencyName}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.deleteAgency(agencyId);
        }
      });
    },
    async deleteAgency(agencyId) {
      try {
        let formData = new FormData();
        formData.append("agencyId", agencyId);
        const res = await deleteAgency(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          this.queryAgencyInfo();
          this.$Message.success(this.$t("common.deleteSuccess"));
        } else {
          this.$Message.error(this.$t("common.deleteFailure"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.deleteFailure"));
      }
    },
    async queryAgencyInfo() {
      try {
        let formData = new FormData();
        formData.append("searchName", this.agencyName);
        formData.append("page", this.currentPage);
        const res = await queryAgencyInfo(formData, {
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
    }
  },
  mounted() {
    this.queryAgencyInfo();
    this.$ebus.$on("/main/agency/list", () => {
      this.queryAgencyInfo();
    });
  },
  beforeDestroy() {
    this.$ebus.$off("/main/agency/list");
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
      justify-content: flex-start;
      height: 60px;
      .item {
        width: 50%;
        justify-content: flex-start;
      }
      .input-with-select {
        width: 192px;
        margin-left: 20px;
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