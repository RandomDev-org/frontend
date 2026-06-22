import { api } from './api';

export interface EventItem {
  id: string;
  pointId: string;
  createdBy?: string;
  name: string;
  description?: string;
  date: string;
  startTime: string;
  endTime?: string;
  musicGenre?: string;
  artists?: string[];
  isFree: boolean;
  ticketPrice?: number;
  availableCapacity?: number;
  poster?: string;
  confirmed: boolean;
}

export const eventsService = {
  findAll: () => api.get<EventItem[]>('/map/events'),

  findByPoint: (pointId: string) =>
    api.get<EventItem[]>(`/map/points/${pointId}/events`),

  create: (dto: {
    pointId: string;
    name: string;
    description?: string;
    date: string;
    startTime: string;
    endTime?: string;
    musicGenre?: string;
    artists?: string[];
    isFree?: boolean;
    ticketPrice?: number;
    availableCapacity?: number;
  }) => api.post<EventItem>('/map/events', dto),

  remove: (id: string) => api.delete<void>(`/map/events/${id}`),
};
