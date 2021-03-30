const minWidth = 60;
import {
    AlignType,
    TableColumn,
    ResultTable,
    Pager,
} from '../../types';
import { PropType,ref,toRefs,computed,reactive,watch,defineComponent,nextTick } from 'vue' 
import funcRender from './blocks/funcRender.vue'
import {ElTable} from 'element-plus';
import {
    OpBtnsHandle,
    FormatColumn,
    ElComponentTableMethods,
    UtilsFunc
} from "./tableHandle";
export default defineComponent({
    name:'v-table',
    components:{funcRender},
    props: {
        // 是否需要分页，默认是
        pagination: {
            type: Boolean as PropType<Boolean>,
            default: true
        },
        // 接口路径
        services: {
            type: String as PropType<String>
        },
        // 是否初始化加载
        autoLoad: {
            type: Boolean as PropType<Boolean>,
            default: true
        },
        // 配置列静态数据，可以通过配置外部importData数据，也可以通过接口请求数据，以静态数据为准
        importData: {
            type: Array as PropType<Array<Object>>,
            default:()=>[]
        },
        // 查询接口参数
        param: {
            type: Object as PropType<Object>,
            default: ()=>{}
        },
        // 对齐方式,默认居中对齐
        align:{
            type: String as PropType<AlignType>,
            default:'center'
        },
        // 是否带有纵向边框，默认是
        border: {
            type: Boolean as PropType<Boolean>,
            default: true
        },
        // 表格table数据为空，是否展示空图片
        showEmptyImg: {
            type: Boolean as PropType<Boolean>,
            default: true
        },
        // 配置列数组
        tableColumn: {
            type: Array as PropType<Array<TableColumn>>,
            default: ()=>[]
        },
        // 接口请求前，对参数进行个别处理，paramsHandle:(params:Object):Object=>{}
        paramsHandle: {
            type: Function as PropType<(params:Object) => Object>
        },
        // 接口请求时，postHandle:(params:Object):void=>{}
        postHandle:{
            type: Function as PropType<(params:Object) => Promise<any>>
        },
        // 接口请求后，对返回的数据处理 dataFormatHandle:(result:any):any=>{}
        dataFormatHandle: {
            type: Function as PropType<(result:ResultTable | Array<any>) => any>
        },
        //查询玩列表数据后，第一项是否默认选中状态和选中样式
        firstSelected:{
            type: Boolean as PropType<Boolean>,
            default: true
        }
    },
    emits:[
        'data-change',//调用接口后，数据变更后emit该事件
        'selection-change',//多选变化后emit该事件 ()=>{}
        'radio-change',//单选变化后emit该事件
        'columnMoveTop',//tableColunm的type为render,且columnMove=columnMoveTop=true,emit该事件
        'columnMoveBottom'//tableColunm的type为render,且columnMove=columnMoveBottom=true,emit该事件
    ],
    setup(props,{slots, attrs, emit}){
        const { param,autoLoad } = toRefs(props)
        let refTable=ref(ElTable),
            radioSelect = ref<Number|String>(''),
            loading = ref<Boolean>(false),//loading状态
            total = ref<Number>(0),//总页数
            selectList = reactive<Array<Object>>([]);//被选中的数据
            
        const getFullData = computed(()=>{
            return {
                total: total.value,
                pager:paramHandle.pager,
                dataSet:httpHandle.dataSet,
                selectList
            }
        })
        const tableData = computed({
            get(){
                return Array.isArray(props.importData) && props.importData.length? props.importData : httpHandle.dataSet
            },
            set(){
                console.log('手动设置tableData')
            }
        })
        const autoWith = computed(()=>{
            return function(options:any[]){
                let width = minWidth;
                if (Array.isArray(options) && options.length) {
                    width = options.length * 50;
                    return minWidth > width ? minWidth : width;
                }
                return 0;
            }
        })
        watch(param,(val,oVal)=>{
            paramHandle.queryParams = { ...val };
        })
        watch(autoLoad,(val,oVal)=>{
            val && httpHandle.request();
        })
        // 多选触发事件
        const selectionChange = (selectLists:Array<Object>):void => {
            selectList = selectLists || [];
            emit("selection-change", selectList);
        }
        // 单选触发事件
        const radioChange = (index:number):void => {
            emit("radio-change", (tableData.value as Array<any>)[index]);
        }
        // type---top-上移 bottom-下移 index---当前index
        const columnMove = (type:String,row:Object,column:TableColumn,index:number)=>{
            if(type === 'top'){//上移
                if(column.columnMoveTop){
                    return emit('columnMoveTop',{row,column,index})
                }
                let previousRow = tableData.value[index-1];
                tableData.value[index-1]= row;
                tableData.value[index]= previousRow;
            }
            if(type === 'bottom'){//下移
                if(column.columnMoveBottom){
                    return emit('columnMoveBottom',{row,column,index})
                }
                let nextRow = tableData.value[index+1];
                tableData.value[index+1]= row;
                tableData.value[index]= nextRow;
            }
        }
        /**
         * @desc 参数处理
        */
        const paramHandle = reactive({
            queryParams:{...props.param} as Object,
            lastQueryParams:{} as Object,
            pager:{//分页数据
                pageNo: 1,
                pageSize: 10
            } as Pager,
            clearParam:()=>{
                paramHandle.queryParams = {};
            },
            getParam:():Object=>{
                const utilsFunc:UtilsFunc = new UtilsFunc();
                let params = utilsFunc.mergeJSON(paramHandle.queryParams || props.param, {
                    ...(props.pagination ? { page: paramHandle.pager } : {})
                });
                if (props.paramsHandle) {
                    return props.paramsHandle(params);
                }
                return params;
            },
            setParam:(params:Object):void=>{
                paramHandle.queryParams = Object.assign({},params);
            }
        })
        /**
         * @desc 接口请求处理
         */
        const httpHandle = reactive({
            dataSet:[] as Array<Object>,//接口查询到的tableData数据
            pageChange(data:Pager) {
                paramHandle.pager = Object.assign(paramHandle.pager, data);
                httpHandle.request();
            },
            // 设置分页参数
            setPagerNumber:(pagerNumber:Number):void => {
                paramHandle.pager = Object.assign({}, paramHandle.pager, {
                    pageNo: pagerNumber
                });
            },
            // 获取table数据
            request:async (pageChange:Boolean = true) => {
                console.log('请求参数:',paramHandle.getParam())
                // 如果设置了importData,则以importData为主，不做接口查询
                if(Array.isArray(props.importData) && props.importData.length){
                    return total.value = props.importData.length;
                }
                if (!props.postHandle) {
                    return;
                }
                if (!pageChange) {
                    httpHandle.setPagerNumber(1);
                }
                loading.value = true;
                const params = paramHandle.getParam() as Object;
                let result:ResultTable | Array<any> = [];
                if(props.postHandle){
                    result = await props.postHandle(params).catch(err=>{
                        loading.value = false;
                        throw err;
                    });
                }else if(props.services){
                    // result = await http({
                    //     url,
                    //     data: params
                    // })
                    // .catch((err:never) => {
                    //     loading.value = false;
                    //     throw err;
                    // });
                }
                paramHandle.lastQueryParams = params;//存储最近的一次参数
                loading.value = false;
                if (props.dataFormatHandle) {
                    result = props.dataFormatHandle(result);
                } //表格数据格式化
                // 返回的是数组的话，则total根据长度计算
                if (result && Array.isArray(result)) {
                    httpHandle.dataSet = result || [];
                    total.value = result.length || 0;
                } else {
                    httpHandle.dataSet =
                        (result && result["results"]) ||
                        (result && result["data"]) ||
                        (result && result["list"]) ||
                        [];
                    total.value = (result && result["total"]) || 0;
                }
                // 默认选中第一行
                console.log('test')
                if (Array.isArray(httpHandle.dataSet) && httpHandle.dataSet.length && props.firstSelected) {
                    nextTick(()=>{
                        elTableHandle.setCurrentRow(httpHandle.dataSet[0]);
                    })
                }
                //处理表格数据
                emit("data-change", getFullData);
            },
        })
        /**
         * @desc buttons相关操作
         */
        const {btnCondition,btnDisabled,btnClick} = new OpBtnsHandle();
        const buttonsHandle = reactive({
            btnCondition,// 该按钮显示与否 conditionFun:(row):boolean=>{}
            btnDisabled,// 该按钮是否disabled disabledFunc:(row):boolean=>{}
            btnClick, // 回调函数，该按钮点击事件 click:(row):void=>{}
        })
        /**
         * @desc table-column：formatter
         */
        const {formatFun}:FormatColumn = new FormatColumn(props.tableColumn)
        /**
         * @desc element-plus:Table Methods
         */
        const {
            clearSelection,
            toggleRowSelection,
            toggleAllSelection,
            toggleRowExpansion,
            setCurrentRow,
            clearSort,
            clearFilter,
            doLayout,
            sort
        }:ElComponentTableMethods = new ElComponentTableMethods()
        const elTableHandle = reactive({
            clearSelection,
            toggleRowSelection,
            toggleAllSelection,
            toggleRowExpansion,
            setCurrentRow,
            clearSort,
            clearFilter,
            doLayout,
            sort
        })
        // created,props.autoLoad为true的情况，调用接口
        if (props.autoLoad) {
            httpHandle.request();
        }

        return {
            // data-ref
            refTable,//table-ref
            loading,
            total,
            radioSelect,
            // data-reactive
            selectList,
            // computed
            getFullData,
            tableData,
            autoWith,
            // methods
            ...toRefs(paramHandle),//参数处理
            ...toRefs(httpHandle),//接口请求
            ...toRefs(buttonsHandle),//buttons相关操作
            ...toRefs(elTableHandle),//el-table:methods
            selectionChange,
            radioChange,
            columnMove,
            formatFun,
        }; 
    },
});
