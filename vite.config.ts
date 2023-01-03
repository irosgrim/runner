import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    //publicDir: path.resolve(__dirname, "src/assets"),
    base: "/runner/",
    root: "./",
    publicDir: "public",
});
