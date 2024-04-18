import { postTransporterFollow, deleteTransporterFollow } from "@/api";
import { DetailContentProps } from "@/pages/private/FollowTransporters/Index";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const usePostTransporterFollow = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: DetailContentProps) => postTransporterFollow(data),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['transporter'] });
            queryClient.removeQueries({ queryKey: ['dataUrl'] });
        }
    });
}

export const useDeleteTransporterFollow = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: DetailContentProps) => deleteTransporterFollow(data),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['transporter'] });
            queryClient.removeQueries({ queryKey: ['dataUrl'] });
        }
    });
}