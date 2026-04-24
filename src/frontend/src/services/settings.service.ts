import axios from '@/lib/api-client';

export interface SystemSettingDto {
  key: string;
  value: string;
  description?: string;
  updatedAt?: string;
}

export interface UpdateSettingRequest {
  value: string;
}

export const settingsService = {
  async getAllSettings(): Promise<SystemSettingDto[]> {
    const response = await axios.get<{ data: SystemSettingDto[] }>('/settings');
    return response.data.data;
  },

  async updateSetting(key: string, value: string): Promise<void> {
    await axios.put(`/settings/${key}`, { value });
  },
};

export default settingsService;