import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Cache-Control', 's-maxage=86400');
  const result = await fetch(
    `${process.env.OPENSEA_API_URL}/collections?offset=0&limit=300`
  );
  const body = await result.body;
  (body as any)?.pipe(res);
};
