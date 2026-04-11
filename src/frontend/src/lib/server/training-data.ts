import { cache } from 'react';
import apiClient from '@/lib/api-client';

/**
 * Server-side cached function to fetch training hours required for a license category.
 * Uses React.cache() to prevent duplicate DB calls per request.
 * 
 * @param category - License category code (A, B, C, D, E, F)
 * @returns Number of training hours required, or default value if not configured
 */
export const getRequiredTrainingHours = cache(async (category: string): Promise<number> => {
  try {
    const response = await apiClient.get(`/system-settings/TRAINING_HOURS_${category}`);
    const value = response.data?.data;
    return value ? parseInt(value, 10) : 20; // Default to 20 hours
  } catch (error) {
    // If setting not found, return default
    console.warn(`Training hours for category ${category} not found, using default`);
    return 20;
  }
});

/**
 * Get required training hours for multiple categories in parallel.
 * Each category result is cached independently.
 */
export const getTrainingHoursForCategories = cache(async (categories: string[]): Promise<Record<string, number>> => {
  const results = await Promise.all(
    categories.map(async (category) => {
      const hours = await getRequiredTrainingHours(category);
      return { category, hours };
    })
  );
  
  return results.reduce((acc, { category, hours }) => {
    acc[category] = hours;
    return acc;
  }, {} as Record<string, number>);
});
