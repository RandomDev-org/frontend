import { api } from './api';
import type { Venue } from './api';

export const mapsService = {
  findAll: () => api.get<Venue[]>('/map/points'),

  findOne: (id: string) => api.get<Venue>(`/map/points/${id}`),

  findByBounds: (neLat: number, neLng: number, swLat: number, swLng: number) =>
    api.get<Venue[]>(
      `/map/points/bounds?neLat=${neLat}&neLng=${neLng}&swLat=${swLat}&swLng=${swLng}`,
    ),

  findNearby: (lat: number, lng: number, radius: number) =>
    api.get<Venue[]>(
      `/map/points/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
    ),
};
