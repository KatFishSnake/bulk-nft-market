import React from 'react';

import Collections from '@/components/Collections';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

const CollectionsPage = () => {
  return (
    <Layout>
      <Seo templateTitle='NFT collections' />
      <Collections />
    </Layout>
  );
};

export default CollectionsPage;
