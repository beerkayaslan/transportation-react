import { postCargos } from "@/api";
import { DetailContentProps } from "@/pages/private/CreateCargo/Detail";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const usePostCargo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: DetailContentProps) => postCargos(data),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['cargos'] });
            queryClient.removeQueries({ queryKey: ['dataUrl'] });
        }
    });
}