<template>
  <div class="container-login">
    <div class="left-logo center">
      <img :src="loignIcon" alt class="loginIcon" />
    </div>
    <div class="right-panel center">
      <div class="panel">
        <div class="lang">
          <div class="panel" @click="toggleLang">
            <span>{{lang}}</span>
            <img v-if="!showLang" :src="arrowDown" alt />
            <img v-else :src="arrowUp" alt />
          </div>
          <ul v-show="showLang">
            <li
              v-for="(item) in langs"
              :key="item.key"
              @click="hangdleSelectLang(item)"
            >{{item.lang}}</li>
          </ul>
        </div>
        <div class="system">{{$t("login.system")}}</div>
        <div class="title">{{$t("login.title")}}</div>
        <el-radio-group
          v-model="formInline.msUserType"
          @change="handleUsertypeChange"
          class="agencyType"
          style="width:100%"
        >
          <el-radio :label="2">{{$t('login.company')}}</el-radio>
          <el-radio :label="3">{{$t('login.property')}}</el-radio>
        </el-radio-group>
        <div class="account">
          <Input
            v-model.trim="formInline.account"
            :maxlength="30"
            :placeholder="$t('login.plzIptAccount')"
            :clearable="true"
            :autofocus="true"
            autocomplete="off"
            ref="account"
            type="text"
            id="account"
          />
        </div>
        <div class="psw">
          <Input
            v-model.trim="formInline.psw"
            :placeholder="$t('login.plzIptPsw')"
            :maxlength="30"
            :clearable="true"
            autocomplete="off"
            type="password"
            id="psw"
          />
        </div>
        <!-- <div class="checkcode">
          <input
            type="text"
            id="checkcode"
            :placeholder="$t('login.plzIptCheckcode')"
            v-model.trim="formInline.checkcode"
            maxlength="6"
          />
          <div class="captcha">
            <img :src="formInline.captcha" alt />
          </div>
        </div>-->
        <Button
          :disabled="disabled"
          :loading="loading"
          :class="['login' , { active: !disabled } ]"
          @click="handleLogin"
          style="width:100%;outline:none"
        >{{$t("login.loginText")}}</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { login, getToken } from "@/api/login";
import { mapGetters, mapMutations } from "vuex";
const LANG = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-LANGUAGE";
const USER_TYPE = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-USER-TYPE";

export default {
  name: "login",
  data() {
    return {
      loignIcon: require("@/assets/img/pic_login.png"),
      arrowDown: require("@/assets/svg/arrowDown.svg"),
      arrowUp: require("@/assets/svg/arrowUp.svg"),
      loading: false,
      timer: null,
      showLang: false,
      lang: "简体中文",
      langs: [
        { lang: "简体中文", key: "zh" },
        { lang: "English", key: "en" },
        { lang: "русский", key: "ru" }
      ],
      formInline: {
        msUserType: 1,
        account: "",
        psw: "",
        checkcode: "",
        captcha: "",
        accountIcon: require("@/assets/svg/account.svg"),
        pswIcon: require("@/assets/svg/password.svg")
      }
    };
  },
  computed: {
    disabled() {
      let { psw, account } = this.formInline;
      if (psw && account) {
        return false;
      }
      return true;
    }
  },
  methods: {
    ...mapMutations(["setAgencyInfo"]),
    handleUsertypeChange() {
      window.localStorage.setItem(USER_TYPE, this.formInline.msUserType);
    },
    toggleLang() {
      this.showLang = !this.showLang;
    },
    hangdleSelectLang({ lang, key }) {
      this.lang = lang;
      this.$i18n.locale = key;
      this.showLang = false;
      window.localStorage.setItem(LANG, key);
    },
    handleLogin() {
      if (this.check()) {
        this.login();
      } else {
        window.localStorage.setItem(process.env.TOKEN, "");
        this.setAgencyInfo("");
      }
    },
    async login() {
      try {
        this.loading = true;
        let formData = new FormData();
        formData.append("userAccount", this.formInline.account);
        formData.append("passWord", this.$md5(this.formInline.psw));
        formData.append("msUserType", this.formInline.msUserType);
        const result = await login(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        let _formData = new FormData();
        _formData.append("token", result.data.token);
        const token = await getToken(_formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (result.code == 1) {
          window.localStorage.setItem(process.env.TOKEN, result.data.token);
          let userInfo = Object.assign({}, result.data, {
            agencyType: this.formInline.msUserType,
            extraToken: token
          });
          this["setAgencyInfo"](userInfo);
          this.$router.push({
            path: "/main"
          });
        } else {
          this.$Message.error(this.$t("login.loginError"));
          window.localStorage.setItem(process.env.TOKEN, "");
          this.setAgencyInfo("");
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(this.$t("login.netWorkError"));
        window.localStorage.setItem(process.env.TOKEN, "");
        this.setAgencyInfo("");
      } finally {
        this.loading = false;
      }
    },
    check() {
      if (!this.formInline.account) {
        this.$Message.error(this.$t("login.plzIptAccount"));
        return false;
      }
      if (!this.formInline.psw) {
        this.$Message.error(this.$t("login.plzIptPsw"));
        return false;
      }
      // if (!this.formInline.checkcode) {
      //   this.$Message.error(this.$t("login.plzIptCheckcode"));
      //   return false;
      // }
      return true;
    }
  },
  created() {
    let language = window.localStorage.getItem(LANG) || "zh";
    let msUserType = window.localStorage.getItem(USER_TYPE);
    let { lang } = this.langs.find(lang => lang.key == language);
    this.$i18n.locale = language;
    this.lang = lang || "简体中文";
    this.formInline.msUserType = parseInt(msUserType) || 2;
  },
  mounted() {
    window.addEventListener("keydown", e => {
      if (e.keyCode === 13 && this.$route.path.includes("login")) {
        this.handleLogin();
      }
    });
  },
  beforeDestroy() {
    this.timer && clearTimeout(this.timer);
  }
};
</script>

<style scoped lang="less">
.container-login {
  color: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  font-family: "AlibabaPuHuiTiR";
  .left-logo {
    flex: 1;
    height: 100%;
    background: linear-gradient(135deg, #3503ba, #0d0757);
    img {
      display: inline-block;
      width: 85%;
    }
  }
  .right-panel {
    position: relative;
    width: 36%;
    min-width: 560px;
    height: 100%;
    .system {
      position: absolute;
      left: 20px;
      top: 20px;
      width: auto;
      height: auto;
      font-size: 24px;
      color: #000;
      letter-spacing: 5px;
      font-family: PingFang-SC-Regular;
    }
    .lang {
      position: absolute;
      right: 20px;
      top: 20px;
      width: 120px;
      height: auto;
      font-size: 16px;
      color: #999;
      .panel {
        height: 30px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        user-select: none;
        img {
          display: inline-block;
          height: 50%;
          margin-right: 20px;
        }
        &:hover {
          cursor: pointer;
        }
      }
      ul {
        width: 120px;
        margin-top: 15px;
        background: #fff;
        border-radius: 5px;
        color: #333;
        font-size: 14px;
        overflow: hidden;
        border: 1px solid #ccc;
        li {
          padding: 10px 15px;
          border-bottom: 1px solid #ccc;
          &.active {
            color: #298df8;
          }
          &:hover {
            background: hsla(0, 0%, 80%, 0.1);
            color: #298df8;
            cursor: pointer;
          }
        }
      }
    }
    > .panel {
      min-width: 340px;
      margin-top: -100px;
      height: 300px;
      .title {
        text-align: left;
        font-size: 24px;
        font-weight: 500;
        border: none;
        margin-bottom: 30px;
        color: #333;
      }
      .login {
        user-select: none;
        border: none;
        height: 35px;
        text-align: center;
        background: #dcdfe6;
        color: #fff;
        font-size: 20px;
        padding: 0;
        &.active {
          background: #409eff;
        }
        &:not([disabled]) {
          :hover {
            cursor: pointer;
          }
        }
      }
      > div.account,
      div.role,
      div.psw,
      div.checkcode,
      div.agencyType {
        height: 35px;
        // border: 2px solid #a3b1bf;
        margin-bottom: 30px;
        // border-radius: 4px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        overflow: hidden;
        label {
          // width: 26px;
          width: auto;
          padding: 0px 15px;
          height: 100%;
          display: flex;
          align-items: center;
          &:hover {
            cursor: pointer;
            background: rgba(64, 158, 255, 0.1);
          }
          img {
            display: inline-block;
            width: 60% !important;
            height: 60% !important;
          }
        }
        input {
          display: inline-block;
          border-radius: 0px;
          flex: 1;
          height: 100%;
          font-size: 16px;
          // padding-left: 20px;
          outline: none;
          background: #fff !important;
        }
        .captcha {
          width: 100px;
          height: 100%;
          img {
            display: inline-block;
            width: 100%;
            height: 100%;
          }
        }
      }
      div.role {
        > div {
          width: 100%;
          display: flex;
          justify-content: space-around;
          align-items: center;
        }
      }
    }
  }
}
</style>