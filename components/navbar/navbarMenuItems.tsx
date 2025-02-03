import { NavbarMenuItem, Link } from "@nextui-org/react";
import { signOut } from "@/auth/signOut";
import { useSession } from "@/context/sessionContext"; // Assuming you have session context

interface MenuItem {
    label: string;
    path: string;
}

interface Props {
    tabs: MenuItem[];
    onClose: () => void;
}

export default function NavbarMenuItems({ tabs, onClose }: Props) {
    const { session } = useSession(); // Get user session

    return (
        <>
            {tabs
                .filter((item) => item.label !== "로그아웃")
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

            {/* Show logout button only if the user is signed in */}
            {session && tabs.some((item) => item.label === "로그아웃") && (
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
                        로그아웃
                    </Link>
                </NavbarMenuItem>
            )}
        </>
    );
}
