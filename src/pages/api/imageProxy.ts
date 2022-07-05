import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;
  const urlToFetch = decodeURIComponent(`${url}`);
  const result = await fetch(urlToFetch);
  const body = await result.body;
  (body as any)?.pipe(res);
};

export const config = {
  runtime: 'experimental-edge',
};
