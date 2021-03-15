# Vue 3 + Typescript + Vite

This template should help get you started developing with Vue 3 and Typescript in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur). Make sure to enable `vetur.experimental.templateInterpolationService` in settings!

### If Using `<script setup>`

[`<script setup>`](https://github.com/vuejs/rfcs/pull/227) is a feature that is currently in RFC stage. To get proper IDE support for the syntax, use [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar) instead of Vetur (and disable Vetur).

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can use the following:

### If Using Volar

Run `Volar: Switch TS Plugin on/off` from VSCode command palette.

### If Using Vetur

1. Install and add `@vuedx/typescript-plugin-vue` to the [plugins section](https://www.typescriptlang.org/tsconfig#plugins) in `tsconfig.json`
2. Delete `src/shims-vue.d.ts` as it is no longer needed to provide module info to Typescript
3. Open `src/main.ts` in VSCode
4. Open the VSCode command palette 5. Search and run "Select TypeScript version" -> "Use workspace version"
# 初始化
+ 分支:dev
+ 安装:npm i
+ 运行:npm run dev
+ 发布：见下
# publish 发布的时候，已经自动更新版本号/建立新的分支
*** 开发阶段基本使用预发布版本：npm run pub，其他发布不要轻易操作 ***
*** 发布的时候，已经自动打包并且自动更新版本号，不需要手动修改 *** 
*** 发布的时候，已经自动映射新的分支保存发布版本，不需要更改git分支，始终在dev分支开发 ***
## 预发布版本
```
npm run pub
```
## 补丁号
```
npm run pub:patch
```
## 次版本
```
npm run pub:minor
```
## 主版本
```
npm run pub:major
```
