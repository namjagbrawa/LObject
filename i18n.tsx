
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zh';

const translations: Record<Language, Record<string, string>> = {
  en: {
    workspace: 'Workspace',
    spaces: 'Spaces (3D)',
    identity_hub: 'Identity & Legacy',
    freelance_market: 'Freelance Center',
    resources: 'Global Search',
    network_chat: 'Network & Chat',
    cloud_fabric: 'Cloud Fabric',
    automation: 'Automation',
    security: 'Security',
    audit_trail: 'Audit Trail',
    custom_views: 'Custom Views',
    schema_designer: 'Schema Designer',
    tag_taxonomy: 'Tag Taxonomy',
    system_status: 'System Status',
    
    // App Library
    app_library: 'App Library',
    app_library_desc: 'Manage and organize your workspace modules.',
    installed_apps: 'Installed Apps',
    available_apps: 'Available Apps',
    app_category_core: 'Core System',
    app_category_communication: 'Communication',
    app_category_tool: 'Tools',
    app_category_system: 'System Config',
    add_to_sidebar: 'Add',
    remove_from_sidebar: 'Remove',
    module_installed: 'Module added to sidebar',
    module_removed: 'Module removed from sidebar',
    move_up: 'Move Up',
    move_down: 'Move Down',
    
    // Descriptions for modules
    space_desc: 'Hierarchical, spatial organization of your digital assets.',
    identity_desc: 'Manage your digital self, devices, and digital inheritance.',
    market_desc: 'Find public nodes, storage providers, and AI services in the P2P network.',
    resources_desc: 'Global file and resource search.',
    tag_taxonomy_desc: 'Structured Faceted Tagging System.',
    chat_desc: 'Encrypted P2P messaging and file sharing.',
    cloud_integration_desc: 'Manage cloud adapters.',
    automation_subtitle: 'Rhai Scripting',
    schema_desc: 'Define custom data types and pipelines.',
    audit_desc: 'Security logs and access history.',
    system_status_desc: 'Network health, statistics and tag analytics.',
    
    // System Status
    system_dashboard: 'System Dashboard',
    network_info: 'Network Information',
    item_count: 'Total Items',
    tag_count: 'Total Tags',
    tag_heatmap: 'Tag Heatmap (Usage)',
    connection_details: 'Connection Details',
    peer_id: 'Peer ID',
    uptime: 'Uptime',
    bytes_sent: 'Bytes Sent',
    bytes_received: 'Bytes Received',
    active_peers: 'Active Peers',
    
    // Space Browser
    root_space: 'Root Space',
    hidden_space: 'Hidden Space',
    locked: 'Locked',
    unlock: 'Unlock',
    enter_password: 'Enter Password to Decrypt',
    password: 'Password',
    decryption_failed: 'Decryption failed. Invalid key.',
    items: 'items',
    no_content: 'This space is empty.',
    version_history: 'Version History',
    current_version: 'Current',
    restore: 'Restore',
    attributes: 'Attributes',
    behavior_binding: 'Behavior Binding',
    secret_terminal: 'DEC_TERMINAL',
    enter_key_placeholder: 'Input Access Key...',
    vault_revealed: 'Quantum Vault Revealed.',
    vault_scan_complete: 'Scan complete. No signatures found.',
    
    // Inspector Views & Actions
    inspector_view: 'View',
    inspector_actions: 'Actions',
    view_preview: 'Preview',
    view_json: 'JSON',
    view_metadata: 'Meta',
    view_editor: 'Editor',
    run_action: 'Run',
    action_running: 'Running...',
    action_success: 'Done',
    action_error: 'Failed',

    // Taxonomy
    facets: 'Dimensions',
    add_facet: 'Add Dimension',
    facet_name: 'Dimension Name',
    facet_code: 'Code',
    multi_select: 'Multi-select',
    tags_tree: 'Tag Tree',
    add_root_tag: 'Add Root Tag',
    add_sub_tag: 'Add Child',
    tag_name: 'Tag Name',
    select_facet_first: 'Select a dimension to manage tags.',
    delete: 'Delete',
    
    // Identity
    identity_management: 'Identity Management',
    profile: 'Profile',
    devices: 'Nodes / Devices',
    inheritance: 'Inheritance (Legacy)',
    public_key: 'Public Key',
    dead_man_switch: 'Dead Man\'s Switch',
    inheritance_enabled: 'Inheritance Protocol Enabled',
    inheritance_disabled: 'Inheritance Protocol Disabled',
    trigger_condition: 'Trigger Condition',
    inactivity_days: 'Inactivity (Days)',
    beneficiary: 'Beneficiary ID',
    save_settings: 'Save Settings',
    
    // Market
    discovery_market: 'Freelance & Discovery',
    service_storage: 'Storage',
    service_compute: 'Compute',
    service_network: 'Network',
    service_data: 'Data',
    hire: 'Connect / Hire',
    credits: 'Credits',
    
    // Chat & Resources
    search_devices: 'Search devices...',
    search_query: 'Search query...',
    encrypted_p2p: 'Encrypted P2P Connection',
    message_placeholder: 'Message...',
    select_device: 'Select a Device',
    select_device_desc: 'Choose a peer from the sidebar.',
    local: 'Local',
    p2p: 'P2P',
    selected: 'Selected',
    clear: 'Clear',
    share_to_device: 'Share to Device',
    share_modal_title: 'Share {{count}} items',
    share_via_iroh: 'Share via Iroh',
    establishing_tunnel: 'Establishing secure tunnel...',
    encrypting_payload: 'Encrypting payload with recipient key...',
    sent_successfully: 'Sent Successfully',
    select_peer_desc: 'Select a peer to share these resources with. They must be online.',
    
    // Network Status
    network_status: 'Network Status',
    status_online: 'Online',
    status_offline: 'Offline',
    status_connecting: 'Connecting...',
    
    // Custom Views & Schema
    page_edit_mode: 'Edit Mode',
    page_view_mode: 'View Mode',
    widget_text: 'Text',
    widget_list: 'List',
    widget_stats: 'Stats',
    widget_action: 'Action',
    delete_page: 'Delete Page',
    page_title_placeholder: 'Page Title',
    widget_content: 'Content',
    widget_tags: 'Tags',
    widget_action_target: 'Target Script',
    save: 'Save',
    schema_types: 'Types',
    add_type: 'Add Type',
    fields: 'Fields',
    methods: 'Methods',
    pipelines: 'Pipelines',
    add_field: 'Add Field',
    field_name: 'Field Name',
    field_type: 'Field Type',
    required: 'Required',
    add_method: 'Add Method',
    add_pipeline: 'Add Pipeline',
    schema_desc_placeholder: 'Description...',
    field_type_text: 'Text',
    field_type_number: 'Number',
    field_type_boolean: 'Boolean',
    field_type_date: 'Date',
    field_type_reference: 'Reference',
    field_type_file: 'File',
    method_code_label: 'Rhai Script',
    no_steps: 'No steps defined',
    pipeline_name: 'Pipeline Name',
    function_label: 'Function',
    unknown: 'Unknown',
    no_schemas: 'No Types Defined',
    no_resources: 'No resources found',
    markdown_placeholder: 'Enter markdown content...',
    items_count: 'Items Count',
    no_widgets: 'No widgets. Add one to start.',

    // Cloud & Auto
    cloud_integration_fabric: 'Cloud Fabric',
    automation_studio: 'Automation Studio',
    run: 'Run',
    running: 'Running...',
    
    // General
    loading: 'Loading...',
    back: 'Back',
    full: 'Full',
    half: 'Half',
    third: 'Third',
    confirm_delete: 'Are you sure?',
  },
  zh: {
    workspace: '工作区',
    spaces: '空间浏览器',
    identity_hub: '身份与继承',
    freelance_market: '游离中心 (市集)',
    resources: '全局搜索',
    network_chat: '网络与会话',
    cloud_fabric: '云端架构',
    automation: '自动化编排',
    security: '安全审计',
    audit_trail: '审计日志',
    custom_views: '自定义视图',
    schema_designer: '类型设计器',
    tag_taxonomy: '标签分类体系',
    system_status: '系统状态',

    // App Library
    app_library: '应用库',
    app_library_desc: '管理并组织您的工作区功能模块。',
    installed_apps: '已安装应用',
    available_apps: '可用应用市场',
    app_category_core: '核心系统',
    app_category_communication: '通讯协作',
    app_category_tool: '工具',
    app_category_system: '系统配置',
    add_to_sidebar: '添加',
    remove_from_sidebar: '移除',
    module_installed: '模块已添加到侧边栏',
    module_removed: '模块已从侧边栏移除',
    move_up: '上移',
    move_down: '下移',

    // Descriptions
    space_desc: '数字资产的层级化、空间化组织管理。',
    identity_desc: '管理您的数字自我、节点设备及数字遗产继承策略。',
    market_desc: '发现 P2P 网络中的公共节点、存储服务提供商和 AI 算力服务。',
    resources_desc: '全局文件与资源搜索。',
    tag_taxonomy_desc: '结构化分面标签管理体系。',
    chat_desc: '加密 P2P 消息传输与文件共享。',
    cloud_integration_desc: '管理云端存储适配器。',
    automation_subtitle: 'Rhai 脚本引擎',
    schema_desc: '定义自定义数据类型与流水线。',
    audit_desc: '安全日志与访问历史记录。',
    system_status_desc: '网络健康状况、统计信息与标签分析。',
    
    // System Status
    system_dashboard: '系统仪表盘',
    network_info: '网络信息',
    item_count: '项目总数',
    tag_count: '标签总数',
    tag_heatmap: '标签热度 (使用量)',
    connection_details: '连接详情',
    peer_id: '节点 ID',
    uptime: '运行时间',
    bytes_sent: '发送字节',
    bytes_received: '接收字节',
    active_peers: '活跃节点',
    
    // Space Browser
    root_space: '根空间',
    hidden_space: '隐藏空间',
    locked: '已锁定',
    unlock: '解锁',
    enter_password: '输入密码以解密',
    password: '密码',
    decryption_failed: '解密失败，密钥错误。',
    items: '个项目',
    no_content: '此空间为空。',
    version_history: '版本历史',
    current_version: '当前',
    restore: '回溯',
    attributes: '属性详情',
    behavior_binding: '行为绑定',
    secret_terminal: '密钥终端',
    enter_key_placeholder: '输入访问密钥...',
    vault_revealed: '量子保险箱已显形。',
    vault_scan_complete: '扫描完成，未发现匹配信号。',

    // Inspector Views & Actions
    inspector_view: '视图',
    inspector_actions: '操作 / 流水线',
    view_preview: '预览',
    view_json: '原始数据',
    view_metadata: '元数据',
    view_editor: '编辑器',
    run_action: '执行',
    action_running: '运行中...',
    action_success: '完成',
    action_error: '失败',

    // Taxonomy
    facets: '维度 (分类)',
    add_facet: '新建维度',
    facet_name: '维度名称',
    facet_code: '编码',
    multi_select: '允许多选',
    tags_tree: '标签树',
    add_root_tag: '新建根标签',
    add_sub_tag: '新建子标签',
    tag_name: '标签名称',
    select_facet_first: '请先选择一个维度。',
    delete: '删除',
    
    // Identity
    identity_management: '身份管理',
    profile: '个人档案',
    devices: '节点 / 设备',
    inheritance: '数字遗产 (继承)',
    public_key: '公钥',
    dead_man_switch: '死手开关 (Dead Man\'s Switch)',
    inheritance_enabled: '继承协议已启用',
    inheritance_disabled: '继承协议已禁用',
    trigger_condition: '触发条件',
    inactivity_days: '静默期 (天)',
    beneficiary: '受益人 ID',
    save_settings: '保存设置',
    
    // Market
    discovery_market: '游离中心 & 发现',
    service_storage: '存储资源',
    service_compute: '算力资源',
    service_network: '网络中继',
    service_data: '公开数据',
    hire: '连接 / 雇佣',
    credits: '积分',
    
    // Chat & Resources
    search_devices: '搜索设备...',
    search_query: '搜索资源...',
    encrypted_p2p: '加密 P2P 连接',
    message_placeholder: '发送消息...',
    select_device: '选择设备',
    select_device_desc: '从侧边栏选择一个节点。',
    local: '本地',
    p2p: 'P2P',
    selected: '已选择',
    clear: '清除',
    share_to_device: '分享到设备',
    share_modal_title: '分享 {{count}} 个项目',
    share_via_iroh: '通过 Iroh 分享',
    establishing_tunnel: '正在建立安全隧道...',
    encrypting_payload: '正在使用接收方公钥加密...',
    sent_successfully: '发送成功',
    select_peer_desc: '选择一个节点进行分享，对方必须在线。',

    // Network Status
    network_status: '网络状态',
    status_online: '在线 (Iroh Net)',
    status_offline: '离线',
    status_connecting: '连接中...',

    // Custom Views & Schema
    page_edit_mode: '编辑模式',
    page_view_mode: '查看模式',
    widget_text: '文本块',
    widget_list: '列表',
    widget_stats: '统计',
    widget_action: '动作',
    delete_page: '删除页面',
    page_title_placeholder: '页面标题',
    widget_content: '内容',
    widget_tags: '标签',
    widget_action_target: '目标脚本',
    save: '保存',
    schema_types: '类型列表',
    add_type: '新建类型',
    fields: '字段',
    methods: '方法',
    pipelines: '流水线',
    add_field: '添加字段',
    field_name: '字段名',
    field_type: '字段类型',
    required: '必填',
    add_method: '添加方法',
    add_pipeline: '添加流水线',
    schema_desc_placeholder: '类型描述...',
    field_type_text: '文本',
    field_type_number: '数字',
    field_type_boolean: '布尔值',
    field_type_date: '日期',
    field_type_reference: '引用',
    field_type_file: '文件',
    method_code_label: 'Rhai 脚本代码',
    no_steps: '未定义步骤',
    pipeline_name: '流水线名称',
    function_label: '函数',
    unknown: '未知',
    no_schemas: '未定义类型',
    no_resources: '未找到资源',
    markdown_placeholder: '输入 Markdown 内容...',
    items_count: '项目数量',
    no_widgets: '没有组件。点击上方按钮添加。',

    // Cloud & Auto
    cloud_integration_fabric: '云端架构',
    automation_studio: '自动化工作室',
    run: '运行',
    running: '运行中...',

    // General
    loading: '加载中...',
    back: '返回',
    full: '全宽',
    half: '半宽',
    third: '三分之一',
    confirm_delete: '确定删除吗？',
  }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const t = (key: string, params?: Record<string, string | number>) => {
    let text = translations[language][key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{{${k}}}`, String(v));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
