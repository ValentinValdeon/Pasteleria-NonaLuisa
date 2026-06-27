"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category } from "@/lib/types";

interface ModalData {
  open: boolean;
  editing: Category | null;
  name: string;
  description: string;
  image_url: string;
}

const emptyModal = (): ModalData => ({
  open: false,
  editing: null,
  name: "",
  description: "",
  image_url: "",
});

export default function CategoriasPage() {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalData>(emptyModal);
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreate = () => {
    setModal({ open: true, editing: null, name: "", description: "", image_url: "" });
  };

  const openEdit = (cat: Category) => {
    setModal({
      open: true,
      editing: cat,
      name: cat.name,
      description: cat.description ?? "",
      image_url: cat.image_url ?? "",
    });
  };

  const handleSave = async () => {
    if (!modal.name.trim()) return;
    setSaving(true);
    const payload = {
      name: modal.name.trim(),
      description: modal.description.trim() || null,
      image_url: modal.image_url.trim() || null,
    };

    if (modal.editing) {
      await supabase.from("categories").update(payload).eq("id", modal.editing.id);
    } else {
      await supabase.from("categories").insert(payload);
    }

    setSaving(false);
    setModal(emptyModal());
    fetchCategories();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Eliminar esta categoría? Los productos asociados quedarán sin categoría.")) return;
    await supabase.from("categories").delete().eq("id", id);
    fetchCategories();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)]">
          Categorías
        </h1>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 min-h-[44px] rounded-full text-sm font-semibold bg-[var(--primary)] text-white hover:bg-[var(--accent)] transition-colors"
        >
          + Nueva
        </button>
      </div>

      {loading ? (
        <p className="text-[var(--accent)]">Cargando...</p>
      ) : categories.length === 0 ? (
        <p className="text-[var(--accent)]">No hay categorías todavía.</p>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-xl border border-[var(--primary-light)]/20 p-4 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-semibold text-[var(--foreground)] text-base">{cat.name}</p>
                {cat.description && (
                  <p className="text-sm text-[var(--accent)] truncate">{cat.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(cat)}
                  className="px-3 py-2 min-h-[44px] rounded-full text-sm font-medium bg-[var(--primary-light)]/20 text-[var(--accent)] hover:bg-[var(--primary-light)]/40 transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="px-3 py-2 min-h-[44px] rounded-full text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal.open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setModal(emptyModal())} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
                {modal.editing ? "Editar Categoría" : "Nueva Categoría"}
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--accent)] mb-1">Nombre *</label>
                  <input
                    value={modal.name}
                    onChange={(e) => setModal({ ...modal, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--primary-light)] text-base text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--accent)] mb-1">Descripción</label>
                  <textarea
                    value={modal.description}
                    onChange={(e) => setModal({ ...modal, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--primary-light)] text-base text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--accent)] mb-1">URL de imagen</label>
                  <input
                    value={modal.image_url}
                    onChange={(e) => setModal({ ...modal, image_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--primary-light)] text-base text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setModal(emptyModal())}
                  className="flex-1 py-2.5 min-h-[44px] rounded-full border border-[var(--primary-light)] text-base font-medium text-[var(--accent)] hover:bg-[var(--primary-light)]/20 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !modal.name.trim()}
                  className="flex-1 py-2.5 min-h-[44px] rounded-full text-base font-medium text-white bg-[var(--primary)] hover:bg-[var(--accent)] transition-colors disabled:opacity-50"
                >
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
