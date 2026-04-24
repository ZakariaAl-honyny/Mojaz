import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import FAQSection from "./FAQSection";
import { LanguageProvider } from "@/contexts/language-context";

const meta: Meta<typeof FAQSection> = {
  title: "Landing/FAQSection",
  component: FAQSection,
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
type Story = StoryObj<typeof FAQSection>;

export const Default: Story = {};
