export default {
    install: (Vue) => {
        Vue.prototype.$ebus = new Vue();
    }
}