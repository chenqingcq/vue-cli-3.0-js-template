import Vue from 'vue'
import Router from 'vue-router';
import { routes } from './routes.config';
Vue.use(Router);

const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
}
const router = new Router({
  routes: [...routes]
});
const whiteList = ['/login', '/logout'] //登录白名单避免死循环


router.beforeEach((to, from, next) => {
  if (window.localStorage.getItem(process.env.TOKEN)) {
    next();
  } else {
    if (whiteList.includes(to.path)) { // 在免登录白名单，直接进入
      next();
    } else {
      next('/login'); // 否则全部重定向到登录页
    }

  }
});
export default router;
