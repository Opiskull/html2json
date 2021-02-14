interface RequestBody {
  url: string;
  itemSelector: string;
  propertySelectors: PropertySelectors;
}

interface PropertySelectors {
  [property: string]: string
}

import { HTMLElement, parse } from 'node-html-parser';

function toObject(element: HTMLElement, propertySelectors: PropertySelectors) {
  const item: PropertySelectors = {};

  for (const [key, value] of Object.entries(propertySelectors)) {    
    item[key] = element.querySelector(value).text;
  }

  return item;
}

async function getHTML(body: RequestBody) {
  const htmlRequest = await fetch(body.url, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  });

  const htmlBody = await htmlRequest.text();

  const root = parse(htmlBody);

  const items = root.querySelectorAll(body.itemSelector);    

  return items.map(_ => toObject(_, body.propertySelectors));
}

export async function handleRequest(request: Request): Promise<Response> {

  if(request.method === 'POST') {
    const body: RequestBody = await request.json();

    const json = await getHTML(body);    

    return new Response(JSON.stringify(json), {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
    });
  }

  return new Response(`no json post`, { status: 400, headers: {"content-type":"application/json;charset=UTF-8"}});
}
