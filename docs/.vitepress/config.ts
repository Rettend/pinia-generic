import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Pinia Generic',
  description: 'Create generic stores, and split stores into multiple files',
  head: [
    ['link', { rel: 'icon', href: '/pinia-generic.svg' }],
  ],
  themeConfig: {
    logo: '/pinia-generic.svg',
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Examples', link: '/examples/basic' },
      { text: 'API', link: '/api-overview' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/getting-started' },
          { text: 'Splitting Stores', link: '/guide/splitting-stores' },
          { text: 'Generic Stores', link: '/guide/generic-stores' },
        ],
      },
      {
        text: 'Examples',
        items: [
          { text: 'Basic', link: '/examples/basic' },
          { text: 'Generic', link: '/examples/generic' },
        ],
      },
      {
        items: [
          { text: 'API Overview', link: '/api-overview' },
        ],
      },
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Rettend/pinia-generic' },
    ],
  },
})
