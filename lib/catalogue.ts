import rawProducts from "@/products.json";

export interface Specification {
  size?: string;
  details?: string[];
  [key: string]: string | string[] | undefined;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  id: string;
  code: string;
  slug: string;
  name: string;
  category: string;
  price: number | null;
  specifications: Specification;
  images: ProductImage[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  productCount: number;
  image: ProductImage;
  products: Product[];
}

interface RawProduct {
  id?: string;
  name?: string;
  category?: string;
  price?: number | null;
  specifications?: Specification | null;
  images?: string[];
}

const fallbackImage = "/assets/catalog/play-slide.jpg";

const categoryImageOverrides: Record<string, string> = {
  "Ball Pool": "/catalogue/ball-pool/lf-101-5/cover.jpg",
  Bench: "/catalogue/bench/lf-960/cover.jpg",
  Fence: "/catalogue/fence/lf-135/cover.jpg",
  "Flash Cards": "/catalogue/flash-cards/lft-1251/cover.jpg",
  "For All Category Classes": "/catalogue/for-all-category-classes/lf-129/cover.jpg",
  "Gym Equipment": "/catalogue/gym-equipment/lf-604/cover.jpg",
  "Learning Toys": "/catalogue/learning-toys/lft-37a/cover.jpg",
  "Middle & High Classes": "/catalogue/middle-and-high-classes/lf-0407/cover.jpg",
  "Middle Classes": "/catalogue/middle-classes/lf-025/cover.jpg",
  "Play Equipment": "/catalogue/play-equipment/lf-802/cover.jpg",
  "Pre Classes": "/catalogue/pre-classes/lf-0704/cover.jpg",
  Premium: "/catalogue/premium/lf-7021/cover.jpg",
  "Primary Classes": "/catalogue/primary-classes/lf-155/cover.jpg",
  "Primary , Middle & High Classes": "/catalogue/primary-middle-and-high-classes/lf-0448/cover.jpg",
  Puppets: "/catalogue/puppets/lfp-8/cover.jpg",
  Rideon: "/catalogue/rideon/lf-927c/cover.jpg",
  "Rideon & Balls": "/catalogue/rideon-and-balls/lft-333/cover.jpg",
  Rockers: "/catalogue/rockers/lf-624/cover.jpg",
  "Rockers & See-Saw": "/catalogue/rockers-and-see-saw/lf-108b/cover.jpg",
  "Role Play Costumes": "/catalogue/role-play-costumes/lft-1211/cover.jpg",
  "Sand pit": "/catalogue/sand-pit/lf-380/cover.jpg",
  "Shelf & Pencil Dustbin": "/catalogue/shelf-and-pencil-dustbin/lf-934-a/cover.jpg",
  Slides: "/catalogue/slides/lf-916/cover.jpg",
  "Slides & Swings": "/catalogue/slides-and-swings/lf-974/cover.jpg",
  "Soft Play Seating": "/catalogue/soft-play-seating/lf-0422/cover.jpg",
  "Soft Seating": "/catalogue/soft-seating/lf-1484/cover.jpg",
  Sports: "/catalogue/sports/lf-58/cover.jpg",
  "Tent House": "/catalogue/tent-house/lf-5532/cover.jpg",
  "Toy Shelf": "/catalogue/toy-shelf/lf-936/cover.jpg",
  Toys: "/catalogue/toys/lft-1209/cover.jpg",
  Trampoline: "/catalogue/trampoline/lf-55/cover.jpg",
};

const categoryDescriptions: Record<string, string> = {
  "Pre Classes": "Tables, chairs, storage, carpets, and activity pieces for early learning spaces.",
  "Play Equipment": "Slides, tunnels, balance toys, blocks, and active-play products for indoor fun.",
  Toys: "Hands-on toys, role-play sets, balls, puzzles, and playful learning essentials.",
  "Learning Toys": "Educational toys designed for recognition, sorting, storytelling, and classroom play.",
  Rideon: "Ride-on cars, tricycles, rockers, and toddler mobility toys.",
  Slides: "Compact and colourful slides for safe indoor play zones.",
  "Slides & Swings": "Slide-and-swing combinations for energetic play areas.",
  "Ball Pool": "Bright ball-pool sets and soft play enclosures for younger children.",
  Sports: "Activity, agility, and group-play equipment for movement-rich sessions.",
  Mats: "Eva mats, folding mats, and soft floor surfaces for safer play zones.",
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatProductCode(id: string): string {
  const upper = id.toUpperCase();
  if (/^(LF|LFT|LFP|LFO)-/.test(upper)) {
    return upper.replace("-", "");
  }
  return upper;
}

export function productSlug(product: Pick<Product, "id" | "name">): string {
  return `${product.id}-${slugify(product.name)}`;
}

function normalizeRawProduct(item: RawProduct): Product {
  const id = slugify(item.id || item.name || "product");
  const name = item.name?.trim() || formatProductCode(id);
  const category = item.category?.trim() || "Catalogue";
  const sourceImages = item.images?.filter(Boolean) ?? [];
  const code = formatProductCode(id);
  const images = (sourceImages.length ? sourceImages : [fallbackImage]).map((src) => ({
    src,
    alt: `${code} - ${name}`,
  }));

  const product: Product = {
    id,
    code,
    slug: "",
    name,
    category,
    price: typeof item.price === "number" ? item.price : null,
    specifications: item.specifications ?? {},
    images,
  };

  return {
    ...product,
    slug: productSlug(product),
  };
}

export const products: Product[] = (rawProducts as RawProduct[]).map(normalizeRawProduct);

export const categories: Category[] = Object.values(
  products.reduce<Record<string, Product[]>>((groups, product) => {
    groups[product.category] = [...(groups[product.category] ?? []), product];
    return groups;
  }, {}),
)
  .map((categoryProducts) => {
    const [firstProduct] = categoryProducts;
    const name = firstProduct?.category ?? "Catalogue";
    const slug = slugify(name);
    const image = categoryImageOverrides[name]
      ? { src: categoryImageOverrides[name], alt: `${name} product category` }
      : (firstProduct?.images[0] ?? { src: fallbackImage, alt: name });

    return {
      id: slug,
      slug,
      name,
      description:
        categoryDescriptions[name] ??
        `Explore ${categoryProducts.length} catalogue products from the ${name.toLowerCase()} range.`,
      productCount: categoryProducts.length,
      image,
      products: categoryProducts,
    };
  })
  .sort((a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name));

export const featuredCategories = categories.slice(0, 6);

const featuredProductIds = ["lf-802", "lf-155", "lf-916", "lf-101-5", "lf-55", "lf-135", "lf-936", "lft-1251"];

export const popularProducts = featuredProductIds
  .map((id) => products.find((product) => product.id === id))
  .filter((product): product is Product => Boolean(product));

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug || product.id === slug);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, limit);
}

export function formatPrice(price: number | null): string {
  if (typeof price !== "number") {
    return "Price on request";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
    style: "currency",
    currency: "INR",
  }).format(price);
}

export function getWhatsAppUrl(product?: Pick<Product, "code" | "name">): string {
  const message = product
    ? `Hi, I am interested in ${product.code} - ${product.name}. Please share details.`
    : "Hi, I would like to know more about ANKUSH Playways products.";

  return `https://wa.me/919811148225?text=${encodeURIComponent(message)}`;
}
