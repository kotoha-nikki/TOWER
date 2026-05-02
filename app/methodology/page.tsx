import { categories, floors } from "@/lib/tower-data";

export const metadata = {
  title: "Methodology / Tower Map",
  description: "How Tower Map places tenants inside the editorial high-rise."
};

export default function MethodologyPage() {
  return (
    <main className="page-shell">
      <section className="page-heading">
        <p className="eyebrow">Methodology</p>
        <h1>How tenants move into the tower</h1>
        <p>
          Tower Map is not a raw token ranking. Floor placement combines market
          gravity, liquidity visibility, cultural heat, continuity, and native
          fit into a readable editorial map.
        </p>
      </section>

      <section className="method-grid">
        <article>
          <span>01</span>
          <h2>Market gravity</h2>
          <p>
            Relative size, liquidity depth, exchange visibility, and ecosystem
            importance. This is the weight that pulls a tenant upward.
          </p>
        </article>
        <article>
          <span>02</span>
          <h2>Cultural heat</h2>
          <p>
            Social visibility, meme velocity, recognizable identity, and
            recurring timeline presence. Heat can move faster than market cap.
          </p>
        </article>
        <article>
          <span>03</span>
          <h2>Continuity</h2>
          <p>
            Tenants with lasting ecosystem roles, active maintenance, and
            repeated usage carry more structural weight.
          </p>
        </article>
        <article>
          <span>04</span>
          <h2>Native fit</h2>
          <p>
            Stablecoins, wrapped assets, LP tokens, tokenized stocks, and
            treasury products are generally excluded from the tenant model.
          </p>
        </article>
      </section>

      <section className="method-section">
        <div>
          <p className="eyebrow">Floor schema</p>
          <h2>Twenty-three public floors</h2>
          <p>
            Higher floors represent stronger combined signal. Lower floors
            document emerging rooms, watchlist tenants, and future review.
          </p>
        </div>
        <div className="floor-list compact">
          {floors.map((floor) => (
            <div key={floor.floorNumber}>
              <strong>FL {floor.floorNumber}</strong>
              <span>{floor.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="method-section">
        <div>
          <p className="eyebrow">Categories</p>
          <h2>Tenant wings</h2>
          <p>
            Categories are navigation aids, not rigid boxes. A project can be
            culturally loud, technically important, and financially visible at
            the same time.
          </p>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <article key={category.id}>
              <h3>{category.label}</h3>
              <p>{category.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
