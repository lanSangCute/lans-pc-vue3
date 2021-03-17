export * from "./interface";
import { components } from "./components"; 
import { defineAsyncComponent } from 'vue'

const publish = 'lans-vue3';
export const mspPcCommonModule:any = {
    install: (app:any, options:Object) => {
      
      console.log('install：msp-common')
      // 添加全局实例方法
    //   app.config.globalProperties.$config = config;
 
      // 添加全局指令

      // 添加全局组件
      components.forEach(component => {
            app.component(`${publish}-${component.name}`, defineAsyncComponent(() =>
                import(`./components/${component.url}`)
            ));

        });
    },
}


