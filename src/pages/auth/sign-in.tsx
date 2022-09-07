import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { SignInInput, signInSchema } from "../../schemas/auth";
import { trpc } from "../../utils/trpc";

const SignInPage: NextPage = () => {
    const router = useRouter();
    const { register, handleSubmit } = useForm<SignInInput>({
        resolver: zodResolver(signInSchema),
    });

    const { mutate, error } = trpc.useMutation(["auth.signin"], {
        onSuccess: () => {
            router.push("/home");
        },
    });

    const onSubmit = (values: SignInInput) => mutate(values);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <p>{error && error.message}</p>
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
