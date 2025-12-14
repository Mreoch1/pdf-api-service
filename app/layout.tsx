import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PDF Generation API - Convert HTML to PDF | Fast & Reliable",
  description: "Generate PDFs from HTML with our powerful API. Free tier available. Simple integration, reliable service, pay-per-use pricing.",
  keywords: "PDF API, HTML to PDF, PDF generation, API service",
  openGraph: {
    title: "PDF Generation API - Convert HTML to PDF",
    description: "Generate PDFs from HTML with our powerful API. Free tier available.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PDF Generation API",
    "applicationCategory": "DeveloperApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "100"
    }
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <nav className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link href="/" className="text-xl font-bold text-gray-900">
                  PDF API
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  href="/docs"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Documentation
                </Link>
                <Link
                  href="/pricing"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Pricing
                </Link>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </nav>
        {children}
        <footer className="border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Product</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="/docs" className="text-sm text-gray-600 hover:text-gray-900">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Company</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="/blog" className="text-sm text-gray-600 hover:text-gray-900">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                      Privacy
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Connect</h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <a href="https://github.com" className="text-sm text-gray-600 hover:text-gray-900">
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t border-gray-200 pt-8">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} PDF API. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
