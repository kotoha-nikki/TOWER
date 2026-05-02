import Link from "next/link";
import { notFound } from "next/navigation";
import { getFloorByNumber, getTenantBySlug, tenants } from "@/lib/tower-data";

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
      title: "Tenant not found / Tower Map"
    };
  }

  return {
    title: `${tenant.name} / Tower Map`,
    description: tenant.description
  };
}

export default async function TenantProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;
  const tenant = getTenantBySlug(slug);

  if (!tenant) {
    notFound();
  }

  const floor = getFloorByNumber(tenant.floor);

  return (
    <main className="page-shell profile-shell">
      <Link className="back-link" href="/">
        Back to the tower
      </Link>

      <section className="profile-hero">
        <p className="eyebrow">
          Tenant profile / Floor {tenant.floor} / {floor?.label}
        </p>
        <div className="profile-title-row">
          <h1>{tenant.name}</h1>
          <span>{tenant.ticker}</span>
        </div>
        <p>{tenant.description}</p>
      </section>

      <section className="quote-panel">
        <p className="eyebrow">Curator note</p>
        <blockquote>
          Every tenant is placed by signal, not by randomness. Floor {tenant.floor} reflects
          this project's current combination of visibility, category fit, and ecosystem gravity.
        </blockquote>
      </section>

      <section className="metric-grid">
        <article>
          <span>Category</span>
          <strong>{tenant.category}</strong>
        </article>
        <article>
          <span>Heat</span>
          <strong>{tenant.heat}/100</strong>
        </article>
        <article>
          <span>Market cap tier</span>
          <strong>{tenant.marketCapTier}</strong>
        </article>
        <article>
          <span>Liquidity tier</span>
          <strong>{tenant.poolTier}</strong>
        </article>
      </section>

      <section className="profile-details">
        <article>
          <p className="eyebrow">Contract status</p>
          <h2>{tenant.contractStatus}</h2>
          <p>
            Contract addresses are displayed only after verification from an official source
            or trusted registry.
          </p>
        </article>
        <article>
          <p className="eyebrow">Public interaction layer</p>
          <h2>Coming later</h2>
          <p>
            Wallet identity, saved tenants, public save counts, and tenant notes will be added
            in later construction layers.
          </p>
        </article>
      </section>
    </main>
  );
}
