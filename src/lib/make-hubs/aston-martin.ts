/** Editorial content for the Aston Martin make hub at /stock/aston-martin */

import { buildStockHref } from "@/lib/stock";
import { lookupModelGuide, type MakeModelGuide } from "@/lib/make-hubs/types";

export const ASTON_MARTIN_HUB = {
  make: "Aston Martin",
  slug: "aston-martin",
  title: "Best Aston Martin to Buy & Import from Japan",
  description:
    "The best Aston Martin to buy and import from Japan — DB5, V8 Vantage, Vanquish, DB9, V12 Vantage, DBS, Rapide, One-77, Valkyrie and DB12. Browse stock or ask ZervTek to source and export.",
  h1: "Best Aston Martin to Buy & Import",
  intro:
    "Aston Martin has always understood that a grand tourer can be more than fast transport. The best cars from Gaydon and Newport Pagnell carry a sense of occasion into every part of the drive. Japan is a useful place to search — classics, modern grand tourers and unusual specifications appear in dealer stock and auctions.",
  lead: [
    "Aston Martin has always understood that a grand tourer can be more than fast transport. The best cars from Gaydon and Newport Pagnell carry a sense of occasion into every part of the drive: the long bonnet, the low roof, the deep engine note and the feeling that the road has become a more interesting place simply because the car is on it.",
    "That is why the best Aston Martin to buy is not necessarily the newest, rarest or most powerful. It is the car whose character matches the way you want to use it. A DB5 is an event before the engine starts. A V8 Vantage is a blunt and brilliant British muscle car. A DB9 can make a long journey feel effortless. A V12 Vantage turns the grand-tourer formula into something much more mischievous. The One-77 and Valkyrie sit at the extreme edge of the idea, while the DB12 brings the modern version into sharper focus.",
    "Japan is a useful place to search for these cars because its market includes carefully presented classics, modern grand tourers and unusual specifications that can be difficult to find elsewhere. The listing is only the beginning, however. With an Aston Martin, the individual car matters enormously: history, condition, specification and the quality of past care can change the entire ownership experience.",
  ],
  shortAnswer: {
    title: "The short answer",
    paragraphs: [
      "If you want the Aston Martin most people picture when they imagine the marque, start with the DB5. It has the shape, craftsmanship and cultural presence that made Aston Martin a byword for British grand touring.",
      "If you want the best classic to drive regularly, choose the V8 Vantage. If you want the most rounded modern V12 grand tourer, look at the DB9. If you want a smaller car with an enormous personality, choose the V12 Vantage. If you want the most attainable modern Aston Martin experience, the V8 Vantage remains difficult to ignore. For an extraordinary collector car, the One-77 and Valkyrie represent two very different extremes.",
    ],
  },
  comparison: [
    {
      want: "The definitive British secret-agent grand tourer",
      model: "Aston Martin DB5",
      anchor: "db5",
    },
    {
      want: "A classic V8 with muscle-car presence",
      model: "Aston Martin V8 Vantage",
      anchor: "v8-vantage",
    },
    {
      want: "A modern classic with a dramatic V12",
      model: "Aston Martin Vanquish",
      anchor: "vanquish",
    },
    {
      want: "The most balanced all-round V12 grand tourer",
      model: "Aston Martin DB9",
      anchor: "db9",
    },
    {
      want: "A raw, compact Aston with serious attitude",
      model: "Aston Martin V12 Vantage",
      anchor: "v12-vantage",
    },
    {
      want: "A modern front-engine sports car with real presence",
      model: "Aston Martin DBS",
      anchor: "dbs",
    },
    {
      want: "A beautiful four-door with genuine long-distance ability",
      model: "Aston Martin Rapide",
      anchor: "rapide",
    },
    {
      want: "A hand-built hypercar with immense rarity",
      model: "Aston Martin One-77",
      anchor: "one-77",
    },
    {
      want: "The ultimate road-going expression of Aston Martin performance",
      model: "Aston Martin Valkyrie",
      anchor: "valkyrie",
    },
    {
      want: "The newest-generation grand tourer to use every day",
      model: "Aston Martin DB12",
      anchor: "db12",
    },
  ],
  models: [
    {
      id: "db5",
      name: "Aston Martin DB5",
      years: "1963–1965",
      modelFilter: "DB5",
      paragraphs: [
        "The DB5 is not merely a beautiful car. It is one of the most recognisable shapes in motoring, with a long bonnet, fine pillars, delicate tail and the sort of restrained detailing that modern supercars often try to imitate without understanding. It looks expensive without needing to shout.",
        "The six-cylinder engine gives the DB5 a calm, cultured character. It is a grand tourer rather than a corner-chasing sports car, and that is precisely the point. The controls have weight, the cabin has a sense of occasion and the car rewards a driver who is happy to let the journey unfold rather than attack every bend.",
        "Buy a DB5 for its design, craftsmanship and history. The quality of restoration is more important than the brightness of the paint. Body structure, corrosion repair, trim, engine work, gearbox operation and the provenance of major components all deserve close attention. A genuine, properly documented car is a different proposition from a handsome shell assembled around uncertain history.",
      ],
    },
    {
      id: "v8-vantage",
      name: "Aston Martin V8 Vantage",
      years: "1977–1989",
      modelFilter: "V8 Vantage",
      paragraphs: [
        "The original V8 Vantage is the Aston Martin for buyers who want elegance with a harder edge. The shape remains unmistakably grand-touring, but the broad stance, deeper front treatment and muscular V8 give it the presence of a British muscle car wearing a tailored suit.",
        "It feels substantial from behind the wheel. The engine has the sort of low-speed authority that makes overtaking feel effortless, while the cabin and long-distance manners keep the car from becoming a blunt instrument. This is an Aston Martin that can be relaxed when you want it to be, then unexpectedly forceful when the road opens up.",
        "The early V8 Vantage demands patience. Cooling, fuel systems, suspension, brakes, electrical equipment, bodywork and previous restoration work should all be understood before the car is judged on appearance. The best examples are richly charismatic. The wrong one can hide decades of deferred work beneath a very convincing shine.",
      ],
    },
    {
      id: "vanquish",
      name: "Aston Martin Vanquish",
      years: "2001–2007",
      modelFilter: "Vanquish",
      paragraphs: [
        "The Vanquish brought Aston Martin's traditional proportions into the modern era without losing the sense that it had been shaped by hand and finished with care. Its low roof, wide rear haunches and long nose still look special, while the V12 gives the car the effortless authority expected of a flagship.",
        "The appeal is in the combination. It is dramatic enough for a special occasion but composed enough for a serious journey. The cabin feels more contemporary than a classic V8, yet the car retains enough mechanical theatre to avoid becoming anonymous. Later developments sharpen the experience, but the original idea remains powerful.",
        "Pay close attention to the automated manual transmission, clutch operation, suspension, brakes, electronics and the condition of the carbon-fibre structure and interior trim. The Vanquish is a car to buy with documentation and specialist understanding, not simply with confidence in its appearance.",
      ],
    },
    {
      id: "db9",
      name: "Aston Martin DB9",
      years: "2004–2016",
      modelFilter: "DB9",
      paragraphs: [
        "The DB9 may be the clearest answer to the question of what an Aston Martin should be. It is beautiful without being fragile-looking, quick without being intimidating and luxurious without losing the sense that a large engine is doing meaningful work beneath the bonnet.",
        "The V12 suits the car perfectly. It delivers a deep, unhurried surge rather than demanding constant attention, and the chassis is happiest when the road becomes a long sequence of flowing bends. The DB9 is at its best when it is being used as intended: covering distance quickly, quietly and with enough theatre to make an ordinary trip feel deliberate.",
        "A DB9 is often an excellent first Aston Martin, but it is not a low-maintenance car. Service history, cooling, suspension bushes, brakes, gearbox operation, electronics, leather and the condition of the underside matter. A well-kept car can feel wonderfully cohesive. A neglected one can make every system announce its age at once.",
      ],
    },
    {
      id: "v12-vantage",
      name: "Aston Martin V12 Vantage",
      years: "2009–2018",
      modelFilter: "V12 Vantage",
      paragraphs: [
        "The V12 Vantage takes the compact Aston Martin sports car and gives it far more engine than the proportions appear to require. That is its charm. It looks tight, purposeful and slightly dangerous, then responds with the force and sound of a much larger machine.",
        "The shorter body makes the car feel more alert than the traditional grand tourers. The V12 is not there merely to provide speed; it changes the mood of the entire car. Throttle response, steering weight and the view over the bonnet make even a familiar road feel more vivid.",
        "This is the Aston Martin for a buyer who wants the marque's elegance with less distance between driver and machine. Clutch wear, cooling, brakes, suspension, tyres, electronics and the quality of previous use deserve attention. Special editions can be especially tempting, but the right standard car with strong history is preferable to a rare badge on a compromised example.",
      ],
    },
    {
      id: "dbs",
      name: "Aston Martin DBS",
      years: "2007–2012",
      modelFilter: "DBS",
      paragraphs: [
        "The DBS sits between the DB9's grand-touring poise and the V12 Vantage's harder-edged intent. Its carbon-fibre panels, wider stance and sharper details give the car a more serious look, but it remains recognisably an Aston Martin rather than a generic high-performance coupe.",
        "It is fast in a way that feels substantial rather than frantic. The V12 has the reserve to make motorway speeds almost irrelevant, while the chassis gives the driver more reason to seek out a challenging road. Inside, it still offers the long-distance comfort that makes the Aston Martin formula work.",
        "Look closely at carbon trim, suspension, brakes, tyres, cooling, electronics and gearbox behaviour. A DBS should be bought as a complete car, not as an engine and a body with the rest treated as incidental. The strongest examples combine the visual drama with a clear maintenance story.",
      ],
    },
    {
      id: "rapide",
      name: "Aston Martin Rapide",
      years: "2010–2020",
      modelFilter: "Rapide",
      paragraphs: [
        "The Rapide proves that adding two doors does not have to remove the occasion. Its roofline is low, its proportions remain elegant and the V12 gives it the same sense of effortless movement as the marque's coupes. It is one of the few four-door cars that can feel genuinely special before it moves.",
        "The rear seats are usable enough to change the car's role, not spacious enough to turn it into a conventional family saloon. That compromise is part of the appeal. The Rapide is for the buyer who wants to travel with more people while keeping the driving experience central.",
        "Age, complexity and weight make condition important. Inspect the suspension, brakes, electronics, climate systems, rear-seat equipment, leather and transmission carefully. A Rapide can be a brilliant long-distance Aston Martin, provided its extra systems have been maintained rather than merely polished.",
      ],
    },
    {
      id: "one-77",
      name: "Aston Martin One-77",
      years: "2009–2012",
      modelFilter: "One-77",
      paragraphs: [
        "The One-77 is Aston Martin without restraint. Its body is low, long and sculptural, with surfaces that look more like a piece of modern coachbuilding than a conventional production car. It has the presence of a concept car because, in many ways, that is what it is.",
        "The naturally aspirated V12 provides the mechanical counterpoint to the bodywork. The car is powerful and exotic, but the real appeal is its rarity and the sense that every detail was allowed to become more elaborate than normal production constraints would permit.",
        "A One-77 belongs in a different buying category from an ordinary used Aston Martin. Provenance, authenticity, specialist support, storage, transport and the condition of bespoke components all matter. It is a collector's car first and a high-performance road car second. That does not reduce its appeal; it explains it.",
      ],
    },
    {
      id: "valkyrie",
      name: "Aston Martin Valkyrie",
      years: "2021–present",
      modelFilter: "Valkyrie",
      paragraphs: [
        "The Valkyrie is Aston Martin's most extreme road-going statement. It looks as if the bodywork has been wrapped around an aerodynamic experiment, and the driving position makes no attempt to disguise the car's competition-inspired priorities.",
        "The naturally aspirated V12 and lightweight construction create an experience far removed from the relaxed grand tourers elsewhere in the range. The Valkyrie is not about covering a distance in comfort. It is about making the act of driving feel concentrated, physical and slightly absurd in the best possible way.",
        "This is a specialist collector purchase. The buyer needs to understand access, servicing, storage, transport, software, bespoke components and the practical limits of using a road-legal car built so close to a racing concept. Its rarity is part of the experience, but it also makes every ownership decision more deliberate.",
      ],
    },
    {
      id: "db12",
      name: "Aston Martin DB12",
      years: "2023–present",
      modelFilter: "DB12",
      paragraphs: [
        "The DB12 is the modern Aston Martin grand tourer distilled into a sharper, more capable shape. It keeps the long bonnet and elegant roofline, but the stance is wider and the cabin, electronics and chassis are designed for a driver who expects contemporary usability.",
        "It is quick without being exhausting. The steering, brakes and body control give it more confidence on a fast road, while the cabin remains suited to long journeys. The DB12 is less about nostalgia than about showing why the grand-tourer formula still works when it is properly updated.",
        "For an imported modern car, specification and support matter as much as performance. Check the equipment, software, service history, tyres, brakes, electronics and warranty position. A DB12 makes the most sense when the buyer wants Aston Martin design and atmosphere without accepting the compromises of an older collector car.",
      ],
    },
  ],
  howToChoose: {
    title: "How to choose your Aston Martin from Japan",
    paragraphs: [
      "Start with the kind of drive you want, not the badge on the boot. Do you want the craftsmanship and presence of a DB5, the muscle of a V8 Vantage, the effortless distance of a DB9, the compact force of a V12 Vantage, or the modern usability of a DB12? If rarity is the main attraction, decide whether you want the hand-built theatre of a One-77 or the uncompromising focus of a Valkyrie.",
      "Once that answer is clear, narrow the search by transmission, body style, color, mileage, specification and intended use. With classic and limited-production cars, identity and provenance deserve as much attention as the odometer. With modern cars, electronics, service support and export logistics become more important.",
      "ZervTek can visit an Aston Martin in Japan in person, obtain additional photographs and videos, ask the dealer questions supplied by the customer, review available maintenance records and review Japanese registration history. Once you select a car, ZervTek can coordinate the purchase and export paperwork, inland transport and insured RoRo or container shipping to the destination port.",
    ],
  },
  faqs: [
    {
      q: "What is the best Aston Martin to buy for a first-time owner?",
      a: "The DB9 is usually the strongest starting point for a buyer who wants the traditional Aston Martin experience. It has the shape, V12 character, comfort and long-distance ability of the marque without the age and fragility of the earliest classics.",
    },
    {
      q: "What is the best classic Aston Martin to buy?",
      a: "The DB5 is the defining classic, but the original V8 Vantage is the better choice for a buyer who wants a more muscular driving experience. In either case, restoration quality, authenticity and maintenance history matter more than cosmetic presentation.",
    },
    {
      q: "What is the best modern Aston Martin to buy?",
      a: "The DB12 is the most complete modern grand tourer, combining Aston Martin's design language with contemporary chassis control, electronics and everyday usability. The V12 Vantage is the more focused choice for buyers who want a smaller and more dramatic sports car.",
    },
    {
      q: "Is the Aston Martin DB9 a good car to buy?",
      a: "Yes, if you buy the history as carefully as the car. The DB9 offers one of the best combinations of beauty, V12 character and long-distance comfort in the range, but cooling, suspension, electronics, brakes and transmission operation must be checked properly.",
    },
    {
      q: "Is the V12 Vantage better than the DB9?",
      a: "They serve different purposes. The V12 Vantage is smaller, sharper and more intense. The DB9 is calmer, more spacious and better suited to covering long distances. The right choice depends on whether you want a sports car with a huge engine or a grand tourer with effortless speed.",
    },
    {
      q: "Can ZervTek find an Aston Martin in Japan?",
      a: "Yes. ZervTek can search Japanese dealer stock and auctions, visit a vehicle in person, provide extra photographs and videos, ask customer-supplied questions to the dealer, review available maintenance records and Japanese registration history, and coordinate export paperwork and insured RoRo or container shipping.",
    },
  ],
  closing: {
    title: "Find your Aston Martin from Japan",
    body: "Tell us the model, spec, and destination. We'll search Japan for you.",
  },
} as const;

/** Per-model guides at `/stock/aston-martin/{model}` — empty until spoken content is written. */
export const ASTON_MARTIN_MODEL_GUIDES: Record<string, MakeModelGuide> = {};

export function getAstonMartinModelGuide(model: string): MakeModelGuide | null {
  return lookupModelGuide(ASTON_MARTIN_MODEL_GUIDES, model);
}

export function astonMartinStockHref(model?: string): string {
  return buildStockHref({ make: "Aston Martin", model: model || undefined });
}
