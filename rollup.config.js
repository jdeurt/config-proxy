import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import pkg from "./package.json";

export default {
    input: "src/index.ts",
    output: [
        {
            format: "esm",
            file: pkg.module,
            sourcemap: false,
        },
        {
            format: "cjs",
            file: pkg.main,
            sourcemap: false,
            esModule: false,
        },
    ],
    external: [
        ...require("module").builtinModules,
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
        resolve(),
        typescript({
            useTsconfigDeclarationDir: true,
        }),
    ],
};
