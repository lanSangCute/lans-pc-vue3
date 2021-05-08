<script lang="ts">
import debounce from 'lodash';
import {
    PropType, ref, toRefs, reactive, watch, defineComponent, nextTick, h, onUnmounted, getCurrentInstance
} from 'vue';
import {
    ElForm, ElFormItem, ElCol, ElRow
} from 'element-plus';
import {
    RulesHandle, FormDataHandle, ElComponentFormMethods
} from './formHandle';
import { generateFormItem } from './generator';
import {
    FormItem, AlignType, ConfigForm
} from '../../types';

export default defineComponent({
    name: 'v-form',
    props: {
        // 表单配置项
        configs: {
            type: [Function, Array],
            default: () => {}
        },
        // 表单初始值
        initFormData: {
            type: Object as PropType<Object>,
            default: {}
        },
        inline: {
            type: Boolean as PropType<Boolean>,
            default: false
        },
        // 表单是否可编辑
        disabled: {
            type: Boolean as PropType<Boolean>,
            default: false
        },
        // label宽度
        labelWidth: {
            type: String as PropType<String>,
            default: '100px'
        },
        // label位置,默认左对齐
        labelPosition: {
            type: String as PropType<AlignType>,
            default: 'right'
        },
        // label和value之前的分隔符
        labelSuffix:{
            type: String as PropType<String>,
            default: ':'
        },
        // 默认分割col个为一行
        col: {
            type: Number as PropType<Number>,
            default: 4
        },
        // 表单是否有规则，主要是区分详情和增改表单行间距
        ruleYn: {
            type: Boolean as PropType<Boolean>,
            default: true
        }
    },
    emits:[
        'changeOut', // 当formItem设置了changeToEmit：true，触发该方法
        'setFormDataEnd'
    ],
    setup(props, { emit }){
        const refForm = ref(ElForm);
        const ctx = getCurrentInstance();
        const { configs } = toRefs(props);
        let configData = reactive<Array<FormItem>>([]);
        let debounceUpdateFunction = () => {};
        const defaultData = reactive({
            updateFormSign: false,
            formDataSettingSign: false,
            itemDependonWatchMap: {},
            itemChangeToEmitWatchMap: {}
        });

        // 表单数据处理
        const { getInitFormData, loadItemAsyncData, getFormData }:FormDataHandle = new FormDataHandle();
        const formDataHandle = reactive({
            formData:{} as Object,
            // default-初始化数据，来源default或者default()
            getInitFormData,
            // options-初始化options数据
            loadItemAsyncData: async (config: FormItem, configIndex: number, formDatas: Object) => {
                const { optionsTypesYn, options } = await loadItemAsyncData(config, configIndex, formDatas);
                if (optionsTypesYn) {
                    configData[configIndex].options = options;
                }
            },
            // 获取表单数据
            getFormData: () => getFormData(configData, formDataHandle.formData),
            // 设置表单数据
            setFormData(formDatas: object) {
                if (defaultData.formDataSettingSign) {
                    // this.$once('setFormDataEnd', () => {
                    //     formDataHandle.formData = { ...formDataHandle.formData, ...formDatas };
                    // });
                    return;
                }

                formDataHandle.formData = { ...formDataHandle.formData, ...formDatas };
            }
        });

        const watchHandle = reactive({
            updateUnWatchHandle:null,
            setUpdateUnWatchHandle:() => {
                watchHandle.updateUnWatchHandle = watch(
                    () => formDataHandle.formData,
                    debounceUpdateFunction,
                    {
                        deep: true
                    }
                );
            },
            loadAsyncData: async () => {
                const configDatas = configData;
                const processList = configDatas.map((config:FormItem, configIndex:number) => {
                    if (config.dependon) {
                        const itemWatchHandle = async () => {
                            formDataHandle.formData[config.key] = null;
                            await formDataHandle.loadItemAsyncData(config, configIndex, formDataHandle.formData);
                            const watchList = defaultData.itemDependonWatchMap[config.key] || [];
                            watchList.forEach((f:Function) => {
                                f();
                            });

                            // bindWatch();
                        };
                        const bindWatch = () => {
                            defaultData.itemDependonWatchMap[
                                config.key
                            ] = config.dependon.map((v:string) => watch(
                                () => formDataHandle.formData[v],
                                itemWatchHandle
                            ));
                        };
                        bindWatch();
                    }

                    if (config.changeToEmit) {
                        defaultData.itemChangeToEmitWatchMap[config.key] = watch(
                            () => formDataHandle.formData[config.key],
                            () => {
                                emit('changeOut', {
                                    key: config.key,
                                    config,
                                    data: formDataHandle.formData[config.key],
                                    formData: formDataHandle.formData
                                });
                            }, {
                                deep:true
                            }
                        );
                    }
                    return formDataHandle.loadItemAsyncData(config, configIndex, formDataHandle.formData);
                });

                await Promise.all(processList);
                // this.$forceUpdate();
            },
            unWatchMap:() => {
                [defaultData.itemDependonWatchMap, defaultData.itemChangeToEmitWatchMap].forEach(
                    (map:Object) => {
                        Object.keys(map).forEach((key:string) => {
                            if (map[key] && typeof map[key] === 'function') {
                                map[key]();
                            }
                        });
                    }
                );
            }
        });
        const updateFunctionalConfig = () => {
            if (typeof props.configs !== 'function') {
                return;
            }
            if (watchHandle.updateUnWatchHandle) {
                watchHandle.updateUnWatchHandle();
                watchHandle.updateUnWatchHandle = null;
            }
            defaultData.formDataSettingSign = true;

            props.configs({
                formData: formDataHandle.formData,
                configData
            })
                .then((result: ConfigForm) => {
                    if (!result.notChange) {
                        formDataHandle.formData = result.formData;
                        configData = result.configData;

                        defaultData.updateFormSign = true;
                    }

                    nextTick(() => {
                        watchHandle.setUpdateUnWatchHandle();

                        nextTick(() => {
                            watchHandle.loadAsyncData();
                            console.log('watching out formData', formDataHandle.formData);
                        });

                        defaultData.formDataSettingSign = false;
                        emit('setFormDataEnd');
                    });
                })
                .catch((err:never) => {
                    console.log('form config function err', err);
                    watchHandle.setUpdateUnWatchHandle();
                    defaultData.formDataSettingSign = false;
                    emit('setFormDataEnd');
                });
        };

        /**
         * @desc element-plus:form Methods
         */
        const {
            validate,
            validateField,
            resetFields,
            clearValidate
        }: ElComponentFormMethods = new ElComponentFormMethods();
        const elFormHandle = reactive({
            validate,
            validateField,
            resetFields:() => {
                resetFields.bind((ctx as any).ctx)();
                formDataHandle.formData = formDataHandle.getInitFormData(props.configs as Array<FormItem>);
            },
            clearValidate
        });
        // props.configs是数组的话，获取config的default默认值
        if (Array.isArray(props.configs)) {
            const initData = formDataHandle.getInitFormData(props.configs as Array<FormItem>);
            formDataHandle.formData = Object.assign(initData, props.initFormData || {});

            nextTick(() => {
                watchHandle.loadAsyncData();
            });
            configData = [...props.configs as Array<FormItem>];
        } else {
            defaultData.formDataSettingSign = true;

            props.configs()
                .then((result:ConfigForm) => {
                    formDataHandle.formData = result.formData;
                    configData = result.configData;
                    defaultData.formDataSettingSign = false;
                    emit('setFormDataEnd');

                    debounceUpdateFunction = debounce(
                        updateFunctionalConfig,
                        300
                    );
                    nextTick(() => {
                        watchHandle.loadAsyncData();
                        watchHandle.setUpdateUnWatchHandle();
                    });
                })
                .catch((err:never) => {
                    console.log('type-functio:form config init function err', err);
                    defaultData.formDataSettingSign = false;
                    emit('setFormDataEnd');
                });
        }

        watch(configs, (val, oVal) => {
            if (val === oVal) {
                return;
            }
            if (Array.isArray(val)) {
                configData = [...(val as Array<FormItem>)];
                const initData = formDataHandle.getInitFormData(val as Array<FormItem>);
                const newInitData = { ...initData };
                Object.keys(initData).forEach((key:string) => {
                    newInitData[key] = formDataHandle.formData[key] || newInitData[key];
                });
                formDataHandle.formData = Object.assign(initData, props.initFormData || newInitData || {});
                watchHandle.unWatchMap();
                nextTick(() => {
                    watchHandle.loadAsyncData();
                });
            }
        }, {
            deep:true
        });

        onUnmounted(() => {
            if (watchHandle.updateUnWatchHandle) {
                watchHandle.updateUnWatchHandle();
            }
            watchHandle.unWatchMap();
        });

        return {
            refForm, // ref-form
            configData, // props-configs
            defaultData,
            debounceUpdateFunction,
            updateFunctionalConfig,
            ...toRefs(watchHandle),
            ...toRefs(elFormHandle),
            ...toRefs(formDataHandle)
        };
    },
    render(){
        let formItemList:any = [];
        const rules = {};
        const colDivSign = this.col >= 1 && this.inline === false;
        this.configData.forEach((item:FormItem) => {
            let formItem = null;
            const {
                getRequiredRules, getEmailRules, getTelMoblieRules, getTelFixedRules
            }: RulesHandle = new RulesHandle(item);
            const rulesPush = (rule:Object) => {
                if (!rule) {
                    return;
                }
                if (rules[item.key]) {
                    rules[item.key].push(rule);
                } else {
                    rules[item.key] = [rule];
                }
            };
            rulesPush(getRequiredRules());
            rulesPush(getEmailRules());
            rulesPush(getTelMoblieRules());
            rulesPush(getTelFixedRules());

            if (item.rules) {
                rules[item.key] = item.rules.concat(rules[item.key] || []);
            }

            if (item.type === 'empty') {
                formItem = h('span', null,
                    {
                        default:() => '\u00A0'// 类似于&nbsp;
                    });
            } else if (item.type === 'string') {
                formItem = h('span', null,
                    {
                        default:() => this.formData[item.key]
                    });
            } else if (item.type === 'render' && item.render) {
                formItem = item.render(
                    h,
                    this,
                    item,
                    this.formData[item.key],
                    (data:any) => {
                        this.formData[item.key] = data;
                    }
                );
            } else {
                formItem = generateFormItem(h, this, item);
            }
            const formItemRender = h(formItem);

            formItem = h(ElFormItem, {
                key:item.key,
                label:item.label,
                prop:item.key,
                class: `el-item-w-100 ${this.ruleYn ? 'hasRule' : 'noRule'} ${item.className || ''}`,
                style:{
                    'text-align': 'left'
                },
                ...(item.noLabel ? { 'label-width': '0' } : {}),
                ...item.itemProps
            }, {
                default:() => formItemRender
            });

            if (colDivSign) {
                const formItemRenderCol = h(formItem);
                formItem = h(ElCol, {
                    span:item.fullLine ? 24 : Math.floor(24 / this.col) * (item.col || 1),
                    class:'px-16'
                }, {
                    default:() => formItemRenderCol
                });
            }
            formItemList.push(formItem);
        });

        if (colDivSign) {
            const formItemRender = formItemList;

            formItemList = h(ElRow, null, {
                default:() => formItemRender
            });
        }
        return h(ElForm, {
            // onInput:noop,
            model: this.formData as object,
            rules,
            inline: this.inline,
            disabled: this.disabled,
            'label-position': this.labelPosition,
            'label-width': this.labelWidth,
            'label-suffix': this.labelSuffix,
            'validate-on-rule-change': false,
            ref: 'refForm',
            key: 'form'
        }, {
            default:() => [
                formItemList,
                this.$slots.inline?.()
            ]
        });
    }
});
</script>
<style>
/* 全局 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"]{
  -moz-appearance: textfield;
}
.el-item-w-100 .el-form-item__label {
    word-break: break-all;
}
.noRule{
    margin-bottom: 8px!important;
}
.hasRule{
    margin-bottom: 18px!important;
}
</style>
