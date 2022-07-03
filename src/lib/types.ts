export type CollectionType = {
  slug: string;
  name: string | null;
  description: string | null;
  short_description: string | null;
  banner_image_url: string | null;
  stats: {
    total_supply: number;
  };
  primary_asset_contracts: Array<{
    address: string;
  }>;
};

export type TokenType = {
  id: string;
  name: string | null;
  description: string | null;
  image_url: string | null;
  image_thumbnail_url: string | null;
  permalink: string;
  asset_contract: {
    address: string;
  };
  collection?: {
    slug: string;
    name: string | null;
  };
};
