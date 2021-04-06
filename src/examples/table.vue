<template>
    <div>
        <lans-v-table
            ref="refTable1"
            class="px-8"
            :table-column="tableColumn"
            :import-data="tableData"
            :params="params"
            @selection-change="selectionChange"
            @radio-change="radioChange"
            @columnMoveTop="columnMoveTop"
            @columnMoveBottom="columnMoveBottom"
            @data-change="dataChange"
        />
        <!-- pagination=false 不带分页，默认为true -->
        <!-- align=left 字段居左对齐，默认为cente -->
        <!-- border=false 不带边框，默认为true -->
        <!-- param={activityId:''} 传递参数，默认为{} -->
        <el-button
            type="primary"
            @click="clearSelection"
        >
            clearSelection
        </el-button>
        <el-button
            type="primary"
            @click="clearParam"
        >
            clearParam
        </el-button>
        <el-button
            type="primary"
            @click="setParam({ name:'lanjuan', age:18 })"
        >
            setParam
        </el-button>
        <el-button
            type="primary"
            @click="request"
        >
            request
        </el-button>

        <section>params:{{ params }}</section>
        <lans-v-table
            ref="refTable2"
            class="px-8"
            :table-column="tableColumn"
            :import-data="tableData"
            :pagination="false"
            :auto-load="false"
            :border="false"
            align="left"
            :param="params"
            @selection-change="selectionChange"
            @radio-change="radioChange"
        />
    </div>
</template>

<script lang="ts">
import {
    defineComponent, reactive, ref, toRefs
} from 'vue';
import { ElButton } from 'element-plus';
import {
    vTable
} from '../packages';

import {
    TableColumn
} from '../packages/types';

interface TableItem<T=String> {
  readonly id: Number | T;
  ernestMoney: T,
  status: T,
  time: T | Number | Date;
  expandMoney: T,
  userLimitBuy: T
}

export default defineComponent({
    name: 'ETable',
    setup(){
        const tableColumn = reactive<Array<TableColumn>>([
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
                width: '150px'
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
                },
                // 以下操作关于上下移
                columnMove:true
                // columnMoveTop:true,//如果非默认行为(整体上移),设置该值为true,组件会emit事件columnMoveTop
                // columnMoveBottom:true,//如果非默认行为(整体下移),设置该值为true,组件会emit事件columnMoveBottom
            }
        ]);
        const refTable1 = ref(vTable);
        const refTable2 = ref(vTable);
        const dataMap = reactive({
            params: {
                test1:'ee'
            } as Object
        });
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

        const selectionChange = (selectList: Array<TableItem>) => {
            console.info('多选被选择的数据：');
            console.table(selectList);
        };

        const radioChange = (row: TableItem) => {
            console.info('单选被选择的数据：', row);
        };
        const getParam = ():Object => (refTable1.value as any).getParam();
        const setParam = (params: Object) => {
            (refTable1.value as any).setParam(params);
            dataMap.params = getParam();
        };

        const clearParam = () => {
            (refTable1.value as any).clearParam();
            dataMap.params = getParam();
        };

        const clearSelection = () => {
            (refTable1.value as any).clearSelection();
        };

        const columnMoveTop = ({ row, column, index }) => {
            console.log('上移', row, column, index);
        };

        const columnMoveBottom = ({ row, column, index }) => {
            console.log('下移', row, column, index);
        };

        const request = () => {
            (refTable1.value as any).request();
        };
        // 接口请求后，返回的参数
        const dataChange = (data) => {
            const {
                total, pager, dataSet, selectList
            } = data.value;
            console.log('请求接口后，统一返回的数据：');
            console.log('total:', total);
            console.log('pager:', pager);
            console.log('dataSet:', dataSet);
            console.log('selectList:', selectList);
        };
        return {
            ...toRefs(dataMap),
            tableColumn,
            tableData,
            // refTable
            refTable1,
            refTable2,
            // events
            selectionChange,
            radioChange,
            // methods...等
            setParam,
            getParam,
            clearParam,
            clearSelection,
            columnMoveTop,
            columnMoveBottom,
            dataChange,
            request
        };
    }
});
</script>
