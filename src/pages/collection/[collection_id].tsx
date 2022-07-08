import Collection from '@/components/Collection';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';

const CollectionPage = () => {
  return (
    <Layout>
      <Seo templateTitle='Token' description='Individual token page' />
      <Collection />
    </Layout>
  );
};

export default CollectionPage;
