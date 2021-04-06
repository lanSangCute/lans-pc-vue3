/**
 * tableRender
*/
import {
    vForm, vTable, vRender
} from '../index';
import { ElButton } from 'element-plus';
import {
    TopOperationItem, TableColumn
} from '../../types';

export function formTableRender(h:any) {
    const {
        title,
        filterFormConfig,
        filterInline,
        filterLabelWidth,
        filterLabelSuffix,
        filterCol,
        filterLabelPosition,
        initFormData,
        changeOut,
        topRightOperationLine,
        hasTopOperationLeft,
        topOperation,
        showSearch,
        showReset,
        btnSize,
        operationHandle,
        $slots,
        showRequestNum,
        tableData,
        hasSelection,
        selectionList,
        tableColumn,
        filterParams,
        services,
        dataFormatHandle,
        pagination,
        tableBorder,
        importData,
        autoLoad,
        postHandle,
        paramsHandle,
        tableProps,
        tableSelectionChangeHandle,
        tableDataChange,
        tableCurrentChangeHandle
    } = this;

    const getSlotFormTableColumns = () => {
        let slotColumns = {};
        tableColumn.forEach((item: TableColumn) => {
            let { type, slot, header } = item;
            if (!['select', 'radio', 'index', 'operate', 'render'].includes(type || '')){
                const slotAdd = (slotName?: string) => {
                    if (slotName) {
                        slotColumns = {
                            ...slotColumns,
                            [slotName]: (scope: Object) => [
                                $slots[slotName]?.({
                                    scope
                                })
                            ]
                        };
                    }
                };
                slotAdd(slot);
                slotAdd(header);
            }
        });
        return slotColumns;
    }

    const searchAndReset = h('div', null, {
        default: () => [
            showSearch ? h(ElButton, {
                type: 'primary',
                size: btnSize,
                onClick: () => {
                    operationHandle({ handle: 'query' });
                }
            }, {
                default: () => [filterFormConfig ? '查询' : '刷新']
            }) : null,
            filterFormConfig && showReset ? h(ElButton, {
                size: btnSize,
                onClick: () => {
                    operationHandle({ handle: 'resetFilterForm' });
                }
            }, {
                default: () => '重置'
            }) : null
        ]
    });

    return h('div', {
        class: 'component-configFilterTable h-100 w-100'
    }, {
        default: () => [
            title ? h('div', {
                class: 'text-20 title'
            }, {
                default: () => title
            }) : null,
            h(vForm, {
                ref: 'refForm',
                configs: filterFormConfig,
                inline: filterInline,
                'label-width': filterLabelWidth,
                'label-suffix': filterLabelSuffix,
                'label-position': filterLabelPosition,
                'init-form-data': initFormData,
                col: filterCol,
                onChangeOut: changeOut
            }, {
                inline: () => [topRightOperationLine ? h('div', {
                    class: 'd-inline-block line-height-40'
                }, {
                    default: () => [searchAndReset]
                }) : null]
            }),
            !(!hasTopOperationLeft && topRightOperationLine) ? h('div', {
                class: 'top-opertaions-container flex-ju-between mb-12'
            }, {
                default: () => {
                    const operationBtns = (btns: Array<TopOperationItem>) => (btns || []).map((operation: TopOperationItem) => {
                        const {
                            key, type, icon, disabled, render, data, name
                        } = operation;
                        return operation.type !== 'render' ? h(ElButton, {
                            key,
                            type: 'primary' || type,
                            size: btnSize,
                            icon,
                            disabled,
                            onClick: () => {
                                operationHandle(operation);
                            }
                        }, {
                            default: () => name
                        }) : h(vRender, {
                            key,
                            render,
                            data
                        });
                    });
                    return [
                        h('div', {
                            class: 'left-operations-container d-block'
                        }, {
                            default: () => [hasTopOperationLeft ? [h('div', null, {
                                default: () => [operationBtns(topOperation.left)]
                            })] : null]
                        }),
                        !topRightOperationLine ? h('div', {
                            class: 'right-operations-container d-block'
                        }, {
                            default: () => [searchAndReset]
                        }) : null
                    ];
                }
            }) : null,
            $slots.default?.(),
            showRequestNum ? h('div', {
                class: 'tip-container radius-4 mb-12'
            }, {
                default: () => [
                    h('i', {
                        class: 'el-icon-info tip-icon color-blue'
                    }),
                    h('span', {
                        class: 'tip-text'
                    }, {
                        default: () => [
                            `共查询到 ${tableData.total || '-'} 条数据`,
                            hasSelection ? h('span', null, {
                                default: () => [h('span', {
                                    class: 'color-blue'
                                }, {
                                    default: () => `,已选择${selectionList.length}条数据`
                                })]
                            }) : null
                        ]
                    })
                ]
            }) : null,
            h(vTable, {
                ref: 'refTable',
                'table-column': tableColumn,
                params: filterParams,
                services,
                'data-format-handle': dataFormatHandle,
                pagination,
                border: tableBorder,
                'import-data': importData,
                'auto-load': autoLoad,
                'post-handle': postHandle,
                'params-handle': paramsHandle,
                onSelectionChange: tableSelectionChangeHandle,
                onDataChangef: tableDataChange,
                onCurrentChange: tableCurrentChangeHandle,
                ...tableProps
            }, getSlotFormTableColumns())
        ]
    });
}
