import type { NextApiRequest, NextApiResponse } from 'next';

const contractAddressApi = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const { contract_address, order, limit } = req.query;
  const result = await fetch(
    `${process.env.OPENSEA_API_URL}/assets?asset_contract_address=${contract_address}&order_direction=${order}&offset=0&limit=${limit}&include_orders=false`
  );
  const body = await result.body;
  (body as any)?.pipe(res);
};

export default contractAddressApi;

export const config = {
  runtime: 'experimental-edge',
};
