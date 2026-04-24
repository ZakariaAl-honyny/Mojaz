import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import CTASection from "./CTASection";
import { LanguageProvider } from "@/contexts/language-context";

const meta: Meta<typeof CTASection> = {
  title: "Landing/CTASection",
  component: CTASection,
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
type Story = StoryObj<typeof CTASection>;

export const Default: Story = {};
