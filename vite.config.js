import { resolve } from "path";
import { defineConfig } from "vite";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

import pkg from "./package.json" assert { type: "json" };

const version = pkg.version;
let processed_chunks = 0;
const dev = process.env.NODE_ENV !== "production";

const PLUGINS = {
    deepIndex: ({ path }) => {
        return {
            name: "deep-index",
            configureServer(server) {
                server.middlewares.use((req, res, next) => {
                    if (req.url === "/") {
                        req.url = path;
                    }
                    next();
                });
            },
        };
    },
    noTreeShakingForStandalonePlugin: () => {
        return {
            name: "no-treeshaking-for-standalone",
            transform(code) {
                // This is very fast but can produce lots of false positives.
                // Use a good regular expression or parse an AST and analyze scoping to improve as needed.
                if (code.indexOf("__[STANDALONE]__") >= 0)
                    return { moduleSideEffects: "no-treeshake" };
            },
        };
    },

    addNavigatorValidation: (options = {}) => {
        return {
            name: "inject-navigator",
            renderChunk: (code, chunk) => {
                // return '(typeof navigator !== "undefined")' + code;
                console.log("processing", chunk.fileName);
                console.log("processed_chunks", processed_chunks++);

                return { code };
            },
        };
    },
    injectVersion: (options = {}) => {
        return {
            name: "inject-version",
            renderChunk: (code) => {
                return code.replace("[[BM_VERSION]]", version);
            },
        };
    },
};

export default defineConfig({
    worker: {
        format: "es",
    },
    plugins: [
        nodeResolve(),
        babel({
            babelHelpers: "runtime",
            skipPreflightCheck: true,
        }),
        dev && PLUGINS.deepIndex({ path: "/player/index" }),

        PLUGINS.injectVersion(),
        PLUGINS.addNavigatorValidation(),
    ],
    build: {
        minify: "esbuild",
        target: "modules",
        lib: {
            entry: resolve(__dirname, "player/js/modules/full.js"),
            name: "lottie",
            // the proper extensions will be added
            fileName: "lottie",
            formats: ["es", "umd"],
        },

        sourcemap: false,
        rollupOptions: {
            treeshake: true,
            output: {
                esModule: true,
                // entryFileNames: "[name]_[format].js",
            },
            input: dev
                ? {
                      index: resolve(__dirname, "player/index.html"),
                  }
                : null,
        },
    },
});
