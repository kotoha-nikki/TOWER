export const locales = ["en", "ja"] as const;

export type Locale = (typeof locales)[number];

type MethodCard = {
  number: string;
  title: string;
  body: string;
};

type Dictionary = {
  languageName: string;
  nav: {
    tower: string;
    methodology: string;
    github: string;
  };
  home: {
    eyebrow: string;
    title: string;
    body: string;
    statusVersion: string;
    statusTitle: string;
    statusBody: string;
  };
  tower: {
    ariaLabel: string;
    eyebrow: string;
    title: string;
    openDirectory: string;
    imageAlt: string;
    floorSelector: string;
    floorLabel: string;
    tenantsLabel: string;
    emptyState: string;
    directoryEyebrow: string;
    directoryTitle: string;
    close: string;
    heatLabel: string;
    floorAbbr: string;
  };
  methodology: {
    metadataTitle: string;
    metadataDescription: string;
    eyebrow: string;
    title: string;
    body: string;
    cards: MethodCard[];
    floorSchemaEyebrow: string;
    floorSchemaTitle: string;
    floorSchemaBody: string;
    categoriesEyebrow: string;
    categoriesTitle: string;
    categoriesBody: string;
  };
  profile: {
    notFoundTitle: string;
    back: string;
    eyebrow: string;
    curatorNote: string;
    curatorBody: string;
    category: string;
    heat: string;
    marketCapTier: string;
    liquidityTier: string;
    contractStatus: string;
    contractStatusBody: string;
    interactionLayer: string;
    comingLater: string;
    interactionBody: string;
  };
  fallback: {
    note: string;
  };
  floorLabels: Record<number, string>;
  categoryLabels: Record<string, string>;
  categoryDescriptions: Record<string, string>;
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    languageName: "English",
    nav: {
      tower: "Tower",
      methodology: "Methodology",
      github: "GitHub"
    },
    home: {
      eyebrow: "Public tower / English layer",
      title: "Who lives upstairs?",
      body:
        "Tower Map is a living high-rise map of Solana ecosystem signal. Every floor groups tenants by market gravity, cultural heat, liquidity visibility, and editorial relevance.",
      statusVersion: "v1.0.3",
      statusTitle: "Public shell online",
      statusBody: "Wallet, saves, and tenant notes are planned for later layers."
    },
    tower: {
      ariaLabel: "Tower map experience",
      eyebrow: "Interactive map",
      title: "Click a floor to inspect its tenants.",
      openDirectory: "Open directory",
      imageAlt: "Draft drawing of the Tower Map building",
      floorSelector: "Floor selector",
      floorLabel: "Floor",
      tenantsLabel: "Tenants",
      emptyState:
        "No public sample tenants on this floor yet. The full registry arrives in a later construction layer.",
      directoryEyebrow: "Directory",
      directoryTitle: "Sample tenant registry",
      close: "Close",
      heatLabel: "Heat",
      floorAbbr: "FL"
    },
    methodology: {
      metadataTitle: "Methodology / Tower Map",
      metadataDescription: "How Tower Map places tenants inside the editorial high-rise.",
      eyebrow: "Methodology",
      title: "How tenants move into the tower",
      body:
        "Tower Map is not a raw token ranking. Floor placement combines market gravity, liquidity visibility, cultural heat, continuity, and native fit into a readable editorial map.",
      cards: [
        {
          number: "01",
          title: "Market gravity",
          body:
            "Relative size, liquidity depth, exchange visibility, and ecosystem importance. This is the weight that pulls a tenant upward."
        },
        {
          number: "02",
          title: "Cultural heat",
          body:
            "Social visibility, meme velocity, recognizable identity, and recurring timeline presence. Heat can move faster than market cap."
        },
        {
          number: "03",
          title: "Continuity",
          body:
            "Tenants with lasting ecosystem roles, active maintenance, and repeated usage carry more structural weight."
        },
        {
          number: "04",
          title: "Native fit",
          body:
            "Stablecoins, wrapped assets, LP tokens, tokenized stocks, and treasury products are generally excluded from the tenant model."
        }
      ],
      floorSchemaEyebrow: "Floor schema",
      floorSchemaTitle: "Twenty-three public floors",
      floorSchemaBody:
        "Higher floors represent stronger combined signal. Lower floors document emerging rooms, watchlist tenants, and future review.",
      categoriesEyebrow: "Categories",
      categoriesTitle: "Tenant wings",
      categoriesBody:
        "Categories are navigation aids, not rigid boxes. A project can be culturally loud, technically important, and financially visible at the same time."
    },
    profile: {
      notFoundTitle: "Tenant not found / Tower Map",
      back: "Back to the tower",
      eyebrow: "Tenant profile",
      curatorNote: "Curator note",
      curatorBody:
        "Every tenant is placed by signal, not by randomness. This floor reflects the project's current combination of visibility, category fit, and ecosystem gravity.",
      category: "Category",
      heat: "Heat",
      marketCapTier: "Market cap tier",
      liquidityTier: "Liquidity tier",
      contractStatus: "Contract status",
      contractStatusBody:
        "Contract addresses are displayed only after verification from an official source or trusted registry.",
      interactionLayer: "Public interaction layer",
      comingLater: "Coming later",
      interactionBody:
        "Wallet identity, saved tenants, public save counts, and tenant notes will be added in later construction layers."
    },
    fallback: {
      note: "Untranslated editorial data falls back to English until the content layer is reviewed."
    },
    floorLabels: {},
    categoryLabels: {},
    categoryDescriptions: {}
  },
  ja: {
    languageName: "日本語",
    nav: {
      tower: "タワー",
      methodology: "選定基準",
      github: "GitHub"
    },
    home: {
      eyebrow: "公開タワー / 日本語レイヤー",
      title: "上の階には、誰が住んでる？",
      body:
        "Tower Map は、Solana エコシステムのシグナルを読むための高層マップです。各フロアは、時価総額の重力、文化的な熱量、流動性、編集上の重要度によって整理されています。",
      statusVersion: "v1.0.3",
      statusTitle: "日本語レイヤーを建設中",
      statusBody: "ウォレット、保存、テナントノートは次の建設レイヤーで追加されます。"
    },
    tower: {
      ariaLabel: "Tower Map 体験",
      eyebrow: "インタラクティブマップ",
      title: "フロアを選んで、住んでいるテナントを見てみる。",
      openDirectory: "ディレクトリを開く",
      imageAlt: "Tower Map の下書きビル",
      floorSelector: "フロア選択",
      floorLabel: "フロア",
      tenantsLabel: "テナント",
      emptyState:
        "このフロアには、まだ公開サンプルのテナントがいません。完全なレジストリは次の建設レイヤーで追加されます。",
      directoryEyebrow: "ディレクトリ",
      directoryTitle: "サンプルテナント一覧",
      close: "閉じる",
      heatLabel: "熱量",
      floorAbbr: "FL"
    },
    methodology: {
      metadataTitle: "選定基準 / Tower Map",
      metadataDescription: "Tower Map がテナントを各フロアに配置する考え方。",
      eyebrow: "選定基準",
      title: "テナントはどうやって入居するの？",
      body:
        "Tower Map は単なるトークン順位表ではありません。フロア配置は、マーケットの重力、流動性、文化的な熱量、継続性、そして Solana らしさを組み合わせた編集マップです。",
      cards: [
        {
          number: "01",
          title: "マーケットの重力",
          body:
            "相対的な規模、流動性、取引所での見え方、エコシステム内での重要度。テナントを上の階へ引き上げる重さです。"
        },
        {
          number: "02",
          title: "文化的な熱量",
          body:
            "SNS 上の存在感、ミームの速度、わかりやすいアイデンティティ、何度も話題になる力。熱量は時価総額より速く動くことがあります。"
        },
        {
          number: "03",
          title: "継続性",
          body:
            "長く残っている役割、継続的な開発、繰り返し使われる場所。時間の中で残るものは、建物の柱になります。"
        },
        {
          number: "04",
          title: "ネイティブ性",
          body:
            "ステーブルコイン、ラップ資産、LP トークン、株式トークン、国債系プロダクトは通常のテナントから除外します。"
        }
      ],
      floorSchemaEyebrow: "フロア構造",
      floorSchemaTitle: "23 の公開フロア",
      floorSchemaBody:
        "高い階ほど、複合的なシグナルが強いことを意味します。低い階は、新しい部屋、ウォッチリスト、今後の見直し対象を記録します。",
      categoriesEyebrow: "カテゴリー",
      categoriesTitle: "テナントの区画",
      categoriesBody:
        "カテゴリーは案内板であって、硬い箱ではありません。ひとつのプロジェクトが、文化的にも、技術的にも、金融的にも重要なことがあります。"
    },
    profile: {
      notFoundTitle: "テナントが見つかりません / Tower Map",
      back: "タワーに戻る",
      eyebrow: "テナントプロフィール",
      curatorNote: "キュレーターノート",
      curatorBody:
        "すべてのテナントはランダムではなく、シグナルによって配置されます。このフロアは、現在の可視性、カテゴリー適性、エコシステム内での重力を反映しています。",
      category: "カテゴリー",
      heat: "熱量",
      marketCapTier: "時価総額ティア",
      liquidityTier: "流動性ティア",
      contractStatus: "CA ステータス",
      contractStatusBody:
        "コントラクトアドレスは、公式ソースまたは信頼できるレジストリで確認できた場合のみ表示します。",
      interactionLayer: "公開インタラクション層",
      comingLater: "後で追加予定",
      interactionBody:
        "ウォレット認証、保存済みテナント、公開保存数、テナントノートは、次の建設レイヤーで追加されます。"
    },
    fallback: {
      note:
        "まだ翻訳されていない編集データは、内容確認が終わるまで英語のまま表示します。"
    },
    floorLabels: {
      23: "ペントハウス",
      22: "礎の階",
      21: "流動性スイート",
      20: "カジノフロア",
      19: "メジャーネーム",
      18: "ミームスイート",
      17: "AI フロア",
      16: "利回り + コンピュート区画",
      15: "プロトコル列",
      14: "カルチャー列",
      13: "エージェントラボ",
      12: "コンシューマーデッキ",
      11: "ゲームルーム",
      10: "アクティブミッドキャップ",
      9: "ワークショップ",
      8: "ストリートシグナル",
      7: "初期エージェント",
      6: "ウォッチリスト階",
      5: "小さなスタジオ",
      4: "マイクロカルチャー",
      3: "新規チェックイン",
      2: "地下ラボ",
      1: "ロビー"
    },
    categoryLabels: {
      Network: "ネットワーク",
      Infrastructure: "インフラ",
      DeFi: "DeFi",
      Meme: "ミーム",
      AI: "AI",
      DePIN: "DePIN",
      "NFT / Consumer": "NFT / コンシューマー",
      Gaming: "ゲーム",
      "Culture / Apps": "カルチャー / アプリ"
    },
    categoryDescriptions: {
      network: "ベースレイヤー資産、実行基盤、エコシステムの中心的プリミティブ。",
      infrastructure: "オラクル、ブリッジ、開発者ツール、データレイヤー、プロトコル基盤。",
      defi: "取引、流動性、レンディング、利回り、オンチェーン金融アプリ。",
      meme: "強いソーシャルアイデンティティと物語の速度を持つカルチャー主導のトークン。",
      ai: "AI エージェント、自動化ナラティブ、推論周辺ツール、エージェント文化。",
      depin: "物理インフラ、コンピュート、マッピング、ワイヤレス、ストレージのネットワーク。",
      "nft-consumer": "コンシューマーアプリ、クリエイターツール、コレクティブル、マーケットプレイス、ソーシャル面。",
      gaming: "ゲーム、ゲーム経済、プレイ可能な世界、エンタメ系トークン。",
      "culture-apps": "アプリケーション、コミュニティ、実験的プロダクト、ナラティブの集合体。"
    }
  }
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale] ?? dictionaries.en;
}

export function stripLocale(pathname: string) {
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    return pathname.replace(/^\/en/, "") || "/";
  }

  if (pathname === "/ja" || pathname.startsWith("/ja/")) {
    return pathname.replace(/^\/ja/, "") || "/";
  }

  return pathname || "/";
}

export function getPathLocale(pathname: string): Locale {
  return pathname === "/ja" || pathname.startsWith("/ja/") ? "ja" : "en";
}

export function withLocale(pathname: string, locale: Locale) {
  const stripped = stripLocale(pathname);

  if (locale === "en") {
    return stripped === "/" ? "/en" : `/en${stripped}`;
  }

  return stripped === "/" ? "/ja" : `/ja${stripped}`;
}

export function getRoutePrefix(locale: Locale) {
  return locale === "ja" ? "/ja" : "/en";
}
