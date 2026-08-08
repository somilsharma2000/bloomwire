import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center flex-wrap gap-2 text-sm text-[#6B6B6B]">
      <Link to="/" className="text-bloom-rose hover:underline font-medium transition-colors">
        Home
      </Link>
      {items.map((item, idx) => (
        <span key={idx} className="flex items-center gap-2">
          <span className="text-[#9A9A9A]">&gt;</span>
          {item.to ? (
            <Link to={item.to} className="text-bloom-rose hover:underline font-medium transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#2D2D2D] font-medium truncate max-w-[200px] sm:max-w-none">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  )
}
