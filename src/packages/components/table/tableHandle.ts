import {
    ElComponentTableComps,
    ElComponentTableCAttrs,
    TableColumnButtons,
    TableColumn,
    Options,
} from '../../types';
import { TimeUtils } from '../../utils'
// buttons处理
export class OpBtnsHandle{
    constructor(){
        this.btnCondition = this.btnCondition.bind(this)
        this.btnDisabled = this.btnDisabled.bind(this)
        this.btnClick = this.btnClick.bind(this)
    }
    // 该按钮显示与否 conditionFun:(row):boolean=>{}
    btnCondition(btn:TableColumnButtons, row:Object):Boolean{
        if (btn.conditionFun) {
            return btn.conditionFun.call(this,row);
        }
        return true;
    }
    // 该按钮是否disabled disabledFunc:(row):boolean=>{}
    btnDisabled(btn:TableColumnButtons, row:Object):Boolean{
        if (btn.disabledFunc) {
            return btn.disabledFunc.call(this,row);
        }
        return false;
    }
    // 回掉函数，该按钮点击事件 click:(row):void=>{}
    btnClick(btn:TableColumnButtons, row:Object):void{
        if (btn.click) {
            btn.click.call(this,row);
        }
    }
}

// 其他columnFormat处理
export class FormatColumn {
    tableColumn:Array<TableColumn>=[]
    constructor(tableColumn:Array<TableColumn>){
        this.tableColumn = tableColumn;
        this.formatFun = this.formatFun.bind(this)
    }
    formatFun(data:Object, row:ElComponentTableCAttrs) {
        try{
            // const property = row.property;
            const utilsFunc:UtilsFunc = new UtilsFunc();
            const column = utilsFunc.isFilter(this.tableColumn, (item:TableColumn,index:Number) => {
                return item.value === row.property;
            }) as TableColumn;
            if (column["valueFun"]) {
                return column.valueFun.call(this, data);
            }
            const propData = (data as any)[row.property];
            if (column["rewrite"]) {
                // const propData = (data as any)[row.property];
                if(column["rewrite"].constructor === [].constructor){
                    let arrList = (column["rewrite"] as Array<Options>).filter((item:Options)=>String(item.value) === String(propData))
                    return Array.isArray(arrList)&&arrList.length?arrList[0]['label']:propData;
                }
                return column.rewrite[propData] || propData;
            }
            if (column["type"] === "date") {
                if(!propData){
                    return '--';
                }
                let timeFormat = column["format"];
                const {formatting}:TimeUtils = new TimeUtils();
                return formatting(new Date(propData),timeFormat);
            }
            return propData;
        }catch(e){
            return (data as any)[row.property];
        }
    }
}
// this指向调用实例
export class ElComponentTableMethods implements ElComponentTableComps{
    refTable:Object | any;
    constructor(refTable?:Object | any){
        this.refTable = refTable;
    }
    clearSelection():void{
        (this.refTable as any).clearSelection();
    }//用于多选表格，清空用户的选择
    toggleRowSelection(row:Object, selected:Boolean):void{
        (this.refTable as any).toggleRowSelection(row,selected);
    }//于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）(row, selected):void=>{}
    toggleAllSelection():void{
        (this.refTable as any).toggleAllSelection();
    }//用于多选表格，切换全选和全不选
    toggleRowExpansion(row:Object, expanded:Boolean){
        (this.refTable as any).toggleRowExpansion(row,expanded);
    };//用于可展开表格与树形表格，切换某一行的展开状态，如果使用了第二个参数，则是设置这一行展开与否（expanded 为 true 则展开）(row, expanded):void=>{}
    setCurrentRow(row:Object){
        (this.refTable as any).setCurrentRow(row);
    }//用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态 (row):void=>{}
    clearSort(){
        (this.refTable as any).clearSort();
    }//用于清空排序条件，数据会恢复成未排序的状态
    clearFilter(columnKey:Array<any>){
        (this.refTable as any).clearFilter(columnKey);
    }//不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态，也可传入由columnKey组成的数组以清除指定列的过滤条件	(columnKey):void=>{}
    doLayout(){
        (this.refTable as any).doLayout();
    }//对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
    sort(prop: string, order: string){
        (this.refTable as any).sort(prop,order);
    }//手动对 Table 进行排序。参数prop属性指定排序列，order指定排序顺序。(prop: string, order: string)=>{}
}

export class UtilsFunc {
    constructor(){
        this.isFunction = this.isFunction.bind(this);
        this.isFilter = this.isFilter.bind(this);
        this.mergeJSON = this.mergeJSON.bind(this);
        this.isJSON = this.isJSON.bind(this);
    }
    isFunction(fn:Function) {
        const string = toString.call(fn);
        return (
            string === "[object Function]" ||
            (typeof fn === "function" && string !== "[object RegExp]") ||
            (typeof window !== "undefined" &&
                // IE8 and below
                (fn === window.setTimeout ||
                    fn === window.alert ||
                    fn === window.confirm ||
                    fn === window.prompt))
        );
    }
    // 过滤tableColumn数据
    isFilter(dataArray:Array<TableColumn>, func:Function) {
        if (!Array.isArray(dataArray) || !dataArray.length) {
            return null;
        }
        let result = [] as Array<TableColumn>;
        for (let i = 0; i < dataArray.length; i++) {
            if (func && this.isFunction(func) && func(dataArray[i], i)) {
                result.push(dataArray[i]);
            }
        }
        return result.length === 1 ? result[0] : result;
    }
    // 是否是对象
    isJSON(json:Object) {
        const jsonC = {}.constructor
        return Boolean(json && json.constructor === jsonC);
    };
    // 合并参数
    mergeJSON(json1:Object | Array<any>, json2:Object |Array<any>) {
        let result = null;
        if (this.isJSON(json2)) {
            result = {};
            if (this.isJSON(json1)) {
                for (let key in json1) {
                    if (!Object.prototype.hasOwnProperty.call(json1, key)) {
                        continue;
                    }
                    (result as any)[key] = (json1 as any)[key];
                }
            }
            for (let key in json2) {
                if (!Object.prototype.hasOwnProperty.call(json2, key)) {
                    continue;
                }
                if (typeof result[key] === "object" && typeof json2 === "object") {
                    (result as any)[key] = this.mergeJSON((result as any)[key], (json2 as any)[key]);
                } else {
                    (result as any)[key] = (json2 as any)[key];
                }
            }
        } else if (Array.isArray(json1) && Array.isArray(json2)) {
            result = json1;
            for (let i = 0; i < json2.length; i++) {
                if (result.indexOf(json2[i]) === -1) {
                    result[result.length] = json2[i];
                }
            }
        } else {
            result = json2;
        }
        return result;
    }
}