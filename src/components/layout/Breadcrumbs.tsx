'use client';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="bg-poker-felt-dark border-b-2 border-poker-gold text-poker-gold px-4 py-2">
      <ol className="flex items-center space-x-2 text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && <span className="mx-2 text-poker-gold-light">/</span>}
            {item.href ? (
              <a href={item.href} className="hover:text-poker-gold-light transition-colors">
                {item.label}
              </a>
            ) : (
              <span className={index === items.length - 1 ? 'font-semibold text-poker-gold' : 'text-poker-gold-light'}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

