import StylelintPlugin from "stylelint-webpack-plugin";

/**
 * Don't be scared of the generics here.
 * All they do is to give us autocompletion when using this.
 *
 * @template {import("next").NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import("next").NextConfig}}
 */
function defineNextConfig(config) {
    return config;
}

export default defineNextConfig({
    reactStrictMode: true,
    swcMinify: true,
    output: "standalone",
    webpack: (config) => {
        config.plugins.push(new StylelintPlugin({ fix: true }));
        return config;
    },
    i18n: {
        locales: ["fr"],
        defaultLocale: "fr",
    },
    images: {
        domains: ["res.cloudinary.com"],
    },
});
