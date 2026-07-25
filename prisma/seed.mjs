import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(input) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

function buildSlug(v) {
  return [String(v.year), v.make, v.model, v.variant || "", v.id.slice(-8)]
    .filter(Boolean)
    .map(slugify)
    .filter(Boolean)
    .join("-");
}

const u = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=80`;

const vehicles = [
  {
    make: "Mercedes-AMG",
    model: "C-Class",
    variant: "C43 4MATIC Wagon",
    year: 2023,
    price: 8855000,
    mileage: 3900,
    transmission: "AUTOMATIC",
    fuelType: "PETROL",
    drivetrain: "AWD",
    bodyType: "WAGON",
    engineCc: 1991,
    exteriorColor: "Obsidian Black",
    interiorColor: "Brown & Black Leather",
    location: "Chiba Flagship",
    featured: true,
    features: ["Panoramic sunroof", "Burmester surround sound", "Heated & ventilated seats", "AMG Ride Control"],
    images: [u("1618843479313-40f8afb4b4d8"), u("1503376780353-7e6692767b70"), u("1552519507-da3b142c6e3d")],
    description:
      "A stunning low-mileage Mercedes-AMG C43 4MATIC Wagon finished in Obsidian Black over a striking brown and black leather interior. Powered by AMG's turbocharged inline-four with EQ Boost and full-time 4MATIC all-wheel drive, this estate blends everyday practicality with genuine performance. Highlights include a panoramic sunroof, Burmester surround sound, and heated and ventilated front seats. Inspected and prepared at our technical base, ready for export worldwide.",
  },
  {
    make: "Land Rover",
    model: "Defender",
    variant: "110 X",
    year: 2023,
    price: 8783000,
    mileage: 25900,
    transmission: "AUTOMATIC",
    fuelType: "PETROL",
    drivetrain: "AWD",
    bodyType: "SUV",
    engineCc: 2996,
    exteriorColor: "Lantau Bronze",
    interiorColor: "Ebony",
    location: "Chiba Flagship",
    featured: true,
    features: ["Cold Climate Pack", "Comfort & Convenience Pack", "Roof rack", "Electronic Air Suspension"],
    images: [u("1606664515524-ed2f786a0bd6"), u("1519641471654-76ce0107ad1b")],
    description:
      "The flagship Defender 110 X in desirable Lantau Bronze with the Cold Climate and Comfort & Convenience packs. This is the definitive modern luxury off-roader — commanding presence, supreme capability and a beautifully appointed cabin. Fitted with a roof rack and electronic air suspension. A meticulously maintained example, fully inspected and ready to ship.",
  },
  {
    make: "BMW",
    model: "X6",
    variant: "xDrive35d M Sport Plus",
    year: 2021,
    price: 6575000,
    mileage: 27700,
    transmission: "AUTOMATIC",
    fuelType: "DIESEL",
    drivetrain: "AWD",
    bodyType: "SUV",
    engineCc: 2993,
    exteriorColor: "Black Sapphire",
    interiorColor: "Brown Leather",
    location: "Central",
    featured: true,
    features: ["Panoramic sunroof", "22-inch alloys", "Crafted Clarity glass", "Harman Kardon audio"],
    images: [u("1555215695-3004980ad54e"), u("1553440569-bcc63803a83d")],
    description:
      "A powerful and elegant BMW X6 xDrive35d in M Sport Plus specification. The smooth inline-six diesel delivers effortless torque and long-distance refinement, while the M Sport Plus package adds 22-inch alloys, Crafted Clarity glass controls and Harman Kardon audio. Finished in Black Sapphire over brown leather with a panoramic sunroof. Superb condition throughout.",
  },
  {
    make: "Land Rover",
    model: "Range Rover Sport",
    variant: "HSE Diesel Drive Pro Pack",
    year: 2022,
    price: 6076000,
    mileage: 54000,
    transmission: "AUTOMATIC",
    fuelType: "DIESEL",
    drivetrain: "AWD",
    bodyType: "SUV",
    engineCc: 2996,
    exteriorColor: "Santorini Black",
    interiorColor: "Ebony",
    location: "Central",
    featured: false,
    features: ["Black Exterior Pack", "Panoramic sunroof", "Meridian sound", "Drive Pro Pack"],
    images: [u("1606664515524-ed2f786a0bd6"), u("1519641471654-76ce0107ad1b")],
    description:
      "A commanding Range Rover Sport HSE with the Drive Pro Pack and Black Exterior Pack, finished in Santorini Black. Combines luxury, technology and genuine capability with a refined diesel powertrain. Equipped with a panoramic sunroof and Meridian sound system. A well-cared-for example, fully serviced and export-ready.",
  },
  {
    make: "Porsche",
    model: "911",
    variant: "Carrera S (992)",
    year: 2020,
    price: 15800000,
    mileage: 18500,
    transmission: "DCT",
    fuelType: "PETROL",
    drivetrain: "RWD",
    bodyType: "COUPE",
    engineCc: 2981,
    exteriorColor: "GT Silver Metallic",
    interiorColor: "Black/Bordeaux",
    location: "Chiba Flagship",
    featured: true,
    features: ["Sport Chrono Package", "PASM", "BOSE Surround Sound", "Sport Exhaust"],
    images: [u("1503376780353-7e6692767b70"), u("1544636331-e26879cd4d9b")],
    description:
      "An icon in its finest current form — the 992-generation Porsche 911 Carrera S in GT Silver Metallic. Twin-turbo flat-six, lightning-quick PDK and the Sport Chrono Package deliver breathtaking performance, while PASM and the sport exhaust sharpen the experience. A low-mileage, immaculate example with a desirable specification. Inspected and ready for worldwide export.",
  },
  {
    make: "Ferrari",
    model: "488",
    variant: "Spider",
    year: 2018,
    price: 32800000,
    mileage: 9800,
    transmission: "DCT",
    fuelType: "PETROL",
    drivetrain: "RWD",
    bodyType: "CONVERTIBLE",
    engineCc: 3902,
    exteriorColor: "Rosso Corsa",
    interiorColor: "Nero",
    location: "Chiba Flagship",
    featured: true,
    features: ["Carbon fibre package", "Daytona seats", "Front lift", "JBL Professional audio"],
    images: [u("1592198084033-aade902d1aae"), u("1583121274602-3e2820c69888")],
    description:
      "The exhilarating Ferrari 488 Spider in the definitive Rosso Corsa over Nero. Its 3.9-litre twin-turbo V8 is one of the greatest engines of the modern era, and the retractable hardtop lets you savour every note. Specified with the carbon fibre package, Daytona seats and front lift. A pristine, low-mileage example with full history — a true collector's grade car.",
  },
];

async function main() {
  for (const v of vehicles) {
    const created = await prisma.vehicle.create({
      data: {
        ...v,
        slug: `tmp-${crypto.randomUUID()}`,
        status: "AVAILABLE",
        createdByType: "ADMIN",
        createdByName: "Seed",
      },
    });
    await prisma.vehicle.update({
      where: { id: created.id },
      data: { slug: buildSlug(created) },
    });
    console.log(`Seeded: ${v.year} ${v.make} ${v.model}`);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
