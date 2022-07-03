import type { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader('Cache-Control', 's-maxage=86400');
  const { contract_address, order, limit } = req.query;
  const result = await fetch(
    `${process.env.OPENSEA_API_URL}/assets?asset_contract_address=${contract_address}&order_direction=${order}&offset=0&limit=${limit}&include_orders=false`
  );
  const body = await result.body;
  (body as any)?.pipe(res);
};
