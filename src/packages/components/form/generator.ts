/* eslint-disable max-lines */
import {
    FormItem,
    FormItemType
} from '../../types';
import {
    ElInput,
    ElInputNumber,
    ElSelect,
    ElCheckbox,
    ElCheckboxGroup,
    ElOption,
    ElOptionGroup,
    ElDatePicker,
    ElTimePicker,
    ElCascader,
    ElSwitch,
    ElRadioGroup,
    ElRadio,
    ElButton
} from "element-plus";
import { TimeUtils,FormUtils } from '../../utils';

const formTypeGeneratorMap = {
    // editor: {
    //     generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
    //         if (item.disabled || (this.disabled && item.disabled !== false)) {
    //             return (
    //                 <div class="contain-content" domPropsInnerHTML={value} />
    //             );
    //         }
    //         // isReadOnly
    //         return (
    //             <com-ocj-editor
    //                 {...vueAttrs}
    //                 value={value}
    //                 on-input={changeHandle}
    //                 upload={item.upload}
    //                 class="mb-4"
    //             />
    //         );
    //     }
    // },
    stringOptions: {
        generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
            if (typeof item.options === "function") {
                return h('span');
            }
            let showValue = value;
            if (Array.isArray(item.options) && item.options.length) {
                let tempList = item.options.filter((v, i) => {
                    if (typeof v === "object") {
                        return v.value === value;
                    }
                    if (i === Number(value)) {
                        return true;
                    }
                });
                if (tempList && tempList.length) {
                    showValue = tempList[0].label || tempList[0];
                } else if (item.getShowValueHandle) {
                    showValue = item.getShowValueHandle({
                        options: item.options,
                        value: value
                    });
                }
            } else if (typeof item.options === "object") {
                if (item.options[value]) {
                    showValue = item.options[value];
                }
            }
            return h('span',null,{
                default:()=>showValue
            })
        }
    },
    input: {
        generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
            return h(ElInput,{
                ...vueAttrs,
                'modelValue':value,
                'onUpdate:modelValue':changeHandle,
                clearable:true,
                placeholder:item.placeholder,
                disabled:item.disabled
            })
        }
    },
    textarea: {
        generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
            return h(ElInput,{
                ...vueAttrs,
                type:"textarea",
                'modelValue':value,
                'onUpdate:modelValue':changeHandle,
                clearable:true,
                placeholder:item.placeholder,
                disabled:item.disabled,
                resize:item.resize,
                rows:item.rows
            })
        }
    },
    email: {
        generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
            return h(ElInput,{
                ...vueAttrs,
                type:"email",
                'modelValue':value,
                'onUpdate:modelValue':changeHandle,
                clearable:true,
                placeholder:item.placeholder,
                disabled:item.disabled,
            })
        }
    },
    number: {
        generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
            const {handleNumberKeyPress}:FormUtils = new FormUtils();
            return h(ElInput,{
                ...vueAttrs,
                type:"number",
                'modelValue':value,
                'onUpdate:modelValue':changeHandle,
                'onKeypress':handleNumberKeyPress,
                clearable:true,
                placeholder:item.placeholder,
                disabled:item.disabled,
            })
        }
    },
    inputNumber: {
        generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
            return h(ElInputNumber,{
                ...vueAttrs,
                class:"w-100",
                'modelValue':value,
                'onUpdate:modelValue':changeHandle,
                placeholder:item.placeholder,
                disabled:item.disabled
            })
        }
    },
    checkbox: {
        generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
            const disabled = (this as any).disabled || item.disabled,
                selectAll = () => {
                    if (!Array.isArray(item.options)) {
                        return;
                    }
                    let allKey = (item.options || []).map(v =>v.value);
                    changeHandle(allKey);
                },

                deSelectAll = () => {
                    changeHandle([]);
                };
            return h(ElCheckboxGroup,{
                ...vueAttrs,
                style:{
                    display:"flex"
                },
                'modelValue':value,
                'onUpdate:modelValue':changeHandle,
                disabled:item.disabled
            },{
                default:()=>{
                    return [item.showSelectAll && !disabled? 
                            h('div',{
                                class:'px-20 py-8',
                                style:{
                                    'background-color': 'rgb(255, 255, 255)',
                                    'margin-right':'6px'
                                }
                            },{
                                default:()=>{
                                    return [
                                        h(ElButton,{
                                            type: "text",
                                            onClick:selectAll
                                        },{
                                            default:()=>'全选'
                                        }),
                                        h(ElButton,{
                                            type: "text",
                                            onClick:deSelectAll
                                        },{
                                            default:()=>'全不选'
                                        }),
                                    ]
                                }
                            })
                        :null,
                        (Array.isArray(item.options) ? item.options : []).map(
                            option => {
                                return h(ElCheckbox,{
                                    label:option.value,
                                    key:option.value,
                                    value:option.value,
                                    disabled:option.disabled
                                },{
                                    default:()=>option.label
                                })
                            }
                        )
                    ]
                }
            })
        }
    },
    select: {
        generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
            return h(ElSelect,{
                ...vueAttrs,
                clearable:true,
                class:'w-100',
                'modelValue':value,
                'onUpdate:modelValue':changeHandle,
                placeholder:item.placeholder,
                disabled:item.disabled
            },{
                default:()=>{
                    return [
                        item.optionsPrefixSlot,
                        (Array.isArray(item.options) ? item.options : []).map(
                            option => {
                                return h(ElOption,{
                                    key:option.value,
                                    label:option.label,
                                    value:option.value
                                })
                            }
                        ),
                        item.optionsPostfixSlot,
                    ]
                }
            })
        }
    },
    multiselect: {
        generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
            const disabled = (this as any).disabled || item.disabled,
                selectAll = () => {
                    if (!Array.isArray(item.options)) {
                        return;
                    }
                    let allKey = (item.options || []).map(v =>v.value);
                    changeHandle(allKey);
                },

                deSelectAll = () => {
                    changeHandle([]);
                };
            return h(ElSelect,{
                ...vueAttrs,
                clearable:true,
                class:'w-100',
                multiple:true,
                'modelValue':value,
                'onUpdate:modelValue':changeHandle,
                placeholder:item.placeholder,
                disabled:item.disabled
            },{
                default:()=>{
                    return [
                        item.selectPrefixSlot ? h('template',{
                            slot:"prefix"
                        },{
                            default:()=>item.selectPrefixSlot
                        }): null,
                        item.optionsPrefixSlot
                        ? item.optionsPrefixSlot
                        : item.showSelectAll && !disabled? 
                            h('div',{
                                class:'px-20 py-8',
                                style:{
                                    position: 'sticky',
                                    padding:'0 20px',
                                    'z-index': 1,
                                    'background-color': 'rgb(255, 255, 255)',
                                }
                            },{
                                default:()=>{
                                    return [
                                        h(ElButton,{
                                            type: "text",
                                            onClick:selectAll
                                        },{
                                            default:()=>'全选'
                                        }),
                                        h(ElButton,{
                                            type: "text",
                                            onClick:deSelectAll
                                        },{
                                            default:()=>'全不选'
                                        }),
                                    ]
                                }
                            })
                        :null,
                        (Array.isArray(item.options) ? item.options : []).map(
                            option => {
                                    return h(ElOption,{
                                        key:option.value,
                                        label:option.label,
                                        value:option.value
                                    })
                            }
                        )
                    ]
                }
            })
        }
    },
    groupselect: {
        generate (h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
            return h(ElSelect,{
                ...vueAttrs,
                clearable:true,
                class:'w-100',
                'modelValue':value,
                'onUpdate:modelValue':changeHandle,
                placeholder:item.placeholder,
                disabled:item.disabled
            },{
                default:()=>{
                    return [
                        item.optionsPrefixSlot,
                        (Array.isArray(item.options) ? item.options : []).map(
                            option => {
                                return h(ElOptionGroup,{
                                    key:option.value,
                                    label:option.label
                                },{
                                    default:()=>{
                                        return (Array.isArray(option.children) ? option.children : []).map(
                                            optionChiild => {
                                                return h(ElOption,{
                                                    key:optionChiild.value,
                                                    label:optionChiild.label,
                                                    value:optionChiild.value
                                                })
                                            }
                                        )
                                    }
                                })
                            }
                        ),
                        item.optionsPostfixSlot
                    ]
                }
            })
        }
    },
    radio: {
        generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
            return h(ElRadioGroup,{
                ...vueAttrs,
                'modelValue':value,
                'onUpdate:modelValue':changeHandle,
                disabled:item.disabled
            },{
                default:()=>{
                    return (Array.isArray(item.options) ? item.options : []).map(
                        option => {
                            return h(ElRadio,{
                                label:option.value,
                                key:option.value,
                                disabled:option.disabled
                            },{
                                default:()=>option.label
                            })
                        }
                    )
                }
            })
        }
    },
    time: {
        generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
            return h(ElTimePicker,{
                ...vueAttrs,
                class:"w-100",
                'arrow-control':true,
                'modelValue':value,
                'onUpdate:modelValue':changeHandle,
                placeholder:item.placeholder,
                disabled:item.disabled
            })
        }
    },
    date: {
        generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
            return h(ElDatePicker,{
                ...vueAttrs,
                class:"w-100",
                'modelValue':value,
                'onUpdate:modelValue':changeHandle,
                placeholder:item.placeholder,
                disabled:item.disabled
            })
        }
    },
    datetime: {
        generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
            return h(ElDatePicker,{
                ...vueAttrs,
                class:"w-100",
                type:"datetime",
                'modelValue':value,
                'onUpdate:modelValue':changeHandle,
                placeholder:item.placeholder,
                disabled:item.disabled
            })
        }
    },
    daterange: {
        generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
            return h(ElDatePicker,{
                ...vueAttrs,
                class:"w-100",
                style:{ width: "100%" },
                type:"daterange",
                'modelValue':value,
                'onUpdate:modelValue':changeHandle,
                'range-separator':'至',
                'start-placeholder':'开始日期',
                'end-placeholder':'结束日期',
                'unlink-panels':true,
                disabled:item.disabled
            })
        }
    },
    datetimerange: {
        generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
            const { getDefaultTime }:TimeUtils = new TimeUtils();
            return h(ElDatePicker,{
                ...vueAttrs,
                class:"w-100",
                style:{ width: "100%" },
                type:"datetimerange",
                'modelValue':value,
                'onUpdate:modelValue':changeHandle,
                'range-separator':'至',
                'start-placeholder':'开始时间',
                'end-placeholder':'结束时间',
                'default-time':item["default-time"] || getDefaultTime(),
                'unlink-panels':true,
                disabled:item.disabled
            })
        }
    },
    cascader: {
        generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
            return h(ElCascader,{
                ...vueAttrs,
                class:"w-100",
                options: Array.isArray(item.options)?item.options:[],
                'modelValue':value,
                'onUpdate:modelValue':changeHandle,
                clearable:true,
                placeholder:item.placeholder,
                disabled:item.disabled
            })
        }
    },
    switch: {
        generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
            return h(ElSwitch,{
                ...vueAttrs,
                'modelValue':value,
                'onUpdate:modelValue':changeHandle,
                // 'active-color':"#13ce66",
                disabled:item.disabled
            })
        }
    },
    // stringrange: {
    //     generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
    //         return (
    //             <com-stringRange
    //                 {...vueAttrs}
    //                 value={value}
    //                 on-input={changeHandle}
    //                 disabled={item.disabled}
    //             />
    //         );
    //     }
    // },
    // tableTransfer: {
    //     generate(h:any, item:FormItem, value:any, changeHandle:Function, vueAttrs:Object) {
    //         return (
    //             <com-tableTransfer
    //                 {...vueAttrs}
    //                 value={value}
    //                 on-input={changeHandle}
    //                 disabled={item.disabled}
    //             />
    //         );
    //     }
    // }
} as Record<FormItemType, {generate?:any}> ;

export function generateFormItem(h:any, vm:any, item:FormItem, options?:any) {
    let formItem = null,
        vueAttrs = {},
        itemType = item.type || "input",
        formTypeGenerator = formTypeGeneratorMap[itemType],
        getBindValueHandle =
            options && options.getBindValueHandle
                ? options.getBindValueHandle
                : null,
        bindValueChangeHandle =
            options && options.getBindValueChangeHandle
                ? options.getBindValueChangeHandle()
                : null;

    if (!formTypeGenerator) {
        return null;
    }

    [
        "props",
        "on",
        // "directives",
        // "scopedSlots",
        // "slot",
        // "class",
        // "attrs",
        // "domProps",
        // "nativeOn",
        // "style"
    ].map(key => {
        const objComps = (item as any)[key] || {};
        if (objComps) {
            vueAttrs = {
                ...vueAttrs,
                ...objComps,
            };
        }
    });

    formItem = formTypeGenerator.generate.call(
        vm,
        h,
        item,
        getBindValueHandle ? getBindValueHandle() : vm.formData[item.key],
        (value:any) => {
            return bindValueChangeHandle
                ? bindValueChangeHandle(value)
                : (vm.formData[item.key] = value);
        },
        vueAttrs
    );

    return formItem;
}
