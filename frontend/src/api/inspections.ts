import { api } from './client';

export type Location = { id: number; name: string };
export type Inspector = { id: number; name: string };

export type Inspection = {
  id: number;
  status: 'Yet to Start' | 'Completed';
  assignedInspectorId: number | null;
  locationId: number | null;
  startedAt: string | null;
  durationMinutes: number | null;
  result: 'Pass' | 'Fail' | null;
  comments: string | null;
};

export type CompleteInput = {
  locationId: number;
  startedAt: string; 
  durationMinutes: number;
  result: 'Pass' | 'Fail';
  comments?: string;
};

export const listInspections = () => api<Inspection[]>('/inspections');
export const listInspectors = () => api<Inspector[]>('/users/inspectors'); 

export const createInspection = () =>
  api<Inspection>('/inspections', { method: 'POST', body: JSON.stringify({}) });

export const assignInspection = (id: number, inspectorId: number) =>
  api<Inspection>(`/inspections/${id}/assign`, { method: 'PATCH', body: JSON.stringify({ inspectorId }) });

export const completeInspection = (id: number, input: CompleteInput) =>
  api<Inspection>(`/inspections/${id}/complete`, { method: 'PATCH', body: JSON.stringify(input) });