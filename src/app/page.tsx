import { createPublicClient } from "@/lib/supabase/server-public";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ComboCard from "@/components/ComboCard";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import CartWrapper from "@/components/CartWrapper";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = createPublicClient();

  const [productsRes, combosRes, categoriesRes, settingsRes] = await Promise.all([
    supabase.from("products").select("*").eq("available", true).order("name"),
    supabase.from("combos").select("*").eq("available", true),
    supabase.from("categories").select("*").order("name"),
    supabase.from("settings").select("*").eq("key", "delivery_price").single(),
  ]);

  const products = productsRes.data ?? [];
  const combos = combosRes.data ?? [];
  const categories = categoriesRes.data ?? [];
  const deliveryPrice = Number(settingsRes.data?.value ?? 0);

  return (
    <CartWrapper deliveryPrice={deliveryPrice}>
      <Header />
      <Hero />

      {combos.length > 0 && (
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-[var(--foreground)] mb-6">
              Combos Destacados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
              {combos.map((combo) => (
                <ComboCard
                  key={combo.id}
                  id={combo.id}
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
    </CartWrapper>
  );
}
