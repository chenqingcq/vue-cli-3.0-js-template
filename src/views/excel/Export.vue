<template>
  <div class="container-excel-export">
    <div class="header center">
      <div class="bream">{{$t('excel.title')}}</div>
    </div>
    <div class="content center">
      <div class="panel">
        <div class="item date">
          <div class="title">{{$t('excel.export.selectDate')}}</div>
          <div class="datepicker">
            <el-date-picker
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              v-model="formInline.startTime"
              type="datetime"
              :placeholder="$t('excel.export.endTime')"
            ></el-date-picker>
            <span>-</span>
            <el-date-picker
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              format="yyyy-MM-dd HH:mm:ss"
              v-model="formInline.endTime"
              type="datetime"
              :placeholder="$t('excel.export.startTime')"
            ></el-date-picker>
          </div>
        </div>
        <div class="item staff">
          <div class="title">{{$t('excel.export.selectOnes')}}</div>
          <el-cascader
            style="width:100%"
            :placeholder="$t('excel.export.selectOnes')"
            :clearable="true"
            :options="options"
            :props="{ expandTrigger: 'hover' }"
            @change="handleSelectChange"
            @visible-change="getData"
          ></el-cascader>
        </div>
        <div class="item submit">
          <div class="button center disable" @click="submit">{{$t('common.export')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { queryUserInfo, queryGroupInfo, report } from "@/api/reports";
import { reportReserve } from "@/api/room";
const LANG = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-LANGUAGE";

export default {
  name: "export-excel",
  data() {
    let _this = this;
    return {
      formInline: {
        startTime: moment(new Date()).format("YYYY-MM-DD 00:00:00"),
        endTime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
      },
      selected: [],
      type: 0, //0 人员 ; 1 分组
      options: []
    };
  },
  methods: {
    init() {
      this.options = [
        {
          value: "0",
          label: this.$t("excel.export.all")
        },
        {
          value: "1",
          label: this.$t("excel.export.group"),
          children: []
        },
        {
          value: "2",
          label: this.$t("excel.export.personnel"),
          children: []
        }
      ];
    },
    handleSelectChange(selection) {
      this.selected = [];
      if (selection[0] == 0) {
        this.options[2].children.forEach(item => {
          let { value } = item;
          this.selected.push(value);
        });
        this.type = 0;
      }
      if (selection[0] == 1) {
        this.selected = [selection[1]];
        this.type = 1;
      }
      if (selection[0] == 2) {
        this.selected = [selection[1]];
        this.type = 0;
      }
    },
    check() {
      let { startTime, endTime } = this.formInline;
      if (!startTime) {
        this.$Message.error(this.$t("common.plzEnterStartTime"));
        return false;
      }
      if (!endTime) {
        this.$Message.error(this.$t("common.plzEnterEndTime"));
        return false;
      }
      if (!this.selected.length) {
        this.$Message.error(this.$t("excel.export.plzEnterStaff"));
        return false;
      }
      return true;
    },
    submit() {
      let checked = this.check();
      if (checked) {
        this.report().then(res => {
          console.log(res);
          if (res.code == 1) {
            let { fileName, url } = res.data;
            this.download(url);
          } else {
            this.$Message.error(res.msg);
          }
        });
      }
    },
    download(url) {
      let a = document.createElement("a");
      link.download = encodeURI(encodeURI(this.$t("excel.export.fileName")));
      a.href = `${process.env.VUE_APP_BASE_API}${url}`;
      a.click();
    },
    formatType(staff) {
      let { type, sort, name } = staff;
      if (name == "默认分组" && type == 1) {
        return `${this.$t("common.default")} (${this.$t(
          "excel.export.staff"
        )})`;
      }
      if (name == "默认分组" && type == 2) {
        return `${this.$t("common.default")} (${this.$t(
          "excel.export.visitor"
        )})`;
      }
      return name;
    },
    getData(load) {
      if (!load) return;
      Promise.all([
        this.queryUserInfo(), //全部人员
        this.queryGroupInfo() //所有分组
      ]).then(res => {
        this.options[1].children = [
          ...res[1].data.map(item => {
            if (item) {
              return {
                value: item.id,
                label: this.formatType(item)
              };
            }
          })
        ];
        this.options[2].children = [
          ...res[0].data.map(item => {
            if (item) {
              return {
                value: item.visitorId,
                label: item.visitorName
              };
            }
          })
        ];
      });
    },
    async report() {
      try {
        let formData = new FormData();
        let language = window.localStorage.getItem(LANG) || "zh";

        formData.append("startTime", this.formInline.startTime);
        formData.append("endTime", this.formInline.endTime);
        formData.append("language", language);
        if (this.type == 0) {
          //人员visitorId
          formData.append("visitorId", this.selected.toString());
        }
        if (this.type == 1) {
          //分组groupId
          formData.append("groupId", this.selected.toString());
        }
        return await report(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } catch (err) {
        this.$Message.error(this.$t("excel.export.error"));
      }
    },
    async queryUserInfo(visitorType) {
      try {
        let formData = new FormData();
        if (visitorType) {
          formData.append("visitorType", visitorType);
        }
        return await queryUserInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async queryGroupInfo(groupType) {
      try {
        let formData = new FormData();
        if (groupType) {
          formData.append("groupType", groupType);
        }
        return await queryGroupInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    },
    async reportReserve() {
      try {
        let formData = new FormData();
        formData.append("searchName", this.spaceName);
        formData.append("operateType", this.operateType);
        formData.append("startTime", this.startTime);
        formData.append("endTime", this.endTime);
        formData.append("companyId", this.companyId);
        const res = await reportReserve(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1 && res.data) {
          console.log(res);
          let { url } = res.data;
          url && this.download(url);
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        this.$Message.error(this.$t("common.searchError"));
      }
    }
  },
  mounted() {
    this.init();
    this.$ebus.$on("changeLang", () => {
      this.init();
    });
  },
  beforeDestroy() {
    this.$ebus.$off("changeLang");
  }
};
</script>

<style lang="less" scoped>
.datepicker {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.container-excel-export {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #333;
  background: #fff;
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
    .panel {
      width: 450px;
      min-height: 400px;
      align-self: flex-start;
      margin-top: 40px;
      .item {
        margin-bottom: 24px;
        .title {
          margin-bottom: 10px;
        }
        &.submit {
          .button {
            height: 42px;
            border-radius: 4px;
            font-size: 18px;
            letter-spacing: 5px;
            color: #fff;
            background-color: #cccccc;
            background-image: #298df8;
            &:hover {
              cursor: pointer;
            }
            &.disable {
              background-color: #cccccc;
            }
          }
        }
      }
    }
  }
}
</style>