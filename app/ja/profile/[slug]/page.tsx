import { LocalizedTenantProfilePage } from "@/components/localized-profile-page";
import { getDictionary } from "@/lib/i18n";
import { getTenantBySlug, tenants } from "@/lib/tower-data";

type ProfilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return tenants.map((tenant) => ({
    slug: tenant.slug
  }));
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { slug } = await params;
  const tenant = getTenantBySlug(slug);

  if (!tenant) {
    return {
      title: getDictionary("ja").profile.notFoundTitle
    };
  }

  return {
    title: `${tenant.name} / Tower Map`,
    description: tenant.description
  };
}

export default async function JapaneseTenantProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  return <LocalizedTenantProfilePage slug={slug} locale="ja" routePrefix="/ja" />;
}
