import { zodResolver } from "@hookform/resolvers/zod";
import { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import Header from "../components/header/Header";
import FullPageLoadingSpinner from "../components/spinners/FullPageLoadingSpinner";
import LoadingSpinner from "../components/spinners/LoadingSpinner";
import { UpdateUserFormInput, updateUserFormSchema } from "../schemas/user.schema";
import { trpc } from "../utils/trpc";

const CLOUDINARY_UPLOAD_PRESET = "trpc-api";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/stevancorre/image/upload";

const ProfilePage: NextPage = () => {
    const router = useRouter();

    const [preview, setPreview] = useState<string | undefined>();

    const { data: user } = trpc.useQuery(["users.me"]);
    const { mutate: updateUser, isLoading: updateUserLoading } = trpc.useMutation(["users.update"], {
        onSuccess: () => router.reload(),
    });

    const [isImageUploading, setIsImageUploading] = useState<boolean>(false);
    const { formState, handleSubmit, register, reset, watch } = useForm<UpdateUserFormInput>({
        resolver: zodResolver(updateUserFormSchema),
    });
    const { errors } = formState;

    const profilPicture: FileList | undefined = watch("profilePicture");

    useEffect(() => {
        reset({
            displayName: user?.displayName || user?.username,
        });
    }, [reset, user]);

    useEffect(() => {
        if (!profilPicture || profilPicture?.length === 0) return;

        // create the preview
        const objectUrl = URL.createObjectURL(profilPicture[0] as Blob);
        setPreview(objectUrl);

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl);
    }, [profilPicture]);

    if (!user) return <FullPageLoadingSpinner className="h-9 sm:h-8 lg:h-7" />;

    const onSubmit = async (data: UpdateUserFormInput) => {
        const image: Blob = data.profilePicture?.[0] as Blob;
        if (image) {
            const formData = new FormData();
            formData.append("file", image);

            formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

            setIsImageUploading(true);
            fetch(CLOUDINARY_URL, {
                method: "POST",
                body: formData,
            })
                .then((res) => res.json())
                .then((x) => {
                    if (!x.secure_url) return;

                    updateUser({
                        displayName: data.displayName,
                        profilePicture: x.secure_url,
                    });
                    setIsImageUploading(false);
                })
                .catch(() => {
                    // TODO: toast
                    setIsImageUploading(false);
                });
        } else
            updateUser({
                displayName: data.displayName,
            });
    };

    const onCancel = () => {
        reset();
        setPreview(undefined);
    };

    return (
        <>
            <Head>
                <title>Profile | Groupomania</title>
            </Head>

            <div>
                <Header />

                <section role={"main"} className="mt-6 flex w-full justify-center">
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="my-6 flex w-11/12 flex-col gap-6 sm:w-5/6 md:w-4/5 lg:w-3/5 xl:w-1/2"
                    >
                        <div>
                            <Image
                                className="rounded-full shadow"
                                width={128}
                                height={128}
                                objectFit="contain"
                                src={
                                    preview ??
                                    user?.profilePicture ??
                                    "https://res.cloudinary.com/stevancorre/image/upload/v1664060971/default-user.jpg"
                                }
                                alt="User photo"
                            />
                            <input
                                multiple={false}
                                accept="image/*"
                                type="file"
                                {...register("profilePicture")}
                            />
                            <p className="text-xs text-red-500">
                                {errors.profilePicture && errors.profilePicture.message?.toString()}
                            </p>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-800">
                                Nom affiché
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="h-5 w-5 fill-gray-400" viewBox="0 0 512 512">
                                        <path d="M256,0c-74.439,0-135,60.561-135,135s60.561,135,135,135s135-60.561,135-135S330.439,0,256,0z" />
                                        <path d="M423.966,358.195C387.006,320.667,338.009,300,286,300h-60c-52.008,0-101.006,20.667-137.966,58.195    C51.255,395.539,31,444.833,31,497c0,8.284,6.716,15,15,15h420c8.284,0,15-6.716,15-15    C481,444.833,460.745,395.539,423.966,358.195z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder={user.displayName ?? user.username}
                                    {...register("displayName")}
                                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-800">
                                Nom d&#39;utilisateur
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="h-5 w-5 fill-gray-400" viewBox="0 0 64 64">
                                        <path d="m60.40978 29.69362c-1.88297-23.98325-31.62868-34.96971-48.56353-17.84639-22.32681 23.22472 3.67943 59.4159 32.82428 45.6899a2.41587 2.41587 0 0 0 -2.15153-4.32575c-14.5979 7.51078-33.02312-2.88164-34.11343-19.28457-1.356-14.27374 11.239-26.88253 25.52126-25.5212a23.67916 23.67916 0 0 1 18.97834 34.70979 3.56663 3.56663 0 0 1 -5.62327.7519 4.32266 4.32266 0 0 1 -1.27278-3.0748v-20.38623a2.41552 2.41552 0 0 0 -4.83073.00007v1.02174c-8.86751-7.86924-23.28139-1.31372-23.18739 10.57215-.08877 11.97827 14.5039 18.49677 23.33466 10.44177 1.27088 7.85557 11.97657 10.13659 15.84232 2.94564a28.53366 28.53366 0 0 0 3.2418-15.69402zm-28.40978 11.48477a9.18882 9.18882 0 0 1 -9.17837-9.17839c.49516-12.17282 17.86345-12.16933 18.35678.00008a9.18883 9.18883 0 0 1 -9.17841 9.17831z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={user.username}
                                    disabled
                                    className="block w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label htmlFor="email" className="mb-2 block text-sm font-medium text-zinc-800">
                                Adresse email
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <svg className="h-5 w-5 fill-gray-400" viewBox="0 0 20 20">
                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="email"
                                    value={user.email ?? ""}
                                    disabled
                                    className="block w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex w-full gap-2">
                            <button
                                disabled={!formState.isDirty || updateUserLoading || isImageUploading}
                                type="button"
                                onClick={onCancel}
                                className="ml-auto inline-flex h-10 w-40 cursor-pointer items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-primary-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-primary-600 active:bg-primary-700 disabled:cursor-not-allowed disabled:bg-primary-400 disabled:hover:bg-primary-400 disabled:active:bg-primary-400"
                            >
                                Annuler
                            </button>
                            <button
                                disabled={!formState.isDirty || updateUserLoading || isImageUploading}
                                type="submit"
                                className="ml-6   inline-flex h-10 w-40 cursor-pointer items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-tertiary-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-tertiary-700 active:bg-tertiary-800 disabled:cursor-not-allowed disabled:bg-tertiary-400 disabled:hover:bg-tertiary-400 disabled:active:bg-tertiary-400"
                            >
                                {updateUserLoading || isImageUploading ? (
                                    <LoadingSpinner className="h-6" />
                                ) : (
                                    "Sauvegarder"
                                )}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </>
    );
};

export default ProfilePage;
