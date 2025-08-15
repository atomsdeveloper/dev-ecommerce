"use client";

// Action
import { finishOrder } from "@/actions/finish-order";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Query
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Icon
import { LoaderCircleIcon } from "lucide-react";

// Next
import { redirect } from "next/navigation";

// Hook
import { useState } from "react";

// Toast
import { toast } from "sonner";

const ButtonFinishOrder = () => {
  const queryClient = useQueryClient();
  const [successPayOpenDialog, setSuccessPayOpenDialog] = useState(false);

  // Mutate action from add address in table and set like current cart.
  const { mutate: payment, isPending: isPendingPayment } = useMutation({
    mutationKey: ["finish-order"],
    mutationFn: finishOrder,
    onSuccess: () => {
      setSuccessPayOpenDialog(true);
      return queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
    onError: (error: any) => {
      toast.error(
        error?.message || "Erro ao salvar endereço. Tente novamente.",
      );
    },
  });

  // Function call on click button.
  const handleClickFinishOrder = () => {
    payment();
  };

  const handleCloseDialogAndRedirect = () => {
    setSuccessPayOpenDialog(false);
    redirect("/");
  };

  return (
    <>
      <Button
        className="w-full rounded-lg disabled:opacity-75"
        size="lg"
        onClick={handleClickFinishOrder}
        disabled={isPendingPayment}
      >
        {isPendingPayment ? (
          <div className="flex items-center gap-4">
            <LoaderCircleIcon className="animate-spin" />
            <p className="text-sm">Finalizando sua compra</p>
          </div>
        ) : (
          "Finalizar compra"
        )}
      </Button>

      <Dialog
        defaultOpen={successPayOpenDialog}
        onOpenChange={setSuccessPayOpenDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Button onClick={() => {}}>Ver meus pedidos.</Button>
            <Button onClick={handleCloseDialogAndRedirect}>
              Voltar para a loja.
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ButtonFinishOrder;
