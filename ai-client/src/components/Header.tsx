import {UserAvatar} from "./UserAvatar";
import logo from "@/assets/logo-yea.svg";
import logoLight from "@/assets/logo-yea-light.svg";
import {ModeToggle} from "@/components/ModeToggle.tsx";
import {PlusIcon} from "lucide-react"

export function Header() {
    return (
        <header className="w-full h-18 flex items-center border-b justify-between p-3">
            <div className="flex items-center">
                <a href="/#">
                    <img src={logoLight.src} alt="Logo" className="h-8 w-auto hidden dark:block"/>
                    <img src={logo.src} alt="Logo" className="h-8 w-auto block dark:hidden"/>
                </a>
                <h1 className="text-3xl font-bold">Actual Intelligence</h1>
            </div>
            <div className="flex items-center gap-4">
                <a href="/create-prompt">
                    <PlusIcon/>
                </a>
                <ModeToggle/>
                <UserAvatar/>
            </div>
        </header>
    )
}
