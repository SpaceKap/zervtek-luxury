/** Editorial content for the Porsche make hub at /stock/porsche */

import { buildStockHref } from "@/lib/stock";
import { lookupModelGuide, type MakeModelGuide } from "@/lib/make-hubs/types";

export const PORSCHE_HUB = {
  make: "Porsche",
  slug: "porsche",
  title: "Five Porsches Worth Searching for in Japan",
  description:
    "A focused guide to four defining 911 generations and the 987 Cayman and Boxster, with practical inspection and sourcing advice from ZervTek.",
  h1: "Five Porsches worth searching for in Japan",
  intro:
    "The 911 has survived by changing carefully. A 993 does not feel like a 997, and a 997 does not feel like a 992 — Japan is a useful place to search across those generations and the mid-engine 987 twins.",
  lead: [
    "The 911 has survived by changing carefully. Its engine moved from air cooling to water cooling. The body grew, the cabin became more civilized, steering assistance changed and electronics took on more of the work. Yet the silhouette, the view over the front fenders and the peculiar sensation of an engine working behind you remained.",
    "Calling every one of these cars simply a 911 flattens the story. A 993 does not feel like a 997, and a 997 does not feel like a 992. Each generation has its own rhythm and its own idea of what a Porsche should be. This guide focuses on four that make that evolution clear, then steps away from the 911 for one mid-engine alternative that may be the more honest driver's car.",
  ],
  shortAnswer: {
    title: "Which one belongs in your garage?",
    paragraphs: [
      "Choose by temperament, not hierarchy. The 993 is the most intimate and historic. The 997 is the clearest bridge between old and new. The 991 has the breadth of a serious touring car without losing its ability to entertain. The 992 is the fullest expression of the modern 911. The 987 twins step outside the family script and remind you that balance can matter more than lineage.",
      "Then narrow the brief. Coupe or open roof. Manual or two-pedal transmission. Quiet Carrera or sharper derivative. Steering position, color, intended use and tolerance for age all matter. The right answer is personal, which is exactly why a shorter list is more useful than a catalogue.",
    ],
  },
  comparisonTitle: "Five Porsches worth searching for",
  comparison: [
    {
      want: "The last air-cooled 911 — intimate and historic",
      model: "Porsche 993",
      anchor: "993",
    },
    {
      want: "The modern-classic sweet spot",
      model: "Porsche 997",
      anchor: "997",
    },
    {
      want: "A grown-up 911 that still entertains",
      model: "Porsche 991",
      anchor: "991",
    },
    {
      want: "The current idea of a 911",
      model: "Porsche 992",
      anchor: "992",
    },
    {
      want: "A mid-engine driver's car outside the 911 script",
      model: "Porsche 987 Cayman / Boxster",
      anchor: "987",
    },
  ],
  models: [
    {
      id: "993",
      name: "Porsche 993",
      years: "1994–1998",
      modelFilter: "911",
      paragraphs: [
        "The 993 carries a heavy reputation. It is the final air-cooled 911, the last chapter of an engineering tradition that had defined the model for decades. That status can turn the car into an object before anyone drives it, which is a shame. The 993 is not important only because production ended. It is important because it is genuinely good.",
        "The cabin is narrow, upright and intimate. The pedals rise from the floor. The windscreen feels close. From the driver's seat you can see the fenders trace the road ahead while the flat-six murmurs and chatters behind you. The controls have weight, but they are not clumsy. Once the car is moving, the steering becomes delicate and the multi-link rear suspension makes the chassis feel more settled than earlier 911s without removing its rear-engined character.",
        "A Carrera coupe is the clearest expression of the generation. The Cabriolet gives away some purity for open-air sound, while the Targa has a character of its own. Carrera 4, Turbo and special variants should be treated as separate cars rather than trim levels.",
        "The romantic story must not replace inspection. Look for engine leaks, valve-guide wear, suspension condition, dual-mass flywheel issues, climate-control faults, corrosion and previous body repair. A car that spent years sitting can need more care than one driven regularly. Service records should show a life, not merely a recent effort to prepare the car for sale.",
      ],
    },
    {
      id: "997",
      name: "Porsche 997",
      years: "2004–2012",
      modelFilter: "911",
      paragraphs: [
        "The 997 feels familiar almost immediately. Its round headlights, compact body and restrained cabin restored visual cues that many people had missed. More importantly, it kept hydraulic steering and a relatively small footprint while offering the comfort and performance expected of a modern 911.",
        "This is the generation that can play several roles without feeling compromised. An early Carrera on modest wheels is communicative and usable. A Carrera S adds urgency. The later phase brings direct injection and PDK, changing both the response of the engine and the way the car fits into daily life. Turbo and GT models sit in another category altogether.",
        "The appeal of a regular 997 is balance. It is quick without making every road feel too small. The steering has texture. The cabin gives you enough comfort but still feels built around the driver. A manual car invites involvement; a later PDK car makes a strong case for simply getting in and going somewhere.",
        "Inspection depends on the phase and engine. Earlier Carrera models need careful attention to bore condition, oil use, cooling, leaks and service history. Later cars require their own checks, including PDK operation where fitted. Across the generation, inspect suspension, brakes, tires, active systems, over-rev data and evidence of accident repair. A specialist should identify the exact version before deciding what matters most.",
      ],
    },
    {
      id: "991",
      name: "Porsche 991",
      years: "2011–2019",
      modelFilter: "911",
      paragraphs: [
        "The 991 is larger and more polished than the 997. Its wheelbase is longer, the cabin is more spacious and electric power steering replaces the old hydraulic system. Those changes upset purists when the car arrived. Drive a good one for more than a few minutes, though, and the argument becomes less simple.",
        "The 991 has a wonderful sense of composure. It settles into a fast road with the calm of a much larger grand tourer, yet the front end still reacts eagerly and the rear engine still shapes the way the car accelerates out of a corner. The first phase retains naturally aspirated Carrera engines. The later phase introduces turbocharging across the regular Carrera range, bringing stronger low-speed response and a different voice.",
        "This generation also widened the spectrum of what a 911 could be. A Carrera is an easy long-distance companion. A GTS has more edge without becoming exhausting. The GT3 and special models show how much precision the basic platform can support. Buyers should resist treating the most dramatic specification as automatically the best one. The quiet brilliance of a well-chosen Carrera is easy to miss.",
        "Inspect the cooling system, engine and transmission behavior, suspension, active mounts, brakes, exhaust, cabin electronics and water drainage. Cars with complex options need every system tested. Paint-depth readings, underbody photographs and diagnostic data help separate careful ownership from a polished presentation.",
      ],
    },
    {
      id: "992",
      name: "Porsche 992",
      years: "2019–present",
      modelFilter: "911",
      paragraphs: [
        "The 992 is wide, fast and deeply technical. Its cabin mixes a central analog tachometer with digital displays, and its body has more visual weight than the generations before it. On paper it can sound removed from the small sports car that started the line. From behind the wheel, the family resemblance is still there.",
        "The steering is immediate, the nose places itself accurately and the engine delivers enormous response in ordinary driving. What stands out is not just speed but confidence. The car shrinks around the driver once moving. It can cross a city without fuss, cover long distances quietly and then find another personality on the right road.",
        "That breadth is the 992's character. It is less about preserving an old ritual and more about proving how far the rear-engined idea can stretch. A Carrera is already a serious performance car. S, GTS, T, Turbo and GT versions add distinct personalities, but complexity rises with specification. The best choice is the one that matches the roads and use the owner actually has.",
        "Inspection should cover diagnostic history, cooling, transmission, active suspension, steering systems, brakes, tires and every driver-assistance feature. Option-heavy cars need time. Test cameras, displays, seats, lighting, exhaust modes and lift systems rather than assuming a warning-free dashboard means everything works. Body repair should be assessed carefully because modern materials and tightly integrated systems demand correct workmanship.",
      ],
    },
    {
      id: "987",
      name: "Porsche 987 Cayman and Boxster",
      years: "2004–2012",
      modelFilter: "Cayman",
      paragraphs: [
        "The 987 Cayman and Boxster are here because a Porsche article should not pretend the 911 is always the answer. Their engine sits ahead of the rear axle, giving the chassis a balance that feels natural from the first corner. The Boxster adds sky and sound. The Cayman adds a roof, stiffness and a little more focus.",
        "These cars do not have the 911's mythology pressing down on them. That can be liberating. The steering is clear, the dimensions suit real roads and the performance is accessible without becoming ordinary. A base car with a manual gearbox can be more satisfying than a much more powerful machine because it asks the driver to participate at speeds that still make sense.",
        "Early and later phases differ, as do the regular and S models. Some engines require close attention to IMS history or bore condition, while later cars bring revised engines and PDK. All need inspection of cooling, oil leaks, engine mounts, clutch or transmission behavior, suspension and brakes. On a Boxster, operate the roof several times and check the drains and carpets for water. On a Cayman, listen for hatch and trim noises and inspect the luggage areas.",
      ],
    },
  ],
  howToChoose: {
    title: "Condition is part of the character",
    paragraphs: [
      "A Porsche with a great specification can still be the wrong car. Confirm the chassis identity, manufacture details, engine, transmission and factory equipment. Read the service history as a timeline. Gaps, repeated faults and sudden bursts of work before sale all deserve questions.",
      "Inspect from cold, scan every control unit and drive the car long enough to reach operating temperature. Look underneath. Measure paint. Check tire dates and wear patterns. On performance variants, review over-rev data and signs of track use. The inspector should know the exact generation because each one hides its age in different places.",
      "ZervTek works in Japan for buyers who want more than a forwarded sales sheet. We can refine the brief, compare suitable cars, visit the vehicle, take additional photographs and video, review the documents and coordinate the purchase and export process.",
      "Once a car is chosen, ZervTek can arrange transport to the departure port and organize roll-on/roll-off or container shipping. Buyers should confirm their local import, inspection, registration and insurance requirements before purchase.",
    ],
  },
  faqs: [
    {
      q: "Which Porsche generation should I buy?",
      a: "Choose by temperament, not hierarchy. The 993 is the most intimate and historic. The 997 is the clearest bridge between old and new. The 991 has touring breadth without losing entertainment. The 992 is the fullest modern 911. The 987 Cayman and Boxster are often the more honest driver's cars when balance matters more than lineage.",
    },
    {
      q: "What matters most when inspecting a used Porsche?",
      a: "Confirm chassis identity, engine, transmission and factory equipment, then read the service history as a timeline. Inspect from cold, scan control units, drive to operating temperature, check paint depth, underbody condition, tire dates and wear. On performance variants, review over-rev data and track use. Each generation hides age in different places.",
    },
    {
      q: "Is a 911 always better than a Cayman or Boxster?",
      a: "No. The 987 Cayman and Boxster place the engine ahead of the rear axle and often feel more natural on real roads. A well-chosen base car with a manual gearbox can be more satisfying than a much more powerful 911 when you want involvement at speeds that still make sense.",
    },
    {
      q: "Can ZervTek source a Porsche from Japan?",
      a: "Yes. ZervTek can refine the brief, compare suitable cars, visit the vehicle, take additional photographs and video, review documents and coordinate purchase, inland transport and RoRo or container shipping. Confirm local import, inspection, registration and insurance requirements before purchase.",
    },
  ],
  closing: {
    title: "Find your Porsche from Japan",
    body: "Tell us the generation, body style, transmission and destination — we'll search Japan for you.",
  },
} as const;

export const PORSCHE_MODEL_GUIDES: Record<string, MakeModelGuide> = {};

export function getPorscheModelGuide(model: string): MakeModelGuide | null {
  return lookupModelGuide(PORSCHE_MODEL_GUIDES, model);
}

export function porscheStockHref(model?: string): string {
  return buildStockHref({ make: "Porsche", model: model || undefined });
}
