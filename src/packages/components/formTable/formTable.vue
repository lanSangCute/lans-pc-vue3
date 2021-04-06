<script lang="ts">
import {
    defineComponent, PropType, toRefs, ref, computed, reactive, nextTick, h
} from 'vue';
import {
    AlignType, TableColumn, FormItem, TopOperationItem, TopOperation, TopOperationItemArguments
} from '../../types';

import {
    DebounceTime
} from '../../utils';
import {
    vForm, vTable
} from '../index';
import { formTableRender } from './formTableRender';

export default defineComponent({
    name: 'v-formtable',
    props: {
        // 表格title
        title: {
            type: String as PropType<String>,
            default: ''
        },
        // form表单默认数据
        initFormData: {
            type: Object as PropType<Object>,
            default: () => {}
        },
        // form表单配置项
        filterFormConfig: {
            type: Array as PropType<Array<FormItem>>,
            default: () => []
        },
        // form表单行内表单模式
        filterInline: {
            type: Boolean as PropType<Boolean>,
            default: false
        },
        // form表单域标签的位置
        filterLabelPosition: {
            type: String as PropType<AlignType>,
            default: 'right'
        },
        // form表单域标签的宽度
        filterLabelWidth: {
            type: String as PropType<String>,
            default: '100px'
        },
        // form表单域标签的后缀
        filterLabelSuffix: {
            type: String as PropType<String>,
            default: ''
        },
        // form表单默认分割col个为一行
        filterCol: {
            type: Number as PropType<Number>,
            default: 4
        },
        // 查询重置按钮是否和表单信息放在同一行
        topRightOperationLine: {
            type: Boolean as PropType<Boolean>,
            default: false
        },
        // 左右两部分代码
        topOperation: {
            type: Object as PropType<TopOperation>,
            default: {
                left: [],
                right: []
            }
        },
        // 是否展示查询按钮
        showSearch: {
            // 是否展示查询和重置按钮
            type: Boolean as PropType<Boolean>,
            default: true
        },
        // 是否展示重置按钮
        showReset: {
            type: Boolean as PropType<Boolean>,
            default: true
        },
        // 点击重置按钮的时候，是否需要调用接口
        resetSearch: {
            type: Boolean as PropType<Boolean>,
            default: true
        },
        // button按钮的size
        btnSize: {
            type: String as PropType<String>,
            default: 'medium'
        },
        // 是否展示查询到的数据结果（包含数据合计+选项项
        showRequestNum: {
            type: Boolean as PropType<Boolean>,
            default: true
        },
        // 表格额外参数
        params: {
            type: Object as PropType<Object>,
            default: {}
        },
        // 表格是否需要展示分页
        pagination: {
            type: Boolean as PropType<Boolean>,
            default: true
        },
        // 表格的tableColumn
        tableColumn: {
            type: Array as PropType<Array<TableColumn>>,
            default: () => []
        },
        // 查询表格的接口路径
        services: {
            type: String as PropType<String>,
            default: ''
        },
        // 是否初始化加载
        autoLoad: {
            type: Boolean as PropType<Boolean>,
            default: true
        },
        // 接口请求后，对返回的数据处理 dataFormatHandle:(result:any):any=>{}
        dataFormatHandle: {
            type: Function as PropType<Function>
        },
        importData: {
            type: Array as PropType<Array<Object>>,
            default: () => []
        },
        paramsHandle: {
            type: Function as PropType<Function>
        }, // 参数处理
        postHandle: {
            type: Function as PropType<Function>
        }, // 请求处理
        // 是否带有纵向边框，默认是
        tableBorder: {
            type: Boolean as PropType<Boolean>,
            default: true
        },
        tableProps: {
            type: Object as PropType<Object>,
            default: () => {}
        }
    },
    emits: [
        'current-change',
        'filter-changeOut'
    ],
    setup(props, { emit }){
        const refTable = ref(vTable);
        const refForm = ref(vForm);
        const debounce: DebounceTime = new DebounceTime();
        const tableDataHandle = reactive({
            tableData: {} as Object,
            tableDataChange: (list: Array<any>) => {
                tableDataHandle.tableData = list;
            }
        });
        const selectionHandle = reactive({
            selectionList: [] as Array<any>,
            tableSelectionChangeHandle: (list: Array<any>) => {
                selectionHandle.selectionList = list;
            }
        });

        // v-form-methods
        const formHandle = reactive({
            setFormData: (data: Object) => {
                (refForm.value as any).setFormData(data);
            },
            getFormData: () => (refForm.value as any).getFormData(),
            resetFields: () => {
                (refForm.value as any).resetFields();
            },
            validate: () => {
                (refForm.value as any).validate();
            }
        });

        // v-table-methos
        const tableHandle = reactive({
            getLastQueryParams: () => (refTable.value as any).lastQueryParams,
            getRadioSelect: () => (refTable.value as any).radioSelect,
            request: () => {
                (refTable.value as any).request();
            }
        });

        const paramsMap = reactive({
            filterParams: props.params,
            setFilterParams: () => {
                const formData = {
                    ...formHandle.getFormData(),
                    ...props.params
                };
                (props.filterFormConfig || []).forEach((item: FormItem) => {
                    const { key } = item;
                    const val = formData[key];
                    // 没有值的删除掉对应字段
                    if (!val && val !== 0) {
                        delete formData[key];
                    }
                    if (['daterange', 'datetimerange'].includes(item.type || 'input')){
                        delete formData[key];
                    }
                });
                paramsMap.filterParams = { ...formData };
            }
        });
        // 表格是否有多选列
        const hasSelection = computed(() => Boolean(
            (props.tableColumn || []).filter((v:TableColumn) => v.type === "select").length
        ));
        // 是否有操作部分的左边按钮
        const hasTopOperationLeft = computed(() => props.topOperation && props.topOperation.left && props.topOperation.left.length);

        const filterFormQueryHandle = async () => {
            const success = await new Promise((resovle:any) => {
                (refForm.value as any).validate((valid: Boolean) => {
                    resovle(Boolean(valid));
                });
            });

            if (!success) {
                return;
            }
            paramsMap.setFilterParams();
            nextTick(() => {
                debounce.run(() => tableHandle.request());
            });
        };

        const handleString = (queryType: String) => {
            if (queryType === 'resetFilterForm') {
                formHandle.resetFields();
                // 点击重置按钮的时候，是否需要调用接口
                if (props.resetSearch) {
                    filterFormQueryHandle();
                }
            }
            if (queryType === 'query') {
                filterFormQueryHandle();
            }
        };

        const handleArgumentMap = reactive({
            batchSelected: () => selectionHandle.selectionList,
            filterForm: () => paramsMap.filterParams
        });

        const operationHandle = (operation: TopOperationItem) => {
            const handleArguments: Array<any> = [];

            if (Array.isArray(operation.requireArguments) && operation.requireArguments.length) {
                (operation.requireArguments || []).forEach((argumentItem:TopOperationItemArguments) => {
                    handleArguments.push(
                        handleArgumentMap[argumentItem]()
                    );
                });
            }
            if (operation.handle) {
                const { handle } = operation;
                if (typeof handle === 'string') {
                    handleString(handle);
                } else if (typeof handle === 'function') {
                    operation.handle(...handleArguments);
                }
            }
        };

        const emitsEvent = reactive({
            tableCurrentChangeHandle: (currentRow: Object, oldCurrentRow: Object) => {
                emit("current-change", currentRow, oldCurrentRow);
            },
            changeOut: (e: Object) => {
                emit("filter-changeOut", e);
            }
        });
        return {
            refTable,
            refForm,
            hasSelection,
            hasTopOperationLeft,
            operationHandle,
            handleString,
            ...toRefs(paramsMap),
            ...toRefs(handleArgumentMap),
            ...toRefs(tableDataHandle),
            ...toRefs(selectionHandle),
            ...toRefs(formHandle),
            ...toRefs(tableHandle),
            ...toRefs(emitsEvent)
        };
    },
    render(){
        return formTableRender.bind(this)(h);
    }
});

</script>
