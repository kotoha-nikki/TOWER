import { TowerExperience } from "@/components/tower-experience";
import { getDictionary, type Locale } from "@/lib/i18n";
import { floors, tenants } from "@/lib/tower-data";

type LocalizedHomePageProps = {
  locale: Locale;
  routePrefix?: "" | "/en" | "/ja";
};

export function LocalizedHomePage({ locale, routePrefix = "" }: LocalizedHomePageProps) {
  const dictionary = getDictionary(locale);

  return (
    <main>
      <section className="hero-shell">
        <div className="hero-copy">
          <p className="eyebrow">{dictionary.home.eyebrow}</p>
          <h1>{dictionary.home.title}</h1>
          <p>{dictionary.home.body}</p>
        </div>
        <div className="hero-status" aria-label="Build status">
          <span>{dictionary.home.statusVersion}</span>
          <strong>{dictionary.home.statusTitle}</strong>
          <p>{dictionary.home.statusBody}</p>
        </div>
      </section>

      <TowerExperience
        floors={floors}
        tenants={tenants}
        locale={locale}
        routePrefix={routePrefix}
      />
    </main>
  );
}
