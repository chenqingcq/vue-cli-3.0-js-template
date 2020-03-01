import Toast from './toast.vue';
let instance = null;
export default (Vue) => {
    Vue.prototype.$toast = (options = {}) => {
        options = Object.assign({}, {
            show: true,
            title: '确认',
            content: "",
            onOkText: "确认",
            onConcelText: "取消",
            onOk() { },
            onConcel() { }
        }, options);
        let ToastConstructor = Vue.extend(Toast, "Toast");
        instance = new ToastConstructor({
            data() {
                return {
                    show: options.show,
                    title: options.title,
                    content: options.content,
                    onOk: options.onOk,
                    onOkText: options.onOkText,
                    onConcel: options.onConcel,
                    onConcelText: options.onConcelText,
                }
            }
        });
        document.body.appendChild(instance.$mount().$el)
    };
}