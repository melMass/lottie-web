import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

import { fixupConfigRules } from "@eslint/compat";
import { fixupPluginRules } from "@eslint/compat";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

const airbnb = compat.extends("airbnb-base");
export default [
    ...fixupConfigRules(airbnb),
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },

            ecmaVersion: 2015,
            sourceType: "module",

            parserOptions: {
                ecmaFeatures: {
                    globalReturn: false,
                },
            },
        },

        rules: {
            "no-var": "off",
            "prefer-destructuring": "off",
            "prefer-template": "off",
            "linebreak-style": "off",
            "object-shorthand": "off",
            "prefer-object-spread": "off",

            "comma-dangle": [
                "error",
                {
                    arrays: "always-multiline",
                    objects: "always-multiline",
                    imports: "always-multiline",
                    exports: "always-multiline",
                    functions: "never",
                },
            ],

            "no-restricted-properties": "off",
            "prefer-spread": "off",
            "no-restricted-globals": "off",
            "prefer-arrow-callback": "off",
            "prefer-rest-params": "off",
            "no-restricted-syntax": "off",
            strict: "off",
            "------": "off",
            "func-names": "off",
            "max-len": "off",
            "no-underscore-dangle": "off",
            "no-param-reassign": "off",
            "vars-on-top": "off",
            "no-use-before-define": "off",
            "-------": "off",
        },
    },
];
