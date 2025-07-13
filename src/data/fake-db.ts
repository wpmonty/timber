import {
  mockMaintainables,
  mockMaintenanceLogs,
  mockPropertyData,
} from '@/data/mock-property-data';
import { MaintainableData } from '@/types/maintainables.types';
import { MaintenanceLogEntry } from '@/types/maintenance';
import { PropertyData } from '@/types/property.types';

// Simple in-memory store that copies the mock data so mutations during runtime
// don’t modify the source mocks (helpful for Jest tests that rely on pristine mocks).
// ---------------------------------------------------------------------------------
export const db = {
  maintainables: [...mockMaintainables],
  logs: [...mockMaintenanceLogs],
  properties: [deepClone(mockPropertyData)],
};

// ---------- Maintainables (Systems) ----------
export function getSystems(): MaintainableData[] {
  return db.maintainables;
}

export function getSystem(id: string): MaintainableData | undefined {
  return db.maintainables.find(m => m.id === id);
}

export function createSystem(data: Omit<MaintainableData, 'id' | 'createdAt' | 'updatedAt'>): MaintainableData {
  const now = new Date();
  const newItem: MaintainableData = {
    ...data,
    id: generateId('sys'),
    createdAt: now,
    updatedAt: now,
  } as MaintainableData;
  db.maintainables.push(newItem);
  return newItem;
}

export function updateSystem(id: string, patch: Partial<MaintainableData>): MaintainableData | undefined {
  const item = getSystem(id);
  if (!item) return undefined;
  Object.assign(item, patch, { updatedAt: new Date() });
  return item;
}

export function deleteSystem(id: string): boolean {
  const idx = db.maintainables.findIndex(m => m.id === id);
  if (idx === -1) return false;
  db.maintainables.splice(idx, 1);
  return true;
}

// ---------- Logs ----------
export function getLogs(): MaintenanceLogEntry[] {
  return db.logs;
}

export function getLog(id: string): MaintenanceLogEntry | undefined {
  return db.logs.find(l => l.id === id);
}

export function createLog(data: Omit<MaintenanceLogEntry, 'id'>): MaintenanceLogEntry {
  const newItem: MaintenanceLogEntry = { ...data, id: generateId('log') } as MaintenanceLogEntry;
  db.logs.push(newItem);
  return newItem;
}

export function updateLog(id: string, patch: Partial<MaintenanceLogEntry>): MaintenanceLogEntry | undefined {
  const log = getLog(id);
  if (!log) return undefined;
  Object.assign(log, patch);
  return log;
}

export function deleteLog(id: string): boolean {
  const idx = db.logs.findIndex(l => l.id === id);
  if (idx === -1) return false;
  db.logs.splice(idx, 1);
  return true;
}

// ---------- Properties ----------
export function getProperties(): PropertyData[] {
  return db.properties;
}

export function getProperty(id: string): PropertyData | undefined {
  return db.properties.find(p => p.id === id);
}

export function updateProperty(id: string, patch: Partial<PropertyData>): PropertyData | undefined {
  const prop = getProperty(id);
  if (!prop) return undefined;
  Object.assign(prop, patch, { updatedAt: new Date() });
  return prop;
}

// ---------- Helpers ----------
function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}