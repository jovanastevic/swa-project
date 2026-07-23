import {Button} from "@/components/ui/button"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

import {useState} from "react"
import {_api} from "@/lib/_api.ts"

export function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
        profileDescription: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.id]: e.target.value});
    };

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        try {
            if (isLogin) {
                await _api.login({
                    username: formData.username,
                    password: formData.password
                });
                window.location.href = "/";
            } else {
                 await _api.register({
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                    profileDescription: formData.profileDescription,
                });

                setIsLogin(true);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Login fehlgeschlagen");
        }
    }


    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>{isLogin ? "Login" : "Registrieren"}</CardTitle>
                <CardDescription>
                    {isLogin ? "Gib deinen Username ein, um dich einzuloggen." : "Erstelle ein Konto, um loszulegen."}
                </CardDescription>
                <CardAction>
                    <Button variant="link"
                            onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Registrieren" : "Login"}</Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form id="auth-form" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                required
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Passwort</Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}/>
                        </div>
                        {!isLogin &&(
                            <div className="grid gap-2">
                                <Label htmlFor="email">E-Mail</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        {!isLogin && (
                        <div className="grid gap-2">
                            <Label htmlFor="profileDescription">Beschreibung</Label>
                            <Input
                                id="profileDescription"
                                type="text"
                                required
                                value={formData.profileDescription}
                                onChange={handleChange}
                            />
                        </div>
                        )}
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full" form="auth-form">
                    {isLogin ? "Login" : "Registrieren"}
                </Button>
            </CardFooter>
        </Card>
    )
}
