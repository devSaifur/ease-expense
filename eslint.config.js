import js from '@eslint/js'
import typescriptEslintParser from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'
import globals from 'globals'
import ts from 'typescript-eslint'

export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    {
        languageOptions: {
            globals: {
                ...globals.node,
            },
        },
    },
    js.configs.recommended,
    ...ts.configs.recommended,
    {
        rules: {
            '@typescript-eslint/no-floating-promises': 'error',
            'no-unused-vars': 'warn',
            'no-undef': 'warn',
        },
        languageOptions: {
            parser: typescriptEslintParser,
            parserOptions: {
                project: './tsconfig.json',
            },
        },
        ignores: ['./client/*'],
    },
    eslintConfigPrettier,
]
