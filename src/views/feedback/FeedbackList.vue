
<template>
  <div class="container-feedback-list">
    <div class="header center">
      <div class="title">{{$t('feedback.header')}}</div>
    </div>
    <div class="operate center">
      <div class="item center">
        <Button
          type="error"
          style="height:28px"
          :disabled="disabled"
          @click="handleDeleteInbatch"
          class="center"
        >{{$t('common.dltInbatch')}}</Button>
      </div>
      <div class="item center">
        <el-input
          :placeholder="$t('common.search')"
          v-model.trim="searchName"
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="picturePath" :label="$t('feedback.table.picture')" width="120">
          <template slot-scope="scope">
            <img :src="getAvator(scope.row.visitorHeader)" alt class="haadPath" />
          </template>
        </el-table-column>
        <el-table-column prop="visitorName" :label="$t('feedback.table.name')" width="160"></el-table-column>
        <el-table-column prop="companyName" :label="$t('agency.list.name')" width="200"></el-table-column>
        <el-table-column prop="content" :label="$t('feedback.table.content')"></el-table-column>
        <el-table-column :label="$t('feedback.table.time')" width="200">
          <template slot-scope="scope">{{formateTime( scope.row.createTime)}}</template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('common.operate')" width="200">
          <template slot-scope="scope">
            <el-button
              @click="reply(scope.row)"
              type="text"
              size="small"
            >{{$t('feedback.table.reply')}}</el-button>
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
import {
  queryFeedBackInfo,
  deleteFeedBack,
  getFeedBackList
} from "@/api/feedback";
export default {
  name: "staff-list",
  data() {
    return {
      disabled: false,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      searchName: "",
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
  methods: {
    formateTime(time) {
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
    getAvator(picture) {
      return `${process.env.VUE_APP_BASE_API}${picture}`;
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.queryFeedBackInfo();
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    search() {
      console.log(this.searchName);
      this.currentPage = 1;
      this.queryFeedBackInfo();
    },
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    reply(row) {
      console.log(row);
      let { id, visitorId, companyId, topicId, feedbackId } = row;
      this.$router.push({
        path: "/main/feedback/detail",
        query: {
          id,
          topicId,
          feedbackId,
          visitorId,
          companyId
        }
      });
    },
    handleDelete(row) {
      console.log(row);
      let { id } = row;
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: `${_this.$t("common.delete")}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.deleteFeedBack(id);
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
          let feedbackIdSet = [];
          _this.multipleSelection.forEach(feedback => {
            feedbackIdSet.push(feedback.id);
          });
          _this.deleteFeedBack(feedbackIdSet.toString());
        }
      });
    },
    async deleteFeedBack(id) {
      try {
        let formData = new FormData();
        formData.append("id", id);
        const res = await deleteFeedBack(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          console.log(res);
          this.$Message.success(this.$t("common.deleteSuccess"));
          this.queryFeedBackInfo();
        } else {
          this.$Message.error(this.$t("common.deleteFailure"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.deleteFailure"));
      }
    },
    async queryFeedBackInfo() {
      try {
        let formData = new FormData();
        formData.append("searchName", this.searchName);
        formData.append("page", this.currentPage);
        const res = await queryFeedBackInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          console.log(res);
          this.tableData = res.data;
          this.total = res.count;
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async getFeedBackList() {
      try {
        const res = await getFeedBackList({
          companyId: "",
          propertyId: "",
          page: this.currentPage,
          pageSize: this.pageSize,
          topicType: 1
        });
        if (res.code == 1) {
          console.log(res);
          // this.tableData = res.data;
          // this.total = res.count;
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("common.searchError"));
      }
    }
  },
  mounted() {
    this.queryFeedBackInfo();
    // this.getFeedBackList();
    this.$ebus.$on("/main/feedback/list", () => {
      this.queryFeedBackInfo();
    });
  },
  beforeDestroy() {
    this.$ebus.$off("/main/feedback/list");
  }
};
</script>

<style lang="less" scoped>
.haadPath {
  display: inline-block;
  width: 40px;
  height: 40px;
}
.container-feedback-list {
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