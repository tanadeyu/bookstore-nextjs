import Link from "next/link";

const navItems = [
  { href: "/", label: "ダッシュボード" },
  { href: "/products", label: "商品" },
  { href: "/customers", label: "顧客" },
  { href: "/sales", label: "販売" },
];

export function Navigation() {
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16">
          <div className="flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex items-center px-4 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
