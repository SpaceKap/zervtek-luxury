import { serializeJsonLd } from "@/lib/json-ld";

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // Safe serializer escapes HTML-sensitive chars so stored text cannot break out of the script.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
