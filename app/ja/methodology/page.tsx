import { LocalizedMethodologyPage } from "@/components/localized-methodology-page";
import { getDictionary } from "@/lib/i18n";

const dictionary = getDictionary("ja");

export const metadata = {
  title: dictionary.methodology.metadataTitle,
  description: dictionary.methodology.metadataDescription
};

export default function JapaneseMethodologyPage() {
  return <LocalizedMethodologyPage locale="ja" />;
}
