import { api } from './api';

export interface UserPreferences {
  userId: string;
  preferredGenres?: string[];
  preferredLocation?: string;
  latitude?: number;
  longitude?: number;
  preferredEventTypes?: string[];
}

export const profileService = {
  getPreferences: (userId: string) =>
    api.get<UserPreferences>(`/profiles/${userId}/preferences`),

  updatePreferences: (userId: string, data: Partial<UserPreferences>) =>
    api.put<UserPreferences>(`/profiles/${userId}/preferences`, data),
};
