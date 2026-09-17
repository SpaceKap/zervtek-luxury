/** Editorial content for the Lotus make hub at /stock/lotus */

import { buildStockHref } from "@/lib/stock";
import { lookupModelGuide, type MakeModelGuide } from "@/lib/make-hubs/types";

export const LOTUS_HUB = {
  make: "Lotus",
  slug: "lotus",
  title: "Best Lotus to Buy & Import from Japan",
  description:
    "The best Lotus cars to buy and import from Japan, from the Elan and Esprit to the Elise, Exige, Evora and Emira, with practical model comparisons and buying advice.",
  h1: "Best Lotus to Buy & Import",
  intro:
    "A good Lotus makes you notice the road again — not because it overwhelms you with power, but because the steering, pedals and chassis give you something meaningful to do. Japan is a useful place to search from Elan and Esprit through Elise, Exige, Evora and Emira.",
  lead: [
    "A good Lotus makes you notice the road again. Not because it overwhelms you with power, but because the steering, pedals and chassis give you something meaningful to do. A corner that feels ordinary in a heavier car can become the reason you take the longer route home.",
    "That is why the best Lotus to buy is not necessarily the fastest. An early Elise can be more satisfying at sensible speeds than something with several times its power. An Elan makes delicacy feel like an engineering achievement. An Esprit adds the low seating position and drama of an exotic coupe, while an Evora proves that ride comfort does not have to come at the expense of steering feel.",
    "There are compromises. Access can be awkward, storage can be limited and the quality of previous repairs matters enormously. But choosing a Lotus is not about accepting inconvenience for the sake of a badge. It is about deciding which distractions you are happy to remove from the driving experience.",
  ],
  shortAnswer: {
    title: "The short answer",
    paragraphs: [
      "For a first Lotus, start with a Toyota-powered Elise if you want a compact weekend sports car, or an Evora if you need something more comfortable over a long distance.",
      "The Elise S1 offers the simplest modern interpretation of the marque. The Exige V6 is the more intense choice, with a supercharged engine and a chassis that makes sense to an experienced driver. The Emira V6 manual combines familiar Lotus priorities with a more accommodating cabin.",
      "For a classic, choose the Elan for its agility or the Turbo Esprit for its shape and sense of occasion. The Esprit V8 is a different proposition again: more engine, greater complexity and a stronger need for specialist understanding.",
    ],
  },
  comparisonTitle: "Ten Lotus cars worth searching for",
  comparison: [
    {
      want: "An uncompromising introduction to the original Lotus idea",
      model: "Lotus Seven",
      anchor: "seven",
    },
    {
      want: "A classic defined by delicate steering and low weight",
      model: "Lotus Elan",
      anchor: "elan",
    },
    {
      want: "An unusual, compact mid-engined classic",
      model: "Lotus Europa Twin Cam or Special",
      anchor: "europa",
    },
    {
      want: "The definitive wedge-shaped Lotus with turbocharged performance",
      model: "Lotus Turbo Esprit",
      anchor: "turbo-esprit",
    },
    {
      want: "A later Esprit with a more substantial engine character",
      model: "Lotus Esprit V8",
      anchor: "esprit-v8",
    },
    {
      want: "The purest modern lightweight Lotus experience",
      model: "Lotus Elise S1",
      anchor: "elise-s1",
    },
    {
      want: "A weekend sports car with a wider choice of power and equipment",
      model: "Toyota-powered Lotus Elise",
      anchor: "elise-toyota",
    },
    {
      want: "A focused road and track car with serious performance",
      model: "Lotus Exige V6",
      anchor: "exige-v6",
    },
    {
      want: "A Lotus for longer journeys without losing steering feel",
      model: "Lotus Evora",
      anchor: "evora",
    },
    {
      want: "A more modern cabin around a traditional mid-engined sports-car layout",
      model: "Lotus Emira",
      anchor: "emira",
    },
  ],
  models: [
    {
      id: "seven",
      name: "Lotus Seven",
      years: "1957–1973",
      modelFilter: "Seven",
      paragraphs: [
        "The Seven asks a question that most modern sports cars avoid: how much car do you actually need? The narrow body, exposed wheels and low seating position leave very little between the driver and the surroundings. Even modest performance feels vivid when the machinery is so close and so little is isolated from view.",
        "Engines and specifications vary considerably across the Lotus-built series, but the common ingredients are low weight, rear-wheel drive and direct controls. The pleasure is not confined to acceleration. You feel the effects of a steering input or a change in throttle almost immediately.",
        "It is also a specialist classic rather than a straightforward alternative to an Elise. Weather protection, luggage space and occupant comfort need to match your expectations before the search begins. Try the driving position rather than assuming that a small car will accommodate every driver.",
        "Identity is particularly important. A Lotus-built Seven is not the same purchase as a later Caterham or another Seven-style car. Establish chassis provenance, construction history, engine specification and the quality of any restoration. The right example offers an unusually direct connection to the marque's beginnings; an unclear identity can make ownership and registration much more complicated.",
      ],
    },
    {
      id: "elan",
      name: "Lotus Elan",
      years: "1962–1973",
      modelFilter: "Elan",
      paragraphs: [
        "The original two-seat Elan is proof that a memorable sports car does not need intimidating dimensions. Its compact body, fine pillars and restrained detailing look almost modest until you sit behind the wheel and discover how little effort is required to place it on the road.",
        "A Lotus-Ford twin-cam four-cylinder engine, rear-wheel drive and a manual gearbox give it a lively mechanical personality. But the real attraction is the relationship between the steering, suspension and low mass. The car feels responsive without needing to be harsh, and engaging without making every journey an endurance exercise.",
        "The Sprint is especially appealing for buyers who want the later, more powerful development of the original idea. A well-sorted earlier Elan can be just as rewarding, however. Restoration quality matters more than choosing the most desirable name on the boot.",
        "The steel backbone chassis, suspension mounting areas, glassfibre body, cooling and electrical systems deserve informed assessment. Clarify any replacement chassis or drivetrain modifications and how they are documented. A rebuilt Elan can be a wonderful driver's car, but originality, usability and collector appeal are not always the same thing.",
      ],
    },
    {
      id: "europa",
      name: "Lotus Europa Twin Cam and Special",
      years: "1971–1975",
      modelFilter: "Europa",
      paragraphs: [
        "The Europa is not an obvious beauty, and that is part of its appeal. Its exceptionally low body and unusual rear proportions make it look like an engineering solution before a styling exercise. It is a car for someone who enjoys understanding why things are the way they are.",
        "The Twin Cam and later Special bring Lotus-Ford twin-cam power to the Europa's mid-engined, rear-wheel-drive layout. The seating position is low and the cockpit compact. Rather than surrounding the driver with luxury, it concentrates attention on the road and the car's balance.",
        "It makes sense for a classic buyer who wants something more unusual than a conventional roadster. The Special adds further appeal, but a black-and-gold paint scheme alone does not establish a particular edition or provenance. Buy the documented specification rather than the visual suggestion.",
        "Check chassis condition, cooling, drivetrain installation, gear linkage and the quality of previous body repairs. Cabin fit is also a real buying consideration. A Europa that is fascinating to look at is not automatically comfortable for the person who intends to drive it.",
      ],
    },
    {
      id: "turbo-esprit",
      name: "Lotus Turbo Esprit",
      years: "1980–1987",
      modelFilter: "Esprit",
      paragraphs: [
        "The Giugiaro-era Turbo Esprit is the Lotus that looks most like a childhood idea of a supercar. Its low nose, flat surfaces and sharp edges are unapologetically geometric. The view from the driver's seat is similarly distinctive: low to the ground, with the road framed by a broad, shallow windscreen.",
        "The turbocharged 2.2-litre four-cylinder engine gives the shape the performance it deserves. It delivers a different rhythm from a naturally aspirated sports car, with boost becoming part of how you plan an overtake or accelerate out of a bend. The mid-engined layout and rear-wheel drive keep the chassis central to the experience.",
        "This is the Esprit for someone who values design and mechanical character as much as outright speed. It feels more demanding than a modern coupe, but that involvement is precisely what makes a good example memorable.",
        "Early and later cars differ in lubrication and other mechanical details, so establish the exact specification. Timing-belt maintenance, cooling, fuel systems, turbocharger condition, exhaust components and gearbox behaviour all matter. The wedge body does not reveal everything underneath it. Clear records and an assessment by an Esprit specialist are more useful than a convincing shine.",
      ],
    },
    {
      id: "esprit-v8",
      name: "Lotus Esprit V8",
      years: "1996–2004",
      modelFilter: "Esprit",
      paragraphs: [
        "The Esprit V8 gives the long-running Lotus supercar a more substantial engine character without abandoning its compact, low-slung appearance. The later bodywork is softer than the original wedge, but the silhouette remains immediately recognisable.",
        "Its 3.5-litre twin-turbo V8 sits behind the occupants and drives the rear wheels through a manual gearbox. The attraction is not simply having more cylinders. The broader delivery changes the way the car gathers speed, making it feel like a more muscular development of the Esprit rather than an entirely different idea.",
        "A standard V8 is already an interesting enthusiast purchase. Limited variants such as the Sport 350 add their own appeal, but rarity should not distract from the quality of the individual car. A special badge cannot compensate for uncertain mechanical history.",
        "Engine work, cooling-system condition, timing-belt records and the treatment of the transmission require particular attention. Poorly documented power increases deserve caution. This is a Lotus to buy with access to genuine model expertise, not on the assumption that every independent workshop will know it well.",
      ],
    },
    {
      id: "elise-s1",
      name: "Lotus Elise S1",
      years: "1996–2001",
      modelFilter: "Elise",
      paragraphs: [
        "The first Elise strips the sports car back without making it feel unfinished as an idea. The rounded body is small, the cabin exposes its aluminium structure and the low driving position makes the front wheels feel reassuringly close. There is very little ceremony before the driving begins.",
        "A mid-mounted 1.8-litre Rover K-series engine, manual gearbox and rear-wheel drive are enough because the car has so little mass to move. The steering is unassisted and full of detail. You do not need to approach the car's limits to understand why it matters.",
        "The standard Elise deserves consideration alongside the more powerful versions. On a narrow road, its responsiveness and balance can matter far more than another increment of acceleration. This is the Lotus for someone who values the quality of each input rather than the size of the performance figures.",
        "The bonded aluminium chassis needs careful assessment for damage and corrosion, while the steel rear subframe and suspension components deserve separate attention. Cooling-system condition and evidence of head-gasket work are important on the Rover engine. Confirm appropriate timing-belt maintenance and do not dismiss repaired clamshells without understanding what caused the damage beneath them.",
      ],
    },
    {
      id: "elise-toyota",
      name: "Toyota-powered Lotus Elise",
      years: "2004–2021",
      modelFilter: "Elise",
      paragraphs: [
        "Toyota-powered Elises broaden the choice without removing the qualities that made the original work. Depending on version, you can have a high-revving naturally aspirated engine or the stronger mid-range response of a supercharger, with different levels of equipment and road or track emphasis.",
        "The 111R and later R reward a driver who enjoys using engine speed and working through a manual gearbox. Supercharged versions make their extra performance available in a different way. Cars such as the Sport 220 and Sport 240 Final Edition offer a particularly attractive combination of small dimensions and accessible performance.",
        "The later cabin remains compact, the steering remains unassisted and access still requires some commitment. Air conditioning and additional equipment make a difference, but they do not turn an Elise into a conventional everyday coupe. A Cup version's aerodynamic equipment and more focused setup should suit your intended use, not merely your preferred appearance.",
        "Toyota engines do not remove the need to inspect the rest of the car. Suspension wear, gearbox synchros, chassis condition, accident repairs and air-conditioning faults can all influence a purchase. Establish the exact engine and specification rather than assuming every Series 2 Elise is Toyota-powered or every later car is supercharged.",
      ],
    },
    {
      id: "exige-v6",
      name: "Lotus Exige V6",
      years: "2012–2021",
      modelFilter: "Exige",
      paragraphs: [
        "The V6 Exige takes the small Lotus cabin and places a much more serious engine behind it. The enlarged rear bodywork, purposeful stance and more forceful soundtrack make the change obvious before the car has travelled very far.",
        "Its supercharged 3.5-litre Toyota-derived V6 gives it a different personality from the four-cylinder cars. There is greater urgency, stronger delivery and a sense that the chassis expects the driver to pay attention. Rear-wheel drive and, in many examples, a manual gearbox keep the interaction satisfyingly mechanical.",
        "The Sport 350 and Sport 410 are compelling starting points. The Cup 430 adds a more extreme interpretation, but the best road car for a particular owner is not automatically the most aggressive version. Ride, tyre choice, ground clearance and intended circuit use should influence the decision.",
        "Look carefully at evidence of track preparation and maintenance rather than treating all circuit use as equally concerning. Suspension condition, brakes, tyres, cooling and gearbox operation deserve proper assessment. Splitters and bodywork are vulnerable, and the bonded chassis requires informed inspection. The Exige rewards commitment, but it is not an Elise with the inconvenience edited out.",
      ],
    },
    {
      id: "evora",
      name: "Lotus Evora",
      years: "2009–2021",
      modelFilter: "Evora",
      paragraphs: [
        "The Evora may be the most persuasive answer to the idea that a Lotus has to be uncomfortable. Its cabin is more accommodating than an Elise's, and the ride can be remarkably supple without dulling the steering. It makes a long journey feel like part of the reason to own the car.",
        "The mid-mounted 3.5-litre Toyota-derived V6 was offered in naturally aspirated and supercharged forms. Hydraulic power steering preserves the detail that matters, while the larger body and more substantial seats make the car easier to live with. Some versions have a 2+2 layout, though the rear seats are small and should be judged accordingly.",
        "Later developments such as the Evora 400 and GT410 Sport bring their own balance of performance, equipment and focus. A manual is appealing for involvement, while an automatic may better suit another buyer's use. Confirm the seating arrangement and transmission on the individual car rather than assuming they follow from the model name.",
        "Clutch history, gear selection, cooling, suspension, air conditioning, door seals and electrical equipment are all worth attention. Access to certain mechanical components can make apparently ordinary work more involved. A documented car with functioning cabin equipment is a stronger touring proposition than one whose owner has excused every fault as part of the Lotus experience.",
      ],
    },
    {
      id: "emira",
      name: "Lotus Emira",
      years: "2021–present",
      modelFilter: "Emira",
      paragraphs: [
        "The Emira gives Lotus a more contemporary shape without losing the appeal of a mid-engined two-seat sports car. Its sculpted sides and compact cabin have more visual drama than the Evora, while the interior makes a more convincing attempt to accommodate everyday expectations.",
        "Engine choice changes the experience. The supercharged 3.5-litre V6 offers a familiar Lotus soundtrack and the option of a manual gearbox. The turbocharged 2.0-litre four-cylinder uses a dual-clutch transmission and delivers a different combination of response and gear changes. Neither should be chosen purely by counting cylinders.",
        "For the enthusiast who wants a manual Lotus but finds an Elise too restrictive, the V6 is an obvious place to start. Hydraulic steering and a chassis developed around driver feedback retain a connection with the older cars, even though the Emira is more substantial and better equipped.",
        "Compare suspension and tyre specifications with care. A setup intended for more demanding use may not be the one you prefer on ordinary roads. Service history, software updates, completion of applicable campaigns and the operation of cabin equipment belong in the buying process. For an imported example, confirm warranty and service support rather than assuming they transfer unchanged between markets.",
      ],
    },
  ],
  howToChoose: {
    title: "How to choose your Lotus from Japan",
    paragraphs: [
      "Start with the journeys you genuinely want to make. For short, absorbing drives, an Elise can be difficult to improve upon. For regular longer trips, an Evora or Emira may give you more opportunities to enjoy the car. For track-focused use, an Exige deserves consideration, but its specification should match your experience and plans.",
      "A classic requires a different brief. An Elan, Europa or Esprit should be chosen for the particular mechanical and visual experience it offers, with realistic expectations about age, restoration and specialist support.",
      "Then narrow the search by engine, transmission, steering position, mileage, body style and modifications. Registration year alone does not always identify a Lotus's precise production specification. Model identity, chassis details and available records should agree.",
      "Condition is especially important on lightweight cars. Attractive paint cannot establish the health of a bonded chassis, and low mileage does not prove correct suspension geometry or careful storage. A specialist pre-purchase inspection should be considered separately where structural or mechanical assessment is needed.",
      "ZervTek can visit a vehicle in Japan, obtain additional photographs and videos, ask the dealer questions supplied by the customer, and review available maintenance records and Japanese registration history. Once you select a car, ZervTek can coordinate purchase, inland transport, export paperwork and insured RoRo or container shipping.",
      "Confirm destination import eligibility and registration requirements before committing to a vehicle, particularly with classics, modified cars and track-oriented variants.",
    ],
  },
  faqs: [
    {
      q: "What is the best Lotus to buy for a first-time owner?",
      a: "A Toyota-powered Elise is a strong starting point for a weekend car. An Evora is more suitable if comfort, access and longer journeys are important. Neither choice removes the need for a careful assessment of condition and maintenance history.",
    },
    {
      q: "Should I buy a Rover-powered or Toyota-powered Elise?",
      a: "Choose a Rover-powered car if you value the lightness and simplicity of the early Elise experience. Toyota-powered versions offer a wider choice of later specifications and power delivery. Cooling history is especially important on the Rover engine, while chassis condition, suspension and previous repairs matter on both.",
    },
    {
      q: "Is the Lotus Exige better than the Elise?",
      a: "The Exige V6 is more powerful and more intense, with a greater emphasis on performance. The Elise is smaller in character and can be more satisfying when you want delicacy rather than additional speed. The right choice depends on how much road and circuit use you expect.",
    },
    {
      q: "Which Lotus is best for longer journeys?",
      a: "The Evora and Emira are the strongest starting points. Both provide a more accommodating cabin than an Elise or Exige while retaining a driver-focused mid-engined layout. Seat comfort, suspension specification and functioning air conditioning should form part of the comparison.",
    },
    {
      q: "What matters most when buying a used Lotus Elise?",
      a: "Chassis condition, accident history, suspension health and correct maintenance are more important than cosmetic presentation or mileage alone. Check the cooling system, gear selection and any fitted air conditioning, and establish exactly which engine and model specification the car has.",
    },
    {
      q: "What is the best classic Lotus to buy?",
      a: "The original Elan is a compelling choice for a buyer who values agile handling and compact proportions. A Turbo Esprit adds a more dramatic shape and turbocharged character. The Europa suits someone looking for an unusual mid-engined classic. Restoration quality and specialist support should guide all three purchases.",
    },
    {
      q: "Can ZervTek source a Lotus from Japan?",
      a: "Yes. ZervTek can search Japanese dealer stock and auctions against your requirements, obtain further vehicle information and coordinate purchase and export. Availability, specification and destination eligibility must be confirmed for each car.",
    },
  ],
  closing: {
    title: "Find your Lotus from Japan",
    body: "Tell us the model, spec, and destination. We'll search Japan for you.",
  },
} as const;

export const LOTUS_MODEL_GUIDES: Record<string, MakeModelGuide> = {};

export function getLotusModelGuide(model: string): MakeModelGuide | null {
  return lookupModelGuide(LOTUS_MODEL_GUIDES, model);
}

export function lotusStockHref(model?: string): string {
  return buildStockHref({ make: "Lotus", model: model || undefined });
}
