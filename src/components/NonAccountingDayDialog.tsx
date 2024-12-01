import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Database } from "@/integrations/supabase/types";

type NonAccountingDayInsert = Database["public"]["Tables"]["non_accounting_days"]["Insert"];

interface NonAccountingDayDialogProps {
  currentDate?: Date;
}

export function NonAccountingDayDialog({ currentDate = new Date() }: NonAccountingDayDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState(currentDate.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(currentDate.toISOString().split('T')[0]);
  const [reason, setReason] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const newNonAccountingDay: NonAccountingDayInsert = {
        start_date: startDate,
        end_date: endDate,
        reason,
        user_id: user.id
      };

      const { error } = await supabase
        .from("non_accounting_days")
        .insert(newNonAccountingDay);

      if (error) throw error;

      toast({
        title: "Dia não contábil registrado com sucesso!",
        description: "O registro foi salvo e já está disponível para consulta.",
      });

      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["month-data"] });
    } catch (error) {
      toast({
        title: "Erro ao registrar dia não contábil",
        description: "Ocorreu um erro ao salvar o registro. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex-1 bg-white text-blue-600 border-blue-600 py-4 rounded-2xl font-medium hover:bg-blue-50 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Não Contábil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Lançar Dia Não Contábil</DialogTitle>
            <DialogDescription>
              Registre períodos de férias, licenças ou outros dias não contábeis.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Data Inicial
              </Label>
              <Input
                id="startDate"
                type="date"
                className="col-span-3"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                Data Final
              </Label>
              <Input
                id="endDate"
                type="date"
                className="col-span-3"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Motivo
              </Label>
              <Input
                id="reason"
                className="col-span-3"
                placeholder="Ex: Férias, Licença"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}