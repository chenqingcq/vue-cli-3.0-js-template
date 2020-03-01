<template>
  <div class="container-robot-add">
    <div class="header center">
      <div class="bream">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:16px">
          <el-breadcrumb-item :to="{ path: '/main/robots' }">{{$t("robots.list.title")}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{$t("robots.add.title")}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="panel center">
      <div class="panel">
        <div class="item">
          <el-form
            style="width:100%"
            label-position="right"
            :model="formInline"
            :rules="rules"
            ref="addForm"
            class="demo-ruleForm"
          >
            <el-form-item :label="$t('robots.add.name')" prop="name">
              <el-input
                v-model.trim="formInline.name"
                :placeholder="$t('robots.add.plzIptName')"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('robots.add.SN')" prop="identifier">
              <el-input
                v-model.trim="formInline.identifier"
                :placeholder="$t('robots.add.plzIptSN')"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('robots.add.type')" prop="robotType">
              <el-select
                style="width:100%"
                v-model="formInline.robotType"
                :placeholder="$t('robots.add.plzSelectType')"
              >
                <el-option
                  v-for="item  in robotTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('robots.add.model')" prop="robotModel">
              <el-select
                style="width:100%"
                v-model="formInline.robotModel"
                @visible-change="queryRobotModelInfo"
                :placeholder="$t('robots.add.plzSelectModel')"
              >
                <el-option
                  v-for="item  in robotModelOptions"
                  :key="item.value"
                  :label="item.label"
                  :title="item.value"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div class="item submit center">
          <div class="button center" @click="submit('addForm')">{{$t('common.add')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  addRobotsInfo,
  queryRobotType,
  queryRobotModelInfo
} from "@/api/robots";

export default {
  name: "staff-edit",
  data() {
    let _this = this;
    return {
      formInline: {
        name: "",
        identifier: "",
        robotType: "",
        robotModel: ""
      },
      rules: null,
      robotModelOptions: [],
      robotTypeOptions: [
        {
          value: "1",
          label: "Solaris"
        },
        {
          value: "2",
          label: "Ego"
        },
        {
          value: "3",
          label: "Smarteye"
        },
        {
          value: "4",
          label: "Iknow"
        },
        {
          value: "5",
          label: "Alpha"
        },
        {
          value: "6",
          label: "Tianbo"
        }
      ]
    };
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
        ],
        robotType: [
          {
            required: true,
            message: this.$t("robots.add.plzSelectType"),
            trigger: "change"
          }
        ],
        robotModel: [
          {
            required: true,
            message: this.$t("robots.add.plzSelectModel"),
            trigger: "change"
          }
        ]
      };
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.addRobot();
        }
      });
    },
    reset() {
      Object.assign(this.formInline, {
        name: "",
        identifier: "",
        robotType: "",
        robotModel: ""
      });
    },
    addRobot() {
      let _this = this;
      this.$toast({
        title: _this.$t("common.confirm"),
        content: _this.$t("robots.add.plzSelectModel") + "?",
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.addRobotsInfo();
        }
      });
    },
    async queryRobotModelInfo(show) {
      if (!show) return;
      try {
        let formData = new FormData();
        const res = await queryRobotModelInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          this.robotModelOptions = res.data.map(item => {
            if (item) {
              let { robotModel, robotModelName, robotModelComnt } = item;
              let label = `${robotModelName} ${
                robotModelComnt ? `( ${robotModelComnt} )` : ""
              } `;
              return {
                label,
                value: robotModel
              };
            }
          });
        } else {
          this.$Message.error(this.$t("common.searchError"));
        }
      } catch (err) {
        this.$Message.error(err.toString());
      }
    },
    async addRobotsInfo() {
      try {
        let formData = new FormData();
        let { name, identifier, robotType, robotModel } = this.formInline;
        formData.append("name", name);
        formData.append("identifier", identifier);
        formData.append("robotType", robotType);
        formData.append("robotModel", robotModel);
        const res = await addRobotsInfo(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          this.$Message.success(this.$t("common.saveSuccess"));
        } else {
          this.$Message.error(this.$t("common.saveFailure") + res.msg);
        }
      } catch (err) {
        this.$Message.error(err.toString());
      }
    }
  },
  created() {
    this.initRules();
  },
  mounted() {
    this.$ebus.$on("changeLang", this.initRules);
  },
  beforeDestroy() {
    this.$ebus.$off("changeLang");
  }
};
</script>

<style lang="less" scoped>

.container-robot-add {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #333;
  .header {
    height: 60px;
    justify-content: flex-start;
    border-bottom: 1px solid #f0f0f0;
    .bream {
      margin-left: 20px;
      font-size: 16px;
    }
  }
  > .panel {
    height: calc(100% - 60px);
    overflow-y: auto;
    padding: 20px 0;
    .panel {
      width: 400px;
      height: 100%;
      .item {
        margin-bottom: 24px;
        .title {
          margin-bottom: 10px;
        }
        &.upload {
          .content {
            display: flex;
            .avator {
              width: 180px;
              height: 140px;
              border-radius: 2px;
              img {
                display: inline-block;
                width: 100%;
                height: 100%;
              }
            }
            .button {
              position: relative;
              width: 120px;
              height: 42px;
              border-radius: 4px;
              background-color: #ededed;
              margin-left: 20px;
              &:hover {
                cursor: pointer;
                color: #000;
                border: 1px solid #ccc;
              }
              input {
                display: inline-block;
                width: 100%;
                height: 100%;
                opacity: 0;
                left: 0;
                top: 0;
                z-index: 999;
                position: absolute;
                &:hover {
                  cursor: pointer;
                }
              }
            }
          }
        }
        &.name,
        &.dueTime {
          input {
            display: inline-block;
            height: 42px;
            line-height: 42px;
            width: 100%;
            border-radius: 4px;
            background: none;
            outline: none;
            border: 1px solid #ccc;
            padding-left: 12px;
            &:focus {
              border: 1px solid #419aee;
            }
          }
        }
        &.account {
          .content {
            display: flex;
            .account {
              width: 100px;
              height: 40px;
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
              text-align: center;
              line-height: 42px;
            }
            .button {
              width: 120px;
              height: 42px;
              border-radius: 4px;
              background-color: #ededed;
              margin-left: 20px;
              color: #ff5b5b;
              &:hover {
                cursor: pointer;
                border: 1px solid #ff5b5b;
              }
            }
          }
        }
        &.tags {
          .hint {
            margin-bottom: 12px;
            color: #999;
            font-size: 12px;
          }
          .content {
            width: 100%;
            margin-bottom: 12px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            text-align: justify;
            &::after {
              content: " ";
              width: 30%;
            }
            .selectable {
              color: #333;
              margin-right: 15px;
              border-radius: 0px;
              color: #333;
              border: none;
              background-color: #ededed;
              height: 35px;
              padding: 10px;
              margin-bottom: 10px;
            }
            .selected {
              margin-right: 15px;
              border-radius: 0px;
              color: #333;
              margin-bottom: 10px;
            }
            .add {
              font-size: 18px;
            }
          }
        }
        &.submit {
          .button {
            width: 100%;
            height: 42px;
            border-radius: 4px;
            font-size: 18px;
            letter-spacing: 5px;
            color: #fff;
            background: linear-gradient(90deg, #3172ff 0%, #419aee 100%);

            &:hover {
              cursor: pointer;
            }
            &.disable {
              background-color: #cccccc;
              cursor: not-allowed;
              pointer-events: none;
            }
          }
        }
      }
    }
  }
}
</style>