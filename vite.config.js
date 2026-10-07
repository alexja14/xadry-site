import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// base './' = căi relative, ca site-ul să meargă și pe xadry.live, și pe <cont>.github.io/<repo>/ înainte de mutarea domeniului.
export default defineConfig({
  base: './',
  plugins: [vue()],
});
