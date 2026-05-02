import { TowerExperience } from "@/components/tower-experience";
import { floors, tenants } from "@/lib/tower-data";

export default function HomePage() {
  return (
    <main>
      <section className="hero-shell">
        <div className="hero-copy">
          <p className="eyebrow">Public tower / English layer</p>
          <h1>Who lives upstairs?</h1>
          <p>
            Tower Map is a living high-rise map of Solana ecosystem signal.
            Every floor groups tenants by market gravity, cultural heat,
            liquidity visibility, and editorial relevance.
          </p>
        </div>
        <div className="hero-status" aria-label="Build status">
          <span>v1.0.2</span>
          <strong>Public shell online</strong>
          <p>Wallet, saves, and tenant notes are planned for later layers.</p>
        </div>
      </section>

      <TowerExperience floors={floors} tenants={tenants} />
    </main>
  );
}
