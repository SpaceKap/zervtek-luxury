/** Editorial content for the Ferrari make hub at /stock/ferrari */

import { buildStockHref } from "@/lib/stock";
import { lookupModelGuide, type MakeModelGuide } from "@/lib/make-hubs/types";

export const FERRARI_HUB = {
  make: "Ferrari",
  slug: "ferrari",
  title: "Best Ferraris to Buy and Import from Japan",
  description:
    "The best Ferrari to buy and import from Japan — 308, 328, F355, 360 Modena, 458 Italia, Testarossa, 512 TR and F12 Berlinetta. Browse stock or ask ZervTek to source and export.",
  h1: "Best Ferraris to Buy and Import",
  intro:
    "Ferrari has never been particularly interested in making one perfect car. It makes different kinds of fast cars, then gives each one a shape, a soundtrack and a slightly unreasonable sense of occasion. Japan is a useful place to search — classic and modern Ferraris appear in dealer stock and auctions across a wide range of specifications.",
  lead: [
    "Ferrari has never been particularly interested in making one perfect car. It makes different kinds of fast cars, then gives each one a shape, a soundtrack and a slightly unreasonable sense of occasion. A 308 asks you to slow down and look at it. An F355 asks you to find an empty road. An F12 asks how quickly you would like to cross a continent.",
    "That is why the best Ferrari to buy is not always the newest one or the fastest one. It is the car whose compromises you will forgive. The 308, 328, 348, F355, 360 Modena, F430, 458 Italia, Testarossa, 512 TR and F12 Berlinetta each deliver a different version of the Ferrari idea. Some are delicate. Some are loud. Some are surprisingly usable. None are ordinary.",
    "Japan is a useful place to search for these cars because the market includes both classic Ferraris and later performance cars in a wide range of specifications. Dealer stock and auctions can reveal cars that suit a very specific brief, but the listing is only the beginning. With an older Ferrari, the history and the individual car matter as much as the model name.",
  ],
  shortAnswer: {
    title: "The short answer",
    paragraphs: [
      "If you want the Ferrari most people picture when they imagine ownership, start with the F355. It has the compact shape, open-gated manual option and high-revving V8 that make an analogue Ferrari feel like an event every time you drive it.",
      "If you want the easiest first Ferrari, choose the 360 Modena. If you want the final naturally aspirated mid-engine V8, buy a 458 Italia. If the poster on your wall had side strakes, look at the Testarossa or 512 TR. If you want a front-engine V12 that can turn a long drive into an occasion, the F12 Berlinetta is the answer.",
    ],
  },
  comparison: [
    { want: "A small, sculptural classic with a gated manual", model: "Ferrari 308", anchor: "308" },
    { want: "A more polished version of the same classic idea", model: "Ferrari 328", anchor: "328" },
    { want: "A compact and slightly unruly 1990s V8", model: "Ferrari 348", anchor: "348" },
    { want: "The most charismatic analogue V8 experience", model: "Ferrari F355", anchor: "f355" },
    { want: "A poster car with a flat-twelve soundtrack", model: "Ferrari Testarossa", anchor: "testarossa" },
    { want: "A sharper, more developed Testarossa", model: "Ferrari 512 TR", anchor: "512-tr" },
    { want: "A lighter Ferrari that is easier to use regularly", model: "Ferrari 360 Modena", anchor: "360" },
    { want: "Strong performance with a more serious chassis", model: "Ferrari F430", anchor: "f430" },
    { want: "The ultimate naturally aspirated mid-engine V8", model: "Ferrari 458 Italia", anchor: "458" },
    { want: "A front-engine V12 built for fast touring", model: "Ferrari F12 Berlinetta", anchor: "f12" },
  ],
  models: [
    {
      id: "308",
      name: "Ferrari 308",
      years: "1975–1985",
      modelFilter: "308",
      paragraphs: [
        "The 308 does not need to be explained for long. The wedge profile, side vents, flying-buttress roof pillars and louvered engine cover do the work. It is one of those cars that can make a quiet street feel like a film set, even when it is simply parked outside a café.",
        "On the road, the 308 is smaller and more physical than its reputation suggests. The steering has weight, the cabin feels narrow, and the gated manual gearbox makes ordinary speeds feel deliberate. The V8 is not about overwhelming acceleration. It is about the rhythm of the drive: turn, hear the engine, place the car, shift again.",
        "Buy a 308 for its delicacy, not for modern pace. Originality, corrosion prevention, belt history, cooling and the quality of past repairs deserve more attention than a recent cosmetic refresh. A good car feels alive. A neglected one can turn the same charm into a long list of jobs.",
      ],
    },
    {
      id: "328",
      name: "Ferrari 328",
      years: "1985–1989",
      modelFilter: "328",
      paragraphs: [
        "The 328 keeps the 308's silhouette but rounds off some of its edges. It feels more finished, more substantial and a little less like a machine that expects the owner to participate in every mechanical decision. That does not make it dull. It makes it easier to enjoy.",
        "The proportions are still excellent, especially in GTB form. The GTS adds the removable roof panel and a clearer view of the engine's voice, which is a good trade if open-air driving matters more than absolute quiet. Both versions have the compact dimensions that make a classic Ferrari enjoyable on roads where a modern supercar would feel oversized.",
        "The 328 is often the sensible classic choice, although \"sensible\" is relative here. Service records, previous restoration work, body condition, electrical equipment and long periods of inactivity should be understood. Buy the most honest example you can find, then use it.",
      ],
    },
    {
      id: "348",
      name: "Ferrari 348",
      years: "1989–1995",
      modelFilter: "348",
      paragraphs: [
        "The 348 is the Ferrari for buyers who find the 328 a little too gentle and the F355 a little too polished. Its side strakes, squared-off rear and compact body give it a harder look. The mid-mounted V8 and manual gearbox keep the experience direct.",
        "There is more attitude in the 348 than its place in the Ferrari timeline sometimes suggests. Steering effort, pedal weight and the view down the short nose remind you that this is an older sports car, not a filtered modern supercar. The GTB and GTS have the cleanest lines; the Spider brings open-air drama at the cost of some structural neatness.",
        "A 348 makes sense when you want an analogue Ferrari with a little less ceremony. It still needs careful scrutiny of belts, cooling, suspension, electrics, interior materials and previous body repairs. The appeal is not perfection. It is the feeling that the car is asking you to pay attention.",
      ],
    },
    {
      id: "f355",
      name: "Ferrari F355",
      years: "1994–1999",
      modelFilter: "F355",
      paragraphs: [
        "The F355 is the answer that keeps returning when people ask which Ferrari they should buy. It has the right proportions, the right era, the right engine and, in manual form, one of the great gearshifts. The pop-up headlights help, too. They make the car look slightly sleepy until the road opens up.",
        "The 3.5-liter V8 is the main event. It does not merely get faster as the revs rise; it changes character. Below the high end it is perfectly usable. Near the top of the tachometer, it becomes the reason you bought the car. The cabin places you close to the front wheels, and the narrow body makes the car feel quick without requiring ridiculous speed.",
        "The six-speed gated manual is the romantic choice. The F1 transmission tells a different story, showing Ferrari in the early stages of its paddle-shift era. Choose either on condition and preference, not on somebody else's hierarchy. Belt history, exhaust work, suspension, interior materials and evidence of proper use matter more than a low odometer reading.",
        "If you want one Ferrari that balances visual drama, sound and involvement better than almost anything in this group, make the F355 your first search.",
      ],
    },
    {
      id: "testarossa",
      name: "Ferrari Testarossa",
      years: "1984–1991",
      modelFilter: "Testarossa",
      paragraphs: [
        "The Testarossa is not subtle, and it was never supposed to be. The wide rear body, deep side strakes and enormous flat-twelve announce the car before the engine does. It remains one of the few Ferraris that can be identified from a silhouette across a parking lot.",
        "The surprise is how calmly it drives. The Testarossa is wide, but the twelve-cylinder engine has a relaxed reserve and the car settles into fast roads with the ease of a grand tourer. The cabin feels like a time capsule from an era when a supercar could be dramatic without needing a computer to explain its intentions.",
        "This is the Ferrari for a buyer who wants presence and period character. It is not the obvious choice for narrow urban roads or low-effort ownership. Belt service, cooling, fuel delivery, electrical systems, bodywork, interior trim and restoration quality all deserve close attention. The cheapest Testarossa is rarely the cheapest one to own.",
      ],
    },
    {
      id: "512-tr",
      name: "Ferrari 512 TR",
      years: "1991–1994",
      modelFilter: "512 TR",
      paragraphs: [
        "The 512 TR keeps the poster-car shape but gives the idea a firmer handshake. The revised flat-twelve, improved suspension and sharper responses make it feel more alert than the original. It is still a grand tourer, but it has more appetite for a twisting road.",
        "That balance is the 512 TR's appeal. It has the theatre of the Testarossa without feeling quite as remote from the driver. The manual gearbox, the long nose and the twelve-cylinder soundtrack make even a short trip feel like an occasion. The car still asks you to respect its width and age, but it gives more back when you do.",
        "Look beyond bright paint and fresh leather. Major belt work, cooling, fuel systems, suspension, transmission operation and the quality of restoration work should all be part of the conversation before comparing cars.",
      ],
    },
    {
      id: "360",
      name: "Ferrari 360 Modena",
      years: "1999–2005",
      modelFilter: "360",
      paragraphs: [
        "The 360 Modena is where Ferrari's mid-engine V8 became easier to live with without losing its sense of theatre. The aluminum structure, clean bodywork and glass engine cover give it a lighter, more technical look than the F355. The cabin has better visibility and more room, which matters when the car is meant to leave the garage regularly.",
        "The 360 still rewards revs and still feels special at sane road speeds. A manual car has a lovely rhythm. The early F1 transmission is a different proposition and should be considered on its own terms rather than judged against a later dual-clutch gearbox. The Spider adds sunlight and noise, along with roof and sealing systems that become part of the ownership decision.",
        "For a first Ferrari, the 360 is difficult to dismiss. It has the sound, the seating position and the occasion, but it asks less patience than the older cars. A clear history, a cared-for interior and evidence of regular maintenance are better signs than a polished presentation alone.",
      ],
    },
    {
      id: "f430",
      name: "Ferrari F430",
      years: "2004–2009",
      modelFilter: "F430",
      paragraphs: [
        "The F430 sharpens the 360 formula. Its V8 is stronger, the body is more muscular, and the chassis brings Ferrari's E-Diff and manettino controls into the conversation. It feels faster and more deliberate, but the basic connection remains familiar: low seating, immediate steering and an engine that wants to be used.",
        "A manual F430 preserves the traditional shift pattern in a car with genuinely modern performance. The F1 cars suit the harder edge of the chassis when the transmission and clutch have been properly cared for. The F430 is quick enough to feel exotic without needing a racetrack to make its point.",
        "Specification can change the ownership story. Brakes, exhaust components, suspension parts, interior trim and automated-manual systems all deserve attention alongside the service record. A cheap F430 is not automatically a bargain; it may simply be a more expensive F430 waiting for its turn.",
      ],
    },
    {
      id: "458",
      name: "Ferrari 458 Italia",
      years: "2009–2015",
      modelFilter: "458",
      paragraphs: [
        "The 458 Italia is the cleanest all-round answer in this list. Its dual-clutch gearbox is quick and smooth, the chassis makes serious speed feel manageable, and the 4.5-liter V8 responds with an immediacy that turbocharging cannot quite imitate.",
        "The 458 was Ferrari's last naturally aspirated mid-engine V8 berlinetta before the family moved to turbocharging. That gives it historical weight, but the car does not drive like a museum exhibit. The steering is immediate, the gearbox keeps the engine in its best range, and the bodywork looks shaped by airflow rather than decoration.",
        "Choose a 458 when you want the broadest mix of performance, modern refinement and usability. It will normally cost more than the earlier V8s, but it also removes much of the friction from fast road driving. History still matters. So do electronics, accident history, suspension, brakes, leather and carbon trim.",
      ],
    },
    {
      id: "f12",
      name: "Ferrari F12 Berlinetta",
      years: "2012–2017",
      modelFilter: "F12",
      paragraphs: [
        "The F12 Berlinetta changes the mood completely. The long bonnet, low nose and front-mounted V12 give it the stance of a grand tourer, but the engine and rear-drive chassis make the car feel far more agile than its size suggests. It is the Ferrari for someone who wants to travel quickly and arrive with the soundtrack still ringing in their ears.",
        "The F12 has enormous performance, yet its best quality may be its sense of distance. It can cross a country without feeling like a punishment, then turn a good road into a serious event. The dual-clutch gearbox and electronic systems make it much more contemporary than the Testarossa or 512 TR, but the twelve-cylinder character remains old-school in the best way.",
        "Look closely at service records, transmission behavior, suspension, brakes, cooling, electronics, carbon trim and accident history. The right F12 is a spectacular long-distance Ferrari. The wrong one is a spectacularly expensive problem.",
      ],
    },
  ],
  howToChoose: {
    title: "How to choose your Ferrari from Japan",
    paragraphs: [
      "Start with the drive you want, not the year on the registration document. Do you want the small-car delicacy of a 308, the high-revving soundtrack of an F355, the poster-car theatre of a Testarossa, the relaxed speed of a 360, or the long-distance force of an F12? Once that answer is clear, narrow the search by transmission, body style, color, mileage and budget.",
      "Japanese dealer stock can make it easier to compare specifications and available documentation. Auctions can widen the search, but they demand a clear brief and quick decisions. In both cases, the car's identity, history, specification and paperwork should tell the same story.",
      "ZervTek can visit a Ferrari in Japan in person, obtain additional photographs and videos, ask the dealer questions supplied by the customer, review available maintenance records and review Japanese registration history. Once you select a car, ZervTek can coordinate the purchase and export paperwork, inland transport and insured RoRo or container shipping to the destination port.",
    ],
  },
  faqs: [
    {
      q: "What is the best Ferrari to buy for a first-time owner?",
      a: "The Ferrari 360 Modena is usually the easiest starting point. It retains the sound and feel of a naturally aspirated mid-engine V8 while offering more space, visibility and usability than the 308, 328, 348 or F355.",
    },
    {
      q: "What is the best Ferrari V12 to buy?",
      a: "The F12 Berlinetta is the strongest modern choice for a buyer who wants a front-engine V12 with very high performance and long-distance ability. The Testarossa and 512 TR offer more period theatre, but they demand more tolerance for age-related maintenance.",
    },
    {
      q: "What is the best classic Ferrari to buy?",
      a: "The Ferrari 308 and 328 are the clearest classic starting points. The 308 has the earlier, more delicate character, while the 328 feels like a polished development of the same idea. Choose GTB or GTS according to whether you prefer a fixed roof or open-air driving.",
    },
    {
      q: "Is the Ferrari F355 a good car to buy?",
      a: "Yes, if you buy the history and accept that specialist maintenance is part of ownership. The F355 is one of Ferrari's most rewarding V8s, but a neglected example can become expensive quickly. Records and condition matter more than a low odometer reading.",
    },
    {
      q: "Is the Testarossa or 512 TR better?",
      a: "The Testarossa has the purest poster-car identity. The 512 TR feels sharper and more developed from behind the wheel. The better purchase is the individual car with the stronger history, better condition and specification you actually want.",
    },
    {
      q: "Can ZervTek find a Ferrari in Japan?",
      a: "Yes. ZervTek can search Japanese dealer stock and auctions, visit a vehicle in person, provide extra photographs and videos, ask customer-supplied questions to the dealer, review available maintenance records and Japanese registration history, and coordinate export paperwork and insured RoRo or container shipping.",
    },
  ],
  closing: {
    title: "Find your Ferrari from Japan",
    body: "Tell ZervTek which Ferrari you want, your preferred specification and your destination. We can search for the 308, 328, 348, F355, 360 Modena, F430, 458 Italia, Testarossa, 512 TR and F12 Berlinetta in Japan, then help you compare the individual cars that fit your brief.",
  },
} as const;

/**
 * Per-model Ferrari guides at `/stock/ferrari/{model}`.
 * Add an entry keyed by slugify(model) when ready — until then model pages are stock-only.
 */
export const FERRARI_MODEL_GUIDES: Record<string, MakeModelGuide> = {};

export function getFerrariModelGuide(model: string): MakeModelGuide | null {
  return lookupModelGuide(FERRARI_MODEL_GUIDES, model);
}

export function ferrariStockHref(model?: string): string {
  return buildStockHref({ make: "Ferrari", model: model || undefined });
}
