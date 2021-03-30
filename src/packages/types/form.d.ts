type ResizeTextArea = 'none' | 'both' | 'horizontal' | 'vertical'
export type FormItemType = 'input' | 'render' | 'string' | 'empty'
    | 'stringOptions'
    | 'input'
    | 'textarea'
    | 'email'
    | 'number'
    | 'inputNumber'
    | 'select'
    | 'multiselect'
    | 'groupselect'
    | 'radio'
    | 'time'
    | 'date'
    | 'datetime'
    | 'daterange'
    | 'datetimerange'
    | 'checkbox'
    | 'cascader'
    | 'switch'

    
interface optionsChildren {
    label:String | Number;
    value:String | Number;
    disabled?:Boolean;
    children?:optionsChildren[]
}
export interface Options{
    label:String | Number;
    value:String | Number;
    disabled?:Boolean;
    children?:optionsChildren[];
}

export interface FormItem{
    disabled?:Boolean;
    key:string;//对应formItem的prop,必传
    label?:string;//对用formItem的label
    placeholder?:string;//提示
    type?:FormItemType;//类型
    options?:Array<Options> | Function;//选项相关有此字段。比如select/checkbox
    backOptionFunction?:Function;//选项相关有此字段。比如select/checkbox
    required?:boolean;//是否必填项
    col?:number;//代表占据的空间。比如总col为4，此col为2 相当于一半空间
    fullLine?:boolean;//代表占据的空间。是否占据全行
    className?:string;//针对formItem的class
    noLabel?:boolean;//去除label，包含对应的dom空间
    rules?:object;//规则
    default?:String | Boolean | Number | Function | Array<any>;//默认值
    changeToEmit?:Boolean;//是否在该字段发生变化的时候，触发事件更新
    render?:Function;//type为render时，此字段必传。此字段只有对应type=render有效
    rows?:number;//type=textarea有效
    resize?:ResizeTextArea;//type=textarea有效
    timeFormat?:string;//时间相关类型有效。比如datetime
    keyRange?:object;//时间区间类型有效。比如datetimeRange
    'default-time'?:Array<Date>;//时间区间类型有效。比如datetimeRange
    showSelectAll?:Boolean;//针对type=“multiselect”和type=“checkbox”,disabled为false有效，是否展示多选按钮
    telFixed?:Boolean;//针对type=number,是否是固定电话
    telMoblie?:Boolean;//针对type=input,是否是固移动电话
    getShowValueHandle?:Function;
    attrs?:object;
    props?:object;
    on?:object;
    itemProps?:object;
    // directives?:object|any;
    // domProps?:object;
    // scopedSlots?:object|any;
    // slot?:object|any;
    // class?:object|any;
    // style?:object|any;
    // nativeOn?:object|any;
    dependon?:Array<any>;
    optionsPostfixSlot?:any;
    optionsPrefixSlot?:any;
    selectPrefixSlot?:any;
}

/**
 *
 * @description element-plus:Form Methods
 * @export
 * @interface ElComponentFormComps
 */
 export interface ElComponentFormComps {
    validate:()=>Promise<Boolean>;//对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise:做第二种，不传回调参数，返回一个promise
    validateField:(props: Array<any> | String, callback: (errorMessage: String)=>void)=>void;//对部分表单字段进行校验的方法
    resetFields:()=>void;//对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
    clearValidate:(props: Array<any> | String)=>void;//移除表单项的校验结果。传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果
}