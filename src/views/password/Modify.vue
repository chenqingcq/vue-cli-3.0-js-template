<template>
  <div class="container-password-modify">
    <div class="header center">
      <div class="bream">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:16px">
          <el-breadcrumb-item>{{$t('psw.header')}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="content center">
      <div class="panel">
        <div class="item password">
          <div class="title">{{$t('psw.modify.old')}}</div>
          <Input
            v-model.trim="formInline.oldPsw"
            type="password"
            :placeholder="$t('psw.modify.old')"
            clearable
          />
        </div>
        <div class="item password">
          <div class="title">{{$t('psw.modify.new')}}</div>
          <Input
            v-model.trim="formInline.password"
            type="password"
            :placeholder="$t('psw.modify.new')"
            clearable
          />
        </div>
        <div class="item password">
          <div class="title">{{$t('psw.modify.confirm')}}</div>
          <Input
            v-model.trim="formInline.confirmPsw"
            type="password"
            :placeholder="$t('psw.modify.confirm')"
            clearable
          />
        </div>
        <div class="item submit" @click="submit">
          <div class="button center disable">{{$t('common.submit')}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { updatePassword } from "@/api/password";
export default {
  name: "password-modify",
  data() {
    return {
      formInline: {
        oldPsw: "",
        password: "",
        confirmPsw: ""
      }
    };
  },
  computed: {
    ...mapGetters(["getAgencyInfo"])
  },
  methods: {
    ...mapMutations(["setAgencyInfo"]),
    check() {
      let { oldPsw, password, confirmPsw } = this.formInline;
      if (!oldPsw) {
        this.$Message.error(this.$t("psw.modify.old"));
        return false;
      }
      if (!password) {
        this.$Message.error(this.$t("psw.modify.new"));
        return false;
      }
      if (!confirmPsw) {
        this.$Message.error(this.$t("psw.modify.confirm"));
        return false;
      }
      if (this.$md5(password) != this.$md5(confirmPsw)) {
        this.$Message.error(this.$t("psw.modify.differ"));
        return false;
      }
      return true;
    },
    submit() {
      let checked = this.check();
      let _this = this;
      if (!checked) return;
      this.$toast({
        title: `${_this.$t("common.confirm")}?`,
        content: `${_this.$t("common.confirm")}${_this.$t("common.submit")}?`,
        onOkText: _this.$t("common.confirm"),
        onConcelText: _this.$t("common.cancel"),
        onOk() {
          _this.updatePassword();
        }
      });
    },
    async updatePassword() {
      try {
        let { oldPsw, password, confirmPsw } = this.formInline;
        let { userId } = this.getAgencyInfo || {};
        let formData = new FormData();
        formData.append("userId", userId);
        formData.append("passWord", this.$md5(oldPsw));
        formData.append("newPassWord", this.$md5(password));
        const res = await updatePassword(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          this.$Message.success(this.$t("psw.modify.success"));
          setTimeout(() => {
            this.$router.push("/login", () => {
              this.setAgencyInfo("");
              window.localStorage.setItem(process.env.TOKEN, "");
              window.location.reload();
            });
          }, 1000);
        } else {
          this.$Message.error(this.$t("psw.modify.pswError"));
        }
      } catch (err) {
        this.$Message.error(this.$t("login.netWorkError"));
      }
    }
  }
};
</script>

<style lang="less" scoped>
.container-password-modify {
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #333;
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
      align-self: flex-start;
      margin-top: 40px;
      width: 400px;
      .item {
        margin-bottom: 24px;
        .title {
          margin-bottom: 15px;
        }
        &.submit {
          &:hover {
            cursor: pointer;
          }
          .button {
            height: 42px;
            border-radius: 4px;
            font-size: 18px;
            letter-spacing: 5px;
            color: #fff;
            background: linear-gradient(90deg, #3172ff 0%, #419aee 100%);
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