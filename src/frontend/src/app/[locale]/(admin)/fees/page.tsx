'use client';

/**
 * Admin Fee Management Page
 * Manages all fee structures with edit and history capabilities
 */

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { FeeListItemDto, UpdateFeeRequest } from '@/types/fee.types';
import FeeService from '@/services/fee.service';
import { FeeTable } from '@/components/domain/fee/FeeTable';
import { FeeEditModal } from '@/components/domain/fee/FeeEditModal';
import { FeeHistoryDrawer } from '@/components/domain/fee/FeeHistoryDrawer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RefreshCw, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export default function FeesPage() {
  const t = useTranslations('fee');
  const tCommon = useTranslations('common');
  const queryClient = useQueryClient();

  const [selectedFee, setSelectedFee] = useState<FeeListItemDto | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  // Fetch fees data
  const { data: feesData, isLoading, error, refetch } = useQuery({
    queryKey: ['fees'],
    queryFn: async () => {
      const response = await FeeService.getFees();
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || 'Failed to load fees');
    },
  });

  // Update fee mutation
  const updateFeeMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateFeeRequest }) => {
      const response = await FeeService.updateFee(id, data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update fee');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      toast.success(t('messages.saveSuccess'));
      setIsEditModalOpen(false);
      setSelectedFee(null);
    },
    onError: (error: Error) => {
      toast.error(error.message || t('messages.saveError'));
    },
  });

  const handleEdit = useCallback((fee: FeeListItemDto) => {
    setSelectedFee(fee);
    setIsEditModalOpen(true);
  }, []);

  const handleHistory = useCallback((fee: FeeListItemDto) => {
    setSelectedFee(fee);
    setIsHistoryDrawerOpen(true);
  }, []);

  const handleSaveFee = async (id: string, data: UpdateFeeRequest) => {
    await updateFeeMutation.mutateAsync({ id, data });
  };

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedFee(null);
  }, []);

  const handleCloseHistoryDrawer = useCallback(() => {
    setIsHistoryDrawerOpen(false);
    setSelectedFee(null);
  }, []);

  const fees = feesData || [];

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
              <DollarSign className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary-900 dark:text-primary-100">
                {t('title')}
              </h1>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {t('table.description') || 'Manage all fee structures and pricing'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            {tCommon('retry')}
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertTitle>{tCommon('error.title')}</AlertTitle>
            <AlertDescription>
              {error.message || t('messages.loadError')}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Card */}
        <Card className="border-neutral-200 dark:border-neutral-800 shadow-sm">
          <CardHeader className="pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <CardTitle className="text-lg font-semibold text-primary-900 dark:text-primary-100">
              {t('title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <FeeTable
              fees={fees}
              isLoading={isLoading}
              onEdit={handleEdit}
              onHistory={handleHistory}
            />
          </CardContent>
        </Card>

        {/* Edit Modal */}
        <FeeEditModal
          fee={selectedFee}
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          onSave={handleSaveFee}
          isSaving={updateFeeMutation.isPending}
        />

        {/* History Drawer */}
        <FeeHistoryDrawer
          fee={selectedFee}
          isOpen={isHistoryDrawerOpen}
          onClose={handleCloseHistoryDrawer}
        />
      </div>
    </DashboardLayout>
  );
}