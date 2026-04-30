import * as React from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Footer } from "./footer";
import { LanguageProvider } from "@/contexts/language-context";
import { ThemeProvider } from "@/contexts/theme-context";

const meta: Meta<typeof Footer> = {
  title: "Landing/Footer",
  component: Footer,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => {
      const locale = context.globals?.locale || "ar";
      const isRTL = locale === "ar";

      return (
        <ThemeProvider>
          <LanguageProvider>
            <div
              dir={isRTL ? "rtl" : "ltr"}
              lang={locale}
              className={isRTL ? "font-arabic" : "font-english"}
            >
              <Story />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      );
    },
  ],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Arabic RTL",
};

export const EnglishLTR: Story = {
  name: "English LTR",
  globals: {
    locale: "en",
  },
};

export const LightMode: Story = {
  name: "Light Mode",
  parameters: {
    backgrounds: {
      default: "white",
    },
  },
};

export const DarkMode: Story = {
  name: "Dark Mode",
  parameters: {
    backgrounds: {
      default: "dark",
    },
  },
};