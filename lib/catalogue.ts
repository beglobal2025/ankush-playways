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

export interface ProductColorOption {
  id: string;
  color: string;
  image: ProductImage;
}

export interface Product {
  id: string;
  code: string;
  slug: string;
  name: string;
  colorOptions: ProductColorOption[];
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
  "Ball Pool": "/catalogue-webp/ball-pool/lf-101-5/cover.webp",
  Bench: "/catalogue-webp/bench/lf-960/cover.webp",
  Fence: "/catalogue-webp/fence/lf-135/cover.webp",
  "Flash Cards": "/catalogue-webp/flash-cards/lft-1251/cover.webp",
  "For All Category Classes": "/catalogue-webp/for-all-category-classes/lf-129/cover.webp",
  "Gym Equipment": "/catalogue-webp/gym-equipment/lf-604/cover.webp",
  "Learning Toys": "/catalogue-webp/learning-toys/lft-37a/cover.webp",
  "Middle & High Classes": "/catalogue-webp/middle-and-high-classes/lf-0407/cover.webp",
  "Middle Classes": "/catalogue-webp/middle-classes/lf-025/cover.webp",
  "Play Equipment": "/catalogue-webp/play-equipment/lf-802/cover.webp",
  "Pre Classes": "/catalogue-webp/pre-classes/lf-0704/cover.webp",
  Premium: "/catalogue-webp/premium/lf-7021/cover.webp",
  "Primary Classes": "/catalogue-webp/primary-classes/lf-155/cover.webp",
  "Primary , Middle & High Classes": "/catalogue-webp/primary-middle-and-high-classes/lf-0448/cover.webp",
  Puppets: "/catalogue-webp/puppets/lfp-8/cover.webp",
  Rideon: "/catalogue-webp/rideon/lf-927c/cover.webp",
  "Rideon & Balls": "/catalogue-webp/rideon-and-balls/lft-333/cover.webp",
  Rockers: "/catalogue-webp/rockers/lf-624/cover.webp",
  "Rockers & See-Saw": "/catalogue-webp/rockers-and-see-saw/lf-108b/cover.webp",
  "Role Play Costumes": "/catalogue-webp/role-play-costumes/lft-1211/cover.webp",
  "Sand pit": "/catalogue-webp/sand-pit/lf-380/cover.webp",
  "Shelf & Pencil Dustbin": "/catalogue-webp/shelf-and-pencil-dustbin/lf-934-a/cover.webp",
  Slides: "/catalogue-webp/slides/lf-916/cover.webp",
  "Slides & Swings": "/catalogue-webp/slides-and-swings/lf-974/cover.webp",
  "Soft Play Seating": "/catalogue-webp/soft-play-seating/lf-0422/cover.webp",
  "Soft Seating": "/catalogue-webp/soft-seating/lf-1484/cover.webp",
  Sports: "/catalogue-webp/sports/lf-58/cover.webp",
  "Tent House": "/catalogue-webp/tent-house/lf-5532/cover.webp",
  "Toy Shelf": "/catalogue-webp/toy-shelf/lf-936/cover.webp",
  Toys: "/catalogue-webp/toys/lft-1209/cover.webp",
  Trampoline: "/catalogue-webp/trampoline/lf-55/cover.webp",
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
  if (/^(AP|APT|APP|APO)-/.test(upper)) {
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
    colorOptions: [],
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

const featuredProductIds = ["ap-802", "ap-155", "ap-916", "ap-101-5", "ap-55", "ap-135", "ap-936", "apt-1251"];

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
    : "Hi, I would like to know more about Ankush Playways products.";

  return `https://wa.me/919915000770?text=${encodeURIComponent(message)}`;
}
