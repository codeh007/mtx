import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  // ...
  // framework: '@storybook/react-webpack5', 👈 Remove this
  framework: "@storybook/nextjs", // 👈 Add this
  //   framework: '@storybook/nextjs-vite', // 👈 Add this
  addons: [
    // ...
    // 👇 These can both be removed
    // 'storybook-addon-next',
    // 'storybook-addon-next-router',
  ],
};

export default config;
