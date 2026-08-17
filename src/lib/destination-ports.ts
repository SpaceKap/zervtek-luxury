/** Destination & departure ports for the home globe section. */

export type PortCountry = {
  name: string;
  ports: string[];
};

export type PortRegion = {
  region: string;
  countries: PortCountry[];
};

export type GlobePortMarker = {
  id: string;
  location: [number, number];
  /** Shown as floating tag when facing camera. */
  label?: string;
};

export const DESTINATION_PORT_REGIONS: PortRegion[] = [
  {
    region: "North America",
    countries: [
      {
        name: "United States — West Coast",
        ports: ["Port of Tacoma", "Port of Long Beach"],
      },
      {
        name: "United States — East Coast",
        ports: [
          "Port of Baltimore",
          "Port of Jacksonville",
          "Port of New York",
          "Port of Galveston",
          "Port of Newport News",
          "Port Freeport",
          "Port of Savannah",
        ],
      },
      {
        name: "Canada",
        ports: [
          "New Westminster Port",
          "Port of Vancouver",
          "Port of Halifax",
        ],
      },
    ],
  },
  {
    region: "Oceania",
    countries: [
      {
        name: "Australia",
        ports: [
          "Port of Brisbane",
          "Port Kembla",
          "Port of Melbourne",
          "Port Adelaide",
          "Fremantle Port",
          "Darwin Port",
          "Sydney",
        ],
      },
      {
        name: "New Zealand",
        ports: [
          "Port of Auckland",
          "Lyttelton Port",
          "Centre Port Wellington",
          "Port Nelson",
          "Wellington",
        ],
      },
    ],
  },
  {
    region: "Europe",
    countries: [
      {
        name: "Cyprus",
        ports: ["Larnaca Port", "Limassol Port"],
      },
      {
        name: "Germany",
        ports: ["Port of Bremerhaven"],
      },
      {
        name: "Ireland",
        ports: ["Dublin Port"],
      },
      {
        name: "United Kingdom",
        ports: [
          "Port of Tyne",
          "Port of Southampton",
          "Port of Grimsby",
          "Bristol Port",
          "Port of Felixstowe",
        ],
      },
      {
        name: "Belgium",
        ports: ["Zeebrugge"],
      },
      {
        name: "Poland",
        ports: ["Gdansk"],
      },
      {
        name: "Finland",
        ports: ["Kotka"],
      },
    ],
  },
  {
    region: "Middle East",
    countries: [
      { name: "Bahrain", ports: ["Bahrain"] },
      { name: "United Arab Emirates", ports: ["Jebel Ali"] },
      { name: "Saudi Arabia", ports: ["Dammam"] },
      { name: "Kuwait", ports: ["Kuwait"] },
      { name: "Iran", ports: ["Bandar Abbas"] },
      { name: "Iraq", ports: ["Umm Qasr"] },
    ],
  },
  {
    region: "South Asia",
    countries: [
      { name: "Bangladesh", ports: ["Chittagong", "Mongla"] },
      { name: "Sri Lanka", ports: ["Hambantota"] },
      { name: "Pakistan", ports: ["Karachi"] },
    ],
  },
  {
    region: "Southeast Asia",
    countries: [
      { name: "Singapore", ports: ["Port of Singapore"] },
    ],
  },
  {
    region: "Africa",
    countries: [
      { name: "Ghana", ports: ["Port of Tema"] },
      { name: "Senegal", ports: ["Dakar Port"] },
      { name: "Angola", ports: ["Port of Luanda"] },
      { name: "Côte d'Ivoire", ports: ["Port Abidjan"] },
      { name: "Kenya", ports: ["Port of Mombasa"] },
      { name: "Tanzania", ports: ["Dar Es Salaam Port"] },
      { name: "Mozambique", ports: ["Port Maputo"] },
      { name: "South Africa", ports: ["Port of Durban"] },
      { name: "Mauritius", ports: ["Port-Louis"] },
    ],
  },
  {
    region: "Caribbean",
    countries: [
      { name: "Jamaica", ports: ["Kingston"] },
      { name: "Bahamas", ports: ["Nassau"] },
      { name: "Trinidad and Tobago", ports: ["Port of Spain"] },
      { name: "Cayman Islands", ports: ["GeorgeTown"] },
      { name: "Suriname", ports: ["Paramaribo"] },
      { name: "Saint Lucia", ports: ["Port Castries"] },
      { name: "Dominica", ports: ["Roseau"] },
    ],
  },
  {
    region: "South America",
    countries: [
      { name: "Brazil", ports: ["Santos"] },
      { name: "Argentina", ports: ["Buenos Aires"] },
      { name: "Chile", ports: ["Valparaiso"] },
      { name: "Peru", ports: ["Callao"] },
      { name: "Colombia", ports: ["Cartagena", "Buenaventura"] },
    ],
  },
];

/** Markers on the globe — short labels on key hubs. Nearby tags are spaced at runtime. */
export const GLOBE_PORT_MARKERS: GlobePortMarker[] = [
  // North America
  { id: "tacoma", location: [47.27, -122.42], label: "Tacoma" },
  { id: "long-beach", location: [33.75, -118.21], label: "Long Beach" },
  { id: "baltimore", location: [39.27, -76.58], label: "Baltimore" },
  { id: "jacksonville", location: [30.32, -81.67] },
  { id: "new-york", location: [40.68, -74.02], label: "New York" },
  { id: "galveston", location: [29.31, -94.79] },
  { id: "savannah", location: [32.08, -81.09] },
  { id: "vancouver", location: [49.29, -123.11], label: "Vancouver" },
  { id: "halifax", location: [44.64, -63.57], label: "Halifax" },
  // Oceania
  { id: "brisbane", location: [-27.38, 153.17], label: "Brisbane" },
  { id: "melbourne", location: [-37.84, 144.91], label: "Melbourne" },
  { id: "sydney", location: [-33.85, 151.21] },
  { id: "fremantle", location: [-32.05, 115.74], label: "Fremantle" },
  { id: "auckland", location: [-36.84, 174.77], label: "Auckland" },
  { id: "wellington", location: [-41.28, 174.78] },
  // Europe
  { id: "bremerhaven", location: [53.56, 8.55], label: "Bremerhaven" },
  { id: "southampton", location: [50.9, -1.4], label: "Southampton" },
  { id: "felixstowe", location: [51.96, 1.35] },
  { id: "zeebrugge", location: [51.33, 3.18], label: "Zeebrugge" },
  { id: "gdansk", location: [54.39, 18.67] },
  { id: "limassol", location: [34.65, 33.02], label: "Limassol" },
  // Middle East
  { id: "jebel-ali", location: [25.01, 55.06], label: "Jebel Ali" },
  { id: "bahrain", location: [26.2, 50.62] },
  { id: "dammam", location: [26.5, 50.2] },
  // South Asia
  { id: "chittagong", location: [22.27, 91.81], label: "Chittagong" },
  { id: "hambantota", location: [6.12, 81.11], label: "Hambantota" },
  { id: "karachi", location: [24.85, 66.98] },
  // Southeast Asia
  { id: "singapore", location: [1.26, 103.82], label: "Singapore" },
  // Africa
  { id: "tema", location: [5.63, -0.01], label: "Tema" },
  { id: "mombasa", location: [-4.04, 39.65], label: "Mombasa" },
  { id: "durban", location: [-29.87, 31.02], label: "Durban" },
  { id: "port-louis", location: [-20.16, 57.5] },
  // Caribbean & South America
  { id: "kingston", location: [17.98, -76.82], label: "Kingston" },
  { id: "santos", location: [-23.96, -46.3], label: "Santos" },
  { id: "valparaiso", location: [-33.04, -71.62], label: "Valparaíso" },
  { id: "callao", location: [-12.05, -77.14] },
  { id: "cartagena", location: [10.4, -75.51] },
];
