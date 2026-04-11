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
    const response = await axios.get<{ data: SystemSettingDto[] }>('/api/v1/settings');
    return response.data.data;
  },

  async updateSetting(key: string, value: string): Promise<void> {
    await axios.put(`/api/v1/settings/${key}`, { value });
  },
};

export default settingsService;