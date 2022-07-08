import type { NextApiRequest, NextApiResponse } from 'next';

const imageProxyApi = async (req: NextApiRequest, res: NextApiResponse) => {
  const { url } = req.query;
  const urlToFetch = decodeURIComponent(`${url}`);
  const result = await fetch(urlToFetch);
  const body = await result.body;
  (body as any)?.pipe(res);
};

export default imageProxyApi;

export const config = {
  runtime: 'experimental-edge',
};
