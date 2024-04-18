import { deleteDataTable, getDataTable } from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IDataTableApi, IDeleteDataTable } from "@/types/dataTable";

export const useDataTable = (data: IDataTableApi) => {
    return useQuery({
        queryKey: ['dataUrl', data],
        queryFn: () => getDataTable(data),
    });
}

export const useDeleteDataTable = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: IDeleteDataTable) => deleteDataTable(data),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['dataUrl'] });
        },
    });
};