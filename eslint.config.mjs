import pluginJs from '@eslint/js'
import typeScriptEslintParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { globals: globals.node } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    {
        rules: {
            '@typescript-eslint/no-floating-promises': 'error',
        },
        languageOptions: {
            parser: typeScriptEslintParser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
    },
    eslintConfigPrettier,
]
