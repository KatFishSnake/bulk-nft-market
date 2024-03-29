import type { NextApiRequest, NextApiResponse } from 'next';

const collectionApi = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Cache-Control', 's-maxage=86400');
  const { collection_id } = req.query;
  const result = await fetch(
    `${process.env.OPENSEA_API_URL}/collection/${collection_id}`
  );
  const body = await result.body;
  (body as any)?.pipe(res);
};

export default collectionApi;

export const config = {
  runtime: 'experimental-edge',
};
