<template>
  <div class="container-robots-list">
    <div class="header center">
      <div class="title">{{$t('robots.list.title')}}</div>
    </div>
    <div class="operate center">
      <div class="item center">
        <Button
          type="primary"
          style="height:28px;margin-right:20px"
          class="center"
          @click="addRoom"
        >{{$t('robots.add.title')}}</Button>
        <Button
          type="error"
          style="height:28px"
          class="center center"
          @click="handleDeleteInBatch"
          :disabled="disabled"
        >{{$t('common.dltInbatch')}}</Button>
      </div>
      <div class="item">
        <el-input
          :placeholder="$t('robots.list.search')"
          v-model.trim.trim="spaceName"
          class="input-with-select"
          @keydown.enter.native="search"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
    </div>
    <div class="content">
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        class="robot-list"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="120"></el-table-column>
        <el-table-column prop="name" :label="$t('robots.list.name')"></el-table-column>
        <el-table-column :label="$t('robots.list.online')">
          <template slot-scope="scope">
            <span :class="scope.row.online == 1 ? 'online':'offline'">{{online(scope.row.online)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="identifier" :label="$t('robots.list.SN')" width="180"></el-table-column>
        <el-table-column prop="robotModel" :label="$t('robots.add.type')">
          <template slot-scope="scope">{{getRobotType(scope.row.robotType)}}</template>
        </el-table-column>
        <el-table-column prop="softwareVersion" :label="$t('robots.list.version')"></el-table-column>
        <el-table-column :label="$t('robots.list.room')">
          <template slot-scope="scope">{{getSpaceName(scope.row.spaceList)}}</template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('common.operate')" width="160">
          <template slot-scope="scope">
            <div class="operates">
              <el-button
                @click="handleShowEdit(scope.row)"
                type="text"
                size="small"
                style="margin:0px"
              >{{$t('common.edit')}}</el-button>
              <el-button
                v-show="scope.row.robotType == 6 "
                @click="handleReset(scope.row.identifier)"
                size="small"
                type="text"
                style="margin:0px;"
              >{{$t('robots.list.reset')}}</el-button>
              <el-button
                @click="handleDelete(scope.row)"
                type="text"
                size="small"
                style="color:#ff5b5b;margin:0px"
              >{{$t('common.delete')}}</el-button>
            </div>
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
    <template>
      <el-dialog
        :title="$t('common.edit') "
        :visible.sync="centerDialogVisible"
        v-if="centerDialogVisible"
        width="600px"
      >
        <el-form
          :model="formInline"
          :rules="rules"
          ref="editForm"
          label-position="right"
          class="demo-ruleForm"
        >
          <el-form-item :label="$t('robots.list.name')" prop="name">
            <el-input
              v-model.trim="formInline.name"
              :placeholder="$t('robots.add.plzIptName')"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('robots.list.SN')" prop="identifier">
            <el-input
              v-model.trim="formInline.identifier"
              :placeholder="$t('robots.add.plzIptSN')"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button
            size="small"
            @click="centerDialogVisible = false"
            style="border-radius:0px;width:75px"
          >{{$t("common.cancel")}}</el-button>
          <el-button
            size="small"
            type="primary"
            @click="handleEditRobot('editForm')"
            style="border-radius:0px;width:75px"
          >{{$t("common.confirm")}}</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import {
  queryRobotsInfo,
  queryOneRobotsInfo,
  updateRobotsInfo,
  resetRobotPassword,
  deleteRobots
} from "@/api/robots";

export default {
  name: "robot-list",
  data() {
    return {
      centerDialogVisible: false,
      disabled: false,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      spaceName: "",
      tableData: [],
      multipleSelection: [],
      formInline: {
        name: "",
        identifier: "",
        id: ""
      },
      rules: null
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
    initRules() {
      this.rules = {
        name: [
          {
            required: true,
            message: this.$t("robots.add.plzIptName"),
            trigger: "blur"
          }
        ],
        identifier: [
          {
            required: true,
            message: this.$t("robots.add.plzIptSN"),
            trigger: "blur"
          }
        ]
      };
    },
    online(yes) {
      return yes == 1 ? this.$t("robots.list.yes") : this.$t("robots.list.no");
    },
    getRobotType(type) {
      //1.solaris;2.ego;3.smarteye;4.iknow;5.Alpha
      if (type == 1) {
        return "Solaris";
      }
      if (type == 2) {
        return "Ego";
      }
      if (type == 3) {
        return "Smarteye";
      }
      if (type == 4) {
        return "Iknow";
      }
      if (type == 5) {
        return "Alpha";
      }
      if (type == 6) {
        return "Tianbo";
      }
    },
    getSpaceName(space) {
      let spaceList = [];
      space.forEach(item => {
        if (item) {
          spaceList.push(item.name);
        }
      });
      return spaceList.toString();
    },
    getAvator(picture) {
      return `${process.env.VUE_APP_BASE_API}${picture}`;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.queryRobotsInfo();
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
          let robotSet = [];
          _this.multipleSelection.forEach(item => {
            robotSet.push(item.id);
          });
          _this.deleteRobots(robotSet.toString());
        }
      });
    },
    search() {
      console.log(this.spaceName);
      this.currentPage = 1;
      this.queryRobotsInfo();
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    addRoom() {
      this.$router.push({
        path: "/main/equip/add"
      });
    },
    handleShowEdit(row) {
      this.centerDialogVisible = true;
      let { id } = row;
      if (id) {
        this.queryOneRobotsInfo(id);
      }
    },
    handleEditRobot(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateRobotsInfo();
        }
      });
    },
    handleDelete(row) {
      console.log(row);
      let { name, id } = row;
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: `${_this.$t("common.delete")} ${name}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.deleteRobots(id);
        }
      });
    },
    handleReset(identifier) {
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: _this.$t("personnel.edit.resetHint"),
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.resetRobotPassword(identifier);
        }
      });
    },
    async resetRobotPassword(identifier) {
      try {
        let formData = new FormData();
        formData.append("identifier", identifier);
        const res = await resetRobotPassword(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log(res);
        if (res.code == 1) {
          this.$Message.success(this.$t("common.saveSuccess"));
        } else {
          this.$Message.error(this.$t("common.saveFailure") + " : " + res.msg);
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.saveFailure"));
      }
    },
    async updateRobotsInfo() {
      let { id, name, identifier } = this.formInline;
      try {
        let formData = new FormData();
        formData.append("robotId", id);
        formData.append("identifier", identifier);
        formData.append("name", name);
        const res = await updateRobotsInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log(res);
        if (res.code == 1) {
          this.centerDialogVisible = false;
          this.$Message.success(this.$t("common.saveSuccess"));
        } else {
          this.$Message.error(this.$t("common.saveFailure"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.saveFailure"));
      } finally {
        this.currentPage = 1;
        this.queryRobotsInfo();
      }
    },
    async queryOneRobotsInfo(robotId) {
      try {
        let formData = new FormData();
        formData.append("robotId", robotId);
        const res = await queryOneRobotsInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        console.log(res);
        if (res.code == 1) {
          let { name, identifier, id } = res.data;
          Object.assign(this.formInline, {
            name,
            identifier,
            id
          });
        } else {
          this.$Message.error(this.$t("common.searchError"));
          Object.assign(this.formInline, {
            name: "",
            identifier: "",
            id: ""
          });
        }
      } catch (err) {
        Object.assign(this.formInline, {
          name: "",
          identifier: "",
          id: ""
        });
        this.$Message.error(err.toString());
      }
    },
    async deleteRobots(robotId) {
      try {
        let formData = new FormData();
        formData.append("robotId", robotId);
        const res = await deleteRobots(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          this.queryRobotsInfo();
          this.$Message.success(this.$t("common.deleteSuccess"));
        } else {
          this.$Message.error(this.$t("common.deleteFailure"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.deleteFailure"));
      }
    },
    async queryRobotsInfo() {
      try {
        let formData = new FormData();
        formData.append("searchName", this.spaceName);
        formData.append("page", this.currentPage);
        const res = await queryRobotsInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          this.tableData = res.data;
          this.total = res.count || 0;
        } else {
          this.$Message.error(this.$t("common.searchError"));
          this.tableData = [];
        }
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    }
  },
  created() {
    this.initRules();
  },
  mounted() {
    this.queryRobotsInfo();
    this.$ebus.$on("/main/robots/list", () => {
      this.queryRobotsInfo();
    });
    this.$ebus.$on("changeLang", this.initRules);
  },
  beforeDestroy() {
    this.$ebus.$off("/main/robots/list");
    this.$ebus.$off("changeLang");
  }
};
</script>

<style lang="less" scoped>
.online {
  color: #5cbb55;
  font-weight: bold;
}
.offline {
  color: #909399;
}
.haadPath {
  display: inline-block;
  width: 120px;
  height: 80px;
  object-fit: cover;
}
.operates {
  width: calc(100% - 20px);
  height: 100%;
  display: flex;
  justify-content: space-between;
}
.container-robots-list {
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