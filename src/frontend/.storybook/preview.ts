import type { Preview } from '@storybook/nextjs-vite'
import '../src/app/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#eef2f9' },
      ],
    },
    a11y: {
      test: 'todo'
    },
    docs: {
      theme: 'light',
    },
  },
};

export default preview;