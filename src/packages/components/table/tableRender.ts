import {
    ElTable, ElTableColumn, ElRadio, ElButton, ElForm
} from 'element-plus';
import {
    TableColumn, TableScope
} from '../../types';
import {
    vRender, vPagination
} from '../index';

export function tableRender(h:any) {
    const {
        getFullData,
        tableData,
        border,
        selectionChange,
        showEmptyImg,
        tableColumn,
        radioSelect,
        radioChange,
        aligns,
        autoWith,
        btnCondition,
        btnDisabled,
        btnClick,
        columnMove,
        formatFun,
        pagination,
        pager,
        total,
        pageChange,
        $slots,
        $attrs
    } = this;

    return h('div', {
        class: 'component-configTable'
    }, {
        default: () => [
            $slots.head?.({
                ...getFullData
            }),
            h(ElTable, {
                ref: 'refTable',
                data: tableData,
                border,
                size: 'small',
                style: {
                    width: '100%'
                },
                height: $attrs.height,
                'highlight-current-row': true,
                onSelectionChange:selectionChange,
                ...$attrs
            }, {
                empty: () => [showEmptyImg ? h('div', {
                    class: 'flex-ju-al-center'
                }, {
                    default: () => [
                        h('img', {
                            class: 'my-24',
                            src: './noContent.svg'
                        })
                    ]
                }) : null],
                default: () => tableColumn.map((cln: TableColumn, index: number) => {
                    const {
                        label, value, type, fixed, width, selectable, className, align, buttons, render, sortable, slot, header
                    } = cln;
                    let renderColumnItem = null;
                    if (type === 'select') {
                        renderColumnItem = h(ElTableColumn, {
                            key: `select${index}`,
                            type: 'selection',
                            fixed,
                            width: width || 50,
                            align: 'center',
                            selectable
                        });
                    } else if (type === 'radio') {
                        renderColumnItem = h(ElTableColumn, {
                            key: `radio${index}`,
                            label,
                            fixed,
                            width: width || 60,
                            align: 'center'
                        }, {
                            default: (scope: TableScope) => [
                                h(ElRadio, {
                                    modelValue: radioSelect,
                                    'onUpdate:modelValue':radioChange,
                                    label: scope.$index
                                }, {
                                    default:() => '\u00A0'// 类似于&nbsp;
                                })
                            ]
                        });
                    } else if (type === 'index'){
                        renderColumnItem = h(ElTableColumn, {
                            key: `index${index}`,
                            label: '序号',
                            type: 'index',
                            fixed,
                            width: width || 50,
                            align: 'center',
                            prop: value
                        });
                    } else if (type === 'operate') {
                        renderColumnItem = h(ElTableColumn, {
                            key: `operate${index}`,
                            label,
                            fixed,
                            width: width || autoWith(cln.buttons),
                            'class-name': className,
                            align: align || aligns
                        }, {
                            default: (scope: TableScope) => (buttons || []).map((btn) => h('div', null, {
                                default: () => [
                                    btnCondition(btn, scope.row) ? h(ElButton, {
                                        key: label,
                                        disabled: btnDisabled(btn, scope.row),
                                        size: 'small',
                                        type: 'text',
                                        class: className,
                                        onClick: () => {
                                            btnClick(btn, scope.row);
                                        }
                                    }, {
                                        default: () => label
                                    }) : null
                                ]
                            }))
                        });
                    } else if (type === 'render' && render) {
                        renderColumnItem = h(ElTableColumn, {
                            key: `render${index}`,
                            label,
                            sortable,
                            fixed,
                            'class-name': className,
                            align: align || aligns,
                            width: width || 'auto',
                            'show-overflow-tooltip': label !== '操作'
                        }, {
                            default: (scope: TableScope) => [
                                h('div', {
                                    class: 'flex'
                                }, {
                                    default: () => [
                                        h(vRender, {
                                            render,
                                            data: {
                                                row: scope.row,
                                                column: cln,
                                                index: scope.$index
                                            }
                                        }),
                                        cln.columnMove ? h('div', {
                                            class: 'ml-8'
                                        }, {
                                            default: () => [
                                                h(ElButton, {
                                                    type: 'text',
                                                    icon: 'el-icon-top',
                                                    disabled: scope.$index === 0,
                                                    onClick: () => {
                                                        columnMove('top', scope.row, cln, scope.$index);
                                                    }
                                                }),
                                                h(ElButton, {
                                                    type: 'text',
                                                    icon: 'el-icon-bottom',
                                                    disabled: scope.$index === (tableData || []).length - 1,
                                                    onClick: () => {
                                                        columnMove('bottom', scope.row, cln, scope.$index);
                                                    }
                                                })
                                            ]
                                        }) : null
                                    ]
                                })
                            ]
                        });
                    } else {
                        renderColumnItem = h(ElTableColumn, {
                            key: `otable${index}`,
                            prop: value,
                            label,
                            sortable,
                            fixed,
                            type: type === 'expand' ? 'expand' : '',
                            'class-name': className,
                            width: width || 'auto',
                            align: align || aligns,
                            formatter: formatFun,
                            'show-overflow-tooltip': true
                        }, {
                            default: (scope: TableScope) => [
                                formatFun(scope.row, scope.column),
                                slot ? h('slot', null, {
                                    default: () => $slots[slot]?.(scope)
                                }) : null,
                            ],
                            header: (scope: any) => [
                                header ? h('slot', null, {
                                    default: () => $slots[header]?.(scope)
                                }) : scope.column.label,
                            ]
                        });
                    }
                    return renderColumnItem;
                })
            }),
            h(ElForm, {
                disabled: false
            }, {
                default: () => [
                    pagination ? h(vPagination, {
                        class: 'tncm-pagination',
                        page: pager,
                        total,
                        onChange: pageChange
                    }) : null,
                    $slots.foot?.({
                        ...getFullData
                    })
                ]
            })
        ]
    });
}
