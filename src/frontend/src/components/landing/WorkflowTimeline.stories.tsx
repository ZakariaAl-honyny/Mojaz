import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import WorkflowTimeline from "./WorkflowTimeline";
import { LanguageProvider } from "@/contexts/language-context";

const meta: Meta<typeof WorkflowTimeline> = {
  title: "Landing/WorkflowTimeline",
  component: WorkflowTimeline,
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
type Story = StoryObj<typeof WorkflowTimeline>;

export const Default: Story = {};
