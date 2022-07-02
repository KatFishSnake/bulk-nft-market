import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import Collections from '@/components/Collections';

export default function HomePage() {
  return (
    <Layout>
      <Seo templateTitle='BNFT' />
      <Collections />
    </Layout>
  );
}
