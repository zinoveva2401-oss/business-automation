interface IndexNowOptions { host: string; key: string; keyLocation: string; urls: string[]; }

export async function submitToIndexNow({ host, key, keyLocation, urls }: IndexNowOptions): Promise<Response | undefined> {
  if (!host || !key || !keyLocation || urls.length === 0) return undefined;
  return fetch('https://api.indexnow.org/indexnow', {
    method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key, keyLocation, urlList: urls }),
  });
}
