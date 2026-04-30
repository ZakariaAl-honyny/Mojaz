import axios from '@/lib/api-client';
import { ApiResponse, PaginatedResult, SystemSettingDto } from '@/types/api.types';

export type { SystemSettingDto };

export interface UpdateSettingRequest {
  value: string;
}

export const settingsService = {
  async getAllSettings(): Promise<SystemSettingDto[]> {
    const response = await axios.get<ApiResponse<PaginatedResult<SystemSettingDto>>>('settings');
    return response.data.data?.items || [];
  },

  async updateSetting(key: string, value: string): Promise<void> {
    await axios.put(`settings/${key}`, { value });
  },
};

export default settingsService;