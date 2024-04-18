import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import {
    flexRender,
} from "@tanstack/react-table"
import { memo } from "react";

interface IBodyProps {
    table: any;
    columns: any;
    isLoading: boolean;
}


 function Body({ isLoading, table, columns}: IBodyProps) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    {
                        isLoading ? null :
                            table.getHeaderGroups().map((headerGroup: any) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header: any) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))
                    }
                </TableHeader>
                <TableBody>
                    {
                        isLoading ?
                            (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            )
                            :
                            table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row: any) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell: any) => (
                                            <TableCell key={cell.id} className="text-ellipsis">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default memo(Body);