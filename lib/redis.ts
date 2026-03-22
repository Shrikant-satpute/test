import type { ResultsData, SPOMResultsData } from '@/lib/types';

function isRedisConfigured() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export async function getResults(): Promise<ResultsData> {
  if (isRedisConfigured()) {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
    return (await redis.get<ResultsData>('ca_results')) ?? {};
  }

  // Local dev fallback
  const fs = await import('fs');
  const path = await import('path');
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'results.json'), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function setResults(data: ResultsData): Promise<void> {
  if (isRedisConfigured()) {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
    await redis.set('ca_results', data);
    return;
  }

  // Local dev fallback
  const fs = await import('fs');
  const path = await import('path');
  fs.writeFileSync(
    path.join(process.cwd(), 'data', 'results.json'),
    JSON.stringify(data, null, 2),
    'utf-8'
  );
}

// ─── SPOM Results ─────────────────────────────────────────────────────────────

export async function getSPOMResults(): Promise<SPOMResultsData> {
  if (isRedisConfigured()) {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
    return (await redis.get<SPOMResultsData>('spom_results')) ?? {};
  }

  const fs = await import('fs');
  const path = await import('path');
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), 'data', 'spom_results.json'), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export async function setSPOMResults(data: SPOMResultsData): Promise<void> {
  if (isRedisConfigured()) {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    });
    await redis.set('spom_results', data);
    return;
  }

  const fs = await import('fs');
  const path = await import('path');
  fs.writeFileSync(
    path.join(process.cwd(), 'data', 'spom_results.json'),
    JSON.stringify(data, null, 2),
    'utf-8'
  );
}
