import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useState } from "react";
import { useDeleteDataTable } from "@/query-hooks/useDataTable";
import { useToast } from "@/components/ui/use-toast";

import { useQueryClient } from "@tanstack/react-query"

interface IDeleteDialogProps {
  deleteDialogId: string | null;
  setDeleteDialogId: (id: string | null) => void;
}

export default function DeleteDialog({ deleteProps, setCheckedAllRows, dataTableQueryProps }: { deleteProps: IDeleteDialogProps; dataTableQueryProps: any; setCheckedAllRows: (checked: boolean) => void }) {
  const { toast } = useToast();

  const { deleteDialogId, setDeleteDialogId } = deleteProps;

  const [isOpen, setIsOpen] = useState(true);

  const deleteQuery = useDeleteDataTable();

  const queryClient = useQueryClient();


  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    setTimeout(() => {
      setDeleteDialogId(null);
    }, 300);
  }

  const handleRemove = () => {
    if (deleteDialogId) {
      deleteQuery.mutate({ deleteUrl: deleteDialogId }, {
        onSuccess: () => {
          handleOpenChange(false);
          setCheckedAllRows(false);
          toast({
            variant: "default",
            className: "bg-red-500 text-white",
            title: "Successfully deleted the record"
          });
          queryClient.refetchQueries({
            queryKey: ['dataUrl', dataTableQueryProps],
          });
        },
        onError: () => {
          toast({
            variant: "default",
            className: "bg-red-500 text-white",
            title: "Failed to delete the record"
          });
        }
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="!flex-row-reverse !justify-start gap-3">
          <Button variant="destructive" onClick={handleRemove}>Remove</Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}



