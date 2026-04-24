import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ServiceGrid from "./ServiceGrid";
import { LanguageProvider } from "@/contexts/language-context";

const meta: Meta<typeof ServiceGrid> = {
  title: "Landing/ServiceGrid",
  component: ServiceGrid,
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
type Story = StoryObj<typeof ServiceGrid>;

export const Default: Story = {};
