import { NextPage } from "next";
import Head from "next/head";

import Header from "../components/Header";
import Post from "../components/posts/Post";
import FullPageLoadingSpinner from "../components/spinners/FullPageLoadingSpinner";
import { trpc } from "../utils/trpc";

const HomePage: NextPage = () => {
    const { data: posts, isLoading } = trpc.useQuery(["posts.get-all"]);

    const { mutate: createPost, error: createPostError } = trpc.useMutation(["posts.new"], {
        onSuccess: () => {
            console.log("post created");
        },
    });

    const handleCreateTestPost = async () => {
        createPost({
            title: Math.random().toString(16),
            body: Math.random().toString(16),
        });
    };

    return (
        <>
            <Head>
                <title>Groupomania</title>
            </Head>

            <div>
                <Header />

                <button onClick={handleCreateTestPost} className="bg-red-500 p-6">
                    Create test post
                </button>

                {isLoading ? (
                    <FullPageLoadingSpinner className="h-9 sm:h-8 lg:h-7" />
                ) : (
                    <section role={"main"} className="flex w-full justify-center">
                        <nav className="my-6 flex w-11/12 flex-col gap-6 sm:w-5/6 md:w-4/5 lg:w-3/5 xl:w-1/2">
                            {posts?.map((post) => (
                                <Post key={post.id} post={post} />
                            ))}
                        </nav>
                    </section>
                )}
            </div>
        </>
    );
};

export default HomePage;
