import { Like, Post, User } from "@prisma/client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FunctionComponent } from "react";

import { trpc } from "../../utils/trpc";

type PostParams = {
    post: Post & {
        User: User;
        Likes: Like[];
    };
};

// TODO: fix (edited)

const Post: FunctionComponent<PostParams> = ({ post }) => {
    const { data: session } = useSession();

    const { mutate: deletePost } = trpc.useMutation(["posts.delete"], {
        onSuccess: () => {
            const postElement = document.querySelector(`#_${post.id}`);
            if (!postElement) return;

            postElement.remove();
        },
    });

    const handleDeletePost = async (postId: string) => deletePost({ postId });

    return (
        <article
            id={`_${post.id}`}
            className="h-fit w-full rounded-md border border-gray-200 bg-white p-3 pb-2 drop-shadow-sm"
        >
            <header className="flex h-9 w-full justify-between border-b-2 border-gray-100">
                <h3 className="text-lg font-medium leading-6">{post.title}</h3>
                <div className="flex gap-3">
                    {session?.user?.id === post.userId && (
                        <Link href={`/posts/edit/${post.id}`}>
                            <svg
                                className="h-6 cursor-pointer fill-yellow-400 hover:animate-wiggle hover:fill-yellow-400 md:fill-yellow-200"
                                viewBox="0 0 492.49284 492"
                            >
                                <path d="m304.140625 82.472656-270.976563 270.996094c-1.363281 1.367188-2.347656 3.09375-2.816406 4.949219l-30.035156 120.554687c-.898438 3.628906.167969 7.488282 2.816406 10.136719 2.003906 2.003906 4.734375 3.113281 7.527344 3.113281.855469 0 1.730469-.105468 2.582031-.320312l120.554688-30.039063c1.878906-.46875 3.585937-1.449219 4.949219-2.8125l271-270.976562zm0 0" />
                                <path d="m476.875 45.523438-30.164062-30.164063c-20.160157-20.160156-55.296876-20.140625-75.433594 0l-36.949219 36.949219 105.597656 105.597656 36.949219-36.949219c10.070312-10.066406 15.617188-23.464843 15.617188-37.714843s-5.546876-27.648438-15.617188-37.71875zm0 0" />
                            </svg>
                        </Link>
                    )}
                    {(session?.user?.id === post.userId || session?.user?.isAdmin) && (
                        <svg
                            onClick={() => handleDeletePost(post.id)}
                            className="h-6 cursor-pointer fill-primary-500 hover:animate-wiggle hover:fill-primary-500 md:fill-primary-300"
                            viewBox="0 0 512 512"
                        >
                            <path d="M62.205,150l26.569,320.735C90.678,493.865,110.38,512,133.598,512h244.805c23.218,0,42.92-18.135,44.824-41.265    L449.795,150H62.205z M180.986,452c-7.852,0-14.458-6.108-14.956-14.063l-15-242c-0.513-8.276,5.771-15.395,14.033-15.908    c8.569-0.601,15.381,5.757,15.908,14.033l15,242C196.502,444.632,189.721,452,180.986,452z M271,437c0,8.291-6.709,15-15,15    c-8.291,0-15-6.709-15-15V195c0-8.291,6.709-15,15-15s15,6.709,15,15V437z M360.97,195.938l-15,242    c-0.493,7.874-7.056,14.436-15.908,14.033c-8.262-0.513-14.546-7.632-14.033-15.908l15-242    c0.513-8.276,7.764-14.297,15.908-14.033C355.199,180.543,361.483,187.662,360.97,195.938z" />

                            <path d="M451,60h-90V45c0-24.814-20.186-45-45-45H196c-24.814,0-45,20.186-45,45v15H61c-16.569,0-30,13.431-30,30    c0,16.567,13.431,30,30,30c137.966,0,252.039,0,390,0c16.569,0,30-13.433,30-30C481,73.431,467.569,60,451,60z M331,60H181V45    c0-8.276,6.724-15,15-15h120c8.276,0,15,6.724,15,15V60z" />
                        </svg>
                    )}
                </div>
            </header>

            <main className="pt-3 pb-4">
                <p>{post.body}</p>
            </main>

            <footer className="flex justify-between text-sm text-gray-600 sm:text-xs">
                <span>@{post.User.email.split("@")[0]}</span>
                <span>
                    {post.createdAt.toLocaleDateString("fr-FR")} {post.edited ? "(modifié)" : ""}
                </span>
            </footer>
        </article>
    );
};

export default Post;
