import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // Ignore node_modules, dist, etc.
  {
    ignores: ['dist', 'node_modules'],
  },
  // JavaScript + TypeScript + React config
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser, // needed for TypeScript
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: 'detect', // Automatically picks up from package.json
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...tseslint.configs.recommended[0].rules,
      'react/react-in-jsx-scope': 'off', // React 17+ JSX transform
      'react/prop-types': 'off', // Not using prop-types with TS
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
  // Prettier must be last to override conflicting rules
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      ...prettier.rules,
    },
  },
);
