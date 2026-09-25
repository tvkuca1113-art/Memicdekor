// Lokalna zamjena za Resend API, samo za automatske testove.
// POST /emails vraća { id } kao pravi servis; poruka s „[simuliraj-gresku]” vraća HTTP 500,
// a „[simuliraj-sporo]” odgađa odgovor da se vidi stanje slanja.
import http from 'node:http';

const port = Number(process.env.MOCK_RESEND_PORT ?? 3299);
const sent = [];

const server = http.createServer(async (request, response) => {
  const reply = (status, body) => {
    response.writeHead(status, { 'content-type': 'application/json' });
    response.end(body === undefined ? '' : JSON.stringify(body));
  };

  if (request.url === '/health') return reply(200, { ok: true });
  if (request.url === '/__sent' && request.method === 'GET') return reply(200, sent);
  if (request.url === '/__sent' && request.method === 'DELETE') {
    sent.length = 0;
    return reply(204);
  }

  if (request.url === '/emails' && request.method === 'POST') {
    let raw = '';
    for await (const chunk of request) raw += chunk;
    if (request.headers.authorization !== 'Bearer test-kljuc') {
      return reply(401, { message: 'API key is invalid' });
    }
    const email = JSON.parse(raw);
    if (String(email.text).includes('[simuliraj-gresku]')) return reply(500, { message: 'Internal server error' });
    if (String(email.text).includes('[simuliraj-sporo]')) await new Promise((resolve) => setTimeout(resolve, 1500));
    const id = `test-${sent.length + 1}`;
    sent.push({ id, ...email });
    return reply(200, { id });
  }

  return reply(404, { message: 'Not found' });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Mock Resend API na http://127.0.0.1:${port}`);
});
