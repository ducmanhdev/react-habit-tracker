import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

import {useAuthActions} from "@convex-dev/auth/react";

export const PageLogin = () => {
    const {signIn} = useAuthActions();
    return (
        <div className="min-h-screen p-4 flex flex-col items-center justify-center w-full">
            <Card className="mx-auto max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="w-full" onClick={() => void signIn("google")}>
                                Login with Google
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => void signIn("github")}>
                                Login with Github
                            </Button>
                        </div>
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
                            <div className="border-t"></div>
                            <p className="">Or</p>
                            <div className="border-t"></div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            Send code
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
};

export default PageLogin;
