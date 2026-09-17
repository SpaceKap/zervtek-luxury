/** Editorial content for the Bentley make hub at /stock/bentley */

import { buildStockHref } from "@/lib/stock";
import { lookupModelGuide, type MakeModelGuide } from "@/lib/make-hubs/types";

export const BENTLEY_HUB = {
  make: "Bentley",
  slug: "bentley",
  title: "Best Bentley to Buy & Import from Japan",
  description:
    "The best Bentley to buy and import from Japan — Turbo R, Arnage, Continental GT, Flying Spur, Mulsanne and Bentayga. Browse stock or ask ZervTek to source and export.",
  h1: "Best Bentley to Buy & Import",
  intro:
    "A Bentley should make a long journey feel shorter, not turn every journey into a performance test. Choose between traditional saloons, Continental grand tourers, the Mulsanne, Flying Spur or Bentayga — Japan is a useful place to search.",
  lead: [
    "A Bentley should make a long journey feel shorter, not turn every journey into a performance test. That is what separates the marque’s best cars from luxury cars that happen to be fast. The appeal is in the combination: substantial controls, beautifully finished cabins and an engine that rarely seems to be working very hard.",
    "But there are two quite different Bentley experiences. A Turbo R or Arnage delivers the upright driving position, deep windows and unhurried authority of the traditional British luxury saloon. A Continental GT sits lower, grips harder and makes its performance easier to use. The Mulsanne carries the older philosophy into a more modern car, while the Flying Spur and Bentayga make Bentley ownership fit around passengers and everyday life.",
    "The best Bentley to buy depends on which of those experiences you want. Choose well and the car’s character lasts far longer than the novelty of its specification. Choose only by appearance or mileage and a complicated ownership proposition can hide behind some very handsome woodwork.",
  ],
  shortAnswer: {
    title: "The short answer",
    paragraphs: [
      "For most buyers, the Continental GT V8 is the strongest starting point. It combines genuine grand-touring comfort with a more responsive character than the badge’s size and weight might suggest.",
      "Choose the Continental GT W12 if the engine is central to the attraction. For traditional Bentley character, start with the Turbo R or Arnage. The Mulsanne is the more complete choice for someone who wants that sense of occasion with a newer cabin and greater refinement.",
      "The Flying Spur makes the most sense when rear passengers matter. The Bentayga V8 is the practical everyday option. For a classic two-door Bentley, the Continental R and Azure offer an experience the modern range does not directly replace.",
    ],
  },
  comparison: [
    {
      want: "Traditional Bentley character with meaningful performance",
      model: "Bentley Turbo R",
      anchor: "turbo-r",
    },
    {
      want: "A substantial, distinctive classic coupe",
      model: "Bentley Continental R",
      anchor: "continental-r",
    },
    {
      want: "Open-top touring with old-school craftsmanship",
      model: "Bentley Azure",
      anchor: "azure",
    },
    {
      want: "A traditional luxury saloon with enormous engine character",
      model: "Bentley Arnage",
      anchor: "arnage",
    },
    {
      want: "The original modern Bentley grand tourer",
      model: "First-generation Bentley Continental GT",
      anchor: "continental-gt",
    },
    {
      want: "A well-rounded coupe with a more responsive feel",
      model: "Second-generation Bentley Continental GT V8",
      anchor: "continental-gt-v8",
    },
    {
      want: "A more modern interpretation of the W12 grand tourer",
      model: "Third-generation Bentley Continental GT W12",
      anchor: "continental-gt-w12",
    },
    {
      want: "A luxury saloon that still rewards its driver",
      model: "Third-generation Bentley Flying Spur",
      anchor: "flying-spur",
    },
    {
      want: "The definitive modern traditional Bentley",
      model: "Bentley Mulsanne",
      anchor: "mulsanne",
    },
    {
      want: "Bentley comfort in a more versatile everyday shape",
      model: "Bentley Bentayga V8",
      anchor: "bentayga-v8",
    },
  ],
  models: [
    {
      id: "turbo-r",
      name: "Bentley Turbo R",
      years: "1985–1997",
      modelFilter: "Turbo R",
      paragraphs: [
        "The Turbo R is where traditional Bentley luxury acquires some welcome determination. Its upright body, broad grille and generous glass area belong to an older idea of expensive motoring, but the chassis has more purpose than the shape initially suggests. It feels substantial without being content merely to float.",
        "The turbocharged 6.75-litre V8 defines the experience. There is little incentive to chase engine speed when so much of the car’s performance arrives as a deep, sustained surge. Rear-wheel drive and an automatic transmission suit that character. You guide the car into a flowing rhythm rather than try to make it behave like a smaller sports saloon.",
        "The cabin is just as important as the engine. Real wood, generous seats and a relatively upright seating position create a sense of space that many modern luxury cars have traded for lower rooflines and thicker consoles.",
        "Buy on maintenance rather than polish. Hydraulic braking and suspension systems, cooling, corrosion, electrical equipment and aged rubber components deserve specialist attention. A Turbo R with modest mileage but long periods of inactivity is not automatically preferable to one that has been used and maintained consistently.",
      ],
    },
    {
      id: "continental-r",
      name: "Bentley Continental R",
      years: "1991–2003",
      modelFilter: "Continental R",
      paragraphs: [
        "The Continental R looks like a Bentley that was designed as a coupe from the beginning, rather than a saloon with two doors removed. Its long bonnet, substantial rear quarters and more intimate roofline give it an identity of its own. It is elegant, but never delicate.",
        "The turbocharged 6.75-litre V8 sends its power to the rear wheels through an automatic gearbox. The driving experience is about sustained acceleration and long-distance composure, not rapid gear changes or high engine speeds. It is a car for covering ground with very little visible effort.",
        "Compared with a Continental GT, the Continental R feels more traditional and more individual. The cabin has the atmosphere of a low-volume luxury car, and the proportions give it a presence that does not depend on modern lighting or oversized wheels.",
        "Its age and specialist components need to be taken seriously. Body condition, hydraulic systems, cooling, suspension and the completeness of the interior deserve close scrutiny. Missing or damaged trim can become a substantial part of a restoration. Choose a Continental R because you want this particular kind of Bentley, not because you expect it to behave like a newer one.",
      ],
    },
    {
      id: "azure",
      name: "Bentley Azure",
      years: "1995–2003",
      modelFilter: "Azure",
      paragraphs: [
        "The first Azure offers something increasingly unusual: a large, genuinely luxurious convertible that does not need to pretend it is a sports car. With the roof down, its long body and broad cabin make open-air driving feel relaxed rather than exposed.",
        "Its turbocharged 6.75-litre V8 and rear-wheel-drive layout suit that role. There is ample performance, but the pleasure comes from how little effort is required. The automatic gearbox, deep seats and substantial controls encourage an unhurried approach even when the car is moving briskly.",
        "The Azure makes particular sense for someone who likes the Continental R’s craftsmanship but wants a different kind of occasion. It is not the neatest choice for tight roads or cramped parking. Its size is part of both the appeal and the compromise.",
        "Roof operation deserves more than a quick demonstration. Hydraulic components, seals, drainage, hood condition and evidence of water ingress all matter. Add body structure, cooling, suspension and interior condition to the assessment. A beautiful convertible can conceal expensive neglect beneath carpets and trim.",
      ],
    },
    {
      id: "arnage",
      name: "Bentley Arnage",
      years: "1998–2009",
      modelFilter: "Arnage",
      paragraphs: [
        "The Arnage is the Bentley for someone who thinks a luxury saloon should look like a luxury saloon. The bonnet is long, the grille is upright and the cabin is arranged around people rather than a sweeping touchscreen. It has authority without needing an aggressive body kit.",
        "Understanding the engine is essential. Early Arnage models used a 4.4-litre twin-turbo V8, while the Red Label and later R and T versions used Bentley’s 6.75-litre V8. These are meaningfully different buying propositions, not simply alternative trim levels.",
        "For many enthusiasts, the later 6.75-litre cars deliver the experience they associate with Bentley: enormous low-speed torque, a relaxed automatic transmission and rear-wheel-drive composure. The Arnage T gives that formula a more assertive edge, while the R leans towards traditional refinement.",
        "This is a car to choose with documentation and specialist support in mind. Cooling, engine maintenance, suspension, brakes, climate control and electrical equipment all deserve attention. The quality of the leather and wood can be seductive, but a convincing cabin is not a substitute for a convincing maintenance history.",
      ],
    },
    {
      id: "continental-gt",
      name: "Bentley Continental GT",
      years: "2003–2011",
      modelFilter: "Continental GT",
      paragraphs: [
        "The original Continental GT changed what a Bentley could be used for. It retained the substantial cabin and effortless performance, then added all-wheel drive, a more compact coupe body and a level of usability that made regular driving a more natural proposition.",
        "Its 6.0-litre twin-turbo W12 is the central attraction. It does not need to sound dramatic to make its presence felt. The delivery is broad and persistent, turning overtaking and long climbs into brief interruptions rather than events requiring preparation.",
        "The proportions have aged well. The rounded nose, muscular rear quarters and compact glasshouse give the car a recognisable silhouette without relying on sharp creases. Inside, the driving position feels more enclosed than an Arnage’s, but also more connected to the road.",
        "Complexity is the compromise. Air suspension, cooling, drivetrain servicing, electrical equipment and water ingress should all form part of the buying assessment. The rear seats are useful, but they do not turn it into a substitute for a Flying Spur. Buy it as a two-person grand tourer with occasional extra accommodation.",
      ],
    },
    {
      id: "continental-gt-v8",
      name: "Bentley Continental GT V8",
      years: "2012–2018",
      modelFilter: "Continental GT",
      paragraphs: [
        "The second-generation Continental GT V8 may be the easiest Bentley to recommend without immediately adding a long explanation. It retains the cabin quality and long-distance ability people want from the marque, but the 4.0-litre twin-turbo V8 gives it a more vocal, responsive personality.",
        "All-wheel drive remains part of the formula. The V8 does not transform the Continental into a lightweight sports car, but it makes the car feel more willing to change pace. There is a clearer connection between the engine’s sound and the driver’s input, which can make an ordinary road more involving.",
        "That balance is its strength. It can be quiet and composed over a long distance, then become entertaining without asking its occupants to tolerate an unnecessarily harsh ride. The V8 S adds a firmer, more purposeful interpretation, although the standard V8 should not be dismissed.",
        "Service history, turbocharger-related maintenance, cooling, air suspension and gearbox servicing deserve attention. Wheel specification matters too. A car that looks especially dramatic in photographs may not provide the ride quality you want on the roads you actually use.",
      ],
    },
    {
      id: "continental-gt-w12",
      name: "Bentley Continental GT W12",
      years: "2018–2024",
      modelFilter: "Continental GT",
      paragraphs: [
        "The third-generation Continental GT makes the W12 formula feel more cohesive. The body is cleaner, the cabin is more contemporary and the chassis gives the driver greater confidence without abandoning the car’s grand-touring purpose.",
        "The 6.0-litre twin-turbo W12 remains wonderfully suited to the idea of an effortless coupe. All-wheel drive and an eight-speed dual-clutch transmission make its performance readily accessible. The attraction is not simply speed; it is the sense that the car has more in reserve than a journey is likely to demand.",
        "This is the Continental for a buyer who wants the distinctive W12 experience without stepping as far back in cabin technology and road behaviour. A GT Speed takes the driver-focused side further, but a standard W12 can be the better match for someone whose priority is relaxed touring.",
        "Specification requires careful comparison. Chassis equipment, seating functions, audio systems and interior options vary. Check the operation of fitted equipment rather than assuming every car has the same features. Brakes, tyres, suspension systems and electronic diagnostics also belong in a serious pre-purchase assessment.",
      ],
    },
    {
      id: "flying-spur",
      name: "Bentley Flying Spur",
      years: "2019–2024",
      modelFilter: "Flying Spur",
      paragraphs: [
        "The third-generation Flying Spur is more than a Continental with additional doors. Its longer, more formal proportions give it a different purpose, and the cabin makes a stronger case for bringing passengers along.",
        "The W12 version offers exceptional ease, while the V8 gives the saloon a slightly different character without removing its long-distance authority. Plug-in hybrid versions exist too, making it important to identify the exact powertrain rather than judge every Flying Spur by the same expectations.",
        "Its achievement is making a large saloon feel interesting from the front seat without compromising the reason someone would sit in the back. Rear-wheel steering helps make its dimensions more manageable, although no chassis system can make a large car physically small.",
        "Choose around the way it will be used. Rear-seat configuration, comfort functions and luggage requirements deserve as much attention as engine choice. For an imported example, confirm regional compatibility of connected features, navigation and any charging requirements. Service support and software history matter alongside the usual mechanical checks.",
      ],
    },
    {
      id: "mulsanne",
      name: "Bentley Mulsanne",
      years: "2010–2020",
      modelFilter: "Mulsanne",
      paragraphs: [
        "The Mulsanne is the Bentley for someone who wants the traditional formula developed rather than replaced. Its upright nose, long bonnet and imposing proportions suggest exactly what the cabin delivers: space, craftsmanship and a remarkable separation from ordinary traffic.",
        "The 6.75-litre twin-turbo V8 is fundamental to that personality. It produces its performance with little apparent strain, driving the rear wheels through an eight-speed automatic transmission. A Mulsanne does not need to feel frantic to feel immensely capable.",
        "The cabin rewards attention. The timber, metal controls, seat construction and detailing matter because they remain part of every journey. This is not a car whose appeal disappears when a newer infotainment system arrives elsewhere.",
        "The Mulsanne Speed adds a more assertive interpretation, but the standard car already expresses the idea convincingly. Focus on maintenance, air suspension, cooling, brakes and the operation of every comfort feature. Extended Wheelbase versions deserve a separate practical assessment: additional rear-seat space also means additional car to accommodate.",
      ],
    },
    {
      id: "bentayga-v8",
      name: "Bentley Bentayga V8",
      years: "2018–2024",
      modelFilter: "Bentayga",
      paragraphs: [
        "The Bentayga V8 is the sensible Bentley, provided sensible is understood in the context of a large luxury SUV. It offers easier access, a useful luggage area and a more adaptable cabin without removing the sense that the interior was a major part of the engineering brief.",
        "The 4.0-litre twin-turbo V8 suits everyday use particularly well. It has the response and sound to keep the driver interested, while all-wheel drive and an automatic transmission make its performance straightforward to access.",
        "Its greater versatility does not make specification unimportant. Seating arrangements, comfort equipment and chassis options can change how well an individual car fits a family or a regular travel routine. The facelifted cars also bring meaningful cabin and technology changes, so a model name alone is not enough to compare examples.",
        "Check air suspension operation, cooling, brakes, tyres and electronic equipment. Look for signs of hard use rather than assuming an expensive SUV has led an easy life. The right Bentayga is not necessarily the most heavily optioned one. It is the one whose condition and configuration fit the work you expect it to do.",
      ],
    },
  ],
  howToChoose: {
    title: "How to choose your Bentley from Japan",
    paragraphs: [
      "Start with the experience you want to preserve.",
      "For traditional proportions and mechanical character, look at the Turbo R, Continental R, Azure and Arnage. For a coupe that can fit more naturally into regular use, compare the Continental GT generations. If passengers are central to the brief, concentrate on the Flying Spur or Mulsanne. If versatility comes first, begin with the Bentayga.",
      "Then narrow the search by engine, steering position, body style, interior specification and maintenance history. Do not assume a vehicle offered in Japan has a particular steering configuration or an unusually easy ownership history. Confirm the individual car.",
      "Mileage should be read alongside servicing and use. A lightly used Bentley can still need extensive attention to aged suspension components, seals, cooling systems and electronics. A more regularly driven example with consistent documentation may be the more reassuring choice.",
      "ZervTek can visit a vehicle in Japan, obtain additional photographs and videos, ask the dealer questions supplied by the customer, and review available maintenance records and Japanese registration history. Once a vehicle is selected, ZervTek can coordinate purchase, inland transport, export paperwork and insured RoRo or container shipping.",
      "Import eligibility and registration requirements should be confirmed for the destination before committing to a purchase.",
    ],
  },
  faqs: [
    {
      q: "What is the best Bentley to buy for a first-time owner?",
      a: "The second-generation Continental GT V8 is a strong starting point. It combines Bentley’s cabin quality and touring ability with an engaging engine and a comparatively modern driving experience. Condition and service history remain more important than choosing a particular badge.",
    },
    {
      q: "Should I buy a Bentley Continental GT V8 or W12?",
      a: "Choose the V8 if you value a more pronounced engine note and responsive character. Choose the W12 if you want the distinctive smoothness and effortless delivery associated with the modern Continental. Compare cars from the same generation before drawing conclusions, because chassis and transmission changes also affect the experience.",
    },
    {
      q: "What is the best classic Bentley to buy?",
      a: "The Turbo R is a convincing introduction to traditional Bentley ownership. The Continental R offers a more distinctive coupe body, while the Azure adds open-top touring. For all three, specialist maintenance, structural condition and complete trim matter more than cosmetic presentation alone.",
    },
    {
      q: "Is the Bentley Arnage better than the Mulsanne?",
      a: "The Arnage offers a more overtly old-school experience. The Mulsanne develops the traditional Bentley saloon with newer engineering, greater refinement and a more modern cabin. Choose according to the character you want, then assess the individual car’s condition and support requirements.",
    },
    {
      q: "Which Bentley is best for everyday use?",
      a: "The Bentayga V8 offers the greatest versatility, particularly where access, luggage and passengers matter. The Flying Spur is the stronger choice for buyers who prefer a saloon. A Continental GT works well for regular use when its two-door layout and rear-seat space suit the owner.",
    },
    {
      q: "Can ZervTek source a Bentley from Japan?",
      a: "Yes. ZervTek can search Japanese dealer stock and auctions against your brief, obtain further vehicle information and help coordinate the purchase and export process. Availability, specification and destination eligibility must be confirmed for each vehicle.",
    },
  ],
  closing: {
    title: "Find your Bentley from Japan",
    body: "Tell us the model, spec, and destination. We'll search Japan for you.",
  },
} as const;

export const BENTLEY_MODEL_GUIDES: Record<string, MakeModelGuide> = {};

export function getBentleyModelGuide(model: string): MakeModelGuide | null {
  return lookupModelGuide(BENTLEY_MODEL_GUIDES, model);
}

export function bentleyStockHref(model?: string): string {
  return buildStockHref({ make: "Bentley", model: model || undefined });
}
