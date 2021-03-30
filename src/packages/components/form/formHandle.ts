import { FormItem, ElComponentFormComps } from '../../types';
import { TimeUtils } from '../../utils'
export class FormDataHandle{
    constructor(){
        this.getInitFormData = this.getInitFormData.bind(this)
    }
    // default
    getInitFormData(configs:Array<FormItem>|Function,configData?:Array<FormItem>):Object{
        if(!Array.isArray(configs)){
            return {};
        }
        configs = configs || configData;

        let formData = {};

        configs.map((config:FormItem) => {
            let defaultData:any =
                config.type === 'inputNumber'
                    ?0
                    :config.type === 'checkbox' || config.type === 'multiselect'
                    ?[]:null;

            if (typeof config.default === "function") {
                defaultData = config.default();
            } else if (typeof config.default !== "undefined") {
                defaultData = config.default;
            }

            (formData as any)[config.key] = defaultData;
        });

        return formData;
    }
    // options
    async loadItemAsyncData(config:FormItem, configIndex:number,formData:Object) {
        const optionsTypes = [
            'select',
            'groupselect',
            'multiselect',
            'checkbox',
            'cascader',
            'radio',
            'stringOptions'
        ];
        if (
            optionsTypes.includes(config.type || '')&&
            (typeof config.options === "function" ||
                typeof config.backOptionFunction === "function")
        ) {
            let options = [];

            if (typeof config.options === "function") {
                config.backOptionFunction = config.options;

                options = await config.options(formData);
            } else if (typeof config.backOptionFunction === "function") {
                options = await config.backOptionFunction(formData);
            }
            return {
                optionsTypesYn:true,
                options
            };
        }
        return {
            optionsTypesYn:false,
            options:[]
        };
    }
    // formData
    getFormData(configData:Array<FormItem>,formData:Object):Object{
        let newFormData = {...formData};
        (configData || []).map(item => {
            const key = item.key,
                val = (newFormData as any)[key];
            if (typeof val === "string") {
                (newFormData as any)[key] = val && val.trim();
            }

            if ((item.type === 'multiselect' || item.type === 'checkbox') && JSON.stringify(val) === '[]') {
                (newFormData as any)[key] = null;
            }

            let timeFormat =
                item.timeFormat ||
                (item.type === "datetimerange" || item.type === 'datetime'
                    ? "YYYY-MM-DD HH:mm:ss"
                    : "YYYY-MM-DD");

            try{
                const type = item.type || "input";
                const {formatting} = new TimeUtils();
                if(val){
                    if(['datetime','date'].includes(type)){
                        (newFormData as any)[key] = formatting(val,timeFormat)
                    }
                    if(['daterange','datetimerange'].includes(type)){
                        const start = formatting(val[0],timeFormat),
                            end = formatting(val[1],timeFormat);
                        (newFormData as any)[key] = [start,end];
                        if(Array.isArray(item.keyRange)){
                            (newFormData as any)[item.keyRange[0]] = start;
                            (newFormData as any)[item.keyRange[1]] = end;
                        }
                    }
                }
            }catch(e){
                console.error(e);
            }
        });
        return newFormData;
    }
}

export class ElComponentFormMethods implements ElComponentFormComps{
    refForm:Object | any;
    constructor(refForm?:Object | any){
        this.refForm = refForm;
    }
    validate():Promise<Boolean>{
        return (this.refForm as any).validate(...arguments);
    };//对整个表单进行校验的方法，参数为一个回调函数。该回调函数会在校验结束后被调用，并传入两个参数：是否校验成功和未通过校验的字段。若不传入回调函数，则会返回一个 promise:做第二种，不传回调参数，返回一个promise
    validateField(props: Array<any> | String, callback: (errorMessage: String)=>void):void{
        (this.refForm as any).validateField(props,callback);
    };//对部分表单字段进行校验的方法
    resetFields():void{
        (this.refForm as any).resetFields();
    };//对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
    clearValidate(props: Array<any> | String):void{
        (this.refForm as any).clearValidate(props);
    };//移除表单项的校验结果。传入待移除的表单项的 prop 属性或者 prop 组成的数组，如不传则移除整个表单的校验结果
}

export class RulesHandle{
    item:FormItem;
    constructor(item:FormItem){
        this.item = item;
        this.getRequiredRules = this.getRequiredRules.bind(this);
        this.getEmailRules = this.getEmailRules.bind(this);
        this.getTelMoblieRules = this.getTelMoblieRules.bind(this);
        this.getTelFixedRules = this.getTelFixedRules.bind(this);
    }
    getRequiredRules(){
        const { item } =this
        let requiredRule = null
        if (item.required) {
            const type = item.type || "input";
            const extraTypes = [
                'select',
                'groupselect',
                'multiselect',
                'checkbox',
                'radio',
                'cascader',
                'date',
                'time',
                'datetime',
                'daterange',
                'datetimerange',
            ]
            requiredRule = {
                required: true,
                message: item.placeholder?item.placeholder
                    :item.label
                        ? `请${extraTypes.includes(type) ? "选择" : "输入"}${item.label}` : '必填项,请填写或选择',
                trigger:["blur", "change"]
            };
        }
        return requiredRule;
    }
    getEmailRules(){
        const { item } =this
        let emailRule = null
        if(item.type === 'email'){
            emailRule = {
                pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/,
                message: `请输入正确的${item.label}`,
                trigger: 'blur'
            }
        }
        return emailRule;
    }
    // 移动电话
    getTelMoblieRules(){
        const { item } =this
        let telRule = null
        if(item.type === 'number' && item.telMoblie){
            telRule = {
                pattern: /^(\+)?(\d{2,3})?1\d{10}$/,
                message: `请输入正确的${item.label}`,
                trigger: 'blur'
            }
        }
        return telRule
    }
    // 固定电话
    getTelFixedRules(){
        const { item } =this
        let telRule = null
        if((!item.type || item.type === 'input') && item.telFixed){
            telRule = {
                pattern: /^0\d{2,3}-?\d{7,8}$/,
                message: `请输入正确的${item.label}`,
                trigger: 'blur'
            }
        }
        return telRule
    }
    
}