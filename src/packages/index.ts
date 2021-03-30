export * from "./types";
export * from "./components";
export * from "./utils"
import { components } from "./components"; 


export const lansPcCommonModule:any = {
    install: (app:any, options:Object) => {
      
      console.log('lans-common')
      // 添加全局实例方法
    //   app.config.globalProperties.$config = config;
 
      // 添加全局指令

      // 添加全局组件
      components.forEach(component => {
          app.component(`lans-${component.name}`, component);
      });
    },
}


