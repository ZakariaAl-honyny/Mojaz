'use client';

import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useAuth } from '@/hooks/useAuth';

interface PushNotificationPromptProps {
  /** Unique key to store dismissal state */
  promptKey?: string;
  /** Callback when notifications are enabled */
  onEnabled?: () => void;
  /** Callback when prompt is dismissed */
  onDismiss?: () => void;
}

export function PushNotificationPrompt({
  promptKey = 'push-notification-prompt',
  onEnabled,
  onDismiss,
}: PushNotificationPromptProps) {
  const t = useTranslations('push');
  const { isAuthenticated } = useAuth();
  const {
    isSupported,
    permission,
    fcmToken,
    isLoading,
    error,
    requestPermission,
  } = usePushNotifications();

  const [isDismissed, setIsDismissed] = useState(false);

  // Check if we should show the prompt
  const shouldShowPrompt =
    isAuthenticated &&
    isSupported &&
    !isDismissed &&
    permission !== 'granted' &&
    !fcmToken;

  // Persist dismissal state
  useEffect(() => {
    if (isDismissed) {
      localStorage.setItem(`${promptKey}-dismissed`, 'true');
    }
  }, [isDismissed, promptKey]);

  // Load dismissal state on mount
  useEffect(() => {
    const wasDismissed = localStorage.getItem(`${promptKey}-dismissed`);
    if (wasDismissed) {
      setIsDismissed(true);
    }
  }, [promptKey]);

  // Call onEnabled callback when token is registered
  useEffect(() => {
    if (fcmToken && onEnabled) {
      onEnabled();
    }
  }, [fcmToken, onEnabled]);

  if (!shouldShowPrompt) {
    return null;
  }

  const handleEnable = async () => {
    await requestPermission();
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <Card className="mx-4 my-2 max-w-sm border-primary/20 bg-primary/5 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Bell className="h-5 w-5 text-primary" />
          </div>

          <div className="flex-1">
            <h4 className="mb-1 font-semibold text-foreground">
              {t('prompt.title')}
            </h4>
            <p className="mb-3 text-sm text-muted-foreground">
              {t('prompt.description')}
            </p>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleEnable}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? t('common.loading') : t('prompt.enable')}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDismiss}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {error && (
              <p className="mt-2 text-xs text-destructive">{error}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
