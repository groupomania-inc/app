import type { NextPage } from "next";
import { signOut, useSession } from "next-auth/react";

const HomePage: NextPage = () => {
    const { data: session } = useSession();

    return (
        <>
            <p>{session?.user?.id}</p>
            <button onClick={async () => await signOut()}>Sign out</button>
        </>
    );
};

export default HomePage;
