import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "@/query-hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";

type Inputs = {
    email: string,
    password: string
}

export default function Login() {
    const { toast } = useToast();

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const [loading, setLoading] = useState(false);



    const loginMutation = useLogin();
    const { setUserCookie } = useAuth();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setLoading(true);

        loginMutation.mutate(data, {
            onSuccess: (data) => {
                setUserCookie(JSON.stringify(data));
            },
            onError: (error: any) => {
                toast({
                    variant: "destructive",
                    title: String(error),
                });
                setLoading(false);
            },
        });

    }

    return (
        <Card className="mx-auto max-w-sm">
      
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            {...register("email", {
                                required: "Must be a valid email address",
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Must be a valid email address"
                                },
                                maxLength: 200,
                            })}
                            className={errors.email && "!border-red-500"}
                        />
                        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                        </div>
                        <Input id="password" type="password" required
                            {...register("password",
                                {
                                    required: "Must be a valid password",
                                    minLength: {
                                        value: 6,
                                        message: "Password must have at least 6 characters"

                                    },
                                    maxLength: {
                                        value: 100,
                                        message: "Password must have at most 100 characters"
                                    }
                                })} className={errors.password && "!border-red-500"} />
                        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
                    </div>
                    <Button onClick={handleSubmit(onSubmit)} disabled={loading} type="submit" className="w-full">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Login
                    </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                    Don't have an account?{" "}
                    <Link to="/register" className="underline text-blue-500">
                        Register
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}