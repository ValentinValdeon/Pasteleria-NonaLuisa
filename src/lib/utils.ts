export function formatPrice(price: number): string {
  return `$ ${price.toLocaleString("es-AR")}`;
}

export function getImageUrl(
  url: string | null,
  width: number = 400,
  quality: number = 60
): string | null {
  if (!url) return null;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}width=${width}&quality=${quality}&format=webp`;
}
