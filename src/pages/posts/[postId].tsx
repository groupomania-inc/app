import { NextPage } from "next";
import Error from "next/error";
import { useRouter } from "next/router";

import { trpc } from "../../utils/trpc";

const PostPage: NextPage = () => {
    const router = useRouter();

    const postId = router.query.postId as string;
    const { data, isLoading } = trpc.useQuery(["posts.get-single", { postId }]);
    const { mutate, error } = trpc.useMutation(["posts.like"], {
        onSuccess: () => {
            console.log("ok");
        },
    });

    if (isLoading) return <p>Loading post...</p>;
    if (!data) return <Error statusCode={404} />;

    const handleLike = () => mutate({ postId: data.id });

    return (
        <div>
            {error && error.message}
            <h1>{data.title}</h1>

            <p>{data.body}</p>

            <button onClick={handleLike}>Like ({data.likes.length} likes)</button>
        </div>
    );
};

export default PostPage;
