"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product, Category } from "@/lib/types";
import { formatPrice, getImageUrl } from "@/lib/utils";

interface ModalData {
  open: boolean;
  editing: Product | null;
  name: string;
  description: string;
  price: string;
  image_url: string;
  category_id: string;
  available: boolean;
}

const emptyModal = (): ModalData => ({
  open: false,
  editing: null,
  name: "",
  description: "",
  price: "",
  image_url: "",
  category_id: "",
  available: true,
});

export default function ProductosPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<(Product & { category_name?: string })[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalData>(emptyModal);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState("");

  const fetchData = async () => {
    const [{ data: productsData }, { data: cats }] = await Promise.all([
      supabase.from("products").select("*").order("name"),
      supabase.from("categories").select("*").order("name"),
    ]);

    if (cats) setCategories(cats);

    if (productsData) {
      const enriched = productsData.map((p) => ({
        ...p,
        category_name: cats?.find((c) => c.id === p.category_id)?.name ?? "Sin categoría",
      }));
      setProducts(enriched);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setModal(emptyModal());
  };

  const openEdit = (product: Product) => {
    setModal({
      open: true,
      editing: product,
      name: product.name,
      description: product.description ?? "",
      price: String(product.price),
      image_url: product.image_url ?? "",
      category_id: product.category_id ?? "",
      available: product.available,
    });
  };

  const handleSave = async () => {
    if (!modal.name.trim() || !modal.price.trim()) return;
    setSaving(true);

    const price = parseFloat(modal.price.replace(",", "."));
    if (isNaN(price)) return;

    const payload = {
      name: modal.name.trim(),
      description: modal.description.trim() || null,
      price,
      image_url: modal.image_url.trim() || null,
      category_id: modal.category_id || null,
      available: modal.available,
    };

    if (modal.editing) {
      await supabase.from("products").update(payload).eq("id", modal.editing.id);
    } else {
      await supabase.from("products").insert(payload);
    }

    setSaving(false);
    setModal(emptyModal());
    fetchData();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`¿Eliminar "${name}"? También se eliminará de los combos que lo contengan.`)) return;
    await supabase.from("products").delete().eq("id", id);
    fetchData();
  };

  const toggleAvailable = async (product: Product) => {
    setLoading(true);
    await supabase.from("products").update({ available: !product.available }).eq("id", product.id);
    fetchData();
  };

  const filtered = filterCat
    ? products.filter((p) => p.category_id === filterCat)
    : products;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)]">
          Productos
        </h1>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 min-h-[44px] rounded-full text-sm font-semibold bg-[var(--primary)] text-white hover:bg-[var(--accent)] transition-colors"
        >
          + Nuevo
        </button>
      </div>

      {categories.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          <button
            onClick={() => setFilterCat("")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              !filterCat
                ? "bg-[var(--primary)] text-white"
                : "bg-[var(--primary-light)]/20 text-[var(--accent)] hover:bg-[var(--primary-light)]/40"
            }`}
          >
            Todas
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCat(cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterCat === cat.id
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--primary-light)]/20 text-[var(--accent)] hover:bg-[var(--primary-light)]/40"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-[var(--accent)]">Cargando...</p>
      ) : filtered.length === 0 ? (
        <p className="text-[var(--accent)]">No hay productos.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((product) => {
            const imgSrc = getImageUrl(product.image_url, 80, 60);
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-[var(--primary-light)]/20 p-4 shadow-sm flex items-center gap-4"
              >
                <div className="w-14 h-14 rounded-lg bg-[var(--primary-light)]/20 overflow-hidden shrink-0">
                  {imgSrc ? (
                    <img src={imgSrc} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[var(--primary-light)]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-[var(--foreground)] text-base ${!product.available ? "line-through opacity-50" : ""}`}>
                      {product.name}
                    </p>
                    {!product.available && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-red-100 text-red-600">
                        No disp.
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--accent)] truncate">{product.category_name}</p>
                  <p className="font-bold text-[var(--primary)] text-sm">{formatPrice(product.price)}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => toggleAvailable(product)}
                    className={`p-2 min-h-[44px] min-w-[44px] rounded-full text-sm transition-colors ${
                      product.available
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                    title={product.available ? "Deshabilitar" : "Habilitar"}
                  >
                    {product.available ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => openEdit(product)}
                    className="px-3 py-2 min-h-[44px] rounded-full text-sm font-medium bg-[var(--primary-light)]/20 text-[var(--accent)] hover:bg-[var(--primary-light)]/40 transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="px-3 py-2 min-h-[44px] rounded-full text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal.open && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setModal(emptyModal())} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
                {modal.editing ? "Editar Producto" : "Nuevo Producto"}
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
                  <label className="block text-sm font-medium text-[var(--accent)] mb-1">Precio *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={modal.price}
                    onChange={(e) => setModal({ ...modal, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--primary-light)] text-base text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--accent)] mb-1">Categoría</label>
                  <select
                    value={modal.category_id}
                    onChange={(e) => setModal({ ...modal, category_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--primary-light)] text-base text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors bg-white"
                  >
                    <option value="">Sin categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--accent)] mb-1">URL de imagen</label>
                  <input
                    value={modal.image_url}
                    onChange={(e) => setModal({ ...modal, image_url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--primary-light)] text-base text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-[var(--accent)]">Disponible</label>
                  <button
                    onClick={() => setModal({ ...modal, available: !modal.available })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      modal.available ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`block w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                        modal.available ? "translate-x-[22px]" : "translate-x-[2px]"
                      }`}
                    />
                  </button>
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
                  disabled={saving || !modal.name.trim() || !modal.price.trim()}
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
