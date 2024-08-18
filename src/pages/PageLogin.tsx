import {useState} from "react";
import {Button} from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {useAuthActions} from "@convex-dev/auth/react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"
import {toast} from "sonner"

const formSchema = z.object({
    email: z.string().email("Please enter a valid email"),
})

export const PageLogin = () => {
    const {signIn} = useAuthActions();
    const [submitting, setSubmitting] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    const handleSendEmail = async (values: z.infer<typeof formSchema>) => {
        setSubmitting(true);
        const formData = new FormData();
        formData.append("email", values.email)
        try {
            await signIn("resend", formData);
            toast.success("Email was sent successfully")
        } catch (error) {
            toast.error("Could not send login link")
            // TODO Make error better
            // TODO Make email template better
        } finally {
            setSubmitting(false);
        }
    };

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
                        <div>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(handleSendEmail)}
                                    className="space-y-8"
                                >
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your email..."
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={submitting}
                                    >
                                        Send login link
                                    </Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
};

export default PageLogin;
