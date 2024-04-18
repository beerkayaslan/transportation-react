import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm, SubmitHandler } from 'react-hook-form';
import { useState } from "react";
import { Link } from "react-router-dom";
import { useRegister } from "@/query-hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { cn } from "@/lib/utils";
type Inputs = {
    email: string,
    password: string,
    name: string,
}

export default function Register() {
    const { toast } = useToast();

    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();

    const [loading, setLoading] = useState(false);


    const [isCustomer, setIsCustomer] = useState(true);


    const registerMutation = useRegister();
    const { setUserCookie } = useAuth();

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        setLoading(true);

        registerMutation.mutate({
            ...data,
            role: isCustomer ? "customer" : "transporter"
        }, {
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
            <div className="flex">
                <button id="customerBtn" className={cn("w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-tl focus:outline-none", {
                    "bg-blue-500 text-white": isCustomer
                })} onClick={() => setIsCustomer(true)}>Customer</button>
                <button id="transporterBtn" className={cn("w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-tl focus:outline-none", {
                    " bg-blue-500 text-white": !isCustomer
                })} onClick={() => setIsCustomer(false)}>Transporter</button>
            </div>
            <CardHeader>
                <CardTitle className="text-2xl">Register</CardTitle>
                <CardDescription>
                    Enter your email below to register to your account
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
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            required
                            {...register("name", {
                                required: "Must be a valid name",
                                maxLength: 200,
                            })}
                            className={errors.name && "!border-red-500"}
                        />
                        {errors.name && <p className="text-xs text-red-600">{errors.name.message}</p>}
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
                        Register
                    </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                    Already have an account? {" "}
                    <Link to="/login" className="underline text-blue-500">
                        Login
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}