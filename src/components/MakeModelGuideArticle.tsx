import Link from "next/link";
import { Faq } from "@/components/Faq";
import type { MakeModelGuide } from "@/lib/make-hubs/types";
import { stockBrowsePath } from "@/lib/stock";

type Props = {
  make: string;
  model: string;
  guide: MakeModelGuide;
};

/** Editorial block under model stock — only when a make-model guide exists. */
export function MakeModelGuideArticle({ make, guide }: Props) {
  return (
    <div className="make-hub-model-spoke">
      <article className="make-hub-article">
        {guide.sections.map((section) => (
          <section key={section.id} id={section.id} className="make-hub-block">
            <h2 className="heading">{section.heading}</h2>
            {section.paragraphs.map((p) => (
              <p key={p.slice(0, 48)} className="make-hub-prose">
                {p}
              </p>
            ))}
          </section>
        ))}
      </article>

      {guide.faqs && guide.faqs.length > 0 ? (
        <section className="make-hub-faq" aria-labelledby="model-guide-faq">
          <h2 id="model-guide-faq" className="heading">
            Frequently asked questions
          </h2>
          <Faq items={[...guide.faqs]} />
        </section>
      ) : null}

      <p className="make-hub-spoke-links">
        <Link href={stockBrowsePath(make)}>All {make} stock</Link>
        <span aria-hidden="true"> · </span>
        <Link href={`${stockBrowsePath(make)}#short-answer`}>General {make} guide</Link>
      </p>
    </div>
  );
}
