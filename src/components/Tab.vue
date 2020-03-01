<template>
  <div class="container-tab">
    <div class="logo">
      <img :src="logo" alt @click="reload" />
    </div>
    <ul>
      <li
        v-for="(item, index) in tabs"
        :class="['center' , {active:currentActive[0] == index  }]"
        :key="index"
      >
        <div
          :class="['title', 'center' , { active:currentActive[0] == index && !item.children.length}]"
          @click="showSubItems(item , index)"
        >
          <div>{{$t(item.i18n)}}</div>
          <div :class="['avator' , {active:item.show}]" v-show="item.children.length">
            <img :src="arrow" alt=" " />
          </div>
        </div>
        <ul v-if="item.children.length" class="subItems" v-show="item.show">
          <li
            @click="select(subItem, index, $index)"
            v-for="(subItem ,$index) in item.children"
            :key="$index"
            :class="['center' , {active:currentActive[0] == index && currentActive[1] == $index}]"
          >{{$t(subItem.i18n)}}</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { logout } from "@/api/login";
import { tab } from "@/common/tabConfig/tab";
const CURRENT_INDEX = "IIM-SMARTEYE-MANAGEMENT-SYSTEM-CURRENT-INDEX";

export default {
  name: "tab-menu",
  data() {
    return {
      currentRoute: "",
      currentActive: [],
      logo: require("@/assets/svg/logo_blue.svg"),
      arrow: require("@/assets/svg/arrowDown.svg"),
      tabs: [...tab]
    };
  },
  methods: {
    reload() {
      window.location.reload();
    },
    navigate(path) {
      this.$ebus.$emit(path);
      if (path != this.currentRoute) {
        this.currentRoute = path;
        this.$router.push({
          path
        });
      }
    },
    select(subItem, index, $index) {
      this.currentActive = [index, $index];
      this.navigate(subItem.router);
    },
    showSubItems(item, index) {
      console.log(item, index);
      this.tabs.forEach(menu => {
        if (menu) {
          menu.show = false;
        }
      });
      if (item.children.length) {
        item.show = !item.show;
      } else {
        this.currentActive = [index];
        this.navigate(item.router);
      }
    },
    async logout() {
      this.$router.push("/login");
      window.localStorage.setItem(process.env.TOKEN, "");
      window.localStorage.setItem(CURRENT_INDEX, 0);
    }
  },
  mounted() {
    this.$ebus.$on("changeIndex", index => {
      this.currentActive = index;
    });
    this.$ebus.$on("statistics-jump-to-personnel", (index, subIndex) => {
      this.currentActive = [index, subIndex];
      this.tabs.forEach((menu, $index) => {
        if ($index == index) {
          menu.show = true;
        } else {
          menu.show = false;
        }
      });
    });
  },
  beforeDestroy() {
    this.$ebus.$off("/main/visitor/list");
    this.$ebus.$off("changeIndex");
  }
};
</script>

<style lang="less" scoped>
.container-tab {
  background: #17263c;
  color: #fff;
  .logo {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: 20px;
    width: 100%;
    height: 60px;
    img {
      display: block;
      width: 120px;
      &:hover {
        cursor: pointer;
      }
    }
  }
  ul {
    // margin-top: 20px;
    > li {
      width: 100%;
      // height: 48px;
      justify-content: flex-start;
      flex-wrap: wrap;
      font-size: 16px;
      padding: 0px 20px;
      color: #fff;
      user-select: none;
      &.active {
        background: #12192c;
      }
      &:hover {
        cursor: pointer;
        // color: #298df8;
        // font-size: 17px;
        background: #12192c;
      }
      .title {
        width: 100%;
        height: 48px;
        justify-content: space-between;
        &.active {
          color: #298df8;
        }
        .avator {
          user-select: none;
          &.active {
            transform: rotate(180deg);
          }
          img {
            display: inline-block;
            width: 10px;
          }
        }
      }
      .subItems {
        li {
          height: 48px;
          width: 100%;
          justify-content: flex-start;
          padding-left: 20px;
          color: #fff;
          &.active {
            background: #12192c;
            color: #298df8;
          }
        }
      }
    }
  }
}
</style>