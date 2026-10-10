export interface NavItem {
  key: string;
  href: string;
}

/** Menü öğeleri. Tek grup hâlinde eşit aralıklı listelenir. */
export const NAV_GROUPS: NavItem[][] = [
  [
    { href: "/", key: "nav.about" },
    { href: "/works", key: "nav.works" },
    { href: "/blog", key: "nav.articles" },
    { href: "/contact", key: "nav.contact" },
  ],
];
