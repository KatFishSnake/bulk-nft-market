import * as React from 'react';

import Collections from '@/components/Collections';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

export default function HomePage() {
  return (
    <Layout>
      <Seo templateTitle='BNFT' />
      <Collections />
    </Layout>
  );
}
