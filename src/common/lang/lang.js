import VueI18n from 'vue-i18n';
import Vue from 'vue';
import zh from './zh-CN';
import en from './en-US';
import ru from './ru-RU';

const LANG = "IIM-SMARTEYE-MANAGEMENT-SYSTEM-LANGUAGE";

Vue.use(VueI18n); // 通过插件的形式挂载

/**
 *  通过this.$i18n.locale = "zh" | "en" | "ru"切换语言
 */
const i18n = new VueI18n({
    locale: window.localStorage.getItem(LANG) || 'zh', // 语言标识
    messages: {
        'zh': zh, // 中文语言包
        'en': en, // 英文语言包
        'ru': ru  // 俄文语言包
    },
    silentTranslationWarn: true
})
export default i18n;