
export type StorageLocationType = 'Local' | 'IrohBlob' | 'CloudRef';

export enum SecurityLevel {
  None = 'None',
  Standard = 'Standard',
  High = 'High', // Enterprise
}

export type AppNetworkStatus = 'online' | 'offline' | 'connecting';

export interface Resource {
  id: string;
  name: string;
  author: string; // PublicKey
  type_tag: 'photo' | 'doc' | 'iot_signal' | 'script' | 'video';
  tags: string[];
  location: StorageLocationType;
  cloudProvider?: string; // If location is CloudRef
  size: string;
  encryption_level: SecurityLevel;
  lastModified: string;
  // Versioning & Behavior
  version: number;
  versions?: { version: number; date: string; author: string }[];
  behaviorBinding?: string; // ID of a Schema/Script
  spaceId?: string; // Belonging to a space
  structuredTags?: ResourceTagRelation[];
}

// Structured Faceted Tags
export interface Facet {
  id: string;
  code: string; // e.g., 'department'
  name: string; // e.g., 'Department'
  isMultiSelect: boolean;
}

export interface Tag {
  id: string;
  facetId: string;
  parentId: string | null;
  name: string;
  path: string; // Materialized Path: /root_id/child_id/
  level: number;
}

export interface ResourceTagRelation {
  facetId: string;
  tagId: string;
}

export interface Space {
  id: string;
  name: string;
  parentId: string | null;
  type: 'standard' | 'hidden' | 'system'; // Hidden requires password
  isLocked: boolean;
  tags: string[];
  location?: string; // Virtual coordinates or GPS
}

export interface IdentityProfile {
  id: string;
  name: string;
  publicKey: string;
  avatar?: string;
  inheritance: {
    enabled: boolean;
    triggerCondition: 'inactivity' | 'manual_dead_man_switch';
    inactivityPeriodDays: number;
    beneficiaryId: string;
    status: 'active' | 'triggered';
  };
}

export interface MarketItem {
  id: string;
  title: string;
  providerId: string;
  category: 'storage' | 'compute' | 'network' | 'service' | 'data';
  description: string;
  price: string;
  rating: number;
}

export interface CloudProvider {
  id: string;
  name: string; // OneDrive, Baidu, S3
  connected: boolean;
  status: 'active' | 'syncing' | 'error' | 'idle';
  usedSpace: string;
  totalSpace: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: 'READ' | 'WRITE' | 'DELETE' | 'SYNC' | 'LOGIN';
  resourceId?: string;
  details: string;
}

export interface Peer {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'busy';
  deviceType: 'mobile' | 'desktop' | 'server';
  publicKey: string;
  lastSeen: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

// Custom Pages
export type WidgetType = 'text' | 'resource_list' | 'stats' | 'action_button';

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  width: 'full' | 'half' | 'third';
  content?: string; // for text
  filterTags?: string[]; // for lists/stats
  targetAction?: string; // for buttons
}

export interface CustomPage {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  createdAt: string;
}

// Schemas & Types
export type SchemaFieldType = 'Text' | 'Number' | 'Boolean' | 'Date' | 'Reference' | 'File';

export interface SchemaField {
    id: string;
    name: string;
    type: SchemaFieldType;
    required: boolean;
}

export interface SchemaMethod {
    id: string;
    name: string;
    code: string; // Rhai script
}

export interface SchemaPipeline {
    id: string;
    name: string;
    steps: string[]; // Array of Method IDs
}

export interface ItemSchema {
    id: string;
    name: string;
    description: string;
    fields: SchemaField[];
    methods: SchemaMethod[];
    pipelines: SchemaPipeline[];
}

// Item Views & Actions
export interface ItemView {
    id: string;
    name: string;
    type: 'preview' | 'json' | 'metadata' | 'editor';
}

export interface ItemAction {
    id: string;
    name: string;
    type: 'method' | 'pipeline';
}

// Navigation
export type ViewState = 
  | 'SPACES' 
  | 'IDENTITY' 
  | 'MARKET' 
  | 'RESOURCES' 
  | 'CLOUD' 
  | 'AUTOMATION' 
  | 'AUDIT' 
  | 'CHAT'
  | 'CUSTOM_PAGE'
  | 'SCHEMA_DESIGNER'
  | 'APP_LIBRARY'
  | 'TAG_TAXONOMY'
  | 'SYSTEM_STATUS';

export interface SystemModule {
    id: ViewState;
    iconName: string;
    i18nKey: string;
    descKey: string;
    category: 'core' | 'communication' | 'tool' | 'system';
    isFixed?: boolean;
}
