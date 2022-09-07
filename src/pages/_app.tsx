// src/pages/_app.tsx
import "../styles/globals.scss";

import { withTRPC } from "@trpc/next";
import type { AppType } from "next/dist/shared/lib/utils";
import { useRouter } from "next/router";
import { getSession, SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import superjson from "superjson";

import type { AppRouter } from "../server/router";

const MyApp: AppType = ({ Component, pageProps }) => {
    const router = useRouter();

    useEffect(() => {
        getSession().then(async (session) => {
            if (session?.user) return;
            if (router.route === "/auth/sign-in" || router.route === "/auth/sign-up") return;

            await router.push("/auth/sign-in");
        });
    });

    return (
        <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
        </SessionProvider>
    );
};

const getBaseUrl = () => {
    if (typeof window !== "undefined") return ""; // browser should use relative url
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
    config() {
        /**
         * If you want to use SSR, you need to use the server's full URL
         * @link https://trpc.io/docs/ssr
         */
        const url = `${getBaseUrl()}/api/trpc`;

        return {
            url,
            transformer: superjson,
            /**
             * @link https://react-query.tanstack.com/reference/QueryClient
             */
            // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
        };
    },
    /**
     * @link https://trpc.io/docs/ssr
     */
    ssr: false,
})(MyApp);
