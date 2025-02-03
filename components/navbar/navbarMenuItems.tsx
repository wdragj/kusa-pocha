import { NavbarMenuItem, Link } from "@nextui-org/react";
import { signOut } from "@/auth/signOut";

interface MenuItem {
    label: string;
    path: string;
}

interface Props {
    tabs: MenuItem[];
    onClose: () => void;
}

export default function NavbarMenuItems({ tabs, onClose }: Props) {
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
                            onPress={onClose} // Closes dropdown when clicked
                        >
                            {item.label}
                        </Link>
                    </NavbarMenuItem>
                ))}

            {tabs.some((item) => item.label === "Sign Out") && (
                <NavbarMenuItem>
                    <Link
                        as="button"
                        className="w-full"
                        color="danger"
                        size="lg"
                        onPress={async () => {
                            await signOut();
                            onClose(); // Close menu on sign-out
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
