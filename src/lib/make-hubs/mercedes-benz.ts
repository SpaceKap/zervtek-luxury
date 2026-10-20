/** Editorial content for the Mercedes-Benz make hub at /stock/mercedes-benz */

import { buildStockHref } from "@/lib/stock";
import { lookupModelGuide, type MakeModelGuide } from "@/lib/make-hubs/types";

export const MERCEDES_BENZ_HUB = {
  make: "Mercedes-Benz",
  slug: "mercedes-benz",
  title: "Best Mercedes-Benz to Buy & Import from Japan",
  description:
    "The best Mercedes-Benz cars to buy and import from Japan, from the W123 and W124 to the S-Class, G-Class, SL, CLS and GLE, with model comparisons and buying guidance.",
  h1: "Best Mercedes-Benz to Buy & Import",
  intro:
    "Mercedes-Benz has spent more than a century making the case that a car can be both an instrument and a shelter. From the W123 and W124 to the S-Class, G-Class and SL, Japan is a useful place to search.",
  lead: [
    "Mercedes-Benz has spent more than a century making the case that a car can be both an instrument and a shelter. The best examples do not shout. They close a door, settle onto the road and make speed feel like a decision the car has already made on your behalf. That restraint is the point, and it is why the best Mercedes-Benz to buy is rarely the one with the most dramatic specification sheet.",
    "The marque is also broad enough to mean several different things at once. A W123 or W124 feels like a piece of engineering that was overbuilt on principle. An S-Class isolates its occupants from the road with a completeness that no rival quite matches. A G-Class refuses to behave like anything else on the road. An SL turns a long journey into something closer to an occasion.",
    "The right car depends on the kind of luxury you want. Choose by badge alone and you may end up with a car whose running costs are far more memorable than its ride. Choose by character, and the model itself will tell you where it belongs in your life.",
  ],
  shortAnswer: {
    title: "The short answer",
    paragraphs: [
      "For most buyers, the W124 E-Class is the strongest starting point. It combines the marque's legendary build quality with genuine everyday usability and a mechanical honesty that later cars began to dilute.",
      "If you want a classic, the W123 is the more characterful introduction to older Mercedes ownership. The 190E offers a compact, agile alternative. For traditional flagship luxury, the W126 S-Class is the benchmark, while the W140 is the last S-Class built without cost constraints.",
      "For a modern flagship, the W222 S-Class delivers the most complete expression of contemporary Mercedes comfort. The G-Class is the icon that refuses to age. The SL is the classic grand tourer, the CLS pioneered the four-door coupe, and the GLE brings the marque's refinement into a versatile SUV shape.",
    ],
  },
  comparisonTitle: "Ten Mercedes-Benz cars worth searching for",
  comparison: [
    {
      want: "A classic defined by over-engineering",
      model: "Mercedes-Benz W123",
      anchor: "w123",
    },
    {
      want: "The definitive modern classic saloon",
      model: "Mercedes-Benz W124",
      anchor: "w124",
    },
    {
      want: "A compact, characterful 1990s saloon",
      model: "Mercedes-Benz 190E",
      anchor: "190e",
    },
    {
      want: "The classic flagship saloon",
      model: "Mercedes-Benz S-Class W126",
      anchor: "s-class-w126",
    },
    {
      want: "The last old-school flagship",
      model: "Mercedes-Benz S-Class W140",
      anchor: "s-class-w140",
    },
    {
      want: "The complete modern flagship",
      model: "Mercedes-Benz S-Class W222",
      anchor: "s-class-w222",
    },
    {
      want: "The icon that refuses to age",
      model: "Mercedes-Benz G-Class",
      anchor: "g-class",
    },
    {
      want: "The classic grand-tourer roadster",
      model: "Mercedes-Benz SL",
      anchor: "sl",
    },
    {
      want: "The pioneer of the four-door coupe",
      model: "Mercedes-Benz CLS",
      anchor: "cls",
    },
    {
      want: "Refined luxury in a versatile shape",
      model: "Mercedes-Benz GLE",
      anchor: "gle",
    },
  ],
  models: [
    {
      id: "w123",
      name: "Mercedes-Benz W123",
      years: "1976–1985",
      modelFilter: "E-Class",
      paragraphs: [
        "The W123 is the car that cemented Mercedes-Benz's reputation for durability. Its upright body, chrome detailing and substantial stance announce a machine built to outlast trends, and its survival in numbers across warm and cold climates is itself the strongest possible review.",
        "The driving experience is unhurried and deliberate. Petrol and diesel engines were offered in a broad range, from modest four-cylinders to smooth six-cylinders, with the diesel units becoming especially prized for their longevity. The steering is heavy by modern standards, the ride is composed and the cabin has an honesty that later luxury cars replaced with technology.",
        "This is a classic to buy on condition rather than mileage. Rust protection was good for its era but not immune to decades of use, and the mechanical simplicity that makes the W123 appealing also means deferred maintenance is rarely forgiven. A well-kept example feels indestructible. A neglected one will make its list of needs known quickly.",
        "Choose a W123 because you want the experience of older Mercedes engineering, not because you expect modern pace. The car rewards patience and rewards a buyer who values the way it was put together as much as the way it looks.",
      ],
    },
    {
      id: "w124",
      name: "Mercedes-Benz W124",
      years: "1984–1995",
      modelFilter: "E-Class",
      paragraphs: [
        "The W124 is often described as the last Mercedes-Benz engineered without a calculator in one hand. Its body panels, switchgear and mechanical components feel heavier and more solid than almost anything built since, and the car carries that solidity into a driving experience that is calm, planted and reassuring.",
        "The engine range is wide, with the smooth six-cylinder petrol units and the robust diesel units both attracting devoted followings. The saloon, estate, coupe and cabriolet bodies give the W124 unusual breadth, and the later facelifted cars bring a more modern appearance without abandoning the underlying build quality.",
        "For many enthusiasts the W124 is the definitive everyday classic. It can cover distance in comfort, absorb poor roads with composure and tolerate regular use in a way that more fragile classics cannot. The cabin is roomy, logically laid out and finished to a standard that newer cars find hard to match.",
        "Buy on structural condition and mechanical honesty. Rust, suspension wear, ageing electrics and the health of the automatic transmission deserve attention. A sound W124 is a car you can own and use. A tired one is a project wearing a familiar badge.",
      ],
    },
    {
      id: "190e",
      name: "Mercedes-Benz 190E",
      years: "1982–1993",
      modelFilter: "190 Class",
      paragraphs: [
        "The 190E was the baby Benz, a smaller saloon that brought the marque's engineering into a more compact and more affordable shape. It has a directness and agility that the larger models do not attempt, and it still reads as a proper Mercedes rather than a compromise.",
        "The 2.3-litre and 2.6-litre six-cylinder versions are the enthusiast favourites, while the 2.0-litre four-cylinder cars offer a lighter, more economical introduction. The 190E 2.3-16 and 2.5-16 Cosworth models occupy their own space entirely, adding a racing-derived head and a sharper edge to the same basic platform.",
        "The driving experience is honest and communicative. The steering loads up naturally, the chassis responds eagerly and the car feels far smaller than a conventional Mercedes of the period. It is a sports saloon in the classical sense, useful at legal speeds in a way that many more powerful cars are not.",
        "Age brings the usual considerations: rust, cooling, suspension bushes and electrical gremlins. The six-cylinder cars and the Cosworth variants have developed real collector appeal, so provenance and originality matter. Buy the best structural example you can find and use it as it was intended.",
      ],
    },
    {
      id: "s-class-w126",
      name: "Mercedes-Benz S-Class W126",
      years: "1979–1991",
      modelFilter: "S-Class",
      paragraphs: [
        "The W126 S-Class defined what a flagship saloon should be for more than a decade. Its proportions are clean and dignified, its cabin is genuinely spacious and its engineering set a standard that rivals spent years trying to reach. It remains one of the most respected Mercedes-Benz models ever built.",
        "The V8 engines, from the 3.8-litre through to the 5.6-litre units, deliver the calm, effortless performance the car's character demands. The ride is supremely composed and the cabin isolation is remarkable for the era. This is a car that covers distance without appearing to exert itself, which is precisely the point of an S-Class.",
        "The build quality is exceptional, which is why so many examples survive in presentable condition. That does not remove the need for care. Hydraulic systems, climate control, suspension components, fuel injection and ageing electronics all deserve informed attention, particularly on the more complex V8 cars.",
        "Choose a W126 for its combination of presence, comfort and historical importance. It is a classic that can still be used regularly, provided the maintenance is kept current and the car is selected on condition rather than cosmetics alone.",
      ],
    },
    {
      id: "s-class-w140",
      name: "Mercedes-Benz S-Class W140",
      years: "1991–1998",
      modelFilter: "S-Class",
      paragraphs: [
        "The W140 is the last S-Class built before cost control became the dominant engineering principle. It is visibly larger and heavier than the car it replaced, and every system inside it was developed to a standard that now looks almost reckless. That is exactly why the car commands such respect.",
        "The V8 and V12 engines are the heart of the experience, delivering immense low-speed torque and a sense of effortlessness that no smaller engine can imitate. The cabin is vast, quiet and finished with materials that have aged remarkably well. The car isolates its occupants from the road with a completeness that later generations softened only slightly.",
        "Its size is both the appeal and the compromise. A W140 is a substantial car to park and to place, and its fuel and maintenance appetite reflects the engineering ambition behind it. The V12 versions in particular deserve specialist understanding rather than general luxury-car assumptions.",
        "Buy a W140 because you want the last old-school Mercedes flagship, with its weight, its quality and its sense of occasion intact. Condition and documentation matter more than model year. A well-maintained example is a remarkably reassuring way to travel.",
      ],
    },
    {
      id: "s-class-w222",
      name: "Mercedes-Benz S-Class W222",
      years: "2013–2020",
      modelFilter: "S-Class",
      paragraphs: [
        "The W222 S-Class returned the flagship to a level of technology and cabin comfort that set the agenda for the whole luxury segment. Its interior, with its curved surfaces, ambient lighting and vast displays, redefined what a modern luxury cabin could be, while the ride quality remained the car's defining asset.",
        "The engine range spans efficient six-cylinders, powerful V8s and the twelve-cylinder S 600 and S 65 AMG flagships. The driving experience is serene, with air suspension, advanced driver assistance and a level of noise isolation that makes long journeys genuinely restful. The car manages its own complexity with remarkable smoothness.",
        "The W222 is the modern flagship most buyers actually want, because it delivers contemporary comfort and technology without the earliest-adopter risk of the newest generation. It is a large car, but its systems make that size far easier to manage than the W140's.",
        "Buy on specification and history. Air suspension, electronics, infotainment software, seat functions and the operation of every comfort feature deserve verification. Confirm the exact equipment fitted to the individual car rather than assuming every W222 carries the same features.",
      ],
    },
    {
      id: "g-class",
      name: "Mercedes-Benz G-Class",
      years: "1990–2018",
      modelFilter: "G Class",
      paragraphs: [
        "The G-Class is an anomaly that became an icon. It began as a utilitarian off-roader and somehow grew into one of the most recognisable luxury vehicles on the road, without ever abandoning its upright, bolted-together character. No other Mercedes-Benz has the same presence, or the same refusal to follow fashion.",
        "The pre-2018 cars carry the original ladder-frame construction and part-time four-wheel drive, with the petrol V8 and diesel versions offering very different ownership experiences. The driving position is high and upright, the steering is slow by design and the doors close with a solidity that feels almost agricultural. It is not a refined car, but it is an authentic one.",
        "That authenticity is the appeal. A G-Class does not pretend to be a sports car or a soft-roader. It is what it is, and buyers respond to its honesty. The later AMG versions add serious pace, while the standard models remain the more sensible choice for most buyers.",
        "Condition matters enormously. Rust, chassis corrosion, driveline wear, suspension and the operation of the four-wheel-drive system all deserve close inspection. A clean G-Class holds value extraordinarily well, but a neglected one can hide expensive problems beneath its square, seductive bodywork.",
      ],
    },
    {
      id: "sl",
      name: "Mercedes-Benz SL",
      years: "1989–2001",
      modelFilter: "SL",
      paragraphs: [
        "The R129-generation SL is the classic grand-tourer roadster in its purest form. It combines a folding hardtop, a comfortable cabin and a range of smooth engines into a car that feels special at walking pace and genuinely capable on a fast road. It is a Mercedes-Benz designed for enjoyment rather than simple transport.",
        "The six-cylinder cars are the sensible entry point, while the V8 and V12 versions add the effortless performance the car's shape suggests. The folding roof is an engineering centrepiece in its own right, transforming the car from closed coupe to open roadster without exposing its occupants to excessive noise or weather.",
        "The SL rewards a buyer who values the relationship between a long bonnet, a low seating position and a smooth, substantial engine. It is not a sharp sports car, and it is better for it. The experience is about covering ground with composure and arriving without fatigue.",
        "Roof mechanism, hydraulic systems, suspension, cooling and electrical equipment all deserve careful attention. The later cars became increasingly complex, so choose a model whose systems have been properly maintained rather than one whose complexity has been deferred to the next owner.",
      ],
    },
    {
      id: "cls",
      name: "Mercedes-Benz CLS",
      years: "2004–2010",
      modelFilter: "CLS Class",
      paragraphs: [
        "The first CLS created the four-door coupe as a mainstream idea. Its low, swooping roofline and frameless doors gave a four-door saloon the drama of a coupe, and the market's reaction proved the concept almost immediately. It remains one of the most distinctive Mercedes-Benz designs of the modern era.",
        "The driving experience backs the looks. The V6 and V8 engines deliver smooth, strong performance, and the chassis feels planted and composed without sacrificing ride comfort. The CLS is a grand tourer in saloon form, prioritising elegance and long-distance ease over outright agility.",
        "The first-generation CLS is now the enthusiast's value play, combining distinctive styling with the dependable hardware of the contemporary E-Class. Its cabin still feels special, with the four-seat layout reinforcing the coupe character that defined the concept.",
        "Rust, air suspension on higher models, electronics and the condition of the frameless door seals deserve attention. The early cars are ageing into affordability, which makes condition and history more important than a particular specification on the window sticker.",
      ],
    },
    {
      id: "gle",
      name: "Mercedes-Benz GLE",
      years: "2011–2019",
      modelFilter: "GLE",
      paragraphs: [
        "The GLE, sold as the ML-Class before its 2015 rename, is the Mercedes-Benz that makes the marque's comfort available to buyers who need a higher driving position, a versatile cabin and real load space. It is the sensible route into the brand for a family or for anyone who wants luxury without the formality of a saloon.",
        "The V6 and V8 petrol versions, along with the diesel variants, cover a wide spread of needs, with the AMG models sitting at the performance end of the range. The driving experience is smooth and isolating, with air suspension on higher models delivering the calm ride buyers expect from the badge.",
        "The GLE does not attempt the drama of a G-Class or the intimacy of an SL. Its appeal is breadth. It is a car that can handle a long motorway run, a full boot and a family of passengers without ever asking the driver to think about it. That ease is its own kind of luxury.",
        "Air suspension, electronics, infotainment, driveline components and the condition of the interior all deserve attention on a used example. Specification varies widely, so confirm the features fitted to the individual car. A well-maintained GLE is a straightforward and comfortable ownership proposition.",
      ],
    },
  ],
  howToChoose: {
    title: "How to choose your Mercedes-Benz from Japan",
    paragraphs: [
      "Start with the character you want to preserve. For classic over-engineering, the W123 and W124 are the natural search. For a compact classic with more agility, the 190E deserves attention. For flagship luxury, the W126 and W140 represent the old school, while the W222 is the modern benchmark.",
      "Then decide how the car will be used. A G-Class suits buyers who want presence and authenticity. An SL suits open-air grand touring. A CLS adds coupe drama to four-door practicality, and a GLE adds versatility without abandoning the marque's comfort.",
      "Narrow the search by engine, body style, transmission, mileage and intended use. Confirm the steering position and the exact specification of the individual car. Registration year does not always identify the precise generation or equipment level, so verify the details rather than relying on the model name alone.",
      "Mileage should be read alongside maintenance history. A well-documented, regularly serviced example is more reassuring than a low-mileage car with uncertain past care, particularly on older models with complex hydraulic and electronic systems.",
      "ZervTek can visit a vehicle in Japan, obtain additional photographs and videos, ask the dealer questions supplied by the customer, and review available maintenance records and Japanese registration history. Once you select a car, ZervTek can coordinate purchase, inland transport, export paperwork and insured RoRo or container shipping.",
      "Import eligibility and registration requirements should be confirmed for the destination before committing to a purchase.",
    ],
  },
  faqs: [
    {
      q: "What is the best Mercedes-Benz to buy for a first-time owner?",
      a: "The W124 E-Class is a strong starting point. It combines genuine build quality with everyday usability and broad parts availability. For a more modern first Mercedes, the W222 S-Class or a well-maintained GLE offers comfort and reliability without the specialist demands of the older cars.",
    },
    {
      q: "What is the best classic Mercedes-Benz to buy?",
      a: "The W123 is the most characterful introduction to older Mercedes ownership, while the W124 feels more modern and more usable. The 190E adds agility to the same formula. Condition, rust and mechanical history matter more than choosing between the three.",
    },
    {
      q: "Is the Mercedes-Benz W140 better than the W126?",
      a: "The W140 is larger, heavier and more overtly engineered, with a stronger sense of old-school excess. The W126 is more elegant and easier to live with. The better purchase is the individual car with the stronger history and the condition you actually want.",
    },
    {
      q: "Is the G-Class a good car to buy?",
      a: "Yes, for buyers who value its unique presence and authenticity over refinement and efficiency. The pre-2018 cars are genuinely utilitarian, so rust, chassis condition and driveline wear deserve close attention. A clean example holds value exceptionally well.",
    },
    {
      q: "What is the best Mercedes-Benz S-Class to buy?",
      a: "The W222 is the strongest modern choice for its combination of comfort, technology and usability. The W126 and W140 appeal to buyers who want the classic flagship experience, with the W140 offering the last truly cost-no-object S-Class.",
    },
    {
      q: "Which Mercedes-Benz is best for everyday use?",
      a: "The GLE offers the most versatility for family and luggage, while the E-Class generations remain the natural all-rounders. A W124 or a later E-Class suits buyers who prefer a saloon without the size and complexity of a full S-Class.",
    },
    {
      q: "Can ZervTek source a Mercedes-Benz from Japan?",
      a: "Yes. ZervTek can search Japanese dealer stock and auctions against your requirements, obtain further vehicle information and help coordinate the purchase and export process. Availability, specification and destination eligibility must be confirmed for each vehicle.",
    },
  ],
  closing: {
    title: "Find your Mercedes-Benz from Japan",
    body: "Tell us the model, spec, and destination. We'll search Japan for you.",
  },
} as const;

export const MERCEDES_BENZ_MODEL_GUIDES: Record<string, MakeModelGuide> = {};

export function getMercedesBenzModelGuide(model: string): MakeModelGuide | null {
  return lookupModelGuide(MERCEDES_BENZ_MODEL_GUIDES, model);
}

export function mercedesBenzStockHref(model?: string): string {
  return buildStockHref({ make: "Mercedes-Benz", model: model || undefined });
}
