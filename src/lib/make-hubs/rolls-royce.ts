/** Editorial content for the Rolls-Royce make hub at /stock/rolls-royce */

import { buildStockHref } from "@/lib/stock";
import { lookupModelGuide, type MakeModelGuide } from "@/lib/make-hubs/types";

export const ROLLS_ROYCE_HUB = {
  make: "Rolls-Royce",
  slug: "rolls-royce",
  title: "Best Rolls-Royce to Buy & Import from Japan",
  description:
    "The best Rolls-Royce cars to buy and import from Japan, from the Silver Shadow and Silver Spirit to the Ghost, Phantom, Wraith, Dawn and Cullinan, with model comparisons and buyer guidance.",
  h1: "Best Rolls-Royce to Buy",
  intro:
    "A Rolls-Royce is meant to make an ordinary journey feel like an unusual one. Choose between classic Shadows and Spirits, modern Ghost and Phantom saloons, Wraith, Dawn or Cullinan — Japan is a useful place to search.",
  lead: [
    "A Rolls-Royce is meant to make an ordinary journey feel like an unusual one. The doors close with a distinctive solidity, the cabin seems to float above the road, and the controls feel heavier than ordinary cars because every action is expected to feel considered. Even in a busy city, the experience reminds you that motoring can be more than just transport.",
    "That is why the best Rolls-Royce to buy depends on what kind of presence you want. A Silver Shadow or Silver Spirit brings an older idea of British luxury into the modern era. A Ghost or Phantom carries the marque's craftsmanship into a larger, more contemporary cabin. A Wraith or Dawn adds something more personal. A Cullinan places that same refinement into a more versatile body.",
    "The right car matches the kind of journeys you want to make, how much space you need, and how you feel about the badge's heritage. There is rarely one answer for every buyer. There is usually a clear answer for a particular kind of use.",
  ],
  shortAnswer: {
    title: "The short answer",
    paragraphs: [
      "For most buyers, the Ghost Series II offers the strongest combination of modern refinement, generous cabin space and contemporary driving dynamics. It has the badge's quiet authority without the size and cost of a Phantom.",
      "Choose the Phantom VII for the definitive Rolls-Royce experience. For a driver's car that still feels like a Rolls-Royce, look at the Wraith. For open-air luxury, the Dawn is more refined than a modern convertible has any right to be. The Cullinan is the practical choice when versatility matters.",
      "For a classic, the Silver Shadow offers the most approachable way into the marque's history. The Silver Spirit is more modern and a little more usable. The Silver Cloud III is the elegant classic that many enthusiasts dream about.",
    ],
  },
  comparisonTitle: "Ten Rolls-Royce cars worth searching for",
  comparison: [
    {
      want: "A classic British saloon with an approachable character",
      model: "Rolls-Royce Silver Shadow",
      anchor: "silver-shadow",
    },
    {
      want: "The most elegant classic Rolls-Royce",
      model: "Rolls-Royce Silver Cloud III",
      anchor: "silver-cloud-iii",
    },
    {
      want: "A more modern classic with greater usability",
      model: "Rolls-Royce Silver Spirit",
      anchor: "silver-spirit",
    },
    {
      want: "The most attainable modern Rolls-Royce experience",
      model: "Rolls-Royce Ghost Series I",
      anchor: "ghost-series-i",
    },
    {
      want: "A complete modern interpretation of the marque",
      model: "Rolls-Royce Ghost Series II",
      anchor: "ghost-series-ii",
    },
    {
      want: "The definitive modern Rolls-Royce saloon",
      model: "Rolls-Royce Phantom VII",
      anchor: "phantom-vii",
    },
    {
      want: "An opulent coupe with real presence",
      model: "Rolls-Royce Wraith",
      anchor: "wraith",
    },
    {
      want: "A convertible that retains the brand's quiet authority",
      model: "Rolls-Royce Dawn",
      anchor: "dawn",
    },
    {
      want: "The brand's first ultra-luxury SUV",
      model: "Rolls-Royce Cullinan",
      anchor: "cullinan",
    },
    {
      want: "A flagship limousine with the most imposing proportions",
      model: "Rolls-Royce Phantom VIII",
      anchor: "phantom-viii",
    },
  ],
  models: [
    {
      id: "silver-shadow",
      name: "Rolls-Royce Silver Shadow",
      years: "1965–1976",
      modelFilter: "Silver Shadow",
      paragraphs: [
        "The Silver Shadow brought Rolls-Royce into a more modern era without surrendering the qualities that made the marque distinctive. Its body was lower, more angular and more responsive to design trends of the period, but the proportions still announced that this was something more substantial than an ordinary luxury car.",
        "Its 6.2-litre V8 and automatic transmission delivered the calm, effortless driving experience owners expected. The introduction of disc brakes, independent suspension and a monocoque body made the car more controllable than its predecessors. The result was a Rolls-Royce that could genuinely be used every day.",
        "The interior maintained the brand's standards of leather and timber quality. Later cars added comfort refinements, but the character remained consistent. Choose a Shadow that feels solid and quiet rather than one whose presentation relies on cosmetic refurbishment.",
        "Hydraulic systems, cooling, suspension components, air conditioning and electrical equipment deserve careful assessment. Rust protection and the condition of the body underneath the wheel arches matter more than visible paint quality. Specialist inspection is more valuable than general knowledge for a car of this age.",
      ],
    },
    {
      id: "silver-cloud-iii",
      name: "Rolls-Royce Silver Cloud III",
      years: "1963–1966",
      modelFilter: "Silver Cloud",
      paragraphs: [
        "The Silver Cloud III represents one of the last expressions of an older idea of luxury motoring. Its long bonnet, upright grille and elegant proportions suggest craftsmanship rather than efficiency. It remains one of the most recognisable shapes in the marque's history.",
        "Its 6.2-litre V8 drives through a four-speed automatic transmission, providing the effortless acceleration expected from a car of this character. The driving experience prioritises composure over engagement. A Silver Cloud makes more sense to someone who values presence and tradition than to someone who wants a driver's car.",
        "The cabin is sumptuous by the standards of the early 1960s. Leather and wood combine with straightforward instruments to create an environment that feels special without being intimidating. Air conditioning was offered and is worth seeking.",
        "Mechanical condition requires informed assessment. Chassis condition, suspension, hydraulic and braking systems, cooling and the quality of any restoration deserve particular attention. A genuine, well-maintained Silver Cloud is a different proposition from a presentable example assembled from uncertain history.",
      ],
    },
    {
      id: "silver-spirit",
      name: "Rolls-Royce Silver Spirit",
      years: "1980–1999",
      modelFilter: "Silver Spirit",
      paragraphs: [
        "The Silver Spirit modernised the Rolls-Royce saloon for an era that wanted more usable luxury. Its proportions retained the marque's traditional formality, but the engineering incorporated electronic systems, more efficient climate control and improved handling. It remains one of the most successful Rolls-Royce models.",
        "The 6.75-litre V8 is fundamental to its character, providing effortless torque for overtaking and motorway cruising. The driving experience is calm and detached rather than engaging. A Spirit is meant to insulate its occupants from the road rather than connect them with it.",
        "The cabin is roomy and quiet, with rear-seat comfort remaining a priority. Later variants added features such as more responsive suspension and improved interior equipment. A standard Spirit can be very satisfying, but the Barnato and Silver Spirit II offer worthwhile refinements for buyers with specific preferences.",
        "Hydraulic systems, suspension components, electronic equipment, climate control and electrical reliability deserve attention. Older Spirits in particular benefit from specialist knowledge. A documented, well-maintained example is far more enjoyable than a relatively cheap car whose systems will need attention.",
      ],
    },
    {
      id: "ghost-series-i",
      name: "Rolls-Royce Ghost Series I",
      years: "2010–2020",
      modelFilter: "Ghost",
      paragraphs: [
        "The original Ghost made Rolls-Royce more relevant to a new generation of buyers. It kept the brand's craftsmanship and presence in a slightly smaller, more contemporary package, with a cabin that combined modern technology with the materials expected of the marque.",
        "Its twin-turbocharged 6.6-litre V12 provides effortless performance without drawing attention to the mechanism delivering it. The driving experience is more dynamic than a Phantom's, while retaining the brand's signature composure. All-wheel drive was later added to certain variants.",
        "The interior uses leather, wood and metal in a restrained, modern way. Rear-seat comfort is exceptional for a car of this size. The Ghost is more driver-focused than larger Rolls-Royce models, which makes it a more natural choice for buyers who will spend most of their time behind the wheel.",
        "Air suspension components, electronic systems, infotainment software and engine servicing deserve attention. Some features may require subscription or software updates that are not automatically included in a used car. Confirm the operation of fitted equipment rather than assuming every Ghost has the same features.",
      ],
    },
    {
      id: "ghost-series-ii",
      name: "Rolls-Royce Ghost Series II",
      years: "2020–present",
      modelFilter: "Ghost",
      paragraphs: [
        "The Series II Ghost refined the original's formula with sharper exterior styling, a more substantial presence and a more advanced cabin. It carries Rolls-Royce craftsmanship into an era of greater technological integration while preserving the calm driving experience that defines the brand.",
        "Its twin-turbocharged 6.75-litre V12 provides quiet, effortless performance. All-wheel drive and rear-wheel steering improve both composure and manoeuvrability. The chassis's attention to detail extends to cabin quietness and the quality of the materials used throughout the interior.",
        "The Black Badge variant offers a more assertive character for buyers who want a less restrained interpretation. A standard Ghost Series II is the right starting point for most buyers, while the Black Badge suits those who want performance personality without losing the marque's refinement.",
        "Specify the exact equipment on the individual car rather than assuming it follows from the badge. Rear-seat configuration, infotainment versions and suspension settings can vary significantly. Imported examples should be checked for software compatibility and the availability of regional features.",
      ],
    },
    {
      id: "phantom-vii",
      name: "Rolls-Royce Phantom VII",
      years: "2003–2017",
      modelFilter: "Phantom",
      paragraphs: [
        "The Phantom VII represented a complete rethinking of what a modern Rolls-Royce should be. Its presence is impossible to ignore, the cabin is vast and quiet, and the brand's craftsmanship reached a new level of ambition. It remains the benchmark for traditional flagship luxury motoring.",
        "Its naturally aspirated 6.75-litre V12 provides ample performance with the calm delivery expected from the marque. The driving experience prioritises ride quality and isolation. A Phantom is meant to transport its occupants rather than involve them, and that character has aged remarkably well.",
        "The interior is more than a cabin. It is an environment designed around the occupants' comfort, with rear-seat options that can be configured for almost any preference. Materials and construction quality are exceptional, even when judged against more recent Rolls-Royce models.",
        "Suspension, climate control, electronic systems, infotainment and door operation all deserve careful assessment. Specialist knowledge is more useful than general luxury-car experience. Confirm the car's history, the quality of past maintenance and the completeness of its equipment before forming a final view.",
      ],
    },
    {
      id: "wraith",
      name: "Rolls-Royce Wraith",
      years: "2013–2023",
      modelFilter: "Wraith",
      paragraphs: [
        "The Wraith is the most driver-focused Rolls-Royce in the modern range. Its two-door coupe body has a more intimate character than a Ghost or Phantom, and its roofline makes it more dramatic. It is the right Rolls-Royce for someone who wants to drive rather than be driven.",
        "Its twin-turbocharged 6.6-litre V12 is more powerful than the Ghost's equivalent. The driving experience is more engaging, though still far removed from a conventional sports car. The interior combines the brand's craftsmanship with a more personal atmosphere, particularly in the rear compartment.",
        "A standard Wraith and a Black Badge offer quite different characters. The Black Badge emphasises visual drama and a more assertive performance delivery. Choose the one that matches how the car will actually be used rather than the one that looks more striking in photographs.",
        "Door operation, rear-seat access, infotainment, electronic systems and suspension components all require attention. Some features require software updates or subscription services that may not transfer with the car. Specialist knowledge is particularly valuable when assessing the chassis, given the car's emphasis on driver engagement.",
      ],
    },
    {
      id: "dawn",
      name: "Rolls-Royce Dawn",
      years: "2015–2023",
      modelFilter: "Dawn",
      paragraphs: [
        "The Dawn translates the Ghost's platform into a convertible without losing the calm composure that defines the marque. Its fabric roof operates quietly and the cabin remains quiet even at speed. For buyers who want open-air luxury, the Dawn is more cohesive than many convertible alternatives.",
        "The same twin-turbocharged 6.6-litre V12 used in the Wraith provides effortless performance. All-wheel drive is standard, and the chassis maintains the brand's reputation for ride quality. The driving experience is more about indulging in the moment than engaging with the road.",
        "The cabin uses leather and wood in a way that suits the car's purpose. Rear-seat comfort is good for occasional passengers. The Black Badge Dawn adds visual drama for buyers who prefer a more assertive presentation.",
        "Roof mechanism, sealing, hydraulic components, climate control, suspension and rear-axle systems all require careful assessment. Confirm the operation of folded-roof driving modes and any optional features. Imported examples should be checked for software compatibility and the availability of regional features.",
      ],
    },
    {
      id: "cullinan",
      name: "Rolls-Royce Cullinan",
      years: "2018–present",
      modelFilter: "Cullinan",
      paragraphs: [
        "The Cullinan extended the marque's identity to include an ultra-luxury SUV. It combines the brand's craftsmanship and quiet composure with the practicality of a higher driving position and a more versatile interior. For many buyers, it is now the most usable Rolls-Royce available.",
        "Its twin-turbocharged 6.75-litre V12 provides effortless performance. All-wheel drive and air suspension adapt to a variety of surfaces. The Cullinan is not designed for serious off-road use, but it is more capable than its appearance suggests.",
        "The cabin can be configured for four occupants with individual rear seats or as a five-seat family car. Materials and craftsmanship match the brand's standards. The Black Badge Cullinan offers a more dramatic presentation for buyers who want something less restrained.",
        "Air suspension components, electronic systems, climate control, infotainment, tyres and brakes all deserve attention. Specification varies widely between examples, so confirm features rather than assuming them. For imported cars, verify the availability of regional features and service support.",
      ],
    },
    {
      id: "phantom-viii",
      name: "Rolls-Royce Phantom VIII",
      years: "2018–present",
      modelFilter: "Phantom",
      paragraphs: [
        "The Phantom VIII is the current flagship saloon and represents the most complete expression of modern Rolls-Royce design. Its proportions are imposing and its cabin is more advanced than any previous generation. For buyers who want the most substantial Rolls-Royce available, this is the starting point.",
        "Its twin-turbocharged 6.6-litre V12 provides effortless performance. All-wheel drive and four-wheel steering improve both composure and manoeuvrability. The chassis uses advanced systems to isolate the cabin from road imperfections and external noise.",
        "The interior combines digital technology with traditional craftsmanship. The Gallery, a customisable display panel that spans the fascia, represents one of the most distinctive cabin features in any modern car. Rear-seat configuration can be tailored to specific preferences.",
        "Air suspension, electronic systems, software, climate control and bespoke features require careful assessment. Some features require subscription services or updates. Specialist knowledge is particularly valuable when assessing an example that has been heavily customised.",
      ],
    },
  ],
  howToChoose: {
    title: "How to choose your Rolls-Royce from Japan",
    paragraphs: [
      "Start with the kind of journeys you want to make and the occasions the car will be used for. A Ghost is more appropriate for buyers who will drive most of the time. A Phantom suits buyers who want the most imposing presence and the greatest cabin space. A Wraith or Dawn adds personal character for owners who value individuality.",
      "For classics, decide whether you want the elegance of a Silver Cloud, the usability of a Silver Shadow or the more contemporary character of a Silver Spirit. Restoration quality, specialist support and the availability of parts deserve particular attention with older cars.",
      "Then narrow the search by model year, transmission, interior configuration, mileage, specification and intended use. Confirm the steering position, regional specifications and the availability of features that matter to you.",
      "Mileage should be read alongside maintenance history. A well-documented, regularly serviced example is more reassuring than a low-mileage car with uncertain past care. Specialist pre-purchase inspection is worth considering where structural or mechanical confidence is needed.",
      "ZervTek can visit a vehicle in Japan, obtain additional photographs and videos, ask the dealer questions supplied by the customer, and review available maintenance records and Japanese registration history. Once you select a car, ZervTek can coordinate purchase, inland transport, export paperwork and insured RoRo or container shipping.",
      "Import eligibility and registration requirements should be confirmed for the destination before committing to a purchase, particularly for heavily customised cars or those with advanced technology features.",
    ],
  },
  faqs: [
    {
      q: "What is the best Rolls-Royce to buy for a first-time owner?",
      a: "A Ghost Series I or II is a strong starting point for buyers new to the marque. It combines modern driving dynamics with the craftsmanship expected of a Rolls-Royce. A Silver Shadow is a sensible introduction to classic Rolls-Royce ownership for buyers prepared for older-car considerations.",
    },
    {
      q: "Is the Ghost better than the Phantom?",
      a: "The Ghost is more manageable and more driver-focused. The Phantom is larger, more imposing and more appropriate for buyers who want the most substantial presence. Choose according to the kind of ownership experience you want rather than assuming the flagship is automatically the right answer.",
    },
    {
      q: "What is the best classic Rolls-Royce to buy?",
      a: "The Silver Shadow is the most approachable classic. The Silver Cloud III is more elegant but more demanding to own. The Silver Spirit is more usable but less characterful. Specialist maintenance, structural condition and restoration quality matter more than which classic badge is chosen.",
    },
    {
      q: "Is the Wraith a good daily driver?",
      a: "It is more driver-focused than other Rolls-Royce models, but it remains a large coupe. Its size, two-door configuration and reduced rear visibility make it less practical for daily use than a Ghost. For regular driving, the Ghost is generally more accommodating.",
    },
    {
      q: "Which Rolls-Royce is best for families?",
      a: "The Cullinan offers the most versatile interior for family use. The Phantom provides more rear-seat space but less luggage room. The Ghost is a reasonable compromise for buyers who prefer a saloon. Practicality, not just badge, should guide the choice.",
    },
    {
      q: "Can ZervTek source a Rolls-Royce from Japan?",
      a: "Yes. ZervTek can search Japanese dealer stock and auctions against your requirements, obtain further vehicle information and coordinate purchase and export. Availability, specification and destination eligibility must be confirmed for each car.",
    },
  ],
  closing: {
    title: "Find your Rolls-Royce from Japan",
    body: "Tell ZervTek which Rolls-Royce interests you, your preferred model year, interior and exterior configuration, mileage range and destination. Whether you want the elegant proportions of a Silver Cloud, the usability of a Silver Spirit, the modern refinement of a Ghost or the imposing presence of a Phantom, the aim is to find a car whose character and condition match the experience you want.",
  },
} as const;

export const ROLLS_ROYCE_MODEL_GUIDES: Record<string, MakeModelGuide> = {};

export function getRollsRoyceModelGuide(model: string): MakeModelGuide | null {
  return lookupModelGuide(ROLLS_ROYCE_MODEL_GUIDES, model);
}

export function rollsRoyceStockHref(model?: string): string {
  return buildStockHref({ make: "Rolls-Royce", model: model || undefined });
}
