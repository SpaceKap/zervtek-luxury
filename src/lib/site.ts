export const SITE = {
  name: "ZervTek Performance",
  legalName: "ZervTek Co. Ltd",
  tagline: "The Pride for Quality",
  description:
    "ZervTek Performance sources, inspects and exports performance cars, supercars and luxury vehicles from Japan: Mercedes-AMG, Porsche, Ferrari, Land Rover and more, with transparent all-in pricing.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://performance.zervtek.com",
  email: "info@zervtek.com",
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
    "Hello, I'm interested in a vehicle.",
  social: {
    instagram: "https://instagram.com/zervtek",
    facebook: "https://facebook.com/zervtek",
    linkedin: "https://linkedin.com/company/zervtek",
  },
};

export function whatsappHref(prefill?: string) {
  const text = encodeURIComponent(prefill || SITE.whatsappMessage);
  return `https://api.whatsapp.com/send/?phone=${SITE.whatsappNumber}&text=${text}`;
}

/** Full postal address used for maps and company profile. */
export function siteAddressLine(): string {
  const { street, city, region, postalCode, country } = SITE.address;
  const countryLabel = country === "JP" ? "Japan" : country;
  return `${street}, ${city}, ${region} ${postalCode}, ${countryLabel}`;
}

export function googleMapsEmbedUrl(): string {
  const q = encodeURIComponent(siteAddressLine());
  return `https://www.google.com/maps?q=${q}&z=16&output=embed`;
}

export function googleMapsPlaceUrl(): string {
  const q = encodeURIComponent(siteAddressLine());
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

export const NAV = [
  { label: "Home", href: "/" },
  { label: "Stock", href: "/stock" },
  { label: "Blog", href: "/blog" },
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
    q: "What does ZervTek Performance do?",
    a: "We source, inspect and export performance cars, supercars and luxury vehicles from Japan to buyers worldwide.",
  },
  {
    q: "Why buy a performance or luxury car from Japan?",
    a: "Japan's strict roadworthiness laws, low average mileage and meticulous ownership culture mean these cars are kept in exceptional condition. Combined with a transparent auction grading system and trusted dealer network, you get world-class performance, supercars and luxury vehicles at genuinely competitive prices.",
  },
  {
    q: "Do the prices include everything?",
    a: "Yes. Each listing shows the total FOB payment for Japan, which includes the vehicle price, inspections, documentation charges, inland transport, customs clearance, and applicable fees. Shipping is charged separately based on your destination port and shipping method (RoRo or container).",
  },
  {
    q: "Can you ship internationally?",
    a: "We export worldwide — including North America, South America, Europe, Oceania, Asia, Middle East, and Africa. Our most popular destinations are United States, Canada, United Kingdom, Italy, Germany, Cyprus, Australia, New Zealand, UAE, Saudi Arabia, Hong Kong and Singapore. Our team handles documentation, logistics and customs clearance to your destination port. <a href=\"/#destinations\">See the full list of destinations</a>.",
  },
  {
    q: "How do I reserve a vehicle?",
    a: "Send an inquiry through any vehicle page or the form on our homepage, or message us on WhatsApp. A specialist will confirm availability, walk you through the condition report, and secure the car for you. We can also arrange an in-person inspection anywhere across Japan before you commit.",
  },
  {
    q: "Is every vehicle inspected before delivery?",
    a: "Absolutely. We inspect every vehicle in person, capture detailed photos and videos, and provide a full condition report before you commit.",
  },
];

export const SHOWROOMS = [
  { name: "ZervTek Performance, Chiba Flagship", city: "Chiba" },
  { name: "ZervTek Performance, Central", city: "Tokyo" },
  { name: "ZervTek Auto Technical Base", city: "Chiba" },
];

export const COMPANY_PROFILE = {
  companyName: "ZervTek Co., Ltd.",
  japaneseName: "株式会社ザーブテック",
  address: siteAddressLine(),
  registrationNo: "0400-01-089801",
  dealerLicense: "441340001639",
  phone: SITE.phone,
  email: SITE.email,
  hours: "Mon–Fri, 9:00–18:00 JST",
};

export const BANK_ACCOUNTS = [
  {
    title: "Sumitomo Mitsui",
    rows: [
      { label: "Bank Name", value: "Sumitomo Mitsui Banking Corporation" },
      { label: "Branch", value: "Shin Kemigawa (856)" },
      { label: "SWIFT/BIC", value: "SMBCJPJT" },
      { label: "Account Number", value: "0998854" },
      { label: "Account Name", value: "ZERVTEK CO., LTD" },
      { label: "Bank Address", value: "2-6-1 Nakase, Mihama Ward, Chiba, 261-7102" },
      { label: "Currency", value: "Any currency" },
    ],
  },
  {
    title: "MUFG Bank",
    rows: [
      { label: "Bank Name", value: "MUFG Bank (Mitsubishi UFJ)" },
      { label: "Branch", value: "Nihombashi Branch" },
      { label: "SWIFT/BIC", value: "BOTKJPJTCLS" },
      { label: "Account Number", value: "0420524" },
      { label: "Account Name", value: "ZERVTEK CO., LTD" },
      { label: "Bank Address", value: "1-7-17, Nihonbashi, Tokyo, 103-0027" },
      { label: "Currency", value: "Any currency" },
    ],
  },
  {
    title: "Wise (JPY)",
    rows: [
      { label: "Business Name", value: "カ）ザーヴテック" },
      { label: "Bank", value: "三井住友銀行 (ミツイスミトモ) [0009]" },
      { label: "Branch", value: "新検見川 [856]" },
      { label: "Account Type", value: "Ordinary (普通 / Futsuu)" },
      { label: "Account Number", value: "0998854" },
      { label: "Currency", value: "JPY" },
    ],
  },
];

export const PAYPAL = {
  email: "sales@zervtek.com",
  transferFees: "4.4%",
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
