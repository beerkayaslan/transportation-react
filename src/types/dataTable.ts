export interface IDataTableApi {
    dataUrl: string;
    query: {
        page: number;
        limit: number;
        search: string;
        searchKeys: string[];
    }
}

export interface IDataTable {
    dataUrl: string;
    updateUrl?: string;
    searchKeys: string[];
    actions?: boolean;
    columns: {
        columnRender?: any;
        title: string;
        key: string;
    }[];
}

export interface IDeleteDataTable {
    deleteUrl: string;
}