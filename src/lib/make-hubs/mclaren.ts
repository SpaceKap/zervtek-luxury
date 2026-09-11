/** Editorial content for the McLaren make hub at /stock/mclaren */

import { buildStockHref } from "@/lib/stock";
import { lookupModelGuide, type MakeModelGuide } from "@/lib/make-hubs/types";

export const MCLAREN_HUB = {
  make: "McLaren",
  slug: "mclaren",
  title: "Best McLaren to Buy & Import from Japan",
  description:
    "The best McLaren to buy and import from Japan — 12C, 650S, 570S, 600LT, 675LT, 720S, 765LT, Artura, 750S and P1. Browse stock or ask ZervTek to source and export.",
  h1: "Best McLaren to Buy & Import",
  intro:
    "McLaren makes supercars in a slightly different spirit from its rivals. The drama is usually found in the driving position, the steering and the carbon-fibre structure — Japan is a useful place to search for 12Cs through Artura and P1.",
  lead: [
    "McLaren makes supercars in a slightly different spirit from its rivals. The drama is there, but it is usually found in the driving position, the steering, the carbon-fibre structure and the way the car changes direction rather than in a theatrical engine note alone. The best McLaren to buy is the one that gives you the right balance of precision, speed and usability.",
    "The 12C introduced the modern road-car programme with a 3.8-liter twin-turbocharged V8 and a carbon-fibre passenger cell. The 650S sharpened the same idea. The 570S made McLaren ownership more approachable, while the 600LT and 675LT turned the lightweight philosophy into something more focused. The 720S brought a larger performance step, the 765LT pushed it further, and the 750S refined the formula again.",
    "The Artura adds a 3.0-liter twin-turbo V6 hybrid powertrain to the range, while the P1 remains the ultimate expression of McLaren's road-car ambition. Japan is a useful place to search for these cars because the market includes early 12Cs, Sports Series cars, Longtail models and current-generation examples in a wide range of specifications. The individual car matters enormously. McLaren's technical sophistication makes history, condition and correct maintenance more important than a low odometer reading on its own.",
  ],
  shortAnswer: {
    title: "The short answer",
    paragraphs: [
      "If you want the McLaren that started the modern road-car story, look at the 12C. If you want the most balanced first McLaren, choose the 570S. If you want a more serious long-distance supercar, the 720S is the standout. For a sharper and more collectible road car, the 600LT, 675LT and 765LT are the key searches.",
      "The 750S is the strongest current pure-combustion choice, combining a 4.0-liter twin-turbo V8 with a more focused chassis and a more mature version of the McLaren formula. The Artura is the choice for buyers who want hybrid performance and the newest architecture. The P1 sits in a different category altogether: it is a collector hypercar and a landmark in McLaren's history rather than a normal used-supercar purchase.",
    ],
  },
  comparison: [
    {
      want: "The car that launched the modern road-car programme",
      model: "McLaren 12C",
      anchor: "12c",
    },
    {
      want: "A faster and more polished first-generation McLaren",
      model: "McLaren 650S",
      anchor: "650s",
    },
    {
      want: "The most approachable modern McLaren",
      model: "McLaren 570S",
      anchor: "570s",
    },
    {
      want: "A road car with genuine Longtail focus",
      model: "McLaren 600LT",
      anchor: "600lt",
    },
    {
      want: "A rare and highly focused Sports Series car",
      model: "McLaren 675LT",
      anchor: "675lt",
    },
    {
      want: "A broad-capability supercar with serious pace",
      model: "McLaren 720S",
      anchor: "720s",
    },
    {
      want: "The sharpest modern Longtail experience",
      model: "McLaren 765LT",
      anchor: "765lt",
    },
    {
      want: "A hybrid McLaren with a new-generation powertrain",
      model: "McLaren Artura",
      anchor: "artura",
    },
    {
      want: "The latest pure-combustion supercar evolution",
      model: "McLaren 750S",
      anchor: "750s",
    },
    {
      want: "The ultimate collector McLaren hypercar",
      model: "McLaren P1",
      anchor: "p1",
    },
  ],
  models: [
    {
      id: "12c",
      name: "McLaren 12C",
      years: "2011–2014",
      modelFilter: "12C",
      paragraphs: [
        "The 12C is where McLaren's modern road-car story begins. Its shape is clean rather than decorative, and the carbon-fibre passenger cell gives the car a sense of technical purpose that remains distinctive. The 3.8-liter twin-turbocharged V8 provides the speed, but the real identity comes from the way the car manages its weight and responds to the driver.",
        "The cabin puts you close to the centre of the car, the steering is quick and the suspension system allows the 12C to combine serious performance with a surprising ability to travel comfortably. It does not have the same theatrical reputation as some of its rivals, but that is part of the appeal. The 12C feels engineered first and styled second.",
        "Early software, hydraulic systems, suspension components, electronics, cooling, brakes, tyres and transmission behaviour deserve close attention. McLaren developed the car quickly, and later updates improved some of its systems. The best purchase is an example with a clear maintenance story, documented updates and evidence that the car has been used properly rather than stored and repeatedly recommissioned.",
      ],
    },
    {
      id: "650s",
      name: "McLaren 650S",
      years: "2014–2017",
      modelFilter: "650S",
      paragraphs: [
        "The 650S takes the 12C idea and gives it greater urgency. The 3.8-liter twin-turbo V8 remains central, but the car feels more immediate, more settled and more confident when the road becomes difficult. The revised bodywork adds visual aggression without abandoning the clean technical character of the original.",
        "It is a quick car in every sense. The steering is precise, the carbon-fibre structure gives the chassis a strong foundation and the hydraulic suspension can deliver both control and ride quality. The Spider adds open-air theatre, while the coupe retains the most concentrated version of the original supercar shape.",
        "A 650S makes sense for a buyer who wants a relatively compact McLaren with more development behind it than the earliest cars. Check the hydraulic suspension, dihedral doors, roof and sealing systems, electronics, cooling, brakes, tyres and service records. A car that has received the right updates is a different proposition from one that has simply been polished for sale.",
      ],
    },
    {
      id: "570s",
      name: "McLaren 570S",
      years: "2015–2021",
      modelFilter: "570S",
      paragraphs: [
        "The 570S is the McLaren that most clearly opens the door to the wider brand. It uses a 3.8-liter twin-turbocharged V8 and the same broad carbon-fibre philosophy as the larger cars, but its proportions, performance and equipment make it easier to imagine using regularly.",
        "It is not soft. The 570S has rapid steering, a low seating position and enough acceleration to make even a short road feel much longer than it is. What changes is the level of effort required. Visibility is manageable, the body is relatively compact and the car can settle into a journey without losing its ability to become serious when the road opens up.",
        "The Coupe is the cleanest expression of the idea, while the Spider brings more sound and occasion. The GT brings a different emphasis with more luggage practicality. Across the family, inspect the doors, suspension, nose lift, electronics, air conditioning, tyres, brakes, interior trim and evidence of proper McLaren servicing. The 570S is approachable, but it is not simple.",
      ],
    },
    {
      id: "600lt",
      name: "McLaren 600LT",
      years: "2018–2020",
      modelFilter: "600LT",
      paragraphs: [
        "The 600LT takes the Sports Series car and gives it a sharper reason to exist. The 3.8-liter twin-turbo V8 produces more force, while weight reduction, revised aerodynamics, a more focused chassis and the distinctive upper-exit exhausts change the mood of the car. It feels less like a fast road car and more like a road-legal track tool that happens to have manners.",
        "The Longtail name is not just decoration. The car's balance, braking, steering and seating position encourage the driver to use more of what the McLaren chassis can do. It remains compact enough for the road, but it has a greater appetite for demanding corners than the standard 570S.",
        "Choose a 600LT when involvement matters more than effortless refinement. Carbon-fibre options, seats, brakes, tyres, suspension, exhaust components, underbody condition and track use should all be understood. A car used on circuit is not automatically a bad purchase, but its maintenance history needs to explain how it was used and what was replaced afterward.",
      ],
    },
    {
      id: "675lt",
      name: "McLaren 675LT",
      years: "2015–2017",
      modelFilter: "675LT",
      paragraphs: [
        "The 675LT is one of the most desirable Sports Series McLarens because it combines a relatively compact body with a much more serious performance brief. Its 3.8-liter twin-turbo V8, reduced weight, revised aerodynamics and Longtail bodywork make it feel special even beside other fast McLarens.",
        "It is focused without becoming one-dimensional. The steering is immediate, the suspension communicates the road and the car's short dimensions make it feel alert rather than intimidating. The Coupe is especially collectible, while the Spider offers the same basic character with a different relationship to sound and weather.",
        "Rarity makes specification and provenance important. Check carbon-fibre panels, brakes, wheels, tyres, suspension, exhaust, cooling, electronics and the quality of any track-related repairs. A 675LT should be bought as a complete engineered package, not simply as a high-output version of the 650S.",
      ],
    },
    {
      id: "720s",
      name: "McLaren 720S",
      years: "2017–2023",
      modelFilter: "720S",
      paragraphs: [
        "The 720S is the McLaren that made the brand's performance step impossible to ignore. Its 4.0-liter twin-turbocharged V8 delivers immense acceleration, but the car is not defined by straight-line speed alone. The carbon-fibre structure, hydraulic suspension and carefully managed aerodynamics make it feel remarkably capable on a fast road.",
        "The cabin is more spacious than the shape suggests, visibility is better than many supercar buyers expect and the car can cover distance with less fatigue than its numbers imply. Then the road changes direction and the 720S becomes a serious instrument. The way it controls body movement and carries speed is its defining talent.",
        "The Coupe is the clearest all-round choice, while the Spider adds a stronger sense of event. Look closely at the front lift, dihedral doors, suspension, brakes, tyres, cooling, electronics, carbon trim and accident history. A 720S should feel cohesive. If the systems do not work together, the repair bill can be as dramatic as the performance.",
      ],
    },
    {
      id: "765lt",
      name: "McLaren 765LT",
      years: "2020–2023",
      modelFilter: "765LT",
      paragraphs: [
        "The 765LT is the road-going McLaren for a buyer who wants the 720S idea with fewer compromises and a sharper edge. Its 4.0-liter twin-turbo V8 has more power, while the car gains further weight reduction, aerodynamic development, stronger braking hardware and a more focused driving environment.",
        "It is still usable on the road, but the car's priorities are clear. The Longtail body, fixed or lightweight seats, carbon-fibre components and more aggressive chassis calibration make every control input feel more deliberate. The steering is quick, the traction is formidable and the performance arrives with little ceremony.",
        "This is a car to buy by history and specification. Carbon wheels, ceramic brakes, lightweight body panels, seats, tyres and suspension components can materially change both the driving experience and the cost of ownership. Confirm the equipment fitted to the individual car, understand any circuit use and check that all electronic and hydraulic systems operate correctly.",
      ],
    },
    {
      id: "artura",
      name: "McLaren Artura",
      years: "2021–present",
      modelFilter: "Artura",
      paragraphs: [
        "The Artura introduces a different powertrain philosophy. Its 3.0-liter twin-turbocharged V6 works with an electric motor and battery system, giving McLaren a hybrid supercar with immediate response and modern emissions performance. It is smaller and more compact in character than the 720S, but it is not a less serious car.",
        "The hybrid system changes the rhythm of the drive. Electric assistance fills response at low speed, while the turbocharged V6 provides the sustained performance expected from a McLaren. The car's carbon-fibre structure, compact proportions and dual-clutch transmission keep the experience recognisably focused on the driver.",
        "For an imported modern hybrid, software, warranty coverage and service support matter as much as engine output. Check the hybrid-system documentation, charging equipment where applicable, updates, brakes, tyres, electronics, suspension and the exact specification. The Artura suits a buyer who wants newer technology without giving up the low seating position and precise response of a McLaren sports car.",
      ],
    },
    {
      id: "750s",
      name: "McLaren 750S",
      years: "2023–present",
      modelFilter: "750S",
      paragraphs: [
        "The 750S is the latest pure-combustion development of McLaren's core supercar formula. Its 4.0-liter twin-turbocharged V8, lower weight, revised suspension and sharper aerodynamic work make it a more focused successor to the 720S without turning the car into an unusable track special.",
        "The attraction is not simply the extra performance. McLaren has continued to refine the relationship between steering, braking, body control and power delivery. The 750S should feel quick before the driver asks for everything, then become increasingly serious as the road demands more concentration.",
        "A newer car reduces age-related risk but does not remove the need to check specification and history. Confirm warranty position, software, tyres, brakes, carbon components, front lift, service arrangements and transport requirements. The coupe is the concentrated choice; the Spider adds open-air drama while preserving the main character of the car.",
      ],
    },
    {
      id: "p1",
      name: "McLaren P1",
      years: "2013–2015",
      modelFilter: "P1",
      paragraphs: [
        "The P1 belongs in a different conversation from the regular McLaren range. Its 3.8-liter twin-turbocharged V8 is combined with an electric hybrid system, advanced aerodynamics and a carbon-fibre structure created for an experience far beyond ordinary road-car performance. It is a landmark McLaren and one of the defining hybrid hypercars of its era.",
        "The P1's importance is not only the numbers. It represents the moment when McLaren used electric assistance not to make a supercar quieter or easier, but to make it more immediate and more capable. The car can be gentle when driven carefully, yet its design, seating position and aerodynamic systems constantly remind you that it was built with a much more ambitious target in mind.",
        "This is a collector purchase first. Provenance, authenticity, battery condition, software, specialist support, storage, transport and the condition of bespoke carbon-fibre components all matter. A P1 should be assessed as a complete historical and engineering object, not compared with a conventional used McLaren on price alone.",
      ],
    },
  ],
  howToChoose: {
    title: "How to choose your McLaren from Japan",
    paragraphs: [
      "Start with the role you want the car to play. The 12C and 650S offer the beginning and refinement of the modern road-car programme. The 570S is the natural first search, the 600LT and 675LT are focused Longtail choices, and the 720S is the broadest high-performance all-rounder.",
      "If you want the sharpest current combustion car, compare the 765LT and 750S. If hybrid technology is part of the appeal, the Artura offers a newer and more compact interpretation, while the P1 belongs to the collector and hypercar category. Once the model is clear, narrow the search by body style, transmission, colour, mileage, carbon specification, service history and intended use.",
      "The Japanese market can be useful for comparing McLaren specifications and finding cars that are difficult to locate elsewhere. ZervTek can visit a McLaren in Japan in person, obtain additional photographs and videos, ask the dealer questions supplied by the customer, review available maintenance records and Japanese registration history, and coordinate purchase, export paperwork, inland transport and insured RoRo or container shipping.",
    ],
  },
  faqs: [
    {
      q: "What is the best McLaren to buy for a first-time owner?",
      a: "The 570S is usually the strongest starting point. It retains McLaren's carbon-fibre structure, low driving position and twin-turbo V8 performance while being compact and manageable enough for regular road use. The 720S is the better choice if you want more space, power and long-distance ability.",
    },
    {
      q: "Is the McLaren 12C a good car to buy?",
      a: "Yes, if its software updates, hydraulic systems and maintenance history are clear. The 12C offers a genuine piece of McLaren history and a highly capable carbon-fibre chassis, but an early car should be bought on documented care rather than appearance or mileage alone.",
    },
    {
      q: "Is the 570S or 720S better?",
      a: "The 570S is smaller, more approachable and generally easier to place on the road. The 720S is faster, more spacious and more capable over a long journey, with a larger performance envelope. The better choice depends on whether you want compact involvement or broader supercar ability.",
    },
    {
      q: "What is the best McLaren Longtail to buy?",
      a: "The 600LT is the most accessible route into the Longtail idea, the 675LT is the rare and collectible Sports Series choice, and the 765LT is the most extreme modern road car of the group. Condition, specification and intended use should decide between them.",
    },
    {
      q: "Is the McLaren Artura fully electric?",
      a: "No. The Artura uses a 3.0-liter twin-turbocharged V6 with an electric motor and battery system. It is a hybrid McLaren, not a fully electric vehicle. The electric assistance is intended to improve response and performance while the V6 remains central to the car's character.",
    },
    {
      q: "Is the McLaren P1 a good investment?",
      a: "The P1 should be bought first as a significant McLaren hypercar and collector vehicle, not as a guaranteed financial investment. Provenance, originality, battery condition, specialist support and long-term storage are more important than a simple comparison with other used McLarens.",
    },
    {
      q: "Can ZervTek find a McLaren in Japan?",
      a: "Yes. ZervTek can search Japanese dealer stock, visit a vehicle in person, provide additional photographs and videos, ask customer-supplied questions to the dealer, review available maintenance records and Japanese registration history, and coordinate export paperwork and insured RoRo or container shipping.",
    },
  ],
  closing: {
    title: "Find your McLaren from Japan",
    body: "Tell us the model, spec, and destination — we'll search Japan for you.",
  },
} as const;

export const MCLAREN_MODEL_GUIDES: Record<string, MakeModelGuide> = {};

export function getMcLarenModelGuide(model: string): MakeModelGuide | null {
  return lookupModelGuide(MCLAREN_MODEL_GUIDES, model);
}

export function mclarenStockHref(model?: string): string {
  return buildStockHref({ make: "McLaren", model: model || undefined });
}
