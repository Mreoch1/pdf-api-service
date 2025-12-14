import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Documentation - PDF Generation API',
  description: 'Complete API documentation for PDF generation. Code examples, endpoints, and integration guides.',
}

export default function DocsPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            API Documentation
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Generate PDFs from HTML with our simple REST API. Get started in minutes.
          </p>

          {/* Authentication */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Authentication</h2>
            <p className="mt-4 text-gray-600">
              All API requests require authentication using an API key. Include your API key in the request header:
            </p>
            <div className="mt-4 rounded-lg bg-gray-900 p-4">
              <pre className="text-sm text-gray-100">
                <code>{`X-API-Key: your_api_key_here

# Or using Authorization header:
Authorization: Bearer your_api_key_here`}</code>
              </pre>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              You can generate API keys from your <a href="/dashboard" className="text-blue-600 hover:text-blue-500">dashboard</a>.
            </p>
          </section>

          {/* Generate PDF Endpoint */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Generate PDF</h2>
            <p className="mt-4 text-gray-600">
              Convert HTML content to PDF format.
            </p>

            <div className="mt-4 rounded-lg bg-gray-900 p-4">
              <pre className="text-sm text-gray-100">
                <code>{`POST /api/pdf/generate
Content-Type: application/json
X-API-Key: your_api_key_here

{
  "html": "<h1>Hello World</h1><p>This is a PDF!</p>",
  "format": "A4",
  "margin": {
    "top": "20mm",
    "right": "20mm",
    "bottom": "20mm",
    "left": "20mm"
  },
  "printBackground": true,
  "scale": 1
}`}</code>
              </pre>
            </div>

            <h3 className="mt-6 text-xl font-semibold text-gray-900">Request Parameters</h3>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Parameter</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Required</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">html</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">string</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">Yes</td>
                    <td className="px-3 py-4 text-sm text-gray-500">HTML content to convert to PDF</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">format</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">string</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">No</td>
                    <td className="px-3 py-4 text-sm text-gray-500">Page format: A4, Letter, or Legal (default: A4)</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">margin</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">object</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">No</td>
                    <td className="px-3 py-4 text-sm text-gray-500">Page margins (top, right, bottom, left)</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">printBackground</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">boolean</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">No</td>
                    <td className="px-3 py-4 text-sm text-gray-500">Include background graphics (default: true)</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">scale</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">number</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">No</td>
                    <td className="px-3 py-4 text-sm text-gray-500">Scale factor (0.1 to 2, default: 1)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="mt-6 text-xl font-semibold text-gray-900">Response</h3>
            <p className="mt-4 text-gray-600">
              Returns a PDF file with <code className="text-sm bg-gray-100 px-1 py-0.5 rounded">Content-Type: application/pdf</code>
            </p>
          </section>

          {/* Code Examples */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Code Examples</h2>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900">cURL</h3>
              <div className="mt-2 rounded-lg bg-gray-900 p-4">
                <pre className="text-sm text-gray-100 overflow-x-auto">
                  <code>{`curl -X POST https://api.example.com/api/pdf/generate \\
  -H "X-API-Key: your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "html": "<h1>Hello World</h1><p>This is a PDF!</p>"
  }' \\
  --output document.pdf`}</code>
                </pre>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900">JavaScript (Fetch)</h3>
              <div className="mt-2 rounded-lg bg-gray-900 p-4">
                <pre className="text-sm text-gray-100 overflow-x-auto">
                  <code>{`const response = await fetch('https://api.example.com/api/pdf/generate', {
  method: 'POST',
  headers: {
    'X-API-Key': 'your_api_key_here',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    html: '<h1>Hello World</h1><p>This is a PDF!</p>',
    format: 'A4',
  }),
});

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'document.pdf';
a.click();`}</code>
                </pre>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900">Python</h3>
              <div className="mt-2 rounded-lg bg-gray-900 p-4">
                <pre className="text-sm text-gray-100 overflow-x-auto">
                  <code>{`import requests

response = requests.post(
    'https://api.example.com/api/pdf/generate',
    headers={
        'X-API-Key': 'your_api_key_here',
        'Content-Type': 'application/json',
    },
    json={
        'html': '<h1>Hello World</h1><p>This is a PDF!</p>',
        'format': 'A4',
    }
)

with open('document.pdf', 'wb') as f:
    f.write(response.content)`}</code>
                </pre>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900">Node.js</h3>
              <div className="mt-2 rounded-lg bg-gray-900 p-4">
                <pre className="text-sm text-gray-100 overflow-x-auto">
                  <code>{`const axios = require('axios');
const fs = require('fs');

const response = await axios.post(
  'https://api.example.com/api/pdf/generate',
  {
    html: '<h1>Hello World</h1><p>This is a PDF!</p>',
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

fs.writeFileSync('document.pdf', response.data);`}</code>
                </pre>
              </div>
            </div>
          </section>

          {/* Error Handling */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Error Handling</h2>
            <p className="mt-4 text-gray-600">
              The API uses standard HTTP status codes:
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Status Code</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">200</td>
                    <td className="px-3 py-4 text-sm text-gray-500">Success - PDF generated</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">400</td>
                    <td className="px-3 py-4 text-sm text-gray-500">Bad Request - Invalid input</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">401</td>
                    <td className="px-3 py-4 text-sm text-gray-500">Unauthorized - Invalid or missing API key</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">403</td>
                    <td className="px-3 py-4 text-sm text-gray-500">Forbidden - Usage limit exceeded</td>
                  </tr>
                  <tr>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">500</td>
                    <td className="px-3 py-4 text-sm text-gray-500">Internal Server Error</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Rate Limits */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Rate Limits & Usage</h2>
            <div className="mt-4 rounded-lg bg-blue-50 p-4">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Free Tier:</strong> 10 PDFs per month</li>
                <li><strong>Pay-as-you-go:</strong> $0.01 per PDF after free tier</li>
                <li><strong>Pro:</strong> $9/month for 1,000 PDFs</li>
                <li><strong>Enterprise:</strong> $49/month for 10,000 PDFs</li>
              </ul>
            </div>
          </section>

          {/* Support */}
          <section className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900">Need Help?</h2>
            <p className="mt-4 text-gray-600">
              Check your usage and manage your API keys from your <a href="/dashboard" className="text-blue-600 hover:text-blue-500">dashboard</a>.
              For questions or support, contact us at support@example.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

