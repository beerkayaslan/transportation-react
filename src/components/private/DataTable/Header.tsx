
import { CirclePlus, Settings2, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { memo, useCallback } from "react"
import { Link } from "react-router-dom"

interface IHeaderProps {
    inputValue: string;
    handleChange: (e: any) => void;
    table: any;
    columnVisibility: any;
    dataUrl: string;
    setDeleteDialogId: (id: string) => void;
    isSelectedCheckbox: boolean;
}

function Header({ inputValue, handleChange, table, dataUrl, setDeleteDialogId, isSelectedCheckbox, }: IHeaderProps) {

    const removeHandle = useCallback(() => {
        const selectedRows = table.getSelectedRowModel().rows;
        const fileIds = Object.values(selectedRows).map((row: any) => row.original._id)
        const fileIdString = fileIds.join(",");
        setDeleteDialogId(`${dataUrl}/${fileIdString}`);
    }, [setDeleteDialogId, isSelectedCheckbox]);


    return (
        <div className="flex items-center py-4">
            <div className="relative max-w-72 w-full">
                <Input
                    placeholder="Search"
                    value={inputValue}
                    onChange={handleChange}
                    className="max-w-sm"
                />
                {
                    inputValue && (
                        <Button variant="outline" size="icon" className="absolute w-7 h-7 right-1.5 top-1.5" onClick={() => {
                            handleChange({ target: { value: "" } })
                        }}>
                            <X className="w-4 h-4" />
                        </Button>
                    )
                }
            </div>
            {
                isSelectedCheckbox &&
                <Button variant="destructive" className="ml-4 gap-x-1" onClick={removeHandle}>
                    <Trash2 className="w-4 h-4" />
                    Remove
                </Button>
            }
            <Link to={`/${dataUrl}`}>
                <Button variant="default" className="ml-4 gap-x-1">
                    <CirclePlus className="h-4 w-4" />
                    Add New
                </Button>
            </Link>

            <div className="ml-auto flex gap-x-2 items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline"> View <Settings2 className="ml-2 h-4 w-4" /> </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {
                            table
                                .getAllColumns()
                                .filter((column: any) => column.getCanHide())
                                .map((column: any) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.columnDef.header}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

        </div>
    )
}

export default memo(Header);