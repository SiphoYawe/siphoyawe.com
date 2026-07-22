export type Proverb = {
  id: string;
  /** Original language: Luganda or Runyankole. */
  lang: "Luganda" | "Runyankole";
  text: string;
  english: string;
};

/**
 * Rotating proverbs on the kitenge card (brief section 6.13).
 * TODO(Sipho): add the Runyankole set once curated.
 */
export const PROVERBS: Proverb[] = [
  {
    id: "ababiri-babibira",
    lang: "Luganda",
    text: "Ababiri babibira ebigambo, naye abasatu babisattula.",
    english: "Two people can keep a secret; three cannot.",
  },
  {
    id: "atamanyi",
    lang: "Luganda",
    text: "Atamanyi tamanya nti tamanyi.",
    english: "The one who knows nothing does not know that he knows nothing.",
  },
  {
    id: "ennume-bigwo",
    lang: "Luganda",
    text: "Ennume ekula bigwo.",
    english: "A bull grows strong through its falls.",
  },
  {
    id: "obulungi-bukira",
    lang: "Luganda",
    text: "Obulungi bukira obugagga.",
    english: "A good name is worth more than riches.",
  },
  {
    id: "ke-weerimidde",
    lang: "Luganda",
    text: "Ke weerimidde kakira \"mbegeraako\".",
    english: "What you have earned yourself is worth more than a handout.",
  },
  {
    id: "tomala-gakola",
    lang: "Luganda",
    text: "Tomala gakola, kola bulungi by'okola.",
    english: "Do not do things carelessly; whatever you do, do well.",
  },
  {
    id: "munno-mu-kabi",
    lang: "Luganda",
    text: "Munno mu kabi ye munno ddala.",
    english: "A friend in need is a friend indeed.",
  },
  {
    id: "mpolampola",
    lang: "Luganda",
    text: "Mpolampola eyiisa obusera.",
    english: "Slowly, slowly, the porridge cooks well.",
  },
  {
    id: "okuwummula",
    lang: "Luganda",
    text: "Okuwummula si kutuuka.",
    english: "Resting is not the same as arriving.",
  },
  {
    id: "ezikookolima",
    lang: "Luganda",
    text: "N'ezikookolima gaali magi.",
    english: "Even those that crow the loudest were once eggs.",
  },
  {
    id: "obwami-ddiba",
    lang: "Luganda",
    text: "Obwami ddiba lya mbogo, terizingwa omu.",
    english: "Leadership is like a buffalo hide; it cannot be rolled up by one person alone.",
  },
  {
    id: "omukulu-tava-nnyuma",
    lang: "Luganda",
    text: "Omukulu tava nnyuma, nga waliwo ekyamukanga.",
    english: "The leader does not leave the rear when danger threatens from behind.",
  },
  {
    id: "ssebugulu-nnyomo",
    lang: "Luganda",
    text: "Ssebugulu bwa nnyomo bukaliriza omuwanda.",
    english: "The tiny legs of many ants smooth the path.",
  },
  {
    id: "ozaayisanga",
    lang: "Luganda",
    text: "Ozaayisanga omubiri, n'otozaayisa lulimi.",
    english: "You may send your body abroad, but never your mother tongue.",
  },
  {
    id: "owekikye",
    lang: "Luganda",
    text: "Ow'ekikye talemererwa, enjovu teremererwa masanga gaayo.",
    english: "What is truly yours is never too heavy to carry; the elephant is never weighed down by its own tusks.",
  },
  {
    id: "akwata-empola",
    lang: "Luganda",
    text: "Akwata empola atuuka wala; nnawolovu ow'e Bulemeezi omusanga mu Kyaddondo.",
    english: "The one who moves slowly and steadily goes far, like the chameleon from Bulemeezi that eventually reaches Kyaddondo.",
  },
  {
    id: "kamu-kamu",
    lang: "Luganda",
    text: "Kamu, kamu gwe muganda.",
    english: "Little by little, a bundle is made.",
  },
  {
    id: "akwagala",
    lang: "Luganda",
    text: "Akwagala akubuulirira.",
    english: "The one who loves you warns you.",
  },
];
