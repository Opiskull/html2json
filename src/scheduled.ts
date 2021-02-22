import { RequestBody } from './models';
import { scrapeHTML } from './scraper';

export async function handleScheduled(event: ScheduledEvent) {
  const configs: { [key: string]: RequestBody } =
    (await CONFIG_STORE.get('configs', 'json')) || {};

  const date = new Date(event.scheduledTime);
  date.setSeconds(0);
  date.setMilliseconds(0);
  const time = date.toISOString();

  await Promise.all(
    Object.entries(configs).map((_) => {
      const [key, value] = _;
      return scrapeHTML(value).then((json) =>
        JSON_STORE.put(`${key}.${time}`, JSON.stringify(json), {
          expirationTtl: 172800,
        }),
      );
    }),
  );
}
