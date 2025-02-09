export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Kusa Pocha",
  description: "Kusa Pocha is a Korean pub event from the KUSA(Korean Undergraduate Student Association) that serves delicious food and drinks.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Menu",
      href: "/menu",
    },
    {
      label: "Orders",
      href: "/orders",
    },
    {
      label: "Cart",
      href: "/cart",
    },
    {
      label: "Settings",
      href: "/settings",
    },
  ],
  navMenuItems: [
    {
      label: "Orders",
      href: "/orders",
    },
    {
      label: "Cart",
      href: "/cart",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
  },
};
