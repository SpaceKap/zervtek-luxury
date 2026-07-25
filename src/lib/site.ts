export const SITE = {
  name: "ZervTek Luxury",
  legalName: "ZervTek Co. Ltd",
  tagline: "The Pride for Quality",
  description:
    "ZervTek Luxury sources, inspects and exports the world's finest performance and luxury vehicles from Japan — Mercedes-AMG, Porsche, Ferrari, Land Rover and more, with transparent all-in pricing.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://luxury.zervtek.com",
  email: "performance@zervtek.com",
  phone: "+81 80 6659 4632",
  address: {
    street: "2-465-14, Kemigawacho, Hanamigawa-ku",
    city: "Chiba-shi",
    region: "Chiba-ken",
    country: "JP",
    postalCode: "262-0005",
  },
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "818066594632",
  whatsappMessage:
    process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE ||
    "Hello ZervTek Luxury, I'm interested in a vehicle.",
  social: {
    instagram: "https://instagram.com/zervtek",
    facebook: "https://facebook.com/zervtek",
    linkedin: "https://linkedin.com/company/zervtek",
  },
};

export function whatsappHref(prefill?: string) {
  const text = encodeURIComponent(prefill || SITE.whatsappMessage);
  return `https://wa.me/${SITE.whatsappNumber}?text=${text}`;
}

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Stock", href: "/stock" },
  { label: "Shipping", href: "/shipping" },
  { label: "About", href: "/about" },
];

export const MAKES = [
  "Mercedes-Benz",
  "Mercedes-AMG",
  "BMW",
  "BMW ALPINA",
  "Audi",
  "Volkswagen",
  "Porsche",
  "Land Rover",
  "Jaguar",
  "Bentley",
  "McLaren",
  "Maserati",
  "Ferrari",
  "Lamborghini",
  "Rolls-Royce",
];

export const BODY_TYPES = [
  "Sedan",
  "Coupe",
  "Convertible",
  "SUV",
  "Wagon",
  "Hatchback",
  "Van",
  "Pickup",
];

/** Make → common models for admin dependent selector. */
export const MAKE_MODELS: Record<string, string[]> = {
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "GT"],
  "Mercedes-AMG": ["C43", "C63", "E53", "E63", "GT", "G63", "A45"],
  BMW: ["3 Series", "5 Series", "7 Series", "X5", "X6", "X7", "M3", "M4", "M5"],
  "BMW ALPINA": ["B3", "B4", "B5", "XB7"],
  Audi: ["A4", "A6", "A8", "Q5", "Q7", "Q8", "RS6", "RS7", "R8"],
  Volkswagen: ["Golf R", "Arteon", "Tiguan"],
  Porsche: ["911", "Cayman", "Boxster", "Panamera", "Macan", "Cayenne", "Taycan"],
  "Land Rover": ["Defender", "Range Rover", "Range Rover Sport", "Discovery"],
  Jaguar: ["F-Type", "XF", "F-Pace", "XE"],
  Bentley: ["Continental GT", "Flying Spur", "Bentayga"],
  McLaren: ["720S", "Artura", "GT"],
  Maserati: ["Ghibli", "Quattroporte", "Levante", "MC20"],
  Ferrari: ["488", "F8", "Roma", "SF90", "812"],
  Lamborghini: ["Huracán", "Urus", "Revuelto"],
  "Rolls-Royce": ["Ghost", "Phantom", "Cullinan", "Spectre"],
};

export const EXTERIOR_COLORS = [
  "Black",
  "Obsidian Black",
  "Pearl Black",
  "White",
  "Pearl White",
  "Silver",
  "Grey",
  "Gunmetal",
  "Blue",
  "Dark Blue",
  "Navy",
  "Red",
  "Burgundy",
  "Green",
  "British Racing Green",
  "Yellow",
  "Orange",
  "Bronze",
  "Lantau Bronze",
  "Gold",
  "Brown",
  "Beige",
  "Champagne",
  "Purple",
  "Other",
];

export const INTERIOR_COLORS = [
  "Black",
  "Black Leather",
  "Black / Red",
  "Brown",
  "Brown Leather",
  "Brown & Black Leather",
  "Beige",
  "Cream",
  "Ivory",
  "Tan",
  "Cognac",
  "Grey",
  "Grey Leather",
  "White",
  "Red",
  "Blue",
  "Ebony",
  "Two-tone",
  "Other",
];

/** Japan's 47 prefectures (English names). */
export const PREFECTURES = [
  "Hokkaido",
  "Aomori",
  "Iwate",
  "Miyagi",
  "Akita",
  "Yamagata",
  "Fukushima",
  "Ibaraki",
  "Tochigi",
  "Gunma",
  "Saitama",
  "Chiba",
  "Tokyo",
  "Kanagawa",
  "Niigata",
  "Toyama",
  "Ishikawa",
  "Fukui",
  "Yamanashi",
  "Nagano",
  "Gifu",
  "Shizuoka",
  "Aichi",
  "Mie",
  "Shiga",
  "Kyoto",
  "Osaka",
  "Hyogo",
  "Nara",
  "Wakayama",
  "Tottori",
  "Shimane",
  "Okayama",
  "Hiroshima",
  "Yamaguchi",
  "Tokushima",
  "Kagawa",
  "Ehime",
  "Kochi",
  "Fukuoka",
  "Saga",
  "Nagasaki",
  "Kumamoto",
  "Oita",
  "Miyazaki",
  "Kagoshima",
  "Okinawa",
];

export const FAQS = [
  {
    q: "What does ZervTek Luxury do?",
    a: "We source, inspect and export premium and performance vehicles from Japan to buyers worldwide. Every car is hand-selected, quality-checked at our PDI centre and delivered with transparent, all-inclusive pricing.",
  },
  {
    q: "Why buy a luxury vehicle from Japan?",
    a: "Japan's strict roadworthiness laws, low average mileage and meticulous ownership culture mean luxury vehicles are kept in exceptional condition. Combined with a transparent auction grading system, you get world-class cars at genuinely competitive prices.",
  },
  {
    q: "Do the prices include everything?",
    a: "Yes. Each listing shows the total payment (支払総額) which bundles the vehicle price, inspection, pre-delivery servicing and applicable fees. Shipping and destination-country compliance are quoted upfront with no hidden costs.",
  },
  {
    q: "Can you ship internationally?",
    a: "We export worldwide — including the UK, USA, Canada, Australia, New Zealand, the Middle East and East Africa. Our team handles documentation, logistics and customs clearance to your destination port.",
  },
  {
    q: "How do I reserve a vehicle?",
    a: "Send an inquiry through any vehicle page or the form on our homepage, or message us on WhatsApp. A specialist will confirm availability, walk you through the condition report and secure the car for you.",
  },
  {
    q: "Is every vehicle inspected before delivery?",
    a: "Absolutely. Each car passes a thorough multi-point inspection at our in-house facility, and we provide a detailed condition report plus photography before you commit.",
  },
];

export const SHOWROOMS = [
  { name: "ZervTek Luxury — Chiba Flagship", city: "Chiba" },
  { name: "ZervTek Luxury — Central", city: "Tokyo" },
  { name: "ZervTek Auto Technical Base", city: "Chiba" },
];

export const COMPANY_PROFILE = {
  companyName: "ZervTek Co., Ltd.",
  japaneseName: "株式会社ザーブテック",
  address: `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}, Japan`,
  registrationNo: "XXXX-XXXX-XXXX",
  phone: SITE.phone,
  email: SITE.email,
  hours: "9:00–18:00 JST",
};

export const BANK_ACCOUNTS = [
  {
    title: "Japanese Bank Account (JPY)",
    rows: [
      { label: "Bank Name", value: "MUFG Bank (Mitsubishi UFJ)" },
      { label: "Branch", value: "Shibuya Branch (Code: 225)" },
      { label: "SWIFT/BIC", value: "BOTKJPJT" },
      { label: "Account Name", value: "ZERVTEK CO LTD" },
      { label: "Account Number", value: "XXXX-XXXX-XXXX" },
      { label: "Currency", value: "JPY" },
    ],
  },
  {
    title: "USD Bank Account",
    rows: [
      { label: "Bank Name", value: "MUFG Bank (Mitsubishi UFJ)" },
      { label: "Branch", value: "Tokyo Branch (Code: 001)" },
      { label: "SWIFT/BIC", value: "BOTKJPJT" },
      { label: "Account Name", value: "ZERVTEK CO LTD" },
      { label: "Account Number", value: "XXXX-XXXX-XXXX" },
      { label: "Currency", value: "USD" },
    ],
  },
  {
    title: "International Bank (Wise)",
    rows: [
      { label: "Bank Name", value: "Wise (TransferWise)" },
      { label: "Branch", value: "N/A" },
      { label: "SWIFT/BIC", value: "TRWIGB2L" },
      { label: "Account Name", value: "ZERVTEK CO LTD" },
      { label: "Account Number", value: "XXXX-XXXX-XXXX" },
      { label: "Currency", value: "USD / EUR / GBP" },
    ],
  },
];

export const PAYPAL = {
  email: "payments@zervtek.com",
  transferFees: "4%",
};

export const CONTACT_INTERESTS = [
  "Mercedes-AMG",
  "Porsche",
  "Ferrari",
  "Lamborghini",
  "BMW / ALPINA",
  "Land Rover / Range Rover",
  "Bentley / Rolls-Royce",
  "Other luxury / performance",
];

export const CONTACT_BUDGETS = [
  "Under ¥5M",
  "¥5M – ¥10M",
  "¥10M – ¥20M",
  "¥20M – ¥50M",
  "¥50M+",
];

export const CONTACT_TIMELINES = [
  "Within 30 days",
  "30–60 days",
  "60–90 days",
  "Flexible / browsing",
];

export const CONTACT_METHODS = ["Email", "WhatsApp", "Phone Call"];
