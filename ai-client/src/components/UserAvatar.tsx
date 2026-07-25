import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    BadgeMinusIcon,
    LogOutIcon,
    SettingsIcon,
    UserIcon,
} from "lucide-react"
import {authApi} from "@/lib/api.ts";
import {useState} from "react";

export function UserAvatar() {
    const [loggingOut, setLoggingOut] = useState<boolean>(false);
    async function handleLogout() {
        setLoggingOut(true);
        try{
            await authApi.logoutUser();
        } catch (err){
            console.error("Logout failed:", err);
        } finally {
            window.location.href = "/auth";
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="shadcn"/>
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-32">
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <UserIcon/>
                        Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <BadgeMinusIcon/>
                        Account löschen</DropdownMenuItem>
                    <DropdownMenuItem>
                        <SettingsIcon/>
                        Einstellungen
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                        <LogOutIcon/>
                        {loggingOut ? "Wird abgemeldet..." : "Abmelden"}</DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
