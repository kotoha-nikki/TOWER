import { getDictionary, type Locale } from "@/lib/i18n";
import { categories, floors } from "@/lib/tower-data";

type LocalizedMethodologyPageProps = {
  locale: Locale;
};

export function LocalizedMethodologyPage({ locale }: LocalizedMethodologyPageProps) {
  const dictionary = getDictionary(locale);

  return (
    <main className="page-shell">
      <section className="page-heading">
        <p className="eyebrow">{dictionary.methodology.eyebrow}</p>
        <h1>{dictionary.methodology.title}</h1>
        <p>{dictionary.methodology.body}</p>
      </section>

      <section className="method-grid">
        {dictionary.methodology.cards.map((card) => (
          <article key={card.number}>
            <span>{card.number}</span>
            <h2>{card.title}</h2>
            <p>{card.body}</p>
          </article>
        ))}
      </section>

      <section className="method-section">
        <div>
          <p className="eyebrow">{dictionary.methodology.floorSchemaEyebrow}</p>
          <h2>{dictionary.methodology.floorSchemaTitle}</h2>
          <p>{dictionary.methodology.floorSchemaBody}</p>
        </div>
        <div className="floor-list compact">
          {floors.map((floor) => (
            <div key={floor.floorNumber}>
              <strong>FL {floor.floorNumber}</strong>
              <span>{dictionary.floorLabels[floor.floorNumber] ?? floor.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="method-section">
        <div>
          <p className="eyebrow">{dictionary.methodology.categoriesEyebrow}</p>
          <h2>{dictionary.methodology.categoriesTitle}</h2>
          <p>{dictionary.methodology.categoriesBody}</p>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <article key={category.id}>
              <h3>{dictionary.categoryLabels[category.label] ?? category.label}</h3>
              <p>{dictionary.categoryDescriptions[category.id] ?? category.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
