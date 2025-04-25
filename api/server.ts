import GeminiSubmit from './gemini';
import type { RequestBody } from './type';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

Bun.serve({
  port: 8080,
  fetch(req) {
    const url = new URL(req.url);
    console.log(`Request received: ${url.pathname}`);
    if (url.pathname === '/') {
      return new Response('Hello, Bun Server!', { headers: corsHeaders });
    }
    if (url.pathname === '/health') {
      return new Response('OK', { headers: corsHeaders });
    }
    if (url.pathname === '/api/submit') {
      const handlePost = async (req: RequestBody) => {
        const postData = await req.json();
        console.log('Received data:', postData);
        return GeminiSubmit(postData)
          .then((response) => {
            console.log('Gemini API response:', response);
            return new Response(JSON.stringify(response), {
              headers: { ...corsHeaders },
            });
          })
          .catch((error) => {
            console.error('Error calling Gemini API:', error);
            return new Response('Error calling Gemini API', {
              status: 500,
              headers: { ...corsHeaders },
            });
          });
      };
      return handlePost(req);
    }
    return new Response('Not Found', { status: 404, headers: corsHeaders });
  },
  development: true,
  error(error) {
    return new Response(`<pre>${error}\n${error.stack}</pre>`, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
      },
    });
  },
});

console.log('Server is running on http://localhost:8080');
