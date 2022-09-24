import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import Header from "../../components/header/Header";
import LoadingSpinner from "../../components/spinners/LoadingSpinner";
import { CreatePostFormInput, createPostFormSchema } from "../../schemas/post.schema";
import { trpc } from "../../utils/trpc";

const CLOUDINARY_UPLOAD_PRESET = "trpc-api";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/stevancorre/image/upload";

const NewPostPage: NextPage = () => {
    const router = useRouter();
    const [isImageUploading, setIsImageUploading] = useState(false);
    const { mutate: createPost, isLoading: createPostLoading } = trpc.useMutation(["posts.new"], {
        onSuccess: () => router.push("/"),
    });
    const { formState, handleSubmit, register } = useForm<CreatePostFormInput>({
        resolver: zodResolver(createPostFormSchema),
    });
    const { errors } = formState;

    const onSubmit = async (data: CreatePostFormInput) => {
        const image: Blob = data.image?.[0] as Blob;
        if (image) {
            const formData = new FormData();
            formData.append("file", image);
            console.log(data.image);

            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

            setIsImageUploading(true);
            fetch(CLOUDINARY_URL, {
                method: "POST",
                body: formData,
            })
                .then((res) => res.json())
                .then((x) => {
                    if (!x.secure_url) return;

                    createPost({
                        body: data.body,
                        image: x.secure_url,
                    });
                    setIsImageUploading(false);
                })
                .catch(() => {
                    // TODO: toast
                    setIsImageUploading(false);
                });
        } else
            createPost({
                body: data.body,
            });
    };

    const handleCancel = async () => await router.push("/");

    return (
        <>
            <Head>
                <title>Groupomania</title>
            </Head>

            <div>
                <Header />

                <section role={"main"} className="flex w-full justify-center">
                    <nav className="my-6 flex w-11/12 flex-col gap-6 sm:w-5/6 md:w-4/5 lg:w-3/5 xl:w-1/2">
                        <h1 className="mx-auto text-xl font-bold leading-tight tracking-tight text-zinc-800 md:text-2xl">
                            Nouvelle publication
                        </h1>

                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="h-fit w-full rounded-md border border-gray-400 bg-white p-3 pb-2 drop-shadow-lg"
                        >
                            <main className="min-h-[1.6em] w-full pt-1 pb-4">
                                <textarea
                                    rows={5}
                                    className="min-h-[1.6em] w-full "
                                    placeholder="Texte du post..."
                                    {...register("body")}
                                />
                                <p className="text-xs text-red-500">
                                    {errors.body && errors.body.message?.toString()}
                                </p>
                            </main>

                            <footer className="mr-2 mb-1 flex justify-between">
                                <div>
                                    <input
                                        multiple={false}
                                        accept="image/*"
                                        type="file"
                                        {...register("image")}
                                    />
                                    <p className="text-xs text-red-500">
                                        {errors.image && errors.image.message?.toString()}
                                    </p>
                                </div>
                                <div className="flex gap-3 align-middle">
                                    <button
                                        type="button"
                                        disabled={createPostLoading}
                                        className="fill-red-400 hover:fill-red-500 active:fill-red-600 disabled:fill-red-300"
                                        onClick={handleCancel}
                                    >
                                        <svg className="h-6" viewBox="0 0 365 365">
                                            <path d="m243.1875 182.859375 113.132812-113.132813c12.5-12.5 12.5-32.765624 0-45.246093l-15.082031-15.082031c-12.503906-12.503907-32.769531-12.503907-45.25 0l-113.128906 113.128906-113.132813-113.152344c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503907-12.5 32.769531 0 45.25l113.152344 113.152344-113.128906 113.128906c-12.503907 12.503907-12.503907 32.769531 0 45.25l15.082031 15.082031c12.5 12.5 32.765625 12.5 45.246093 0l113.132813-113.132812 113.128906 113.132812c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082031c12.5-12.503906 12.5-32.769531 0-45.25zm0 0" />
                                        </svg>
                                    </button>

                                    <button
                                        disabled={createPostLoading}
                                        className="fill-green-400 hover:fill-green-500 active:fill-green-600 disabled:fill-green-300"
                                    >
                                        {isImageUploading || createPostLoading ? (
                                            <LoadingSpinner className="h-6" />
                                        ) : (
                                            <svg className="h-6 " viewBox="0 0 420 375">
                                                <path d="m159.988281 318.582031c-3.988281 4.011719-9.4429687 6.25-15.082031 6.25s-11.09375-2.238281-15.082031-6.25l-120.449219-120.46875c-12.5-12.5-12.5-32.769531 0-45.246093l15.082031-15.085938c12.503907-12.5 32.75-12.5 45.25 0l75.199219 75.203125 203.199219-203.203125c12.503906-12.5 32.769531-12.5 45.25 0l15.082031 15.085938c12.5 12.5 12.5 32.765624 0 45.246093zm0 0" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </footer>
                        </form>
                    </nav>
                </section>
            </div>
        </>
    );
};

export default NewPostPage;
