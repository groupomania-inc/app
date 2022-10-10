import { Like, Post, User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FunctionComponent, useEffect, useState } from "react";

import { formatDate } from "../../utils/posts";
import { trpc } from "../../utils/trpc";
import { formatDisplayName, formatUsername, getProfilePicture } from "../../utils/user";

type PostParams = {
    post: Post & {
        User: User;
        Likes: Like[];
    };
};

const Post: FunctionComponent<PostParams> = ({ post }) => {
    const { data: session } = useSession();
    const [userLiked, setUserLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    const { mutate: deletePost } = trpc.useMutation(["posts.delete"], {
        onSuccess: () => {
            const postElement = document.querySelector(`#_${post.id}`);
            if (!postElement) return;

            postElement.remove();
        },
    });

    const { mutate: likePost } = trpc.useMutation(["posts.like"], {
        onSuccess: (liked) => {
            setUserLiked(liked);
            if (liked) setLikesCount(likesCount + 1);
            else setLikesCount(likesCount - 1);
        },
    });

    const handleLikePost = async () => likePost({ postId: post.id });

    const handleDeletePost = async () => deletePost({ postId: post.id });

    useEffect(() => {
        const userLiked = post.Likes.find((x) => x.userId === session?.user?.id) !== undefined;

        setUserLiked(userLiked);
        setLikesCount(post.Likes.length);
    }, [session, post]);

    return (
        <article
            id={`_${post.id}`}
            className="h-fit w-full rounded-md border border-gray-200 bg-white p-3 pb-2 drop-shadow-sm"
        >
            <header className="flex h-9 w-full justify-between border-b-2 border-gray-100">
                <div className="flex flex-row">
                    <div className="mr-2">
                        <Image
                            className="rounded-full shadow"
                            width={30}
                            height={30}
                            objectFit="contain"
                            src={getProfilePicture(post.User)}
                            alt={`Photo de profile de ${formatDisplayName(post.User)}`}
                        />
                    </div>
                    <h3 className="font-medium leading-7">{formatDisplayName(post.User)}</h3>
                </div>
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
                            onClick={handleDeletePost}
                            className="h-6 cursor-pointer fill-primary-500 hover:animate-wiggle hover:fill-primary-500 md:fill-primary-300"
                            viewBox="0 0 512 512"
                        >
                            <path d="M62.205,150l26.569,320.735C90.678,493.865,110.38,512,133.598,512h244.805c23.218,0,42.92-18.135,44.824-41.265    L449.795,150H62.205z M180.986,452c-7.852,0-14.458-6.108-14.956-14.063l-15-242c-0.513-8.276,5.771-15.395,14.033-15.908    c8.569-0.601,15.381,5.757,15.908,14.033l15,242C196.502,444.632,189.721,452,180.986,452z M271,437c0,8.291-6.709,15-15,15    c-8.291,0-15-6.709-15-15V195c0-8.291,6.709-15,15-15s15,6.709,15,15V437z M360.97,195.938l-15,242    c-0.493,7.874-7.056,14.436-15.908,14.033c-8.262-0.513-14.546-7.632-14.033-15.908l15-242    c0.513-8.276,7.764-14.297,15.908-14.033C355.199,180.543,361.483,187.662,360.97,195.938z" />

                            <path d="M451,60h-90V45c0-24.814-20.186-45-45-45H196c-24.814,0-45,20.186-45,45v15H61c-16.569,0-30,13.431-30,30    c0,16.567,13.431,30,30,30c137.966,0,252.039,0,390,0c16.569,0,30-13.433,30-30C481,73.431,467.569,60,451,60z M331,60H181V45    c0-8.276,6.724-15,15-15h120c8.276,0,15,6.724,15,15V60z" />
                        </svg>
                    )}
                </div>
            </header>

            <style jsx>{`
                .img * {
                    width: 100% !important;
                    height: auto !important;
                }
            `}</style>

            <main className="pt-3 pb-4">
                {post.image && (
                    <div className="relative w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={post.image}
                            className="max-h-[420px] w-full object-contain"
                            alt={`Image by ${formatDisplayName(post.User)}`}
                        />
                    </div>
                )}

                <p>{post.body}</p>
            </main>

            <footer className="flex justify-between border-t-2 border-gray-100 pt-2 text-sm text-gray-600 sm:text-xs">
                <div className="flex gap-2 align-middle">
                    <svg
                        className="h-6 cursor-pointer select-none transition-all hover:scale-110 active:scale-125"
                        viewBox="0 0 512 470"
                        onClick={handleLikePost}
                    >
                        {userLiked ? (
                            <path
                                className="fill-purple-600"
                                d="m471.382812 44.578125c-26.503906-28.746094-62.871093-44.578125-102.410156-44.578125-29.554687 0-56.621094 9.34375-80.449218 27.769531-12.023438 9.300781-22.917969 20.679688-32.523438 33.960938-9.601562-13.277344-20.5-24.660157-32.527344-33.960938-23.824218-18.425781-50.890625-27.769531-80.445312-27.769531-39.539063 0-75.910156 15.832031-102.414063 44.578125-26.1875 28.410156-40.613281 67.222656-40.613281 109.292969 0 43.300781 16.136719 82.9375 50.78125 124.742187 30.992188 37.394531 75.535156 75.355469 127.117188 119.3125 17.613281 15.011719 37.578124 32.027344 58.308593 50.152344 5.476563 4.796875 12.503907 7.4375 19.792969 7.4375 7.285156 0 14.316406-2.640625 19.785156-7.429687 20.730469-18.128907 40.707032-35.152344 58.328125-50.171876 51.574219-43.949218 96.117188-81.90625 127.109375-119.304687 34.644532-41.800781 50.777344-81.4375 50.777344-124.742187 0-42.066407-14.425781-80.878907-40.617188-109.289063zm0 0"
                            />
                        ) : (
                            <path
                                className="fill-black"
                                d="m256 455.515625c-7.289062 0-14.316406-2.640625-19.792969-7.4375-20.683593-18.085937-40.625-35.082031-58.21875-50.074219l-.089843-.078125c-51.582032-43.957031-96.125-81.917969-127.117188-119.3125-34.644531-41.804687-50.78125-81.441406-50.78125-124.742187 0-42.070313 14.425781-80.882813 40.617188-109.292969 26.503906-28.746094 62.871093-44.578125 102.414062-44.578125 29.554688 0 56.621094 9.34375 80.445312 27.769531 12.023438 9.300781 22.921876 20.683594 32.523438 33.960938 9.605469-13.277344 20.5-24.660157 32.527344-33.960938 23.824218-18.425781 50.890625-27.769531 80.445312-27.769531 39.539063 0 75.910156 15.832031 102.414063 44.578125 26.191406 28.410156 40.613281 67.222656 40.613281 109.292969 0 43.300781-16.132812 82.9375-50.777344 124.738281-30.992187 37.398437-75.53125 75.355469-127.105468 119.308594-17.625 15.015625-37.597657 32.039062-58.328126 50.167969-5.472656 4.789062-12.503906 7.429687-19.789062 7.429687zm-112.96875-425.523437c-31.066406 0-59.605469 12.398437-80.367188 34.914062-21.070312 22.855469-32.675781 54.449219-32.675781 88.964844 0 36.417968 13.535157 68.988281 43.882813 105.605468 29.332031 35.394532 72.960937 72.574219 123.476562 115.625l.09375.078126c17.660156 15.050781 37.679688 32.113281 58.515625 50.332031 20.960938-18.253907 41.011719-35.34375 58.707031-50.417969 50.511719-43.050781 94.136719-80.222656 123.46875-115.617188 30.34375-36.617187 43.878907-69.1875 43.878907-105.605468 0-34.515625-11.605469-66.109375-32.675781-88.964844-20.757813-22.515625-49.300782-34.914062-80.363282-34.914062-22.757812 0-43.652344 7.234374-62.101562 21.5-16.441406 12.71875-27.894532 28.796874-34.609375 40.046874-3.453125 5.785157-9.53125 9.238282-16.261719 9.238282s-12.808594-3.453125-16.261719-9.238282c-6.710937-11.25-18.164062-27.328124-34.609375-40.046874-18.449218-14.265626-39.34375-21.5-62.097656-21.5zm0 0"
                            />
                        )}
                    </svg>
                    <span className="leading-5">{likesCount}</span>
                </div>

                <span className="leading-6">
                    {formatUsername(post.User)} • {formatDate(post.createdAt)}{" "}
                    {post.edited ? "(modifié)" : ""}
                </span>
            </footer>
        </article>
    );
};

export default Post;
