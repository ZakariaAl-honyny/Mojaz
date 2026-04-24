import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CategorySection from "./CategorySection";
import { LanguageProvider } from "@/contexts/language-context";

const meta: Meta<typeof CategorySection> = {
  title: "Landing/CategorySection",
  component: CategorySection,
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
type Story = StoryObj<typeof CategorySection>;

export const Default: Story = {};
