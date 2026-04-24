import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import StatsSection from "./StatsSection";
import { LanguageProvider } from "@/contexts/language-context";

const meta: Meta<typeof StatsSection> = {
  title: "Landing/StatsSection",
  component: StatsSection,
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
type Story = StoryObj<typeof StatsSection>;

export const Default: Story = {};
