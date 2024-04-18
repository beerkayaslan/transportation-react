import { IDataTable } from "@/types/dataTable";
import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { useDataTable } from "@/query-hooks/useDataTable";
import useDebounce from "@/custom-hooks/useDebouncedValue";
import Footer from "./Footer";
import Header from "./Header";
import Body from "./Body";
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import DeleteDialog from "./DeleteDialog";
import { Progress } from "@/components/Loadable";


export default function DataTable(dataTableProps: IDataTable) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({});

    const [inputValue, setInputValue] = React.useState("");
    const debouncedValue = useDebounce(inputValue, 400);
    const [deleteDialogId, setDeleteDialogId] = React.useState<string | null>(null);

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }, []);


    const [query, setQuery] = React.useState({
        page: 1,
        limit: 10,
        searchKeys: dataTableProps.searchKeys,
        search: "",
        status: ""
    });

    React.useEffect(() => {
        setQuery({
            ...query,
            search: debouncedValue || "",
            page: 1,
        });
    }, [debouncedValue]);

    const { actions = true } = dataTableProps;


    const dataTableQueryProps = {
        dataUrl: dataTableProps.dataUrl,
        query
    };

    const { data, isLoading } = useDataTable(dataTableQueryProps);

    const columns: ColumnDef<any>[] = React.useMemo(() => {

        if (!data) return [];

        let columns = [
            {
                id: "select",
                header: ({ table }: { table: any }) => (
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                ),
                cell: ({ row }: { row: any }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                ),
                enableSorting: false,
                enableHiding: false,
            },
            ...dataTableProps.columns.map((column) => {
                return {
                    id: column.key,
                    accessorKey: column.key,
                    header: column.title,
                    cell: column.columnRender ? ({ row }: { row: any }) => column.columnRender(row.getValue(column.key), row.original) : ({ row }: { row: any }) => <div>{row.getValue(column.key)}</div>,
                };
            }),
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }: { row: any }) => {
                    return (
                        <div className="space-x-2 whitespace-nowrap">
                            <Button variant="destructive" size="icon" onClick={() => setDeleteDialogId(`${dataTableProps.dataUrl}/${row.original._id}`)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                    )
                },
            }
        ];


        if (!actions) {
            columns = columns.filter((column) => column.id !== "actions" && column.id !== "select");
        }

        return columns;
    }, [dataTableProps.columns, data, sorting, columnFilters, columnVisibility, rowSelection]);

    const setPage = React.useCallback((page: number) => {
        setQuery({
            ...query,
            page
        })
    }, [query]);

    const setPerPage = React.useCallback((perPage: number) => {
        setQuery({
            ...query,
            limit: perPage,
        });
    }, [query]);



    const table = useReactTable({
        data: data ? data.data : [],
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        manualPagination: true,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });


    const isSelectedCheckbox = React.useMemo(() => {
        return table.getSelectedRowModel().rows.length > 0;
    }, [rowSelection]);

    const setCheckedAllRows = React.useCallback((value: boolean) => {
        table.toggleAllPageRowsSelected(value);
    }, [rowSelection]);

    return (
        <>
            {
                isLoading && <Progress />
            }
            <div className="w-full">
                {
                    <Header inputValue={inputValue} handleChange={handleChange} table={table} columnVisibility={columnVisibility} dataUrl={dataTableProps.dataUrl} setDeleteDialogId={setDeleteDialogId} isSelectedCheckbox={isSelectedCheckbox} actions={actions} />
                }
                {
                    <Body table={table} isLoading={isLoading} columns={columns} />
                }
                {
                    !isLoading && <Footer
                        meta={{
                            page: data.meta.page,
                            perPage: data.meta.perPage,
                            total: data.meta.total
                        }}
                        setPage={setPage}
                        setPerPage={setPerPage}
                        rowListed={`${table.getFilteredSelectedRowModel().rows.length} of 
                        ${table.getFilteredRowModel().rows.length} row(s) selected.`}
                    />
                }
            </div>
            {
                deleteDialogId && <DeleteDialog dataTableQueryProps={dataTableQueryProps} setCheckedAllRows={setCheckedAllRows} deleteProps={{ deleteDialogId, setDeleteDialogId }} />
            }
        </>
    )
}