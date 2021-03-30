import { createApp } from 'vue'
import App from './App.vue'
import {lansPcCommonModule} from "./packages"
import ElementPlus,{ElMessage} from 'element-plus'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale/lang/zh-cn'
import 'element-plus/lib/theme-chalk/index.css';
createApp(App)
    .use(ElementPlus,{ locale })
    .use(lansPcCommonModule)
    .provide('$message', ElMessage)
    .mount('#app')