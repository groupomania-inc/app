import { NextPage } from "next";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

import { CreatePostInput } from "../../schemas/post.schema";
import { trpc } from "../../utils/trpc";

const CreatePostPage: NextPage = () => {
    const router = useRouter();
    const { handleSubmit, register } = useForm<CreatePostInput>();

    const { mutate, error } = trpc.useMutation(["posts.new"], {
        onSuccess: ({ id }) => {
            router.push(`/posts/${id}`);
        },
    });

    const onSubmit = (values: CreatePostInput) => mutate(values);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <p>{error && error.message}</p>

            <h2>Create post</h2>
            <input maxLength={32} type="text" placeholder="title" {...register("title")} />
            <br />
            <textarea maxLength={1024} placeholder="body" {...register("body")} />
            <br />
            <button type="submit">Create post</button>
        </form>
    );
};

export default CreatePostPage;
