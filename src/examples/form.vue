<template>
    <div>
        <lans-v-form
            ref="refForm"
            :configs="formConfig"
            label-width="120px"
            :col="3"
            :init-form-data="{
                input:'025-5726170'
            }"
            @changeOut="changeOut"
        />
        <el-button
            type="primary"
            @click="consoleHandleFormData"
        >
            提交
        </el-button>
        <el-button
            type="primary"
            @click="resetFields"
        >
            重置
        </el-button>
    </div>
</template>

<script lang="ts">
import {
    defineComponent, reactive, ref
} from 'vue';
import { ElInput } from 'element-plus';
import {
    vForm, FormItem, Options, FormUtils
} from '../packages';

const { handleNumberKeyPress }: FormUtils = new FormUtils();
const optionsArr: Array<Options> = [
    { label: '状态1', value: '1' },
    { label: '状态2', value: '2' },
    { label: '状态3', value: '3' },
    { label: '状态4', value: '4' }
];

export default defineComponent({
    setup() {
        const refForm = ref(vForm);
        const formConfig = reactive<Array<FormItem>>([
            {
                key: 'empty',
                label: 'empty',
                type:'empty',
                placeholder: '请输入empty'
            },
            {
                key: 'input',
                label: 'inputTelFixed',
                placeholder: '请输入inputTelFixed',
                telFixed: true, // 固定电话
                required: true
            },
            {
                key: 'textarea',
                label: 'textarea',
                type: 'textarea',
                placeholder: '请输入textarea',
                rows: 2,
                col: 2,
                resize: 'none',
                required: true
            },
            {
                key: 'email',
                label: 'email',
                type: 'email',
                placeholder: '请输入email',
                required: true
            },
            {
                key: 'number',
                label: 'numberTelMoblie',
                type: 'number',
                placeholder: '请输入numberTelMoblie',
                required: true,
                telMoblie: true, // 移动电话
                itemProps: {
                    'label-width':'140px'
                }
            },
            {
                key: 'inputNumber',
                label: 'inputNumber',
                type: 'inputNumber',
                placeholder: '请输入inputNumber',
                required: true
            },
            {
                key: 'datetime',
                label: 'datetime',
                type: 'datetime',
                required: true
            },
            {
                key: 'date',
                label: 'date',
                type: 'date',
                required: true
            },
            {
                key: 'time',
                label: 'time',
                type: 'time',
                required: true
            },
            {
                key: 'daterange',
                label: 'daterange',
                type: 'daterange',
                required: true,
                col: 2,
                keyRange: ['daterange1', 'daterange2'],
                default: ['2019-02-02', +new Date()]
            },
            {
                key: 'datetimerange',
                label: 'datetimerange',
                type: 'datetimerange',
                required: true,
                col: 2,
                keyRange: ['datetimerange1', 'datetimerange2'],
                props: {
                    // element-plus的attrs
                },
                on: {
                    // element-plus的events 比如change即为onChange
                    onChange: () => {
                        // console.log(e,'eeeee');
                    }
                }
            },
            {
                key: 'string',
                type: 'string',
                label: 'string',
                default: 'label(593475)'
            },
            {
                key: 'string',
                type: 'string',
                // label: 'string',
                default: 'noLabel(593475)',
                noLabel: true
            },
            // 针对键值对展示文字
            {
                key: 'stringOptions',
                label: 'stringOptions',
                type: 'stringOptions',
                options: optionsArr,
                default: '1'
            },
            {
                key: 'select',
                label: 'select',
                placeholder: '请选择select',
                type: 'select',
                required: true,
                changeToEmit: true,
                // options可以为func也可以为数组
                options: async () => optionsArr
            },
            {
                key: 'multiselect',
                label: 'multiselect',
                placeholder: '请选择multiselect',
                type: 'multiselect',
                showSelectAll: true,
                changeToEmit: true,
                required: true,
                options: async () => optionsArr
            },
            {
                key: 'groupselect',
                label: 'groupselect',
                placeholder: '请选择groupselect',
                type: 'groupselect',
                showSelectAll: true,
                required: true,
                options: async () => [
                    { label: '状态1', value: '1', children: optionsArr },
                    { label: '状态2', value: '2', children: optionsArr },
                    { label: '状态3', value: '3', children: optionsArr },
                    { label: '状态4', value: '4', children: optionsArr }
                ]
            },
            {
                key: 'checkbox',
                label: 'checkbox',
                type: 'checkbox',
                showSelectAll: true,
                required: true,
                col: 2,
                options: optionsArr
            },
            {
                key: 'radio',
                label: 'radio',
                type: 'radio',
                required: true,
                col: 2,
                options: optionsArr
            },
            {
                key: 'switch',
                label: 'switch',
                type: 'switch',
                props: {
                    'active-text': 'on',
                    'inactive-text': 'off'
                }
            },
            {
                key: 'cascader',
                label: 'cascader',
                placeholder: '请选择cascader',
                type: 'cascader',
                required: true,
                options: async () => [
                    { label: '状态1', value: '1', children: optionsArr },
                    { label: '状态2', value: '2', children: optionsArr },
                    { label: '状态3', value: '3', children: optionsArr },
                    { label: '状态4', value: '4', children: optionsArr }
                ]
            },
            {
                key: 'render',
                label: 'render',
                type: 'render',
                required: true,
                render: (h:any, vm:any, item:FormItem, value:any, changeHandle:Function) => h('div', {
                    style: {
                        display:'flex'
                    }
                }, {
                    default:() => [
                        h(ElInput, {
                            type:'number',
                            modelValue:value,
                            'onUpdate:modelValue':changeHandle,
                            onKeypress:handleNumberKeyPress,
                            clearable:true,
                            placeholder:'请输入render'
                        }),
                        h('span', {
                            style: {
                                'margin-left':'4px'
                            }
                        }, {
                            default:() => '元'
                        })
                    ]
                })
            }
        ]);

        const getFormData = () => (refForm.value as any).getFormData();

        const resetFields = () => {
            (refForm.value as any).resetFields();
        };

        const consoleHandleFormData = () => {
            console.log(getFormData());
            (refForm.value as any).validate((valid: Boolean) => {
                if (valid) {
                    console.log('通过');
                } else {
                    console.log('不通过');
                }
            });
        };
        // 表单变化
        const changeOut = ({
            key, config, data, formData
        }): void => {
            console.log('----------changeout');
            if (key === 'select') {
                console.log(key, config, data, formData);
            }
            if (key === 'multiselect') {
                console.log(key, config, data, formData);
            }
        };
        return {
            refForm,
            formConfig,
            resetFields,
            consoleHandleFormData,
            getFormData,
            changeOut
        };
    }
});
</script>
