export type ShippingRegionId =
  | "asia-africa"
  | "caribbean"
  | "oceania"
  | "middle-east"
  | "europe"
  | "south-america";

export type ShippingRegion = {
  id: ShippingRegionId;
  label: string;
};

export type ShippingVoyage = {
  company: string;
  vessel: string;
  voyage: string;
  /** Parallel to departurePorts then arrivalPorts */
  dates: string[];
};

export type ShippingSchedule = {
  regionId: ShippingRegionId;
  title: string;
  departurePorts: string[];
  arrivalPorts: string[];
  voyages: ShippingVoyage[];
};

export const SHIPPING_REGIONS: ShippingRegion[] = [
  { id: "asia-africa", label: "Asia & Africa" },
  { id: "caribbean", label: "Caribbean" },
  { id: "oceania", label: "Oceania" },
  { id: "middle-east", label: "Middle East" },
  { id: "europe", label: "Europe" },
  { id: "south-america", label: "South America" },
];

export const SHIPPING_SCHEDULES: ShippingSchedule[] = [
  {
    regionId: "asia-africa",
    title: "Asia & Africa Shipping Schedule",
    departurePorts: ["Yokohama", "Kawasaki", "Nagoya", "Kobe", "Osaka", "Hakata"],
    arrivalPorts: [
      "Jebel Ali",
      "Karachi",
      "Port-Louis",
      "Durban",
      "Dar Es Salaam",
      "Mombasa",
      "Maputo",
      "Hambantota",
    ],
    voyages: [
      {
        company: "SEVEN SEALS CO.,LTD",
        vessel: "SL-BROOKLANDS",
        voyage: "34",
        dates: [
          "Oct 30",
          "-",
          "Oct 31",
          "Nov 01",
          "Nov 02",
          "-",
          "-",
          "-",
          "-",
          "-",
          "Dec 09",
          "Dec 11",
          "-",
          "-",
        ],
      },
      {
        company: "THE KEIHIN CO., LTD.",
        vessel: "ARABIAN SEA",
        voyage: "040",
        dates: [
          "Nov 04",
          "-",
          "Nov 05",
          "Nov 06",
          "-",
          "-",
          "-",
          "-",
          "-",
          "-",
          "Dec 01",
          "Dec 05",
          "-",
          "-",
        ],
      },
      {
        company: "GRIMALDI",
        vessel: "GRANDE FLORIDA",
        voyage: "0425",
        dates: [
          "Nov 08",
          "-",
          "-",
          "-",
          "-",
          "-",
          "-",
          "-",
          "-",
          "-",
          "Dec 03",
          "Dec 04",
          "-",
          "-",
        ],
      },
      {
        company: "G ALLIANCE SHIPPING",
        vessel: "GLOVIS SOLAR",
        voyage: "010",
        dates: [
          "-",
          "-",
          "-",
          "-",
          "Nov 11",
          "Nov 09",
          "-",
          "-",
          "-",
          "Dec 02",
          "Dec 14",
          "Dec 16",
          "-",
          "-",
        ],
      },
      {
        company: "HOEGH",
        vessel: "HOEGH TRADER",
        voyage: "184",
        dates: [
          "Nov 16",
          "-",
          "-",
          "Nov 18",
          "Nov 18",
          "-",
          "-",
          "-",
          "-",
          "Dec 10",
          "Dec 03",
          "Dec 02",
          "Dec 08",
          "-",
        ],
      },
      {
        company: "MOL",
        vessel: "VICTORIOUS ACE",
        voyage: "0084A",
        dates: [
          "Nov 18",
          "-",
          "Nov 19",
          "Nov 14",
          "-",
          "-",
          "-",
          "-",
          "Dec 07",
          "Dec 12",
          "Dec 18",
          "Dec 21",
          "Dec 14",
          "-",
        ],
      },
      {
        company: "MOL",
        vessel: "TRANQUIL ACE",
        voyage: "0125A",
        dates: [
          "Nov 24",
          "-",
          "Nov 21",
          "Nov 22",
          "-",
          "-",
          "-",
          "-",
          "Dec 11",
          "Dec 12",
          "Dec 27",
          "Dec 23",
          "Dec 14",
          "-",
        ],
      },
      {
        company: "NYK",
        vessel: "CASTOR LEADER",
        voyage: "086",
        dates: [
          "Dec 18",
          "-",
          "-",
          "-",
          "-",
          "-",
          "Jan 06",
          "-",
          "-",
          "-",
          "-",
          "-",
          "-",
          "-",
        ],
      },
    ],
  },
];

export function getScheduleForRegion(id: ShippingRegionId): ShippingSchedule | undefined {
  return SHIPPING_SCHEDULES.find((s) => s.regionId === id);
}
