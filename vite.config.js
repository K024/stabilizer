//@ts-check
import { defineConfig } from "vite"
import { resolve } from "path"

export default defineConfig({
  esbuild: {
    jsxFactory: "jsx.createElement",
    jsxFragment: "jsx.Fragment",
    jsxInject: "import jsx from \"jsx\"",
  },
  resolve: {
    alias: {
      jsx: resolve(__dirname, "src/jsx.ts")
    },
  },
})
