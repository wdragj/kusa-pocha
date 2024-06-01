import {
  Avatar,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Link,
} from "@nextui-org/react";

import { signOut } from "@/lib/auth";

interface ProfileData {
  name: string;
  email: string;
  image: string;
}

interface Props {
  profileData: ProfileData;
}

export default function ProfileDropdown({ profileData }: Props) {
  return (
    <>
      <Popover backdrop="blur" offset={10} placement="bottom-end">
        <PopoverTrigger>
          <Avatar
            isBordered
            as="button"
            className="self-center"
            color="danger"
            size="sm"
            src={profileData.image}
          />
        </PopoverTrigger>
        <PopoverContent>
          <div className="px-1 py-2">
            <div className="text-small font-bold pt-1 px-1">
              {profileData.name}님
            </div>
            <div className="text-small pb-2 px-1">{profileData.email}</div>
            <Link
              className="w-full text-small py-2 px-1"
              color="foreground"
              href="/"
              size="lg"
            >
              My Cart
            </Link>
            <Link
              className="w-full text-small py-2 px-1"
              color="foreground"
              href="/orders"
              size="lg"
            >
              My Orders
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Link
                as={"button"}
                className="w-full text-small pt-2 pb-1 px-1"
                color="danger"
                href="/"
                size="lg"
                type="submit"
              >
                Sign Out
              </Link>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
