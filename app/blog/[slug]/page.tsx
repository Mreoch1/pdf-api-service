import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

const posts: Record<string, { title: string; content: string; date: string }> = {
  'how-to-generate-pdfs-in-nodejs': {
    title: 'How to Generate PDFs in Node.js',
    date: '2025-01-15',
    content: `
# How to Generate PDFs in Node.js

Generating PDFs from HTML is a common requirement in modern web applications. Whether you're creating invoices, reports, or documents, having a reliable PDF generation solution is essential.

## Why Use a PDF API?

While you can generate PDFs directly in Node.js using libraries like Puppeteer or PDFKit, using a dedicated PDF API offers several advantages:

- **No server resources**: PDF generation is handled by the API, not your server
- **Scalability**: Handle thousands of PDFs without worrying about server load
- **Reliability**: Professional infrastructure with high uptime
- **Maintenance-free**: No need to manage PDF generation libraries

## Getting Started

First, sign up for an account and get your API key from the dashboard. Then, install a HTTP client library:

\`\`\`bash
npm install axios
\`\`\`

## Basic Example

Here's a simple example of generating a PDF:

\`\`\`javascript
const axios = require('axios');
const fs = require('fs');

async function generatePDF() {
  try {
    const response = await axios.post(
      'https://api.example.com/api/pdf/generate',
      {
        html: '<h1>Hello World</h1><p>This is a PDF document!</p>',
        format: 'A4',
      },
      {
        headers: {
          'X-API-Key': 'your_api_key_here',
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );

    fs.writeFileSync('output.pdf', response.data);
    console.log('PDF generated successfully!');
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

generatePDF();
\`\`\`

## Advanced Usage

You can customize the PDF output with various options:

\`\`\`javascript
const response = await axios.post(
  'https://api.example.com/api/pdf/generate',
  {
    html: '<html>...</html>',
    format: 'Letter',
    margin: {
      top: '30mm',
      right: '20mm',
      bottom: '30mm',
      left: '20mm',
    },
    printBackground: true,
    scale: 1.2,
  },
  {
    headers: {
      'X-API-Key': 'your_api_key_here',
      'Content-Type': 'application/json',
    },
    responseType: 'arraybuffer',
  }
);
\`\`\`

## Best Practices

1. **Cache HTML templates**: Store your HTML templates in a database or file system
2. **Error handling**: Always wrap API calls in try-catch blocks
3. **Rate limiting**: Be mindful of API rate limits
4. **Async operations**: Use async/await for better error handling

## Conclusion

Generating PDFs with our API is simple and reliable. Start with the free tier to test it out, then scale as needed.
    `,
  },
  'best-pdf-apis-2025': {
    title: 'Best PDF APIs in 2025',
    date: '2025-01-10',
    content: `
# Best PDF APIs in 2025

Choosing the right PDF generation API is crucial for your application's success. Here's a comprehensive comparison of the best PDF APIs available in 2025.

## Key Features to Consider

When evaluating PDF APIs, consider these factors:

- **Ease of integration**: How simple is it to get started?
- **Pricing**: Is the pricing model suitable for your use case?
- **Reliability**: What's the uptime guarantee?
- **Performance**: How fast is PDF generation?
- **Documentation**: Is the documentation comprehensive?

## Top PDF APIs

### 1. PDF Generation API

Our API offers:

- Simple REST API
- Free tier with 10 PDFs/month
- Pay-as-you-go pricing
- Fast generation times
- Comprehensive documentation

### 2. Alternative Solutions

Other popular options include:

- **API Service A**: Good for high-volume use cases
- **API Service B**: Best for enterprise customers
- **API Service C**: Great for simple use cases

## Comparison Table

| Feature | Our API | Service A | Service B |
|---------|---------|-----------|-----------|
| Free Tier | Yes (10/month) | No | Yes (5/month) |
| Pay-per-use | $0.01 | $0.02 | $0.015 |
| Uptime | 99.9% | 99.5% | 99.8% |
| Speed | Fast | Medium | Fast |

## Making the Right Choice

Consider your specific needs:

- **Small projects**: Start with a free tier
- **Growing applications**: Look for scalable pricing
- **Enterprise**: Prioritize reliability and support

## Conclusion

The best PDF API depends on your specific requirements. Our API offers a great balance of features, pricing, and reliability for most use cases.
    `,
  },
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const post = posts[params.slug]
  
  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} - PDF Generation API Blog`,
    description: post.content.substring(0, 160),
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts[params.slug]

  if (!post) {
    notFound()
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <article>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-gray-500">
            Published on {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <div
            className="prose prose-lg mt-8 max-w-none"
            dangerouslySetInnerHTML={{
              __html: post.content
                .split('\n')
                .map((line) => {
                  if (line.startsWith('# ')) {
                    return `<h1>${line.substring(2)}</h1>`
                  }
                  if (line.startsWith('## ')) {
                    return `<h2>${line.substring(3)}</h2>`
                  }
                  if (line.startsWith('### ')) {
                    return `<h3>${line.substring(4)}</h3>`
                  }
                  if (line.startsWith('```')) {
                    return ''
                  }
                  if (line.trim() === '') {
                    return '<br/>'
                  }
                  return `<p>${line}</p>`
                })
                .join(''),
            }}
          />
        </article>
      </div>
    </div>
  )
}

