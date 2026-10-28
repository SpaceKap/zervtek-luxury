import { Fragment, type ReactNode } from "react";
import { parseDescription, type InlineNode } from "@/lib/description-markdown";

function renderInline(nodes: InlineNode[]): ReactNode[] {
  return nodes.map((node, i) => {
    if (typeof node === "string") return <Fragment key={i}>{node}</Fragment>;
    if (node.type === "strong") return <strong key={i}>{renderInline(node.children)}</strong>;
    if (node.type === "em") return <em key={i}>{renderInline(node.children)}</em>;
    return (
      <a key={i} href={node.href} target="_blank" rel="nofollow noopener noreferrer">
        {renderInline(node.children)}
      </a>
    );
  });
}

export function RichDescription({
  source,
  className,
}: {
  source: string | null | undefined;
  className?: string;
}) {
  const blocks = parseDescription(source);
  if (blocks.length === 0) return null;

  return (
    <div className={["rich-description", className].filter(Boolean).join(" ")}>
      {blocks.map((block, i) => {
        if (block.type === "heading") return <h3 key={i}>{renderInline(block.children)}</h3>;
        if (block.type === "paragraph") {
          return (
            <p key={i}>
              {block.lines.map((line, j) => (
                <Fragment key={j}>
                  {j > 0 ? <br /> : null}
                  {renderInline(line)}
                </Fragment>
              ))}
            </p>
          );
        }
        const List = block.ordered ? "ol" : "ul";
        return (
          <List key={i}>
            {block.items.map((item, j) => (
              <li key={j}>{renderInline(item)}</li>
            ))}
          </List>
        );
      })}
    </div>
  );
}
