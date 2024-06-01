"use client";

// import { Link } from "@nextui-org/link";
import { NavbarMenuItem, Link } from "@nextui-org/react";

interface MenuItem {
  label: string;
  path: string;
}

interface Props {
  tabs: MenuItem[];
}

export default function NavbarMenuItems({ tabs }: Props) {
  const handleSignOut = async () => {
    const result = await fetch("/api/signout", { method: "POST" });

    if (result.ok) {
      window.location.href = "/";
    } else {
      console.error("Failed to sign out");
    }
  };

  return (
    <>
      {tabs.map((item, index) => (
        <NavbarMenuItem key={`${item}-${index}`}>
          <Link
            className="w-full"
            // Adjust the first condition according to the number of tabs
            color={
              tabs.length === 3
                ? "foreground"
                : index === tabs.length - 1
                  ? "danger"
                  : "foreground"
            }
            href={item.path}
            size="lg"
            onClick={() => {
              if (item.label === "Log Out") {
                handleSignOut();
              }
            }}
          >
            {item.label}
          </Link>
        </NavbarMenuItem>
      ))}
    </>
  );
}
