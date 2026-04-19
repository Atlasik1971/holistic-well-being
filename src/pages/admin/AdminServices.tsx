import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { toast } from "sonner";

type Service = {
  id: string;
  title: string;
  description: string | null;
  duration: string | null;
  price: string | null;
  sort_order: number;
  is_published: boolean;
};

const empty = (): Omit<Service, "id"> => ({
  title: "",
  description: "",
  duration: "",
  price: "",
  sort_order: 0,
  is_published: true,
});

const AdminServices = () => {
  const [items, setItems] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("services").select("*").order("sort_order");
    setLoading(false);
    if (error) return toast.error(error.message);
    setItems((data ?? []) as Service[]);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing?.title?.trim()) return toast.error("Укажите название");
    setSaving(true);
    const payload = {
      title: editing.title!.trim(),
      description: editing.description ?? "",
      duration: editing.duration ?? "",
      price: editing.price ?? "",
      sort_order: editing.sort_order ?? items.length,
      is_published: editing.is_published ?? true,
    };
    const { error } = editing.id
      ? await supabase.from("services").update(payload).eq("id", editing.id)
      : await supabase.from("services").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Сохранено");
    setEditing(null);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Удалить услугу?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Удалено");
    load();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const idx = items.findIndex((i) => i.id === id);
    const swap = items[idx + dir];
    if (!swap) return;
    const a = items[idx];
    await supabase.from("services").update({ sort_order: swap.sort_order }).eq("id", a.id);
    await supabase.from("services").update({ sort_order: a.sort_order }).eq("id", swap.id);
    load();
  };

  const togglePublished = async (s: Service) => {
    const { error } = await supabase
      .from("services")
      .update({ is_published: !s.is_published })
      .eq("id", s.id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl">Услуги</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Карточки на публичной странице «Услуги».
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
          {items.map((s, idx) => (
            <div key={s.id} className="card-soft">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-serif text-lg">{s.title}</span>
                    {!s.is_published && (
                      <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        скрыта
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {[s.duration, s.price].filter(Boolean).join(" · ")}
                  </div>
                  {s.description && (
                    <p className="text-sm mt-2 text-foreground/80">{s.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button size="icon" variant="ghost" disabled={idx === 0} onClick={() => move(s.id, -1)}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" disabled={idx === items.length - 1} onClick={() => move(s.id, 1)}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Switch checked={s.is_published} onCheckedChange={() => togglePublished(s)} />
                  <Button size="sm" variant="quiet" onClick={() => setEditing(s)}>
                    Изменить
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(s.id)} className="text-muted-foreground hover:text-destructive">
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
              <h2 className="font-serif text-xl">{editing.id ? "Редактирование услуги" : "Новая услуга"}</h2>
              <div>
                <Label>Название</Label>
                <Input
                  value={editing.title ?? ""}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="mt-2"
                  maxLength={120}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Длительность</Label>
                  <Input
                    value={editing.duration ?? ""}
                    onChange={(e) => setEditing({ ...editing, duration: e.target.value })}
                    className="mt-2"
                    maxLength={60}
                  />
                </div>
                <div>
                  <Label>Цена / стоимость</Label>
                  <Input
                    value={editing.price ?? ""}
                    onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                    className="mt-2"
                    maxLength={60}
                  />
                </div>
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea
                  value={editing.description ?? ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={5}
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

export default AdminServices;
