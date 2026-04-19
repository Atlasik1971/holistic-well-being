import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";

type Review = {
  id: string;
  client_name: string;
  format: string | null;
  text: string;
  sort_order: number;
  is_published: boolean;
};

const empty = (): Omit<Review, "id"> => ({
  client_name: "",
  format: "",
  text: "",
  sort_order: 0,
  is_published: true,
});

const AdminReviews = () => {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Review> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("reviews").select("*").order("sort_order");
    setLoading(false);
    if (error) return toast.error(error.message);
    setItems((data ?? []) as Review[]);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing?.client_name?.trim()) return toast.error("Укажите имя клиента");
    if (!editing?.text?.trim()) return toast.error("Укажите текст отзыва");
    setSaving(true);
    const payload = {
      client_name: editing.client_name!.trim(),
      format: editing.format ?? "",
      text: editing.text!.trim(),
      sort_order: editing.sort_order ?? items.length,
      is_published: editing.is_published ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("reviews").update(payload).eq("id", editing.id)
      : await supabase.from("reviews").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Сохранено");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить отзыв?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Удалено");
    load();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((i) => i.id === id);
    const swap = items[idx + dir];
    if (!swap) return;
    const a = items[idx];
    await supabase.from("reviews").update({ sort_order: swap.sort_order }).eq("id", a.id);
    await supabase.from("reviews").update({ sort_order: a.sort_order }).eq("id", swap.id);
    load();
  };

  const togglePublished = async (r: Review) => {
    const { error } = await supabase
      .from("reviews")
      .update({ is_published: !r.is_published })
      .eq("id", r.id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl">Отзывы</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Отзывы клиентов на публичной странице.
          </p>
        </div>
        <Button onClick={() => setEditing(empty())} variant="hero">
          <Plus className="h-4 w-4 mr-2" />
          Добавить
        </Button>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((r, idx) => (
            <div key={r.id} className="card-soft">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">{r.client_name}</span>
                    {r.format && (
                      <span className="text-xs text-muted-foreground">{r.format}</span>
                    )}
                    {!r.is_published && (
                      <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        скрыт
                      </span>
                    )}
                  </div>
                  <p className="text-sm mt-2 text-foreground/85 line-clamp-3">«{r.text}»</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" disabled={idx === 0} onClick={() => move(r.id, -1)}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" disabled={idx === items.length - 1} onClick={() => move(r.id, 1)}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Switch checked={r.is_published} onCheckedChange={() => togglePublished(r)} />
                  <Button size="sm" variant="quiet" onClick={() => setEditing(r)}>
                    Изменить
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(r.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => !saving && setEditing(null)}>
          <div className="bg-card border border-border rounded-2xl shadow-card max-w-lg w-full max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 space-y-4">
              <h2 className="font-serif text-xl">{editing.id ? "Редактирование отзыва" : "Новый отзыв"}</h2>
              <div>
                <Label>Имя клиента</Label>
                <Input
                  value={editing.client_name ?? ""}
                  onChange={(e) => setEditing({ ...editing, client_name: e.target.value })}
                  className="mt-2"
                  maxLength={80}
                />
              </div>
              <div>
                <Label>Формат</Label>
                <Input
                  value={editing.format ?? ""}
                  onChange={(e) => setEditing({ ...editing, format: e.target.value })}
                  placeholder="Формат: сопровождение"
                  className="mt-2"
                  maxLength={80}
                />
              </div>
              <div>
                <Label>Текст отзыва</Label>
                <Textarea
                  value={editing.text ?? ""}
                  onChange={(e) => setEditing({ ...editing, text: e.target.value })}
                  rows={6}
                  className="mt-2 resize-y"
                  maxLength={2000}
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={editing.is_published ?? true}
                  onCheckedChange={(v) => setEditing({ ...editing, is_published: v })}
                />
                <span className="text-sm">Опубликовать на сайте</span>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="quiet" onClick={() => setEditing(null)} disabled={saving}>
                  Отмена
                </Button>
                <Button variant="hero" onClick={save} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Сохранить"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
