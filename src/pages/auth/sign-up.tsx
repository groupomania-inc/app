import { zodResolver } from "@hookform/resolvers/zod";
import type { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { SignUpInput, signUpSchema } from "../../schemas/auth.schema";
import { trpc } from "../../utils/trpc";

const SignUpPage: NextPage = () => {
    const router = useRouter();
    const { register, handleSubmit } = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema),
    });

    const { mutate, error } = trpc.useMutation(["users.new"], {
        onSuccess: () => {
            router.push("/auth/sign-in");
        },
    });

    const onSubmit = (values: SignUpInput) => mutate(values);

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <p>{error && error.message}</p>
                <h2>Sign up</h2>

                <input type="email" placeholder="Type your email..." {...register("email")} />
                <input type="password" placeholder="Type your password..." {...register("password")} />

                <Link href="/auth/sign-in">Go to sign in</Link>
                <button>Sign Up</button>
            </form>
        </>
    );
};

export default SignUpPage;
