
import { Resource, SecurityLevel, CloudProvider, AuditLogEntry, Peer, ChatMessage, CustomPage, ItemSchema, Space, IdentityProfile, MarketItem, AppNetworkStatus, Facet, Tag, SystemModule, ViewState, ItemView, ItemAction } from '../types';

// --- Module Registry (Available Apps) ---
export const SYSTEM_MODULES: SystemModule[] = [
    { id: 'SPACES', iconName: 'Box', i18nKey: 'spaces', descKey: 'space_desc', category: 'core', isFixed: true },
    { id: 'SYSTEM_STATUS', iconName: 'Activity', i18nKey: 'system_status', descKey: 'system_status_desc', category: 'core' },
    { id: 'IDENTITY', iconName: 'User', i18nKey: 'identity_hub', descKey: 'identity_desc', category: 'core' },
    { id: 'MARKET', iconName: 'ShoppingBag', i18nKey: 'freelance_market', descKey: 'market_desc', category: 'core' },
    { id: 'RESOURCES', iconName: 'Search', i18nKey: 'resources', descKey: 'resources_desc', category: 'tool' },
    { id: 'TAG_TAXONOMY', iconName: 'Tags', i18nKey: 'tag_taxonomy', descKey: 'tag_taxonomy_desc', category: 'tool' },
    { id: 'CHAT', iconName: 'MessageSquare', i18nKey: 'network_chat', descKey: 'chat_desc', category: 'communication' },
    { id: 'CLOUD', iconName: 'Cloud', i18nKey: 'cloud_fabric', descKey: 'cloud_integration_desc', category: 'system' },
    { id: 'AUTOMATION', iconName: 'Cpu', i18nKey: 'automation', descKey: 'automation_subtitle', category: 'system' },
    { id: 'SCHEMA_DESIGNER', iconName: 'Workflow', i18nKey: 'schema_designer', descKey: 'schema_desc', category: 'system' },
    { id: 'AUDIT', iconName: 'ShieldCheck', i18nKey: 'audit_trail', descKey: 'audit_desc', category: 'system' },
];

// Initial User Preference (Default Sidebar)
let USER_NAVIGATION_ORDER: ViewState[] = [
    'SPACES', 
    'SYSTEM_STATUS',
    'IDENTITY', 
    'MARKET', 
    'CHAT', 
    'TAG_TAXONOMY'
];


// Mock Data - Facets & Tags
let MOCK_FACETS: Facet[] = [
  { id: 'f-1', code: 'location', name: 'Location', isMultiSelect: false },
  { id: 'f-2', code: 'department', name: 'Department', isMultiSelect: true }
];

let MOCK_TAGS: Tag[] = [
  // Location Tree
  { id: 't-1', facetId: 'f-1', parentId: null, name: 'Headquarters', path: '/t-1/', level: 1 },
  { id: 't-2', facetId: 'f-1', parentId: 't-1', name: 'Building A', path: '/t-1/t-2/', level: 2 },
  { id: 't-3', facetId: 'f-1', parentId: 't-2', name: 'Room 101', path: '/t-1/t-2/t-3/', level: 3 },
  // Department Tree
  { id: 't-4', facetId: 'f-2', parentId: null, name: 'Tech', path: '/t-4/', level: 1 },
  { id: 't-5', facetId: 'f-2', parentId: 't-4', name: 'Backend', path: '/t-4/t-5/', level: 2 },
  { id: 't-6', facetId: 'f-2', parentId: 't-4', name: 'Frontend', path: '/t-4/t-6/', level: 2 },
];

// Mock Data - Spaces
const MOCK_SPACES: Space[] = [
  { id: 'root', name: 'Root Space', parentId: null, type: 'system', isLocked: false, tags: ['root'] },
  { id: 'sp-work', name: 'Work Projects', parentId: 'root', type: 'standard', isLocked: false, tags: ['work'] },
  { id: 'sp-personal', name: 'Personal Life', parentId: 'root', type: 'standard', isLocked: false, tags: ['life'] },
  { id: 'sp-secret', name: 'Hidden Vault', parentId: 'sp-personal', type: 'hidden', isLocked: true, tags: ['private', 'encrypted'] },
];

// Mock Data - Schemas
let MOCK_SCHEMAS: ItemSchema[] = [
    {
        id: 'schema-doc',
        name: 'Enterprise Document',
        description: 'Standard document with approval workflow',
        fields: [],
        methods: [
            { id: 'm-sign', name: 'sign_document', code: '...' },
            { id: 'm-ocr', name: 'run_ocr', code: '...' }
        ],
        pipelines: [
            { id: 'p-approve', name: 'Approval Flow', steps: ['m-ocr', 'm-sign'] }
        ]
    }
];

// Mock Data - Resources
const MOCK_RESOURCES: Resource[] = [
  {
    id: 'res-1',
    name: 'Q4_Financial_Report.pdf',
    author: 'pk_abc...123',
    type_tag: 'doc',
    tags: ['work', 'finance', 'confidential'],
    location: 'Local',
    size: '2.4 MB',
    encryption_level: SecurityLevel.High,
    lastModified: '2023-10-25T14:30:00Z',
    version: 3,
    versions: [
        { version: 3, date: '2023-10-25', author: 'Me' },
        { version: 2, date: '2023-10-24', author: 'Me' },
        { version: 1, date: '2023-10-20', author: 'System' },
    ],
    spaceId: 'sp-work',
    behaviorBinding: 'schema-doc', // Bound to Schema
    structuredTags: [
        { facetId: 'f-2', tagId: 't-5' }, // Tech -> Backend
        { facetId: 'f-1', tagId: 't-1' }  // HQ
    ]
  },
  {
    id: 'res-2',
    name: 'Project_Alpha_Assets.zip',
    author: 'pk_def...456',
    type_tag: 'doc',
    tags: ['project-alpha', 'assets'],
    location: 'IrohBlob',
    size: '150 MB',
    encryption_level: SecurityLevel.Standard,
    lastModified: '2023-10-24T09:15:00Z',
    version: 1,
    spaceId: 'sp-work',
    structuredTags: [
        { facetId: 'f-2', tagId: 't-6' } // Tech -> Frontend
    ]
  },
  {
    id: 'res-3',
    name: 'Site_Inspection_Drone.mp4',
    author: 'pk_drone...789',
    type_tag: 'video',
    tags: ['site-A', 'inspection'],
    location: 'CloudRef',
    cloudProvider: 'OneDrive',
    size: '1.2 GB',
    encryption_level: SecurityLevel.Standard,
    lastModified: '2023-10-20T11:00:00Z',
    version: 1,
    spaceId: 'sp-work',
    structuredTags: [
        { facetId: 'f-1', tagId: 't-3' } // HQ -> Bld A -> Room 101
    ]
  },
  {
    id: 'res-script-1',
    name: 'deploy_node.rhai',
    author: 'me',
    type_tag: 'script',
    tags: ['dev', 'ops', 'automation'],
    location: 'Local',
    size: '4 KB',
    encryption_level: SecurityLevel.Standard,
    lastModified: '2023-10-27T10:00:00Z',
    version: 1,
    spaceId: 'sp-work',
    structuredTags: []
  },
  {
    id: 'res-secret-1',
    name: 'Diary_2023.md',
    author: 'me',
    type_tag: 'doc',
    tags: ['journal'],
    location: 'Local',
    size: '50 KB',
    encryption_level: SecurityLevel.High,
    lastModified: '2023-10-27T00:00:00Z',
    version: 10,
    spaceId: 'sp-secret',
    structuredTags: []
  }
];

// Mock Identity
let MOCK_IDENTITY: IdentityProfile = {
    id: 'id-me',
    name: 'Zhang Ge',
    publicKey: 'pk_ed25519_zg...001',
    inheritance: {
        enabled: true,
        triggerCondition: 'inactivity',
        inactivityPeriodDays: 90,
        beneficiaryId: 'pk_beneficiary...999',
        status: 'active'
    }
};

// Mock Market
const MOCK_MARKET: MarketItem[] = [
    { id: 'm-1', title: 'High-Speed Storage Node', providerId: 'node-x', category: 'storage', description: '2TB NVMe storage available for P2P pinning.', price: '0.1 Credit/GB', rating: 4.8 },
    { id: 'm-2', title: 'AI Compute Worker', providerId: 'node-y', category: 'compute', description: 'NVIDIA A100 instance for batch processing scripts.', price: '5 Credit/Hr', rating: 4.9 },
    { id: 'm-3', title: 'Public Knowledge Graph', providerId: 'univ-z', category: 'data', description: 'Open source graph of scientific papers.', price: 'Free', rating: 4.5 },
];

const MOCK_PROVIDERS: CloudProvider[] = [
  { id: 'cp-1', name: 'OneDrive', connected: true, status: 'idle', usedSpace: '450 GB', totalSpace: '1 TB' },
  { id: 'cp-2', name: 'Baidu Netdisk', connected: false, status: 'idle', usedSpace: '0 GB', totalSpace: '2 TB' },
  { id: 'cp-3', name: 'AWS S3 Glacier', connected: true, status: 'syncing', usedSpace: '1.2 TB', totalSpace: 'Unlimited' },
];

const MOCK_LOGS: AuditLogEntry[] = [
  { id: 'log-1', timestamp: '2023-10-26 10:00:01', user: 'Alice (Device A)', action: 'READ', resourceId: 'res-1', details: 'Opened document' },
  { id: 'log-2', timestamp: '2023-10-26 10:05:23', user: 'Bob (Device B)', action: 'SYNC', resourceId: 'res-2', details: 'P2P Transfer via Iroh' },
];

const MOCK_PEERS: Peer[] = [
  { id: 'peer-1', name: 'Alice iPhone 14', status: 'online', deviceType: 'mobile', publicKey: 'pk_alice...88', lastSeen: 'Now' },
  { id: 'peer-2', name: 'Bob Workstation', status: 'busy', deviceType: 'desktop', publicKey: 'pk_bob...22', lastSeen: '2 mins ago' },
];

let MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  'peer-1': [
    { id: 'm-1', senderId: 'peer-1', text: 'Hey, did you get the Q4 report?', timestamp: '10:00 AM' },
  ],
};

let MOCK_PAGES: CustomPage[] = [
    { id: 'page-1', name: 'Project Dashboard', createdAt: '2023-10-27', widgets: [] }
];


// Network Status
let MOCK_NETWORK_STATUS: AppNetworkStatus = 'online';

// Backend Interface
export const Backend = {
  getResources: async (): Promise<Resource[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_RESOURCES), 500));
  },
  
  // -- Item Views & Actions --
  getItemViews: async (resource: Resource): Promise<ItemView[]> => {
      // Default views based on type
      const views: ItemView[] = [
          { id: 'v-preview', name: 'Preview', type: 'preview' },
          { id: 'v-json', name: 'Raw JSON', type: 'json' },
          { id: 'v-meta', name: 'Metadata', type: 'metadata' }
      ];
      if (resource.type_tag === 'script') {
          views.push({ id: 'v-editor', name: 'Code Editor', type: 'editor' });
      }
      return Promise.resolve(views);
  },

  getItemActions: async (resource: Resource): Promise<ItemAction[]> => {
      const actions: ItemAction[] = [];
      
      // If bound to a schema, fetch methods/pipelines
      if (resource.behaviorBinding) {
          const schema = MOCK_SCHEMAS.find(s => s.id === resource.behaviorBinding);
          if (schema) {
              schema.methods.forEach(m => {
                  actions.push({ id: m.id, name: m.name, type: 'method' });
              });
              schema.pipelines.forEach(p => {
                  actions.push({ id: p.id, name: p.name, type: 'pipeline' });
              });
          }
      }
      
      // Default actions
      actions.push({ id: 'a-delete', name: 'Delete Resource', type: 'method' });
      
      return Promise.resolve(actions);
  },

  runItemAction: async (resourceId: string, actionId: string): Promise<boolean> => {
      return new Promise(resolve => {
          setTimeout(() => {
              console.log(`Executed action ${actionId} on ${resourceId}`);
              resolve(true);
          }, 1500); // Simulate network latency
      });
  },

  // -- App Library & Navigation --
  getSystemModules: async (): Promise<SystemModule[]> => {
      return Promise.resolve(SYSTEM_MODULES);
  },
  
  getUserNavigation: async (): Promise<ViewState[]> => {
      // Return a copy to avoid mutation reference issues
      return Promise.resolve([...USER_NAVIGATION_ORDER]);
  },

  updateUserNavigation: async (newOrder: ViewState[]): Promise<void> => {
      // Ensure 'SPACES' is always present and first if you want to enforce it, 
      // but for flexibility, we'll just trust the UI logic or enforce in backend.
      // Let's enforce SPACES presence.
      if (!newOrder.includes('SPACES')) {
          newOrder = ['SPACES', ...newOrder];
      }
      USER_NAVIGATION_ORDER = newOrder;
      return Promise.resolve();
  },

  // -- Tag Taxonomy Methods --
  getFacets: async (): Promise<Facet[]> => Promise.resolve(MOCK_FACETS),
  
  saveFacet: async (facet: Facet): Promise<Facet> => {
      const idx = MOCK_FACETS.findIndex(f => f.id === facet.id);
      if (idx >= 0) MOCK_FACETS[idx] = facet;
      else MOCK_FACETS.push(facet);
      return Promise.resolve(facet);
  },

  deleteFacet: async (id: string): Promise<void> => {
      MOCK_FACETS = MOCK_FACETS.filter(f => f.id !== id);
      MOCK_TAGS = MOCK_TAGS.filter(t => t.facetId !== id);
      return Promise.resolve();
  },

  getTags: async (facetId: string): Promise<Tag[]> => {
      return Promise.resolve(MOCK_TAGS.filter(t => t.facetId === facetId));
  },

  saveTag: async (tag: Tag): Promise<Tag> => {
      // Calculate Materialized Path
      let path = '';
      if (tag.parentId) {
          const parent = MOCK_TAGS.find(t => t.id === tag.parentId);
          if (parent) {
              path = `${parent.path}${tag.id}/`;
          } else {
              // Fallback if parent not found (shouldn't happen)
              path = `/${tag.id}/`; 
          }
      } else {
          path = `/${tag.id}/`;
      }
      tag.path = path;
      tag.level = path.split('/').filter(Boolean).length;

      const idx = MOCK_TAGS.findIndex(t => t.id === tag.id);
      if (idx >= 0) MOCK_TAGS[idx] = tag;
      else MOCK_TAGS.push(tag);
      return Promise.resolve(tag);
  },

  deleteTag: async (id: string): Promise<void> => {
      // Cascade delete children based on path
      const target = MOCK_TAGS.find(t => t.id === id);
      if (target) {
          MOCK_TAGS = MOCK_TAGS.filter(t => !t.path.startsWith(target.path));
      }
      return Promise.resolve();
  },

  // Filter Logic: Descendant Inclusion
  filterResourcesByTags: async (selectedTagIds: string[]): Promise<Resource[]> => {
      if (selectedTagIds.length === 0) return Promise.resolve(MOCK_RESOURCES);

      // 1. Get the full tag objects to check paths
      const selectedTags = MOCK_TAGS.filter(t => selectedTagIds.includes(t.id));

      return Promise.resolve(MOCK_RESOURCES.filter(res => {
          if (!res.structuredTags || res.structuredTags.length === 0) return false;
          
          // Logic: AND between facets? OR between tags in same facet?
          // Simple Logic: Resource matches if it has ANY tag that is a descendant of ANY selected tag
          
          return selectedTags.some(selTag => {
             return res.structuredTags?.some(resRel => {
                 // Check if Resource Tag is a descendant of Selected Tag
                 // Find resource tag definition
                 const resTagDef = MOCK_TAGS.find(t => t.id === resRel.tagId);
                 if (!resTagDef) return false;
                 // "Descendant inclusion": resTag path starts with selTag path
                 return resTagDef.path.startsWith(selTag.path);
             });
          });
      }));
  },
  
  // -- Space Methods --
  getSpaceTree: async (): Promise<Space[]> => {
      return new Promise((resolve) => setTimeout(() => resolve(MOCK_SPACES), 300));
  },

  getSpaceContent: async (spaceId: string): Promise<{ spaces: Space[], resources: Resource[] }> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              const spaces = MOCK_SPACES.filter(s => s.parentId === spaceId);
              const resources = MOCK_RESOURCES.filter(r => r.spaceId === spaceId);
              resolve({ spaces, resources });
          }, 300);
      });
  },

  unlockHiddenSpace: async (spaceId: string, password: string): Promise<boolean> => {
      // Mock validation
      return new Promise((resolve) => setTimeout(() => resolve(password === '123456'), 500));
  },
  
  // -- Identity Methods --
  getIdentityProfile: async (): Promise<IdentityProfile> => {
      return new Promise((resolve) => setTimeout(() => resolve(MOCK_IDENTITY), 200));
  },

  updateInheritance: async (settings: any): Promise<void> => {
      MOCK_IDENTITY.inheritance = { ...MOCK_IDENTITY.inheritance, ...settings };
      return Promise.resolve();
  },

  // -- Market Methods --
  getMarketItems: async (): Promise<MarketItem[]> => {
      return new Promise((resolve) => setTimeout(() => resolve(MOCK_MARKET), 400));
  },

  // -- Network Methods --
  getNetworkStatus: async (): Promise<AppNetworkStatus> => {
      return Promise.resolve(MOCK_NETWORK_STATUS);
  },

  toggleNetwork: async (): Promise<AppNetworkStatus> => {
    if (MOCK_NETWORK_STATUS === 'online' || MOCK_NETWORK_STATUS === 'connecting') {
        MOCK_NETWORK_STATUS = 'offline';
        return Promise.resolve(MOCK_NETWORK_STATUS);
    } else {
        MOCK_NETWORK_STATUS = 'connecting';
        // Simulate connection delay in background
        setTimeout(() => {
            MOCK_NETWORK_STATUS = 'online';
        }, 2000);
        return Promise.resolve(MOCK_NETWORK_STATUS);
    }
  },

  // -- Existing Methods --
  getCloudProviders: async () => Promise.resolve(MOCK_PROVIDERS),
  toggleCloudProvider: async (id: string, connect: boolean) => {
      const updated = MOCK_PROVIDERS.map(p => p.id === id ? { ...p, connected: connect } : p);
      return Promise.resolve(updated);
  },
  getAuditLogs: async () => Promise.resolve(MOCK_LOGS),
  runRhaiScript: async (script: string) => Promise.resolve('Script Executed'),
  getPeers: async () => Promise.resolve(MOCK_PEERS),
  getChatHistory: async (id: string) => Promise.resolve(MOCK_MESSAGES[id] || []),
  sendMessage: async (id: string, text: string) => { return { id: 'new', senderId: 'me', text, timestamp: 'Now' } },
  shareResources: async (peerId: string, resourceIds: string[]) => {
      // Simulate network delay
      return new Promise<void>(resolve => setTimeout(resolve, 800));
  },
  
  getCustomPages: async (): Promise<CustomPage[]> => Promise.resolve(MOCK_PAGES),
  createCustomPage: async (name: string): Promise<CustomPage> => {
      const newPage: CustomPage = { id: `p-${Date.now()}`, name, widgets: [], createdAt: new Date().toISOString() };
      MOCK_PAGES = [...MOCK_PAGES, newPage];
      return newPage;
  },
  updateCustomPage: async (page: CustomPage): Promise<CustomPage> => {
      MOCK_PAGES = MOCK_PAGES.map(p => p.id === page.id ? page : p);
      return page;
  },
  deleteCustomPage: async (id: string): Promise<void> => {
      MOCK_PAGES = MOCK_PAGES.filter(p => p.id !== id);
  },
  
  getSchemas: async (): Promise<ItemSchema[]> => Promise.resolve(MOCK_SCHEMAS),
  saveSchema: async (s: ItemSchema): Promise<ItemSchema> => {
      const exists = MOCK_SCHEMAS.find(schema => schema.id === s.id);
      if (exists) {
          MOCK_SCHEMAS = MOCK_SCHEMAS.map(schema => schema.id === s.id ? s : schema);
      } else {
          MOCK_SCHEMAS = [...MOCK_SCHEMAS, s];
      }
      return s;
  },
  deleteSchema: async (id: string): Promise<void> => {
      MOCK_SCHEMAS = MOCK_SCHEMAS.filter(s => s.id !== id);
  },
};
