import {Options} from './form.d';
export type TableColumnType = 'select'|'radio'|'index'|'operate'|'render'|'expand'|'date'
export type AlignType = 'left'|'center'|'right'
/**
 *
 * @description element-plus:Table Methods
 * @export
 * @interface ElComponentTableComps
 */
export interface ElComponentTableComps {
    clearSelection:()=>void;//用于多选表格，清空用户的选择
    toggleRowSelection:(row:Object, selected:Boolean)=>void;//于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）(row, selected):void=>{}
    toggleAllSelection:()=>void;//用于多选表格，切换全选和全不选
    toggleRowExpansion:(row:Object, expanded:Boolean)=>void;//用于可展开表格与树形表格，切换某一行的展开状态，如果使用了第二个参数，则是设置这一行展开与否（expanded 为 true 则展开）(row, expanded):void=>{}
    setCurrentRow:(row:Object)=>void;//用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态 (row):void=>{}
    clearSort:()=>void;//用于清空排序条件，数据会恢复成未排序的状态
    clearFilter:(columnKey:Array<any>)=>void;//不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态，也可传入由columnKey组成的数组以清除指定列的过滤条件	(columnKey):void=>{}
    doLayout:()=>void;//对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
    sort:(prop: string, order: string)=>void;//手动对 Table 进行排序。参数prop属性指定排序列，order指定排序顺序。(prop: string, order: string)=>{}
}

/**
 *
 * @description element-plus:Table-column Attributes
 * @export
 * @interface ElComponentTableCAttrs
 */
export interface ElComponentTableCAttrs<T=string> {
    type?: T;//对应列的类型。如果设置了 selection 则显示多选框；如果设置了 index 则显示该行的索引（从 1 开始计算）；如果设置了 expand 则显示为一个可展开的按钮 (selection/index/expand)
    index?: Number | Function;//如果设置了 type=index，可以通过传递 index 属性来自定义索引 (index):void=>{}
    columnKey?:T;//column 的 key，如果需要使用 filter-change 事件，则需要此属性标识是哪个 column 的筛选条件
    label?: T;//显示的标题
    prop: T;//对应列内容的字段名，也可以使用 property 属性
    property: T;//对应列内容的字段名，也可以使用 property 属性
    width?: T | Number;//对应列的宽度
    minWidth?: Number | T;//对应列的最小宽度，与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列
    fixed?: T| Boolean;//列是否固定在左侧或者右侧，true 表示固定在左侧true, left, right
    renderHeader?: Function;//列标题 Label 区域渲染使用的 Function (h, { column, $index }):void=>{}
    sortable?: T | Boolean;//对应列是否可以排序，如果设置为 'custom'，则代表用户希望远程排序，需要监听 Table 的 sort-change 事件 (true, false, 'custom')
    sortMethod?:Function;//对数据进行排序的时候使用的方法，仅当 sortable 设置为 true 的时候有效，需返回一个数字，和 Array.sort 表现一致
    sortBy?: T | Array<any> | Function;//指定数据按照哪个属性进行排序，仅当 sortable 设置为 true 且没有设置 sort-method 的时候有效。如果 sort-by 为数组，则先按照第 1 个属性排序，如果第 1 个相等，再按照第 2 个排序，以此类推
    sortOrders?:Array<any>;//数据在排序时所使用排序策略的轮转顺序，仅当 sortable 为 true 时有效。需传入一个数组，随着用户点击表头，该列依次按照数组中元素的顺序进行排序
    resizable?: Boolean;//对应列是否可以通过拖动改变宽度（需要在 el-table 上设置 border 属性为真）
    formatter?:Function;//用来格式化内容
    showOverflowTooltip?: Boolean;//当内容过长被隐藏时显示 tooltip
    align?: AlignType;// 对齐方式 left/center/right
    headerAlign?: AlignType;//表头对齐方式，若不设置该项，则使用表格的对齐方式(left/center/right)
    className?: T;// 列的 className
    labelClassName?: T;//当前列标题的自定义类名
    selectable?:Function;//仅对 type=selection 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
    reserveSelection?: Boolean;//仅对 type=selection 的列有效，类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
    filters?:Array<any>;//数据过滤的选项，数组格式，数组中的元素需要有 text 和 value 属性。
    filterPlacement?: T;//过滤弹出框的定位
    filterMultiple?:Boolean;//数据过滤的选项是否多选
    filterMethod?:Function;//数据过滤使用的方法，如果是多选的筛选项，对每一条数据会执行多次，任意一次返回 true 就会显示
    filteredValue?: Array<any>;//选中的数据过滤项，如果需要自定义表头过滤的渲染方式，可能会需要此属性。 Array
}

/**
 *
 * @description Table-column-buttons Attributes
 * @export
 * @interface TableColumnButtons
 */
export interface TableColumnButtons {
    label:String;//按钮文字
    click?:(row:Object)=>void;//回掉函数，该按钮点击事件 click:(row):void=>{}
    className?:String;//className
    disabledFunc?:(row:Object)=>Boolean;//该按钮disabled disabledFunc:(row):boolean=>{}
    conditionFun?:(row:Object)=>Boolean;//该按钮显示与否 conditionFun:(row):boolean=>{}
}

/**
 *
 * @description Table-column Attributes
 * @export
 * @interface TableColumn<T=String>
 */
export interface TableColumn<T=string> {
    readonly id?:T;//key的标志
    label?:T;//显示的标题
    value?:T;//对应列内容的字段名
    type?:TableColumnType;//对应列的类型,不传或(select,radio,index,operate,render,expand,date)
    className?:T;//列的 className
    fixed?:Boolean | T;//列是否固定在左侧或者右侧，true 表示固定在左侧 (true, left, right)
    width?:T;//对应列的宽度,单位px
    align?:AlignType;//对齐方式 (left,center,right)
    header?:T;//slot-name为header
    slot?:T;//slot-name为slot
    valueFun?:(row:Object)=>String;//type 不为（select,radio,index,operate,render）,处理展示的字段
    rewrite?:Record< number| string,T> | Array<Options>;//type 不为（select,radio,index,operate,render）,处理展示的字段
    selectable?:Function;//仅对 type=select 的列有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选:Function(row, index)
    format?:T;//仅type=date时，可传format格式化时间
    buttons?:Array<TableColumnButtons>;//仅对 type=operate 的列有效
    sortable?:Boolean | T;//对应列是否可以排序，如果设置为 'custom'，则代表用户希望远程排序，需要监听 Table 的 sort-change 事件 (true, false, 'custom')
    render?:Function;//仅对type=render，render函数
    columnMove?:Boolean;//仅对type=render，是否展示上下移按钮图标
    columnMoveTop?:Boolean;//仅对type=render&&columnMove=true,传true的话，则emit上移事件columnMoveTop
    columnMoveBottom?:Boolean;//仅对type=render&&columnMove=true，传true的话，则emit下移事件columnMoveBottom
}

export class ResultTable{
    results?:Array<any>;
    data?:Array<any>;
    list?:Array<any>;
    total?:Number
}
