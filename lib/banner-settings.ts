export const HOME_BANNER_LEGACY_KEY = "home_banner_image";

export const HOME_BANNER_SLOTS = [
  {
    key: "home_banner_image_1",
    label: "Indoor Play Equipment",
    description: "Pick the best Play Set",
    defaultImageSrc: "/assets/catalog/cutouts/play-slide.png",
  },
  {
    key: "home_banner_image_2",
    label: "Slide, Climb & Smile",
    description: "Find the best Play Structure",
    defaultImageSrc: "/assets/catalog/cutouts/play-structure.png",
  },
  {
    key: "home_banner_image_3",
    label: "Ride-on Toys",
    description: "Tiny Wheels, Big Fun",
    defaultImageSrc: "/assets/catalog/cutouts/ride-on-car.png",
  },
  {
    key: "home_banner_image_4",
    label: "Classroom Comfort",
    description: "Dual Seating Desk Adjustable",
    defaultImageSrc: "/assets/catalog/cutouts/dual-seating-desk-adjustable.png",
  },
  {
    key: "home_banner_image_5",
    label: "Junior Living House",
    description: "Pretend Play Favourite",
    defaultImageSrc: "/assets/catalog/cutouts/junior-living-house.png",
  },
  {
    key: "home_banner_image_6",
    label: "Outdoor Playway Equipments",
    description: "Outdoor Play",
    defaultImageSrc: "/catalogue/outdoor-playground-equipments/lfo-mps-04.jpg",
  },
] as const;

export const HOME_BANNER_SETTING_KEYS = HOME_BANNER_SLOTS.map((slot) => slot.key);

export const HOME_BANNER_CATEGORY_SETTING_KEYS = HOME_BANNER_SLOTS.map((slot) => `${slot.key}_category`);
