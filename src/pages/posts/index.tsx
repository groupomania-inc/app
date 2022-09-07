import { NextPage } from "next";
import Link from "next/link";

import { trpc } from "../../utils/trpc";

const PostsListingPage: NextPage = () => {
    const { data, isLoading } = trpc.useQuery(["posts.get-all"]);

    if (isLoading) return <p>Loading...</p>;
    if (!data) return <p>No posts yet!</p>;

    return (
        <div>
            {data.map((post) => (
                <article key={post.id}>
                    <p>{post.title}</p>
                    <Link href={`/posts/${post.id}`}>Read post</Link>
                </article>
            ))}
        </div>
    );
};

export default PostsListingPage;
