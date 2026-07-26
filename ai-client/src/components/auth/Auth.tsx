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

// TODO: check ob das passt mit hook

export function Auth() {
    const { isLogin, formData, error, loading, handleChange, toggleMode, handleSubmit } = useAuthForm();

    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
                <CardDescription>
                    {isLogin ? "Sign in to your account with your username" : "Create a new account by filling out the form below"}
                </CardDescription>
                <CardAction>
                    <Button variant="link" onClick={toggleMode}>
                        {isLogin ? "Register" : "Login"}
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
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required value={formData.password} onChange={handleChange} />
                        </div>

                        {!isLogin && (
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" required value={formData.email} onChange={handleChange} />
                            </div>
                        )}

                        {!isLogin && (
                            <div className="grid gap-2">
                                <Label htmlFor="profile_description">Profile description</Label>
                                <Input id="profile_description" type="text" value={formData.profile_description} onChange={handleChange} />
                            </div>
                        )}
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button type="submit" className="w-full" form="auth-form" disabled={loading}>
                    {loading ? "Sending..." : isLogin ? "Login" : "Register"}
                </Button>
            </CardFooter>
        </Card>
    );
}