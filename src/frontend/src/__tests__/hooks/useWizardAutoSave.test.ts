import { renderHook, act } from '@testing-library/react';
import { useWizardAutoSave } from '@/hooks/useWizardAutoSave';
import { useWizardStore } from '@/stores/wizard-store';
import { applicationService } from '@/services/application.service';

// Mock store and service
jest.mock('@/stores/wizard-store');
jest.mock('@/services/application.service');

describe('useWizardAutoSave', () => {
  const setSavingMock = jest.fn();
  const setLastSavedAtMock = jest.fn();
  const incrementSaveFailuresMock = jest.fn();
  const resetSaveFailuresMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    (useWizardStore as unknown as jest.Mock).mockReturnValue({
      applicationId: 'app-123',
      step1: { serviceType: 'NewLicense' },
      step2: { categoryCode: 'B' },
      step3: { dateOfBirth: '2000-01-01' },
      step4: { applicantType: 'Citizen' },
      declarationAccepted: true,
      consecutiveSaveFailures: 0,
      setSaving: setSavingMock,
      setLastSavedAt: setLastSavedAtMock,
      incrementSaveFailures: incrementSaveFailuresMock,
      resetSaveFailures: resetSaveFailuresMock,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('triggers auto-save after 30 seconds if state changed', async () => {
    (applicationService.updateDraftApplication as jest.Mock).mockResolvedValue({
      success: true,
    });

    renderHook(() => useWizardAutoSave());

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(setSavingMock).toHaveBeenCalledWith(true);
    expect(applicationService.updateDraftApplication).toHaveBeenCalled();
    
    await act(async () => {
      // Wait for promise resolution
    });

    expect(setLastSavedAtMock).toHaveBeenCalled();
    expect(resetSaveFailuresMock).toHaveBeenCalled();
  });

  it('does not trigger auto-save if applicationId is missing', () => {
    (useWizardStore as unknown as jest.Mock).mockReturnValue({
      applicationId: null,
    });

    renderHook(() => useWizardAutoSave());

    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(applicationService.updateDraftApplication).not.toHaveBeenCalled();
  });

  it('increments failures on API error', async () => {
    (applicationService.updateDraftApplication as jest.Mock).mockRejectedValue(new Error('Network error'));

    renderHook(() => useWizardAutoSave());

    act(() => {
      jest.advanceTimersByTime(30000);
    });

    await act(async () => {});

    expect(incrementSaveFailuresMock).toHaveBeenCalled();
  });
});
