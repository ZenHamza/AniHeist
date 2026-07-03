import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";

interface SectionHeaderProps {
  title: string;
  href?: string;
}

export function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-text">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm text-text-muted hover:text-accent transition-colors"
        >
          View All <FaChevronRight size={12} />
        </Link>
      )}
    </div>
  );
}
