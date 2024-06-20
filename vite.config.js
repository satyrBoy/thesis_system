import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

//导入AutoImport、Components
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { VarletUIResolver } from 'unplugin-vue-components/resolvers'

import IconsResolver from 'unplugin-icons/resolver'
import Icons from 'unplugin-icons/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), //以下为添加内容
    AutoImport({
      imports: ['vue'], // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
      // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
      resolvers: [ElementPlusResolver(), IconsResolver(), VarletUIResolver({ autoImport: true })],
      eslintrc: { enabled: true }
    }),
    Components({
      resolvers: [
        ElementPlusResolver(),
        IconsResolver({ enabledCollections: ['ep'] }),
        VarletUIResolver()
      ] // 自动导入 Element Plus 组件, 图标组件
    }),
    Icons({ autoInstall: true })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  server: {
    proxy: {
      '/user': {
        target: 'http://101.132.245.82:8048',
        changeOrigin: true
      },
      '/phase': {
        target: 'http://101.132.245.82:8048',
        changeOrigin: true
      },
      '/phaseRelation': {
        target: 'http://101.132.245.82:8048',
        changeOrigin: true
      },
      '/instruct': {
        target: 'http://101.132.245.82:8048',
        changeOrigin: true
      },
      '/paper': {
        target: 'http://101.132.245.82:8048',
        changeOrigin: true
      }
    },
    port: 8888,
    host: '0.0.0.0', // 配置项目可以局域网访问
    cors: true // 默认启用并允许任何源
  }
})
