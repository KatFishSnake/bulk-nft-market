import * as React from 'react';
import { useRouter } from 'next/router';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function TokenPage() {
  const router = useRouter();
  const { tokenid } = router.query;

  return (
    <Layout>
      <Seo templateTitle='Token' description='Individual token page' />

      <main>
        <p>token - {tokenid}</p>
      </main>
    </Layout>
  );
}
