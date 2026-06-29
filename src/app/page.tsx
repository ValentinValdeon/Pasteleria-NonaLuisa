import { createPublicClient } from "@/lib/supabase/server-public";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ComboCarousel from "@/components/ComboCarousel";
import SwiperCoverflow from "@/components/SwiperCoverflow";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";
import CartWrapper from "@/components/CartWrapper";

export const dynamic = "force-dynamic";

function SectionDivider() {
  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--primary-light)]/50 to-transparent" />
    </div>
  );
}

export default async function Home() {
  const supabase = createPublicClient();

  const [productsRes, combosRes, comboItemsRes, categoriesRes, settingsRes] = await Promise.all([
    supabase.from("products").select("*").order("name"),
    supabase.from("combos").select("*").eq("available", true),
    supabase.from("combo_items").select("*"),
    supabase.from("categories").select("*").order("name"),
    supabase.from("settings").select("*").eq("key", "delivery_price").single(),
  ]);

  const products = productsRes.data?.filter((p) => p.available) ?? [];
  const allProducts = productsRes.data ?? [];
  const comboItems = comboItemsRes.data ?? [];
  const combosRaw = combosRes.data ?? [];
  const categories = categoriesRes.data ?? [];
  const deliveryPrice = Number(settingsRes.data?.value ?? 0);

  const combos = combosRaw.filter((combo) => {
    const items = comboItems.filter((ci) => ci.combo_id === combo.id);
    return items.every((ci) => allProducts.find((p) => p.id === ci.product_id)?.available !== false);
  });

  return (
    <CartWrapper deliveryPrice={deliveryPrice}>
      <Header />
      <Hero />

      <SectionDivider />

      {combos.length > 0 && <ComboCarousel combos={combos} />}

      <SectionDivider />

      {combos.length > 1 && <SwiperCoverflow combos={combos} />}

      <SectionDivider />

      <ProductGrid products={products.map((p) => ({ ...p, price: Number(p.price) }))} categories={categories} />

      <SectionDivider />

      <Footer />
    </CartWrapper>
  );
}
