"use client";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";

interface ProfileData {
  name: string;
  email: string;
  image: string;
}

interface Props {
  profileData: ProfileData;
}

export default function ProfileDropdown({ profileData }: Props) {
  const handleSignOut = async () => {
    const result = await fetch("/api/signout", { method: "POST" });

    if (result.ok) {
      window.location.href = "/";
    } else {
      console.error("Failed to sign out");
    }
  };

  return (
    <Dropdown backdrop="blur" placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          isBordered
          as="button"
          className="self-center"
          color="danger"
          size="sm"
          src={profileData.image}
        />
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Profile Actions"
        // disabledKeys={["name", "email"]}
        variant="faded"
      >
        {/* <DropdownSection showDivider> */}
        <DropdownItem key="name">{profileData.name}님</DropdownItem>
        <DropdownItem key="email">{profileData.email}</DropdownItem>
        {/* </DropdownSection> */}

        {/* <DropdownSection showDivider> */}
        <DropdownItem key="orders">My Orders</DropdownItem>
        <DropdownItem key="cart">My Cart</DropdownItem>
        {/* </DropdownSection> */}

        <DropdownItem
          key="logout"
          className="text-danger"
          color="danger"
          onClick={handleSignOut}
        >
          Sign Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
