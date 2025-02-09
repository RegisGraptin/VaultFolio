import Image from 'next/image'
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white rounded-lg">
      <div className="w-full max-w-screen-xl mx-auto md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link
            href="/"
            title={process.env.NEXT_PUBLIC_SITE_NAME}
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <Image 
              src="/images/logo.svg" 
              className="h-8" 
              alt={`${process.env.NEXT_PUBLIC_SITE_NAME} Logo`} 
              width={32}
              height={32}
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap">
              {process.env.NEXT_PUBLIC_SITE_NAME}
            </span>
          </Link>
          {/* <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul> */}
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center">
          &copy; {new Date().getFullYear()}{" "}
          <Link href="/" className="hover:underline" title={process.env.NEXT_PUBLIC_SITE_NAME}>
            {process.env.NEXT_PUBLIC_SITE_NAME}
          </Link>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
