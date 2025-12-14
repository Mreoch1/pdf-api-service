import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog - PDF Generation API',
  description: 'Learn about PDF generation, API best practices, and integration guides.',
}

const posts = [
  {
    slug: 'how-to-generate-pdfs-in-nodejs',
    title: 'How to Generate PDFs in Node.js',
    excerpt: 'A comprehensive guide to generating PDFs from HTML using Node.js and our PDF API.',
    date: '2025-01-15',
  },
  {
    slug: 'best-pdf-apis-2025',
    title: 'Best PDF APIs in 2025',
    excerpt: 'Compare the top PDF generation APIs and find the best solution for your project.',
    date: '2025-01-10',
  },
]

export default function BlogPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Blog
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Learn about PDF generation, API best practices, and integration guides.
        </p>

        <div className="mt-12 space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-gray-200 pb-8">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold text-gray-900 hover:text-blue-600">
                  {post.title}
                </h2>
              </Link>
              <p className="mt-2 text-gray-600">{post.excerpt}</p>
              <p className="mt-4 text-sm text-gray-500">
                Published on {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-block text-blue-600 hover:text-blue-500"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

