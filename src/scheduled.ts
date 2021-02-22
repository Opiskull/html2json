import { RequestBody } from './models'
import { scrapeHTML } from './scraper'

export async function handleScheduled(event: ScheduledEvent) {
  const configs: { [key: string]: RequestBody } =
    (await CONFIG_STORE.get('configs', 'json')) || {}

  const date = new Date(event.scheduledTime)
  date.setSeconds(0)
  date.setMilliseconds(0)
  const time = date.toISOString()

  for (const [key, value] of Object.entries(configs)) {
    const json = await scrapeHTML(value)

    await JSON_STORE.put(`${key}.${time}`, JSON.stringify(json), {
      expirationTtl: 172800,
    })
  }
}
