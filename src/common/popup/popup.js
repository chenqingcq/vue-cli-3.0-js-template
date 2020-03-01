import Popup from './popup.vue';
export default (Vue) => {
    Vue.prototype.$popup = (options = {}) => {
        options = Object.assign({}, {
            show: true,
            content: "",
            duration: 2000
        }, options)
        let PopupConstructor = Vue.extend(Popup);
        let instance = new PopupConstructor({
            data() {
                return {
                    show: options.show,
                    duration: options.duration,
                    content: options.content,
                }
            }
        });
        document.body.appendChild(instance.$mount().$el)
    }
}