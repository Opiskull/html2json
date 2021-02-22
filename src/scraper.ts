import { HTMLElement, parse, valid } from 'node-html-parser'
import { PropertySelector, PropertySelectors, RequestBody } from './models'

function getValue(
  element: HTMLElement,
  propertySelector: PropertySelector,
): string {
  const e = element.querySelector(propertySelector.selector)
  let val = ''
  if (propertySelector.attribute) {
    val = e.getAttribute(propertySelector.attribute) || ''
  } else {
    val = e.innerText.trim()
  }
  if (propertySelector.regex) {
    let match = val.match(propertySelector.regex)
    val = match && match[0] ? match[0] : ''
  }
  return val
}

function toObject(element: HTMLElement, propertySelectors: PropertySelectors) {
  const item: PropertySelectors = {}

  for (const [key, value] of Object.entries(propertySelectors)) {
    if (typeof value === 'string') {
      item[key] = getValue(element, { selector: value })
    } else if (value instanceof Object) {
      item[key] = getValue(element, value)
    }
  }

  return item
}

export async function scrapeHTML(body: RequestBody) {
  const htmlRequest = await fetch(body.url, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
      'user-agent': 'scraper',
    },
  })

  const htmlBody = await htmlRequest.text()

  if (!valid(htmlBody)) {
    throw new Error('Invalid html')
  }

  const root = parse(htmlBody)

  const items = root.querySelectorAll(body.itemSelector)

  return items.map((_) => toObject(_, body.propertySelectors))
}
