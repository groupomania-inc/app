import { NextPage } from "next";
import Error from "next/error";
import { useRouter } from "next/router";

import { trpc } from "../../utils/trpc";

const PostPage: NextPage = () => {
    const router = useRouter();

    const postId = router.query.postId as string;
    const { data, isLoading } = trpc.useQuery(["posts.get-single", { postId }]);

    if (isLoading) return <p>Loading post...</p>;
    if (!data) return <Error statusCode={404} />;

    return (
        <div>
            <h1>{data.title}</h1>

            <p>{data.body}</p>
        </div>
    );
};

export default PostPage;
