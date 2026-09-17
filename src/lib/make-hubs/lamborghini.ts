/** Editorial content for the Lamborghini make hub at /stock/lamborghini */

import { buildStockHref } from "@/lib/stock";
import { lookupModelGuide, type MakeModelGuide } from "@/lib/make-hubs/types";

export const LAMBORGHINI_HUB = {
  make: "Lamborghini",
  slug: "lamborghini",
  title: "Best Lamborghini to Buy & Import from Japan",
  description:
    "The best Lamborghini to buy and import from Japan — Miura, Countach, Diablo, Murciélago, Gallardo, Aventador, Huracán, Urus, Revuelto and Temerario. Browse stock or ask ZervTek to source and export.",
  h1: "Best Lamborghini to Buy & Import",
  intro:
    "Lamborghini has never treated subtlety as a requirement. Even its quieter cars tend to have a low roof, a wide stance and an engine that seems to regard ordinary traffic as a personal insult. Japan is a useful place to search — modern performance cars and carefully presented classics appear in dealer stock and auctions.",
  lead: [
    "Lamborghini has never treated subtlety as a requirement. Even its quieter cars tend to have a low roof, a wide stance and an engine that seems to regard ordinary traffic as a personal insult. The best Lamborghini to buy is therefore not simply the newest or the fastest. It is the one whose particular kind of theatre matches the way you want to drive.",
    "A Miura is about the birth of the modern supercar. A Countach is a piece of automotive architecture that happens to have a V12. A Diablo brings the same drama with more speed and a harder edge. The Murciélago keeps the traditional twelve-cylinder formula alive, while the Gallardo makes Lamborghini ownership more approachable. The Aventador restores the full-scale occasion, the Huracán adds polish and precision, and the Urus proves that the raging bull can work as an everyday performance vehicle.",
    "The newest cars change the formula again. The Revuelto combines a naturally aspirated V12 with electric assistance, while the Temerario moves the junior supercar into a new hybrid era. Japan is an especially interesting place to search because its dealer market covers both modern performance cars and rare, carefully presented examples from earlier generations. The individual vehicle still matters more than the badge: specification, history and condition determine whether the dream remains enjoyable after the first drive.",
  ],
  shortAnswer: {
    title: "The short answer",
    paragraphs: [
      "If you want the Lamborghini that changed the supercar forever, start with the Miura. If you want the most recognisable wedge-shaped icon, choose the Countach. If you want the best balance of old-school drama and usable performance, the Diablo and Murciélago are the key searches.",
      "For a first Lamborghini, the Gallardo is usually the most approachable place to begin. The Huracán is the strongest modern all-rounder, the Aventador is the full V12 event, and the Urus is the practical choice for buyers who need space without giving up Lamborghini presence. For the current generation, the Revuelto is the flagship answer, while the Temerario brings the latest hybrid technology to the smaller car.",
    ],
  },
  comparison: [
    {
      want: "The car that established the modern supercar layout",
      model: "Lamborghini Miura",
      anchor: "miura",
    },
    {
      want: "The ultimate wedge-shaped poster car",
      model: "Lamborghini Countach",
      anchor: "countach",
    },
    {
      want: "A faster, more aggressive classic V12",
      model: "Lamborghini Diablo",
      anchor: "diablo",
    },
    {
      want: "A modern V12 with old-school theatre",
      model: "Lamborghini Murciélago",
      anchor: "murcielago",
    },
    {
      want: "The most approachable entry into Lamborghini ownership",
      model: "Lamborghini Gallardo",
      anchor: "gallardo",
    },
    {
      want: "A dramatic naturally aspirated V12 flagship",
      model: "Lamborghini Aventador",
      anchor: "aventador",
    },
    {
      want: "A sharp and usable modern V10",
      model: "Lamborghini Huracán",
      anchor: "huracan",
    },
    {
      want: "A Lamborghini you can use with family and luggage",
      model: "Lamborghini Urus",
      anchor: "urus",
    },
    {
      want: "A V12 flagship with hybrid power",
      model: "Lamborghini Revuelto",
      anchor: "revuelto",
    },
    {
      want: "The next-generation V8 hybrid supercar",
      model: "Lamborghini Temerario",
      anchor: "temerario",
    },
  ],
  models: [
    {
      id: "miura",
      name: "Lamborghini Miura",
      years: "1966–1973",
      modelFilter: "Miura",
      paragraphs: [
        "The Miura is the answer to the question of where the modern supercar began. Its engine sits behind the driver, its body is low and sensuous, and its proportions still look extraordinary more than half a century later. It does not need an enormous wing or an aggressive aerodynamic package to announce that it is something different.",
        "The transverse V12 layout gives the Miura a mechanical identity as distinctive as its shape. The car is compact, light by modern standards and full of the physical sensations that disappear as performance cars become more digital. The steering, the visibility and the cabin all remind you that this is a serious machine designed in a very different era.",
        "Buy a Miura for its historical importance, design and rarity rather than modern speed. Chassis identity, restoration quality, engine work, cooling, gearbox operation, body structure and provenance deserve careful attention. A beautifully presented car with uncertain history is not automatically a better purchase than an honest example with a documented past.",
      ],
    },
    {
      id: "countach",
      name: "Lamborghini Countach",
      years: "1974–1990",
      modelFilter: "Countach",
      paragraphs: [
        "The Countach is not merely a classic Lamborghini. It is one of the defining shapes of the twentieth century. The scissor doors, steep windscreen, sharp nose and deeply cut side intakes created the visual language that many later supercars would borrow. It looks fast while standing still, which is a useful quality in a car that often spends as much time being admired as driven.",
        "The early cars are compact, delicate and relatively pure. Later versions add wider arches, more power and greater visual force. The V12 gives the Countach a hard-edged soundtrack, but the experience is not effortless. Visibility is limited, the cabin is tight and the car asks the driver to take its dimensions seriously.",
        "A Countach should be bought with exceptional attention to authenticity and restoration. Fibreglass and steel bodywork, chassis condition, cooling, carburettors, electrical systems, trim and the quality of previous work all matter. The best example is not necessarily the loudest one. It is the car whose history makes sense from nose to tail.",
      ],
    },
    {
      id: "diablo",
      name: "Lamborghini Diablo",
      years: "1990–2001",
      modelFilter: "Diablo",
      paragraphs: [
        "The Diablo took the Countach idea and made it more muscular, faster and more usable without losing the sense of danger. Its body is smoother but still theatrical, and the large V12 gives it the authority expected of Lamborghini's flagship. The car feels like a bridge between the hand-built classics and the more developed supercars that followed.",
        "Early rear-drive cars have a particularly direct character. Later versions add four-wheel drive, more power and improved equipment, while special editions can become distinctly collectible. Across the range, the Diablo retains the long nose, low roof and dramatic driving position that make every short journey feel like an occasion.",
        "Age is the central buying question. Cooling, engine servicing, clutch and gearbox operation, suspension, brakes, electronics, air conditioning and body repairs should all be understood. A Diablo can look immaculate while carrying years of deferred maintenance. Documentation is not background paperwork here; it is part of the car.",
      ],
    },
    {
      id: "murcielago",
      name: "Lamborghini Murciélago",
      years: "2001–2010",
      modelFilter: "Murcielago",
      paragraphs: [
        "The Murciélago is the modern V12 Lamborghini for buyers who want full-scale drama without going all the way back to a classic. It has the right proportions, the right engine and a cabin that is more usable than the Countach or Diablo. The result is a car that still feels outrageous but can cover a serious distance when properly maintained.",
        "The naturally aspirated V12 is the centre of the experience. It has a deep, mechanical voice and a broad reserve of performance, while the four-wheel-drive versions provide more confidence when the road or weather becomes less predictable. Roadster models add another layer of theatre, although the roof and sealing systems become part of the ownership decision.",
        "Look carefully at clutch wear, the automated manual system where fitted, cooling, suspension, brakes, electronics, tyres, underbody condition and previous accident repairs. The Murciélago may be newer than a Diablo, but it is still a complex, high-performance V12. The strongest cars have a clear service story and a specification that has not been compromised by careless modifications.",
      ],
    },
    {
      id: "gallardo",
      name: "Lamborghini Gallardo",
      years: "2003–2014",
      modelFilter: "Gallardo",
      paragraphs: [
        "The Gallardo is the Lamborghini that made the brand easier to use without making it ordinary. It is smaller than the V12 cars, easier to place on the road and available in a wide range of coupe, Spyder, manual and automated-manual specifications. Yet the low nose, sharp shoulders and V10 soundtrack leave no doubt about its identity.",
        "Early cars feel compact and mechanical. Later cars bring more power, improved electronics and a more polished chassis. A gated manual example has obvious appeal, while the E-gear cars can suit buyers who want a more immediate performance experience. The important point is to judge each generation on condition rather than treating every Gallardo as interchangeable.",
        "A Gallardo can be an excellent first Lamborghini, but it is not a low-cost sports car. Clutch life, front-lift systems, suspension, cooling, brakes, electronics, interior trim and the quality of previous repairs deserve attention. A well-kept example feels remarkably complete. A neglected one can turn its apparent accessibility into an expensive lesson.",
      ],
    },
    {
      id: "aventador",
      name: "Lamborghini Aventador",
      years: "2011–2022",
      modelFilter: "Aventador",
      paragraphs: [
        "The Aventador returned the Lamborghini V12 flagship to full visual volume. Its sharp surfaces, scissor doors and wide stance make it look like a concept car that escaped into traffic. Beneath the bodywork is a naturally aspirated V12 that keeps the traditional formula alive while adding a far more modern carbon-fibre structure and electronic control systems.",
        "The car feels large and serious, but the engine gives it a sense of occasion that is difficult to reproduce with a smaller powertrain. The single-clutch automated transmission is part of the character: it can feel dramatic and physical in a way that smoother modern gearboxes do not. Later SV, SVJ and Ultimae versions push the same idea toward greater focus and rarity.",
        "Specification and maintenance history matter enormously. Check the transmission behaviour, clutch condition, front-lift system, carbon components, suspension, brakes, cooling, electronics and tyres. An Aventador is a significant car even when it is parked, and the right example should be supported by records that match its level of complexity.",
      ],
    },
    {
      id: "huracan",
      name: "Lamborghini Huracán",
      years: "2014–2024",
      modelFilter: "Huracan",
      paragraphs: [
        "The Huracán is the most complete modern Lamborghini for many buyers. It keeps the naturally aspirated V10 and the visual drama, but its dual-clutch transmission, electronics and chassis control make it easier to drive quickly and regularly than the older cars. It is still an event, just one with fewer unnecessary obstacles between the driver and the road.",
        "Different versions create genuinely different personalities. A rear-drive car feels more playful, four-wheel-drive models offer greater security, and the Performante and STO move the car toward sharper track-focused intent. The Spyder trades some structural purity for open-air noise and a stronger sense of occasion.",
        "The Huracán is the sensible answer only by Lamborghini standards. Service history, tyres, brakes, lift systems, electronics, carbon trim, accident history and the condition of the cabin still need close attention. Choose the version that suits your roads rather than assuming the most aggressive derivative is automatically the best car.",
      ],
    },
    {
      id: "urus",
      name: "Lamborghini Urus",
      years: "2018–present",
      modelFilter: "Urus",
      paragraphs: [
        "The Urus is the Lamborghini for a buyer who wants the badge, the noise and the theatre but cannot organise life around a two-seat supercar. Its tall body and usable rear seats change the role completely. It can carry people and luggage, then deliver the acceleration and road presence expected from Sant'Agata.",
        "The twin-turbo V8 gives the Urus the force to match its size, while the chassis systems make the car feel smaller than it is. The performance is not subtle, but the broader appeal is its range of abilities. It can be a daily vehicle, a long-distance car and a dramatic arrival without pretending to be a lightweight mid-engine sports car.",
        "The greater practicality comes with greater complexity. Air suspension, brakes, tyres, electronics, cooling, four-wheel-drive hardware, interior equipment and service history all deserve attention. A used Urus should be selected on specification and care as much as on price. The cheapest example may be carrying the most expensive future maintenance.",
      ],
    },
    {
      id: "revuelto",
      name: "Lamborghini Revuelto",
      years: "2023–present",
      modelFilter: "Revuelto",
      paragraphs: [
        "The Revuelto is the new V12 flagship, but it is not simply an Aventador with a new body. Its naturally aspirated V12 is supported by electric motors, allowing Lamborghini to combine traditional engine character with stronger response and modern emissions technology. The result is a flagship that looks forward without abandoning the central drama of the marque.",
        "The architecture is more complex, the cabin is more contemporary and the car has a broader range of electronic systems than its predecessor. Yet the important detail remains the same: the engine is still a naturally aspirated twelve-cylinder placed at the centre of the experience. The electric assistance adds capability rather than replacing the theatre.",
        "For an imported modern flagship, specification and support are especially important. Confirm the equipment, warranty position, charging and hybrid-system information, software, service history, tyres, brakes and transport arrangements. The Revuelto makes sense for a buyer who wants the biggest Lamborghini experience with the newest technology.",
      ],
    },
    {
      id: "temerario",
      name: "Lamborghini Temerario",
      years: "2024–present",
      modelFilter: "Temerario",
      paragraphs: [
        "The Temerario is the next chapter in Lamborghini's smaller supercar range. It replaces the Huracán's naturally aspirated V10 with a twin-turbo V8 hybrid system, moving the brand's junior car into a new performance and electrification era. The character is different, but the purpose remains familiar: make a relatively compact Lamborghini feel like an event every time it moves.",
        "The hybrid system changes the way power is delivered. Turbocharging brings a stronger mid-range, while electric assistance fills response and adds another layer of control. This is not a nostalgic replacement for the Huracán. It is a more technically ambitious car aimed at buyers who want current performance, modern usability and the unmistakable Lamborghini visual language.",
        "As with any new-generation hybrid supercar, early specification and support matter. Check warranty coverage, software updates, hybrid-system documentation, tyres, brakes, service arrangements and the exact equipment fitted to the individual car. The newest Lamborghini can be the easiest to use, but it is also the one with the most technology to understand.",
      ],
    },
  ],
  howToChoose: {
    title: "How to choose your Lamborghini from Japan",
    paragraphs: [
      "Start with the kind of theatre you want. The Miura and Countach are design and history purchases. The Diablo and Murciélago deliver traditional V12 drama with varying degrees of modern usability. The Gallardo is the natural entry point, the Huracán is the best all-round modern supercar, and the Aventador is the full flagship experience.",
      "If you need a car that can handle family life, the Urus changes the calculation completely. If you want Lamborghini's future rather than its past, compare the V12 hybrid Revuelto with the V8 hybrid Temerario. Once the model is clear, narrow the search by transmission, drivetrain, body style, colour, mileage, service history and intended use.",
      "The Japanese market can be useful for comparing unusual specifications and carefully presented examples, but the individual car still determines the ownership experience. ZervTek can visit a Lamborghini in Japan in person, obtain additional photographs and videos, ask the dealer questions supplied by the customer, review available maintenance records and Japanese registration history, and coordinate purchase, export paperwork and insured RoRo or container shipping.",
    ],
  },
  faqs: [
    {
      q: "What is the best Lamborghini to buy for a first-time owner?",
      a: "The Gallardo is usually the most approachable first Lamborghini. It is smaller and easier to place than the V12 cars, while the V10, low driving position and styling still deliver the full Lamborghini experience. A Huracán is the stronger choice if you want more modern refinement and can accept a higher budget.",
    },
    {
      q: "What is the best classic Lamborghini to buy?",
      a: "The Countach is the defining classic poster car, while the Miura is the historically more important choice. The right purchase depends on whether you value the Miura's pioneering design and delicacy or the Countach's visual drama and wedge-shaped presence.",
    },
    {
      q: "Is the Diablo or Murciélago better?",
      a: "The Diablo feels more analogue and more closely connected to the classic Lamborghini era. The Murciélago is easier to use at speed and offers a more modern cabin and chassis. Condition, service history and the exact specification should decide between them.",
    },
    {
      q: "Is the Huracán a good Lamborghini to buy?",
      a: "Yes. The Huracán offers one of the strongest combinations of naturally aspirated engine character, modern gearbox technology, road usability and visual drama. Choose carefully between rear-drive, four-wheel-drive, Spyder and track-focused versions, and buy the strongest history rather than the lowest price.",
    },
    {
      q: "Is the Urus a real Lamborghini?",
      a: "Yes, but it serves a different purpose from the company's two-seat supercars. The Urus is a high-performance SUV with Lamborghini design, sound and acceleration. It is the best choice for a buyer who needs rear seats and luggage capacity but still wants a dramatic performance vehicle.",
    },
    {
      q: "Should I buy a Revuelto or wait for a Temerario?",
      a: "They are aimed at different buyers. The Revuelto is the flagship V12 hybrid and preserves the emotional centre of Lamborghini's traditional top-level cars. The Temerario is the smaller, newer hybrid supercar and is likely to suit buyers who want more compact dimensions and current technology.",
    },
    {
      q: "Can ZervTek find a Lamborghini in Japan?",
      a: "Yes. ZervTek can search Japanese dealer stock, visit a vehicle in person, provide additional photographs and videos, ask customer-supplied questions to the dealer, review available maintenance records and Japanese registration history, and coordinate export paperwork and insured RoRo or container shipping.",
    },
  ],
  closing: {
    title: "Find your Lamborghini from Japan",
    body: "Tell us the model, spec, and destination. We'll search Japan for you.",
  },
} as const;

export const LAMBORGHINI_MODEL_GUIDES: Record<string, MakeModelGuide> = {};

export function getLamborghiniModelGuide(model: string): MakeModelGuide | null {
  return lookupModelGuide(LAMBORGHINI_MODEL_GUIDES, model);
}

export function lamborghiniStockHref(model?: string): string {
  return buildStockHref({ make: "Lamborghini", model: model || undefined });
}
