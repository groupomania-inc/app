import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { SignInInput, signInSchema } from "../../schemas/auth.schema";

const SignInPage: NextPage = () => {
    const router = useRouter();
    const session = useSession();
    const { register, handleSubmit } = useForm<SignInInput>({
        resolver: zodResolver(signInSchema),
    });

    const [error, setError] = useState("");

    const onSubmit = (credentials: SignInInput) =>
        signIn("credentials", {
            ...credentials,
            redirect: false,
            callbackUrl: `${window.location.origin}/`,
        }).then(async (res) => {
            if (res?.error)
                if (res.status === 401) setError("Invalid credentials");
                else setError(res.error);
            else if (res?.url) await router.push(res.url);
        });

    useEffect(() => {
        if (session.data?.user?.email) router.push("/");
    }, [session, router]);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <p>{error}</p>
                <h2>Sign in</h2>

                <input type="email" placeholder="Type your email..." {...register("email")} />
                <input type="password" placeholder="Type your password..." {...register("password")} />

                <Link href="/auth/sign-up">Go to sign up</Link>
                <button>Sign In</button>
            </form>
        </>
    );
};

export default SignInPage;
