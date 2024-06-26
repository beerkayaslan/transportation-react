import { postDiscount, getDiscountbyCode } from "@/api";
import { DetailContentProps } from "@/pages/private/Discount/Detail";
import { useMutation, useQueryClient } from "@tanstack/react-query";


export const usePostDiscount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: DetailContentProps) => postDiscount(data),
        onSuccess: () => {
            queryClient.removeQueries({ queryKey: ['discount'] });
            queryClient.removeQueries({ queryKey: ['dataUrl'] });
        }
    });
}

export const useGetDiscountbyCode = () => {
    return useMutation({
        mutationFn: ({
            discountCode,
            transporter
        }: {
            discountCode: string;
            transporter: string;
        }) => getDiscountbyCode({ discountCode, transporter }),
    });
}