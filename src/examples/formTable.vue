<template>
    <lans-v-formtable
        ref="refFormTable"
        :filter-form-config="filterFormConfig"
        :table-column="tableColumn"
        :import-data="tableData"
        :filter-col="3"
        :top-operation="topOperation"
        :params="tableParams"
        :table-props="tableProps"
        :top-right-operation-line="true"
        filter-label-width="85px"
        @filter-changeOut="changeOut"
    >
        <template #expand="{scope}">
            <div>{{ scope.row }}test-expand</div>
        </template>
        <template #time="{scope}">
            <div>time-{{ scope.row.time }}</div>
        </template>
        <template #headertime>
            <div>header-time</div>
        </template>
    </lans-v-formtable>
</template>

<script lang="ts">
//  :postHandle="postHandle"
//         :paramsHandle="paramsHandle"
//         @radio-change="radioChange"
import {
    ElButton
} from 'element-plus';
import {
    defineComponent, reactive, ref
} from 'vue';
import {
    FormItem, TableColumn, vFormtable, TopOperation
} from '../packages';

interface TableItem<T=String> {
    readonly id: Number | T;
    ernestMoney: T,
    status: T,
    time: T | Number | Date;
    expandMoney: T,
    userLimitBuy: T
}

export default defineComponent({
    setup() {
        const refFormTable = ref(vFormtable);
        const refForm = ref((refFormTable as any).refForm);
        const refTable = ref((refFormTable as any).refTable);
        const topOperation = reactive<TopOperation>({
            left:[
                {
                    name: "导出",
                    key: "export",
                    icon: 'icon',
                    type: "primary",
                    disabled: true,
                    handle: () => {
                        console.log('导出');
                    }
                },
                {
                    name: "导出2",
                    key: "export2",
                    type: "primary",
                    requireArguments: ["batchSelected"], // handle回调seletionList
                    handle: (batchSelected: Array<TableItem>) => {
                        if (!Array.isArray(batchSelected) || !batchSelected.length) {
                            console.log('请至少选择一个');
                            return;
                        }
                        console.log('导出2', batchSelected);
                    }
                },
                {
                    name: "导出3",
                    key: "export3",
                    type: "primary",
                    requireArguments: ["filterForm"], // handle回调filterForm
                    handle: (filterForm: Object) => {
                        console.log('导出3', filterForm);
                    }
                },
                {
                    name: "导出4",
                    key: "export4",
                    type: "render",
                    data: {
                        name:'dddd'
                    },
                    render: (h: any, params: any) => {
                        console.log(params);
                        return h('button', null, {
                            default: () => '导出4'
                        });
                    }
                }
            ]
        });
        const filterFormConfig = reactive<Array<FormItem>>([
            {
                key: 'number',
                label: 'numberTelMoblie',
                type: 'number',
                placeholder: '请输入numberTelMoblie',
                telMoblie: true, // 移动电话
                itemProps: {
                    'label-width':'140px'
                }
            },
            {
                key: 'datetimerange',
                label: 'datetimerange',
                type: 'datetimerange',
                col: 2,
                keyRange: ['datetimerange1', 'datetimerange2']
            },
            {
                key: 'select',
                label: 'select',
                placeholder: '请选择select',
                type: 'select',
                required: true,
                changeToEmit: true,
                // options可以为func也可以为数组
                options: [
                    { label:'test1', value: 1 },
                    { label:'test2', value: 2 }
                ]
            }
        ]);

        const tableColumn = reactive<Array<TableColumn>>([
            { label: '', type: 'expand', slot: 'expand' },
            { label: '序号', type: 'index' },
            { label: '单选', type: 'radio' },
            { label: '多选', type: 'select' },
            { // 字段格式化
                label: '定金(元)',
                value: 'ernestMoney',
                valueFun: (row: TableItem): String => `${row.ernestMoney}-lanjuan`
            },
            { // 枚举
                label: '状态',
                value: 'status',
                // rewrite可以为数组或者对象
                // rewrite:StatusArr,
                rewrite: {
                    1: '状态1',
                    2: '状态2',
                    3: '状态3',
                    4: '状态4'
                }
            },
            { // 时间
                label: '时间',
                value: 'time',
                type: 'date',
                width: '150px',
                slot: 'time', // 也可以使用slot
                header:'headertime' // 修改header
                // format: "yyyy-MM-dd"//默认不传：yyyy-MM-dd HH:mm:ss,可以传yyyy-MM-dd不精确到时分秒
            },
            { label: '膨胀金额(元)原销售价-促销价', value: 'expandMoney', align:'right' },
            { label: '单品单用户限购(件)', value: 'userLimitBuy', width:'220px' },
            {
                label: '操作1',
                type: 'operate',
                buttons:[
                    {
                        label: '新增',
                        disabledFunc: (row: TableItem) => row.status === '2', // 转发为2不可编辑
                        click: (row: TableItem) => {
                            console.log(`新增:${row.id}`);
                        },
                        conditionFun: (row: TableItem) => [1, 2, 3].includes(Number(row.id)),
                        className:'className'
                    },
                    {
                        label: '修改',
                        disabledFunc: (row: TableItem) => [1, 2].includes(Number(row.id)),
                        click: (row: TableItem) => {
                            console.log(`修改:${row.id}`);
                        },
                        conditionFun: (row: TableItem) => [2, 3, 4].includes(Number(row.id)),
                        className: 'className'
                    }
                ]
            },
            {
                label: '操作2',
                type: 'render',
                render:(h, { data }) => {
                    const { row, index } = data;
                    return h('div', [
                        h(ElButton, {
                            type: 'text',
                            size: 'small',
                            disabled: [1, 2].includes(Number(row.id)),
                            onClick: () => {
                                console.log(`删除：${index}`);
                            }
                        },
                        {
                            default:() => '删除'
                        }),
                        h(ElButton, {
                            type: 'text',
                            size: 'small',
                            disabled: [1, 2].includes(Number(row.id)),
                            onClick: () => {
                                console.log(`详情：${index}`);
                            }
                        },
                        {
                            default: () => '详情'
                        })
                    ]);
                }
            }
        ]);

        const tableData = reactive<Array<TableItem>>([
            {
                id: 1,
                ernestMoney: '1',
                status: '1',
                time: '2018-05-03 03:22:55',
                expandMoney: '1',
                userLimitBuy: '膨胀金额(元)原销售价-促销价膨胀金额(元)原销售价-促销价膨胀金额(元)原销售价-促销价膨胀金额(元)原销售价-促销价膨胀金额(元)原销售价-促销价膨胀金额(元)原销售价-促销价膨胀金额(元)原销售价-促销价膨胀金额(元)原销售价-促销价膨胀金额(元)原销售价-促销价'
            },
            {
                id: 2,
                ernestMoney: '2',
                status: '2',
                time: new Date(),
                expandMoney: '2',
                userLimitBuy: '2'
            },
            {
                id: 3,
                ernestMoney: '3',
                status: '3',
                time: 1616058611218,
                expandMoney: '3',
                userLimitBuy: '3'
            },
            {
                id: 4,
                ernestMoney: '4',
                status: '4',
                time: 1616066611218,
                expandMoney: '4',
                userLimitBuy: '4'
            }
        ]);

        const tableParams = {
            test1:'11'
        };

        // 表单变化
        const changeOut = ({
            key, config, data, formData
        }): void => {
            console.log('----------changeout');
            if (key === 'select') {
                console.log(key, config, data, formData);
            }
        };

        const tableProps = reactive({
            height:'400px',
            onSelectAll: () => {
                console.log('selectAll');
            }
        });

        return {
            refFormTable,
            refForm,
            refTable,
            topOperation,
            filterFormConfig,
            tableColumn,
            tableData,
            changeOut,
            tableProps,
            tableParams
        };
    }
});
</script>
