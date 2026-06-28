"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product, Category } from "@/lib/types";
import { formatPrice, getImageUrl } from "@/lib/utils";
import { useToast } from "@/context/ToastContext";

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

function CheckIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function GridPlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  );
}

function FilterIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
    </svg>
  );
}

export default function ProductosPage() {
  const supabase = createClient();
  const [products, setProducts] = useState<(Product & { category_name?: string })[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<ModalData>(emptyModal);
  const [preview, setPreview] = useState<(Product & { category_name?: string }) | null>(null);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();
  const [filterCat, setFilterCat] = useState("");
  const [filterStatus, setFilterStatus] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

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

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const openCreate = () => {
    setModal({ ...emptyModal(), open: true });
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
      addToast("Producto actualizado");
    } else {
      await supabase.from("products").insert(payload);
      addToast("Producto creado");
    }

    setSaving(false);
    setModal(emptyModal());
    fetchData();
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`¿Eliminar "${name}"? También se eliminará de los combos que lo contengan.`)) return;
    await supabase.from("products").delete().eq("id", id);
    addToast("Producto eliminado");
    fetchData();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filePath = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(filePath, file);
    if (error) {
      addToast("Error al subir imagen", "error");
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(filePath);
    setModal({ ...modal, image_url: publicUrl });
    setUploading(false);
  };

  const toggleAvailable = async (product: Product) => {
    const next = !product.available;
    const prev = products;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, available: next } : p
      )
    );
    addToast(next ? "Producto habilitado" : "Producto deshabilitado");
    const { error } = await supabase.from("products").update({ available: next }).eq("id", product.id);
    if (error) {
      setProducts(prev);
      addToast("Error al actualizar", "error");
    }
  };

  const filtered = products.filter((p) => {
    if (filterCat && p.category_id !== filterCat) return false;
    if (filterStatus ? !p.available : p.available) return false;
    return true;
  });

  const activeFilterName = filterCat
    ? categories.find((c) => c.id === filterCat)?.name ?? "Todas"
    : "Todas";

  return (
    <>
      <style>{`
        @keyframes breathe-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.4); }
        }
      `}</style>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)]">
          Productos
        </h1>
        <button
          onClick={openCreate}
          className="p-2 min-h-[44px] min-w-[44px] rounded-full bg-[var(--primary)] text-white hover:bg-[var(--accent)] transition-colors flex items-center justify-center"
          title="Nuevo producto"
        >
          <GridPlusIcon />
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--accent)]">Categorías</span>
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`p-2 min-h-[44px] min-w-[44px] rounded-full transition-colors flex items-center justify-center ${
                filterCat
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--primary-light)]/20 text-[var(--accent)] hover:bg-[var(--primary-light)]/40"
              }`}
              title="Filtrar por categoría"
            >
              <FilterIcon />
            </button>
            {filterOpen && (
              <div className="absolute top-full left-0 mt-1 w-44 bg-white rounded-xl shadow-lg border border-[var(--primary-light)]/20 z-30 py-1 max-h-60 overflow-y-auto">
                <button
                  onClick={() => { setFilterCat(""); setFilterOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                    !filterCat
                      ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                      : "text-[var(--accent)] hover:bg-[var(--primary-light)]/10"
                  }`}
                >
                  Todas
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setFilterCat(cat.id); setFilterOpen(false); }}
                    className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                      filterCat === cat.id
                        ? "bg-[var(--primary)]/10 text-[var(--primary)] font-semibold"
                        : "text-[var(--accent)] hover:bg-[var(--primary-light)]/10"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--accent)]">{filterStatus ? "Disponibles" : "No disponibles"}</span>
          <button
            onClick={() => setFilterStatus(!filterStatus)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              filterStatus ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`block w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                filterStatus ? "translate-x-[22px]" : "translate-x-[2px]"
              }`}
            />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-[var(--primary-light)]/20 p-4 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-[var(--primary-light)]/20 animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[var(--primary-light)]/20 animate-pulse rounded w-1/3" />
                <div className="h-3 bg-[var(--primary-light)]/20 animate-pulse rounded w-1/4" />
              </div>
              <div className="flex gap-2">
                <div className="w-[44px] h-[44px] rounded-full bg-[var(--primary-light)]/20 animate-pulse" />
                <div className="w-[44px] h-[44px] rounded-full bg-[var(--primary-light)]/20 animate-pulse" />
                <div className="w-[44px] h-[44px] rounded-full bg-[var(--primary-light)]/20 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-[var(--accent)]">
          {filterStatus
            ? "No hay productos disponibles."
            : "No hay productos no disponibles."}
        </p>
      ) : (
        <div className="space-y-3">
          {filtered.map((product, index) => {
            const imgSrc = getImageUrl(product.image_url, 80, 60);
            return (
              <div
                key={product.id}
                onClick={() => setPreview(product)}
                className="bg-white rounded-xl border border-[var(--primary-light)]/20 p-4 shadow-sm flex items-center gap-4 cursor-pointer hover:bg-[var(--primary-light)]/5 transition-colors relative"
              >
                  {index === 0 && (
                    <div className="absolute -top-1 -right-2 z-10" style={{ animation: "breathe-scale 1.8s ease-in-out infinite", transform: "rotate(-45deg)" }}>
                      <svg className="w-7 h-7 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
                      </svg>
                    </div>
                  )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-semibold text-[var(--foreground)] text-base transition-all duration-200 ${!product.available ? "line-through opacity-50" : ""}`}>
                      {product.name}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--accent)] truncate">{product.category_name}</p>
                  <p className="font-bold text-[var(--primary)] text-sm">{formatPrice(product.price)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleAvailable(product)}
                    className={`p-2 min-h-[44px] min-w-[44px] rounded-full transition-all duration-200 flex items-center justify-center ${
                      product.available
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                    title={product.available ? "Deshabilitar" : "Habilitar"}
                  >
                    {product.available ? <CheckIcon /> : <XIcon />}
                  </button>
                  <button
                    onClick={() => openEdit(product)}
                    className="p-2 min-h-[44px] min-w-[44px] rounded-full bg-[var(--primary-light)]/20 text-[var(--accent)] hover:bg-[var(--primary-light)]/40 transition-colors flex items-center justify-center"
                    title="Editar"
                  >
                    <EditIcon />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="p-2 min-h-[44px] min-w-[44px] rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center"
                    title="Eliminar"
                  >
                    <TrashIcon />
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
                  <label className="block text-sm font-medium text-[var(--accent)] mb-1">Imagen</label>
                  <input
                    type="file"
                    ref={uploadRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => uploadRef.current?.click()}
                    disabled={uploading}
                    className="w-full px-4 py-3 min-h-[44px] rounded-xl text-sm font-medium bg-[var(--primary-light)]/20 text-[var(--accent)] hover:bg-[var(--primary-light)]/40 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 border-2 border-dashed border-[var(--primary-light)]/40"
                  >
                    <UploadIcon />
                    {uploading ? "Subiendo..." : modal.image_url ? "Cambiar imagen" : "Seleccionar imagen"}
                  </button>
                  {modal.image_url && (
                    <button
                      onClick={() => setModal({ ...modal, image_url: "" })}
                      className="mt-1.5 text-xs text-red-500 hover:underline"
                    >
                      Quitar imagen
                    </button>
                  )}
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

      {preview && (
        <>
          <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setPreview(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
              {getImageUrl(preview.image_url) ? (
                <div className="h-48 bg-[var(--primary-light)]/20">
                  <img src={getImageUrl(preview.image_url)!} alt={preview.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-48 bg-[var(--primary-light)]/20 flex items-center justify-center">
                  <svg className="w-12 h-12 text-[var(--primary-light)]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)]">
                    {preview.name}
                  </h3>
                  <button
                    onClick={() => setPreview(null)}
                    className="p-1.5 text-[var(--accent)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <XIcon />
                  </button>
                </div>
                {preview.description && (
                  <p className="text-sm text-[var(--accent)] leading-relaxed mb-3">{preview.description}</p>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-[var(--accent)]">Categoría:</span>
                  <span className="font-medium text-[var(--foreground)]">{preview.category_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <span className="text-[var(--accent)]">Precio:</span>
                  <span className="font-bold text-[var(--primary)]">{formatPrice(preview.price)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm mt-1">
                  <span className="text-[var(--accent)]">Estado:</span>
                  <span className={`font-medium ${preview.available ? "text-green-600" : "text-red-500"}`}>
                    {preview.available ? "Disponible" : "No disponible"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
