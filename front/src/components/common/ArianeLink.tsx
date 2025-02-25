import Link from "next/link";

const VaultDetailWidget = () => {
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <div className="flex items-center">
            <Link
              href="/dashboard"
              title="Dashboard"
              className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </li>
        <li>
          <div className="flex items-center">
            <svg
              className="h-4 w-4 flex-shrink-0 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="ml-2 text-sm font-medium text-gray-700 aria-[current=page]:text-gray-500">
              {"FIXME: " as string}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  </div>;
};
export default VaultDetailWidget;
