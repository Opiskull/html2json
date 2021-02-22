import { RequestBody } from './models'
import { scrapeHTML } from './scraper'

export async function handleRequest(request: Request): Promise<Response> {
  if (request.method === 'POST') {
    const body: RequestBody = await request.json()

    const json = await scrapeHTML(body)

    return new Response(JSON.stringify(json), {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
      },
    })
  }

  return new Response(`no json post`, {
    status: 400,
    headers: { 'content-type': 'application/json;charset=UTF-8' },
  })
}
