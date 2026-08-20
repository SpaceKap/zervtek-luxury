import Image from "next/image";
import Link from "next/link";

type Props = {
  showLuxury?: boolean;
  href?: string;
  className?: string;
  onClick?: () => void;
};

export function Logo({ showLuxury = true, href = "/", className = "", onClick }: Props) {
  const inner = (
    <>
      <Image
        src="/logo.png"
        alt="ZervTek"
        width={938}
        height={281}
        priority
        className="brand-img"
      />
      {showLuxury ? <span className="brand-sub">Performance</span> : null}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`brand-logo ${className}`.trim()}
        onClick={onClick}
        aria-label="ZervTek Performance home"
      >
        {inner}
      </Link>
    );
  }

  return <div className={`brand-logo ${className}`.trim()}>{inner}</div>;
}
