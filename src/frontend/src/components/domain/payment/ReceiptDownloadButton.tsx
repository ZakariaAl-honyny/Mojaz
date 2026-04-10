"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { paymentService } from "@/services/payment.service";
import { Download, Loader2, FileCheck } from "lucide-react";
import { toast } from "react-hot-toast";

interface ReceiptDownloadButtonProps {
  paymentId: string;
  variant?: "default" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
}

export function ReceiptDownloadButton({
  paymentId,
  variant = "outline",
  size = "sm",
  className,
  showIcon = true,
}: ReceiptDownloadButtonProps) {
  const t = useTranslations("payment");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      setIsDownloading(true);
      await paymentService.downloadReceipt(paymentId);
      toast.success(t("receipt.downloadSuccess") || "Receipt downloaded successfully");
    } catch (error) {
      console.error("Receipt download error:", error);
      toast.error(t("receipt.downloadError") || "Failed to download receipt");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={isDownloading}
      onClick={handleDownload}
    >
      {isDownloading ? (
        <Loader2 className="w-4 h-4 animate-spin me-2" />
      ) : showIcon ? (
        <Download className="w-4 h-4 me-2" />
      ) : null}
      {isDownloading ? (t("receipt.downloading") || "Downloading...") : (t("receipt.downloadButton") || "Download Receipt")}
    </Button>
  );
}
