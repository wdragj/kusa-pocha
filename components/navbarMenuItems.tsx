import { NavbarMenuItem, Link } from "@nextui-org/react";

import { signOut } from "@/auth/signOut";

interface MenuItem {
  label: string;
  path: string;
}

interface Props {
  tabs: MenuItem[];
}

export default function NavbarMenuItems({ tabs }: Props) {
  return (
    <>
      {tabs
        .filter((item) => item.label !== "Sign Out")
        .map((item, index) => (
          <NavbarMenuItem key={`${item.label}-${index}`}>
            <Link
              className="w-full"
              color="foreground"
              href={item.path}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      {tabs.some((item) => item.label === "Sign Out") && (
        <NavbarMenuItem>
          <Link
            as={"button"}
            className="w-full"
            color="danger"
            href="/"
            size="lg"
            onClick={async () => {
              await signOut();
              window.location.reload();
            }}
          >
            Sign Out
          </Link>
        </NavbarMenuItem>
      )}
    </>
  );
}
