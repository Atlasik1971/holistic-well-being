import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type Status = "new" | "in_progress" | "done";

const STATUS_LABEL: Record<Status, string> = {
  new: "Новая",
  in_progress: "В работе",
  done: "Закрыта",
};

const STATUS_VARIANT: Record<Status, "default" | "secondary" | "outline"> = {
  new: "default",
  in_progress: "secondary",
  done: "outline",
};

type Submission = {
  id: string;
  name: string;
  contact: string;
  status: string;
  admin_note: string | null;
  created_at: string;
  format?: string | null;
  request?: string | null;
  message?: string | null;
};

type Props = {
  table: "bookings" | "contact_messages" | "chat_leads";
  title: string;
  description: string;
  bodyField: "request" | "message";
  showFormat?: boolean;
};

const SubmissionsList = ({ table, title, description, bodyField, showFormat }: Props) => {
  const [items, setItems] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems((data ?? []) as Submission[]);
  };

  useEffect(() => {
    load();
  }, [table]);

  const updateStatus = async (id: string, status: Status) => {
    setSavingId(id);
    const { error } = await supabase.from(table).update({ status }).eq("id", id);
    setSavingId(null);
    if (error) return toast.error(error.message);
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, status } : it)));
    toast.success("Статус обновлён");
  };

  const updateNote = async (id: string, note: string) => {
    setSavingId(id);
    const { error } = await supabase.from(table).update({ admin_note: note }).eq("id", id);
    setSavingId(null);
    if (error) return toast.error(error.message);
    toast.success("Заметка сохранена");
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить запись?")) return;
    const { error } = await supabase.from(table).delete().eq("id", id);
    if (error) return toast.error(error.message);
    setItems((prev) => prev.filter((it) => it.id !== id));
    toast.success("Удалено");
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl">{title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="card-soft text-center py-16 text-muted-foreground">Пока пусто</div>
      ) : (
        <div className="space-y-4">
          {items.map((it) => {
            const status = (it.status as Status) || "new";
            const body = (it as any)[bodyField] as string | null | undefined;
            return (
              <div key={it.id} className="card-soft">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{it.name}</span>
                      <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
                      {showFormat && it.format && (
                        <Badge variant="outline">{it.format}</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{it.contact}</div>
                    <div className="text-xs text-muted-foreground/70 mt-0.5">
                      {new Date(it.created_at).toLocaleString("ru-RU")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {status !== "in_progress" && (
                      <Button size="sm" variant="quiet" onClick={() => updateStatus(it.id, "in_progress")}>
                        В работу
                      </Button>
                    )}
                    {status !== "done" && (
                      <Button size="sm" variant="quiet" onClick={() => updateStatus(it.id, "done")}>
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Закрыть
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" onClick={() => remove(it.id)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {body && (
                  <div className="mt-4 rounded-lg bg-muted p-3 text-sm whitespace-pre-wrap text-foreground/85">
                    {body}
                  </div>
                )}

                <details className="mt-3">
                  <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground select-none">
                    Заметка администратора
                  </summary>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <Textarea
                      defaultValue={it.admin_note ?? ""}
                      rows={2}
                      placeholder="Заметка…"
                      className="flex-1"
                      onBlur={(e) => {
                        const v = e.currentTarget.value;
                        if (v !== (it.admin_note ?? "")) updateNote(it.id, v);
                      }}
                    />
                    {savingId === it.id && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground self-center" />}
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubmissionsList;
