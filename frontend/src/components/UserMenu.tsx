import { User } from "lucide-react";
import { Link } from "react-router";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import keycloak from "@/auth/keycloak";

type UserMenuProps = {
    role: string | undefined;
};

const UserMenu = ({ role }: UserMenuProps) => {

    const handleLogout = () => {
        keycloak.logout({
            redirectUri: window.location.origin,
        });
    };

    const profilePath =
        role === "ATHLETE"
            ? "/athlete"
            : role === "COACH"
                ? "/coach"
                : "/";
    console.log("UserMenu role:", role);
    console.log("Profile path:", profilePath);

    return (
        <DropdownMenu>

            <DropdownMenuTrigger
                    className="flex items-center justify-center rounded-full p-2
                               text-dark-blue hover:bg-gray-100
                               transition-colors">
                    <User className="h-5 w-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Link to={profilePath}>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>Billing</DropdownMenuItem>
                    <DropdownMenuItem>Team</DropdownMenuItem>
                    <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default UserMenu;