type TopOperationItemType = 'render'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'text'

export type TopOperationItemArguments = 'batchSelected' | 'filterForm'

export interface TopOperationItem<T=String> {
    name?: T;
    key: T;
    icon?: T;
    type?: TopOperationItemType;
    disabled?: Boolean;
    handle?: Function;
    requireArguments?: Array<TopOperationItemArguments>;
    data?: any;
    render?: Function;
}

export interface TopOperation {
    left?: Array<TopOperationItem>;
    right?: Array<TopOperationItem>;
}