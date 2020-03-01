<template>
  <div class="container-header">
    <div class="title center"></div>
    <div class="settings">
      <div class="lang">
        <li class="center selected" @click="handleExpand">
          <span>{{language}}</span>
          <img :src="langIcon" :class="{active:expanded}" />
        </li>
        <ul class="lang-panel" v-show="expanded">
          <li
            :class="{active:lang == item.lang}"
            v-for="(item) in langList"
            :key="item.lang"
            @click="toggleLang(item.lang)"
          >{{item.title}}</li>
        </ul>
      </div>
      <div class="avator center">
        <img :src="avator" class="avator" @click="preview" alt=" " />
        <div class="panel center" @click="handleShowOperation">
          <span class="company">{{agencyName}}</span>
          <img :src="langIcon" :class="['arrow' , {active:showLogout}]" />
        </div>
        <ul v-show="showLogout">
          <li v-if="!showFullScreen" class="center logout" @click="launchFullscreen">
            <span>{{$t("header.fullscreen")}}</span>
            <img :src="fullScreenIcon" alt />
          </li>
          <li v-else class="center logout" @click="exitFullscreen">
            <span>{{$t("header.fullscreen")}}</span>
            <img :src="exitFullScreenIcon" alt />
          </li>
          <li class="center logout" @click="logout">
            <span>{{$t("login.logoutText")}}</span>
            <img :src="logoutIcon" alt />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import {
  launchFullscreen,
  exitFullscreen,
  isFullScreen
} from "@/utils/fullscreen";
import { logout } from "@/api/login";

const LANG = "IIM-INTELLIGENT-BUILDING-MANAGEMENT-SYSTEM-LANGUAGE";

export default {
  name: "bar",
  data() {
    return {
      showLogout: false,
      showFullScreen: false,
      showBack: false,
      backIcon: require("@/assets/svg/back.svg"),
      langIcon: require("@/assets/svg/lang.svg"),
      logoutIcon: require("@/assets/svg/logout.svg"),
      fullScreenIcon: require("@/assets/svg/fullscreen.svg"),
      exitFullScreenIcon: require("@/assets/svg/exitFullscreen.svg"),
      expanded: false,
      langList: [
        {
          title: "简体中文",
          lang: "zh"
        },
        {
          title: "English",
          lang: "en"
        },
        {
          title: "русский",
          lang: "ru"
        }
      ],
      lang: "zh",
      language: "简体中文"
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(url) {
        if (url.path.includes("robot-list")) {
          this.showBack = false;
        } else {
          this.showBack = true;
        }
      }
    }
  },
  computed: {
    ...mapGetters(["getAgencyInfo"]),
    avator() {
      if (this.getAgencyInfo) {
        let { headUrl } = this.getAgencyInfo;
        return process.env.VUE_APP_BASE_API + headUrl;
      }
    },
    agencyName() {
      if (this.getAgencyInfo) {
        return this.getAgencyInfo.agencyName;
      }
    }
  },
  methods: {
    ...mapMutations(["setAgencyInfo"]),
    preview() {
      let { headUrl } = this.getAgencyInfo;
      this.$previewImg({
        src: `${process.env.VUE_APP_BASE_API}${headUrl}`,
        style: {
          width: 500,
          height: 400,
          objectFit: "contain"
        }
      });
    },
    handleShowOperation() {
      this.showLogout = !this.showLogout;
    },
    isFullScreen() {
      return isFullScreen();
    },
    launchFullscreen() {
      launchFullscreen(document.documentElement || document);
      this.showFullScreen = true;
      this.showLogout = false;
    },
    exitFullscreen() {
      exitFullscreen();
      this.showFullScreen = false;
      this.showLogout = false;
    },
    handleShowLogout(status) {
      this.showLogout = status;
    },
    back() {
      this.$ebus.$emit("back");
      this.showBack = false;
      this.$router.push({
        path: "/main/robot-list",
        query: {
          ...this.$route.query
        }
      });
    },
    async logout() {
      try {
        let formData = new FormData();
        const res = await logout(formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        if (res.code == 1) {
          window.localStorage.setItem(process.env.TOKEN, "");
          this.setAgencyInfo("");
          this.$router.push("/login", () => {
            window.location.reload();
          });
        } else {
          this.$Message.error(this.$t("header.logoutError"));
        }
      } catch (err) {
        console.log(err);
        this.$Message.error(err.toString());
      }
    },
    handleExpand() {
      this.expanded = !this.expanded;
    },
    toggleLang(lang) {
      this.$i18n.locale = this.lang = lang;
      let { title } = this.langList.find(item => item.lang == lang);
      this.language = title;
      this.expanded = false;
      this.$ebus.$emit("changeLang", lang);
      window.localStorage.setItem(LANG, lang);
      document.title = this.$t(this.$route.meta.i18n);
    }
  },
  created() {
    let lang = window.localStorage.getItem(LANG) || "zh";
    this.lang = this.$i18n.locale = lang;
    let { title } = this.langList.find(item => item.lang == lang);
    this.language = title || "简体中文";
  },
  mounted() {
    console.log(this.getAgencyInfo);
  }
};
</script>

<style scoped lang='less'>
.container-header {
  padding: 0px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #333;
  .title {
    font-size: 16px;
    .back {
      display: inline-block;
      height: 50px;
      padding: 15px;
      padding-right: 5px;
      &:hover {
        cursor: pointer;
        transform: translateX(3px);
      }
    }
    .text {
      display: inline-block;
      width: auto;
      white-space: nowrap;
    }
  }
  .settings {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    .lang {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      // margin-right: 50px;
      .selected {
        width: 100px;
        &:hover {
          cursor: pointer;
        }
        span {
          margin-right: 10px;
          user-select: none;
          &.active {
            color: #298df8;
          }
        }
        img {
          display: inline-block;
          height: 14px;
          &.active {
            transform: rotate(-180deg);
          }
        }
      }
      .lang-panel {
        position: absolute;
        bottom: -120px;
        left: 0;
        border: 1px solid #ccc;
        border-radius: 3px;
        z-index: 99999999;

        li {
          padding: 5px 20px;
          height: 35px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          &.active {
            color: #298df8;
          }
          &:hover {
            cursor: pointer;
            color: #298df8;
            background: #d1e7fe;
          }
        }
      }
    }
    div.avator {
      height: 100%;
      margin-left: 10px;
      position: relative;
      img {
        display: inline-block;
        &.avator {
          height: 30px;
          width: 30px;
          border-radius: 50%;
          // border: 1px solid #ccc;
          margin-right: 10px;
          object-fit: cover;
        }
        &.arrow {
          height: 14px;
          margin-left: 10px;
          &.active {
            transform: rotate(-180deg);
          }
        }
      }
      .company {
        &:hover {
          cursor: pointer;
        }
      }
      ul {
        position: absolute;
        right: 0px;
        bottom: -70px;
        border: 1px solid #ccc;
        z-index: 9999999;
        background: #fff;
        li {
          width: auto;
          height: 30px;
          font-size: 16px;
          justify-content: space-between;
          color: #333;
          padding: 10px 15px;
          margin: 0;
          white-space: nowrap;
          &.logout {
            img {
              display: inline-block;
              height: 16px;
              margin-left: 10px;
            }
          }
          &:hover {
            cursor: pointer;
            color: #298df8;
            background: #d1e7fe;
          }
        }
      }
    }
    .logout {
      margin-left: 10px;
    }
  }
}
</style>