import { createPublicClient } from "@/lib/supabase/server-public";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ComboCard from "@/components/ComboCard";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";


export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createPublicClient();

  const [productsRes, combosRes, categoriesRes] = await Promise.all([
    supabase.from("products").select("*").eq("available", true).order("name"),
    supabase.from("combos").select("*").eq("available", true),
    supabase.from("categories").select("*").order("name"),
  ]);

  const products = productsRes.data ?? [];
  const combos = combosRes.data ?? [];
  const categories = categoriesRes.data ?? [];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />

      {combos.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] mb-6">
              Combos Destacados
            </h2>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4">
              {combos.map((combo) => (
                <ComboCard
                  key={combo.id}
                  name={combo.name}
                  description={combo.description ?? ""}
                  price={Number(combo.price)}
                  image_url={combo.image_url}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <ProductGrid products={products.map((p) => ({ ...p, price: Number(p.price) }))} categories={categories} />

      <Footer />
    </div>
  );
}
