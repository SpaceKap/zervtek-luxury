/** Editorial content for the Mercedes-AMG make hub at /stock/mercedes-amg */

import { buildStockHref } from "@/lib/stock";
import { lookupModelGuide, type MakeModelGuide } from "@/lib/make-hubs/types";

export const MERCEDES_AMG_HUB = {
  make: "Mercedes-AMG",
  slug: "mercedes-amg",
  title: "Best Mercedes-AMG to Buy & Import from Japan",
  description:
    "The best Mercedes-AMG cars to buy and import from Japan, from the SLS AMG and AMG GT to the C63, E63, S63, G63, GT 4-Door and the performance SUVs, with model comparisons and buying guidance.",
  h1: "Best Mercedes-AMG to Buy & Import",
  intro:
    "AMG has always built cars around a single idea: that an engine should make its presence felt. From the SLS and AMG GT to the C63, E63, S63 and G63, Japan is a useful place to search.",
  lead: [
    "AMG has always built cars around a single idea: that an engine should make its presence felt. The best AMG models do not simply add power to a Mercedes-Benz. They change its character, giving the car a harder edge, a louder voice and a sense of urgency that the base car deliberately avoids. The result is a range that appeals to a very specific kind of buyer.",
    "That buyer has choices. An SLS AMG is a gullwing supercar built around a naturally aspirated V8. An AMG GT is a hand-built sports car with a front-mid-engine layout and genuine racing intent. A C63 turns a compact saloon into a broad-shouldered muscle car. An E63 or S63 adds that same character to a larger, more refined platform, while a G63 does it to an off-roader that was never meant to move this quickly.",
    "The right AMG depends on how much of that aggression you want to live with. Some are refined enough to use every day. Some demand a long, empty road and a tolerance for noise. None are ordinary.",
  ],
  shortAnswer: {
    title: "The short answer",
    paragraphs: [
      "For most buyers, the AMG GT is the strongest starting point. It is the most focused expression of what AMG can do when it builds a sports car from the ground up, with a hand-built V8 and a chassis developed around driver engagement.",
      "If you want the definitive AMG icon, the SLS AMG is the answer. For a practical daily car with real muscle, the C63 AMG is the classic choice, with the W204's 6.2-litre V8 offering the most character. The E63 AMG is the V8 supersaloon, the S63 brings that character to the flagship, and the G63 turns the G-Wagen into a high-performance anomaly.",
      "For buyers who need space, the GLE 63 and GLS 63 bring AMG performance to the SUV class. The GT 4-Door adds coupe drama to four-door practicality, and the A45 or CLA45 delivers the AMG experience in the most compact, accessible form.",
    ],
  },
  comparisonTitle: "Ten Mercedes-AMG cars worth searching for",
  comparison: [
    {
      want: "The definitive gullwing AMG supercar",
      model: "Mercedes-Benz SLS AMG",
      anchor: "sls-amg",
    },
    {
      want: "A hand-built AMG sports car",
      model: "Mercedes-AMG GT",
      anchor: "gt",
    },
    {
      want: "Coupe drama with four-door practicality",
      model: "Mercedes-AMG GT 4-Door",
      anchor: "gt-4-door",
    },
    {
      want: "The last big naturally aspirated V8 saloon",
      model: "Mercedes-AMG C63 (W204)",
      anchor: "c63-w204",
    },
    {
      want: "The modern turbocharged V8 saloon",
      model: "Mercedes-AMG C63 (W205)",
      anchor: "c63-w205",
    },
    {
      want: "The classic V8 supersaloon",
      model: "Mercedes-AMG E63",
      anchor: "e63",
    },
    {
      want: "Flagship luxury with serious performance",
      model: "Mercedes-AMG S63 / S65",
      anchor: "s63-s65",
    },
    {
      want: "The high-performance G-Wagen",
      model: "Mercedes-AMG G63",
      anchor: "g63",
    },
    {
      want: "AMG performance in an SUV shape",
      model: "Mercedes-AMG GLE 63 / GLS 63",
      anchor: "gle-63-gls-63",
    },
    {
      want: "The compact AMG hot hatch",
      model: "Mercedes-AMG A45 / CLA45",
      anchor: "a45-cla45",
    },
  ],
  models: [
    {
      id: "sls-amg",
      name: "Mercedes-Benz SLS AMG",
      years: "2010–2015",
      modelFilter: "AMG SLS",
      paragraphs: [
        "The SLS AMG is the car that proved AMG could build a genuine supercar. Its gullwing doors, long bonnet and dramatic proportions reference the legendary 300 SL, but the engineering underneath is entirely modern. It remains one of the most instantly recognisable AMG models ever made.",
        "The 6.2-litre naturally aspirated V8 is the heart of the car. It revs hard, sounds extraordinary and delivers its power with a linear, mechanical urgency that turbocharging cannot imitate. The engine sits behind the front axle, driving the rear wheels through a seven-speed dual-clutch transmission, and the car feels balanced and precise in a way that its size and weight should not allow.",
        "The gullwing doors are part theatre and part compromise. They look magnificent opening, but they demand consideration in tight parking and low-roofed garages. The cabin is focused and well made, placing the driver low in a car that feels purposeful even at modest speed.",
        "Buy on history and specialist knowledge. The engine, transmission, suspension and the operation of the doors all deserve informed assessment. A well-maintained SLS is a modern classic with genuine collectability. A neglected one can turn its charisma into a long and expensive list of jobs.",
      ],
    },
    {
      id: "gt",
      name: "Mercedes-AMG GT",
      years: "2015–2023",
      modelFilter: "GT",
      paragraphs: [
        "The AMG GT is the most complete expression of AMG's sports-car ambition. Its front-mid-engine layout, wide stance and long bonnet give it genuine supercar proportions, while the hand-built 4.0-litre twin-turbo V8 provides the force to match the looks.",
        "The driving experience is involving without being intimidating. The steering is precise, the chassis communicates the road and the engine delivers its power with the muscular shove of a large-displacement V8 rather than the peaky delivery of a small turbo engine. The car feels settled at speed and eager when the road tightens, which is a rare combination.",
        "The range is broad. The standard GT is the sensible entry point, the GT S adds more power, the GT C brings the wider body, and the GT R sharpens the car toward genuine track intent. The GT R Pro and the later Black Series push that focus further, while the Black Series stands apart as the most extreme version of the entire platform.",
        "Buy on specification and history. Transmission behaviour, cooling, brakes, tyres, suspension and evidence of track use all deserve attention. The AMG GT is a serious performance car, and the right example is one whose maintenance story matches its capability.",
      ],
    },
    {
      id: "gt-4-door",
      name: "Mercedes-AMG GT 4-Door",
      years: "2018–present",
      modelFilter: "GT",
      paragraphs: [
        "The GT 4-Door takes the AMG GT's character and stretches it over a four-door body. It is not a conventional saloon with a sports badge. It is a low, wide, fastback-shaped car that combines coupe proportions with genuine rear-seat space, creating something distinct in the performance-car landscape.",
        "The engine range begins with the six-cylinder GT 43 and GT 53 and rises through the V8 GT 63 to the extreme GT 63 S. The higher models deliver astonishing pace, with a dual-clutch transmission and all-wheel drive putting the power down with authority. The car is heavy, but it disguises that weight with chassis control and sheer torque.",
        "This is the AMG for a buyer who wants the drama of a sports car but cannot organise life around two doors. It offers the long-bonnet proportions, the V8 soundtrack and the acceleration, while still carrying passengers and luggage when required.",
        "Complexity is the compromise. Air suspension, electronics, the drivetrain and the high-performance braking systems all deserve attention on a used example. Confirm the exact engine and specification rather than assuming every GT 4-Door carries the same character.",
      ],
    },
    {
      id: "c63-w204",
      name: "Mercedes-AMG C63 (W204)",
      years: "2008–2014",
      modelFilter: "C63",
      paragraphs: [
        "The W204 C63 is the AMG that made the brand's muscle-car character famous. It stuffed a 6.2-litre naturally aspirated V8 into a compact saloon, creating a car whose engine seemed to belong in something far larger. The result is one of the most characterful AMG models of the modern era.",
        "The engine defines the experience. It revs freely, sounds immense and delivers a wall of torque that makes the car feel eager at any speed. The seven-speed automatic is smooth but not lightning-quick, and the rear-driven chassis has a playful, old-school balance that rewards a driver who commits to the throttle.",
        "The C63 is not a razor-sharp track tool. It is a muscle car in a business suit, and that is precisely its appeal. It can be used daily, but the fuel appetite, the firm ride on some models and the sheer noise mean it is not a car for anyone seeking subtlety.",
        "Buy on engine and transmission health. Head bolts on the early 6.2-litre engines, camshaft and lifter wear, and the general condition of the drivetrain deserve specialist attention. A well-maintained W204 C63 is a modern classic with a genuinely special engine at its heart.",
      ],
    },
    {
      id: "c63-w205",
      name: "Mercedes-AMG C63 (W205)",
      years: "2015–2021",
      modelFilter: "C63",
      paragraphs: [
        "The W205 C63 swapped the old 6.2-litre engine for a 4.0-litre twin-turbo V8. The change altered the car's personality. The new engine is more flexible and more efficient, but it delivers its power with a broader, more modern character rather than the raw, high-revving aggression of its predecessor.",
        "The chassis is a step forward. The car feels more composed and more precise, with better body control and a more planted high-speed stance. The V8 still sounds properly angry, and the C63 S adds more power, adaptive damping and a limited-slip differential for a sharper edge.",
        "This is the C63 for a buyer who wants the muscle-car character with a more contemporary, more usable driving experience. It remains a loud, fast, rear-driven saloon, but it is easier to live with every day than the W204.",
        "Buy on engine and transmission history, turbocharger condition, brakes, tyres and the operation of the electronic systems. The 4.0-litre engine is robust but complex, and a complete service record matters more than a low odometer reading.",
      ],
    },
    {
      id: "e63",
      name: "Mercedes-AMG E63",
      years: "2010–2023",
      modelFilter: "E63",
      paragraphs: [
        "The E63 AMG is the V8 supersaloon in its most complete form. It takes the E-Class's refinement and practicality, then adds an AMG engine, a firmer chassis and a level of pace that remains genuinely startling. It is the car that makes the idea of a fast family saloon feel entirely natural.",
        "The earlier models used the big naturally aspirated V8, while the later W213 generation adopted the 4.0-litre twin-turbo V8 with all-wheel drive. Both are formidable. The later car adds traction and composure, while the earlier cars retain a more traditional rear-driven, old-school character.",
        "The E63 works because it does not ask its occupants to tolerate a sports-car compromise. It is quiet and comfortable when it needs to be, then becomes a serious performance machine when the road and the driver demand it. That duality is the car's defining achievement.",
        "Buy on engine, transmission, suspension and brake history. The E63 is a complex, high-performance car, and the later all-wheel-drive models in particular reward a documented service record. Condition and specification matter more than a particular model year.",
      ],
    },
    {
      id: "s63-s65",
      name: "Mercedes-AMG S63 / S65",
      years: "2010–present",
      modelFilter: "AMG S Class",
      paragraphs: [
        "The S63 and S65 AMG represent AMG's flagship expression, combining the S-Class's unmatched refinement with serious performance. The S63's V8 and the S65's V12 offer different characters, but both deliver the same fundamental idea: luxury that happens to be extraordinarily fast.",
        "The driving experience prioritises composure over aggression. These are not raw sports saloons. They are cars that make enormous speed feel effortless, isolating the driver from the drama even as the performance arrives. The ride is calm, the cabin is opulent and the engine never seems to be working hard, which is exactly the point.",
        "For a buyer who wants the ultimate combination of luxury and pace, the S63 is the natural choice, while the S65 offers the additional theatre and exclusivity of a twelve-cylinder engine. Both carry the S-Class's reputation for technology and comfort.",
        "Air suspension, electronics, climate control, drivetrain components and the operation of every comfort feature deserve careful assessment. The twelve-cylinder cars in particular require specialist understanding. Specification varies widely, so confirm the equipment fitted to the individual car.",
      ],
    },
    {
      id: "g63",
      name: "Mercedes-AMG G63",
      years: "2012–present",
      modelFilter: "G63",
      paragraphs: [
        "The G63 AMG takes the G-Class's defiant, upright character and adds an AMG engine and a level of performance that the original designers never imagined. It is an anomaly in the best sense: an off-roader that accelerates like a sports car while retaining the G-Wagen's unmistakable presence.",
        "The earlier cars used a naturally aspirated V8, while the later models adopted the twin-turbocharged 4.0-litre unit with all-wheel drive and a far more sophisticated interior. The driving experience is dominated by the car's sheer size and height, but the acceleration is immediate and the soundtrack is unmistakably AMG.",
        "The G63 appeals to buyers who want maximum presence combined with serious speed. It is not a comfortable choice for tight roads or low-effort parking, and its fuel appetite is considerable. But its combination of icon status and performance has made it one of the most desirable AMG models.",
        "Rust, chassis condition, suspension, brakes and the driveline all deserve close attention. The G-Class is a truck underneath its luxury skin, and a used example should be assessed with that in mind. Condition matters more than specification.",
      ],
    },
    {
      id: "gle-63-gls-63",
      name: "Mercedes-AMG GLE 63 / GLS 63",
      years: "2015–present",
      modelFilter: "AMG M Class",
      paragraphs: [
        "The GLE 63 and GLS 63 bring AMG performance to the SUV class. They combine the practicality of a large Mercedes-Benz SUV with the engine, brakes and chassis of a serious performance car, creating a category that barely existed before AMG entered it.",
        "The V8 engines deliver enormous acceleration for a vehicle of this size, and the air suspension, all-wheel drive and high-performance brakes manage that pace with surprising composure. These are not track cars, but they are far more capable and far faster than their bodywork suggests.",
        "The appeal is breadth. A GLE 63 can carry a family and their luggage, then deliver a genuinely thrilling driving experience when the road allows it. The GLS 63 does the same with even more space. For a buyer who wants AMG performance without sacrificing everyday practicality, these are the natural choice.",
        "Air suspension, electronics, brakes, tyres and driveline components all deserve attention on a used example. These are heavy, complex vehicles, and the cost of deferred maintenance can be significant. Buy on condition and history rather than specification alone.",
      ],
    },
    {
      id: "a45-cla45",
      name: "Mercedes-AMG A45 / CLA45",
      years: "2013–present",
      modelFilter: "A45",
      paragraphs: [
        "The A45 and CLA45 bring AMG's philosophy to the smallest, most accessible end of the range. The A45 in particular is one of the most powerful hot hatches ever built, with a heavily boosted four-cylinder engine producing output that would have seemed absurd from such a small unit a generation ago.",
        "The early cars used the 2.0-litre turbocharged engine, while the later A45 S pushes output even higher. The driving experience is rapid and responsive, with all-wheel drive providing traction and the compact body delivering genuine agility. The engine is characterful for a four-cylinder, though it cannot match the drama of the V8 models.",
        "This is the AMG for a buyer who wants the badge's performance in a car that is easy to park, economical enough to use daily and affordable to run. It offers a different kind of AMG experience, one built around accessible pace rather than overwhelming presence.",
        "Buy on engine history, turbocharger condition, suspension, brakes and the operation of the dual-clutch transmission. These cars are often driven hard, so a complete service record and evidence of careful ownership matter more than a low mileage figure.",
      ],
    },
  ],
  howToChoose: {
    title: "How to choose your Mercedes-AMG from Japan",
    paragraphs: [
      "Start with how much of the AMG character you want to live with. A C63 or E63 offers muscle with everyday practicality. An S63 prioritises luxury. An AMG GT or SLS is a focused sports car. A G63 or GLE 63 adds presence and pace to a larger, more versatile shape.",
      "Then narrow the search by engine, body style, transmission, mileage and intended use. The naturally aspirated engines of the earlier cars offer a different character from the turbocharged units that replaced them, so decide which delivery you prefer before comparing models.",
      "Confirm the exact specification and the individual car's history. AMG models are often modified or driven hard, so evidence of proper maintenance matters more than a particular model year or an attractive set of options.",
      "Condition is especially important on high-performance cars. Brakes, tyres, suspension, cooling and drivetrain components wear quickly on an AMG, and a car that has deferred that maintenance can become expensive. A specialist assessment is worth considering where mechanical confidence is needed.",
      "ZervTek can visit a vehicle in Japan, obtain additional photographs and videos, ask the dealer questions supplied by the customer, and review available maintenance records and Japanese registration history. Once you select a car, ZervTek can coordinate purchase, inland transport, export paperwork and insured RoRo or container shipping.",
      "Import eligibility and registration requirements should be confirmed for the destination before committing to a purchase.",
    ],
  },
  faqs: [
    {
      q: "What is the best Mercedes-AMG to buy for a first-time owner?",
      a: "The C63 AMG is the classic starting point, combining a genuinely special engine with everyday usability. The W204's naturally aspirated V8 offers the most character, while the W205 is more modern and more refined. A well-maintained example of either is a strong first AMG.",
    },
    {
      q: "Is the AMG GT better than the SLS AMG?",
      a: "The AMG GT is more focused, more modern and easier to drive quickly. The SLS AMG has the gullwing doors, the naturally aspirated V8 and greater collectability. Choose the SLS for icon status and character, the AMG GT for driving precision and usability.",
    },
    {
      q: "What is the best classic Mercedes-AMG to buy?",
      a: "The SLS AMG is the most collectible, while the W204 C63 with its 6.2-litre V8 is the most characterful modern classic. Both offer an engine experience that the turbocharged cars cannot quite match. Condition and history should guide the choice.",
    },
    {
      q: "Is the G63 AMG a good car to buy?",
      a: "Yes, for buyers who value its unique combination of G-Class presence and AMG performance. It is heavy, thirsty and demanding to place, so it is not a sensible daily car for everyone. A clean, well-maintained example holds value exceptionally well.",
    },
    {
      q: "What is the difference between the C63 AMG generations?",
      a: "The W204 uses a 6.2-litre naturally aspirated V8 with a raw, high-revving character. The W205 uses a 4.0-litre twin-turbo V8 that is more flexible and more efficient. The W204 is the enthusiast's choice, while the W205 is the more usable everyday car.",
    },
    {
      q: "Which Mercedes-AMG is best for families?",
      a: "The E63 AMG is the natural choice for a family that wants a fast saloon, while the GLE 63 and GLS 63 offer the most space and versatility. All three combine genuine performance with the practicality their buyers need.",
    },
    {
      q: "Can ZervTek source a Mercedes-AMG from Japan?",
      a: "Yes. ZervTek can search Japanese dealer stock and auctions against your requirements, obtain further vehicle information and help coordinate the purchase and export process. Availability, specification and destination eligibility must be confirmed for each vehicle.",
    },
  ],
  closing: {
    title: "Find your Mercedes-AMG from Japan",
    body: "Tell us the model, spec, and destination. We'll search Japan for you.",
  },
} as const;

export const MERCEDES_AMG_MODEL_GUIDES: Record<string, MakeModelGuide> = {};

export function getMercedesAmgModelGuide(model: string): MakeModelGuide | null {
  return lookupModelGuide(MERCEDES_AMG_MODEL_GUIDES, model);
}

export function mercedesAmgStockHref(model?: string): string {
  return buildStockHref({ make: "Mercedes-AMG", model: model || undefined });
}
