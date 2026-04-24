import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import Features from "./Features";
import { LanguageProvider } from "@/contexts/language-context";

const meta: Meta<typeof Features> = {
  title: "Landing/Features",
  component: Features,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <LanguageProvider>
        <Story />
      </LanguageProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Features>;

export const Default: Story = {};
