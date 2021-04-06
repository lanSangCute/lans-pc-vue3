export * from "./components";
// export * from "./types";
// export * from "./utils"
import * as componentsAll from "./components"; 

export const lansPcCommonModule:any = {
    install: (app:any, options:Object) => {
      
      console.log('install：lans-common');
      // 添加全局实例方法
      //   app.config.globalProperties.$config = config;
 
      // 添加全局指令

      // 添加全局组件
      Object.values(componentsAll).forEach(component => {
          app.component(`lans-${component.name}`, component);
      });
    }
}


