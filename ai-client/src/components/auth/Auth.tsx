import { Button } from "@/components/ui/button";
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthForm } from "@/hooks/useAuthForm.ts";

export function Auth() {
    const { isLogin, formData, error, loading, handleChange, toggleMode, handleSubmit } = useAuthForm();

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>{isLogin ? "Login" : "Registrieren"}</CardTitle>
                <CardDescription>
                    {isLogin ? "Gib deinen Username ein, um dich einzuloggen." : "Erstelle ein Konto, um loszulegen."}
                </CardDescription>
                <CardAction>
                    <Button variant="link" onClick={toggleMode}>
                        {isLogin ? "Registrieren" : "Login"}
                    </Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <form id="auth-form" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-6">
                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                        <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" type="text" required value={formData.username} onChange={handleChange} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Passwort</Label>
                            <Input id="password" type="password" required value={formData.password} onChange={handleChange} />
                        </div>

                        {!isLogin && (
                            <div className="grid gap-2">
                                <Label htmlFor="email">E-Mail</Label>
                                <Input id="email" type="email" required value={formData.email} onChange={handleChange} />
                            </div>
                        )}

                        {!isLogin && (
                            <div className="grid gap-2">
                                <Label htmlFor="profile_description">Beschreibung</Label>
                                <Input id="profile_description" type="text" value={formData.profile_description} onChange={handleChange} />
                            </div>
                        )}
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full" form="auth-form" disabled={loading}>
                    {loading ? "Wird gesendet..." : isLogin ? "Login" : "Registrieren"}
                </Button>
            </CardFooter>
        </Card>
    );
}