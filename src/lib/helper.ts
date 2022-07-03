type OpenGraphType = {
  siteName: string;
  description: string;
  templateTitle?: string;
  logo?: string;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

// TODO should really do a mkcert proxy locally to have https universally
export const getSiteUrl = () =>
  `${
    process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' ? 'http' : 'https'
  }://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

// Please clone them and self-host if your site is going to be visited by many people.
// Then change the url and the default logo.
export function openGraph({
  siteName,
  templateTitle,
  description,
  logo = `${siteUrl}/images/logo.jpg`,
}: OpenGraphType): string {
  const ogLogo = encodeURIComponent(logo);
  const ogSiteName = encodeURIComponent(siteName.trim());
  const ogTemplateTitle = templateTitle
    ? encodeURIComponent(templateTitle.trim())
    : undefined;
  const ogDesc = encodeURIComponent(description.trim());

  return `${siteUrl}/api/general?siteName=${ogSiteName}&description=${ogDesc}&logo=${ogLogo}${
    ogTemplateTitle ? `&templateTitle=${ogTemplateTitle}` : ''
  }`;
}

export const sortListBy = (list: Array<any> = [], key: string) =>
  list.sort((a, b) => (a?.[key] || '').localeCompare(b?.[key] || ''));
