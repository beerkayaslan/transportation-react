import React, { useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface IFooter {
    setPage: (page: number) => void,
    setPerPage: (perPage: number) => void,
    meta: {
        page: number,
        perPage: number,
        total: number
    },
    rowListed?: string
}

function Footer({ meta: { page, perPage, total }, setPage, setPerPage, rowListed }: IFooter) {
    const totalPages = Math.ceil(total / perPage);

    const handleFilterSetPerPage = React.useCallback((value: string) => {
        setPage(1);
        setPerPage(Number(value));
    }, [setPerPage]);

    useEffect(() => {
        if (totalPages === 0) {
            setPage(1);
            return;
        }

        if (page > totalPages) {
            setPage(totalPages);
        }
    }, [page, totalPages]);

    return (
        <nav className="flex items-center justify-between my-6">
            <div>
                <div className="flex-1 text-sm text-muted-foreground">
                    {rowListed}
                </div>
            </div>
            <div className="flex items-center gap-x-6">
                <div className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</div>
                <div className="w-16">
                    <Select defaultValue={String(perPage)} onValueChange={handleFilterSetPerPage}>
                        <SelectTrigger  >
                            <SelectValue placeholder="Select per page" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="15">15</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="25">25</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {
                    totalPages > 1 &&
                    <>
                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                            Page {page} of {totalPages}
                        </div>
                        <div className="flex items-center gap-x-2">
                            <Button variant="outline" size="icon" disabled={page === 1}
                                onClick={() => setPage(1)}>
                                <ChevronsLeft className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" disabled={page === 1}
                                onClick={() => setPage(page - 1)}>
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" disabled={page === totalPages}
                                onClick={() => setPage(page + 1)}>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="icon" disabled={page === totalPages}
                                onClick={() => setPage(totalPages)}>
                                <ChevronsRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </>
                }
            </div>
        </nav>
    )
}

export default React.memo(Footer);