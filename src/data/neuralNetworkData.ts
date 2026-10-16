import { NeuralNodeData } from '../types';

export const NEURAL_NODES: NeuralNodeData[] = [
  {
    id: 'ai-engineering',
    name: 'AI Engineering',
    category: 'Cognitive Architecture',
    color: '#00D9FF',
    shortDescription: 'Orkestrasi multi-agent OpenClaw, reasoning LLM & autonomous coding agents.',
    description: 'Multi-agent orchestration, LLM reasoning pipelines, RAG context synthesis, and autonomous coding agents embedded into KeenaNet workflows.',
    capabilities: [
      'Multi-Agent System Orchestration (OpenClaw)',
      'Autonomous Code Generation & Self-Correction',
      'Context Synthesis & Prompt Tuning',
      'Local LLM Inference Optimization'
    ],
    metrics: [
      { label: 'Agent Mesh', value: 'Active' },
      { label: 'Token Efficiency', value: '98.4%' },
      { label: 'Latency Target', value: '< 450ms' }
    ],
    position: [0, 2.2, -1.8]
  },
  {
    id: 'software-dev',
    name: 'Software Development',
    category: 'System Architecture',
    color: '#38BDF8',
    shortDescription: 'Pengembangan full-stack TypeScript, React, Python & arsitektur microservices andal.',
    description: 'Full-stack software engineering across React, TypeScript, Python, and Node.js microservices with clean architectural boundaries and defensive programming.',
    capabilities: [
      'TypeScript & Modern React Architectures',
      'Python Microservices & Async Webhooks',
      'REST & WebSocket Edge Interfaces',
      'Modular Refactoring & Zero-Debt Engineering'
    ],
    metrics: [
      { label: 'Code Quality', value: 'Grade A' },
      { label: 'Test Coverage', value: '92%' },
      { label: 'Build Status', value: 'Deterministic' }
    ],
    position: [2.0, 1.4, -1.0]
  },
  {
    id: 'network-infra',
    name: 'Network Infrastructure',
    category: 'Connectivity Core',
    color: '#1677FF',
    shortDescription: 'Manajemen router MikroTik, enkripsi WireGuard & segmentasi isolasi VLAN.',
    description: 'MikroTik RouterOS orchestration, isolated VLAN segregation, WireGuard secure tunnels, dynamic DNS, and low-latency homelab routing.',
    capabilities: [
      'MikroTik Core RouterOS Management',
      'WireGuard Mesh & Encrypted Tunnels',
      'VLAN Segregation & Zero-Trust Segmentation',
      'Traffic Shaping & Failover Redundancy'
    ],
    metrics: [
      { label: 'Uptime', value: '99.98%' },
      { label: 'WireGuard Tunnel', value: 'Encrypted' },
      { label: 'Backbone Throughput', value: '10 Gbps' }
    ],
    position: [2.2, -0.6, -0.5]
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    category: 'Threat Defense',
    color: '#00F0FF',
    shortDescription: 'Pertahanan perimeter zero-trust, pencegahan brute-force & audit privilege ketat.',
    description: 'Autonomous defense posture, perimeter firewalls, automated fail2ban response, secret vaulting, and strict principle of least privilege.',
    capabilities: [
      'Zero-Trust Access Control (ZTAC)',
      'Automated Brute-Force Mitigation',
      'SSL/TLS Certificate Lifecycle Automation',
      'Vulnerability Scanning & Hardening'
    ],
    metrics: [
      { label: 'Threat Index', value: 'Zero Anomalies' },
      { label: 'Firewall State', value: 'Strict' },
      { label: 'Auth Handshakes', value: '2FA Enforced' }
    ],
    position: [0.8, -1.8, -1.2]
  },
  {
    id: 'automation',
    name: 'Automation',
    category: 'Workflow Synapses',
    color: '#00D9FF',
    shortDescription: 'Pipeline otomatisasi alur kerja n8n & bot notifikasi WhatsApp GoWA real-time.',
    description: 'High-throughput n8n workflow pipelines, event-triggered reactive agents, GoWA messaging automation, and automated database sync.',
    capabilities: [
      'n8n Complex Pipeline Orchestration',
      'WhatsApp / Telegram Bot Integrations (GoWA)',
      'Automated Webhook Routing & Sanitization',
      'Batch Data Transformation & Sync'
    ],
    metrics: [
      { label: 'Active Workflows', value: '38 Active' },
      { label: 'Execution Rate', value: '1.2k/day' },
      { label: 'Success Rate', value: '99.7%' }
    ],
    position: [-0.8, -1.8, -1.2]
  },
  {
    id: 'devops',
    name: 'DevOps & Systems',
    category: 'Infrastructure Engine',
    color: '#1677FF',
    shortDescription: 'Manajemen container Docker, kontrol CasaOS & deployment Git-ops Coolify.',
    description: 'Ubuntu Server administration, CasaOS container management, Docker compose scaling, automated snapshots, and Coolify Git-ops deployments.',
    capabilities: [
      'Dockerized Service Orchestration',
      'CasaOS & Coolify Application Deployment',
      'Resource Throttling on OptiPlex Micro',
      'Automated Off-site Snapshot Backups'
    ],
    metrics: [
      { label: 'Containers', value: '18 Running' },
      { label: 'RAM Footprint', value: 'Optimal (8GB pool)' },
      { label: 'CI/CD Cycle', value: 'Automated' }
    ],
    position: [-2.2, -0.6, -0.5]
  },
  {
    id: 'data-intelligence',
    name: 'Data Intelligence',
    category: 'Telemetry & Analytics',
    color: '#38BDF8',
    shortDescription: 'Monitoring metrik Prometheus, dashboard visual Grafana & database PostgreSQL.',
    description: 'Homelab telemetry, Prometheus & Grafana dashboarding, inventory and warehouse intelligence, and structured persistent records.',
    capabilities: [
      'Prometheus & Node-Exporter Telemetry',
      'Grafana Executive Infrastructure Boards',
      'Warehouse Stock & Barcode Tracking',
      'Real-time Anomaly Detection'
    ],
    metrics: [
      { label: 'Metrics Polling', value: '15s interval' },
      { label: 'Storage Engine', value: 'PostgreSQL' },
      { label: 'Health Score', value: '100% Operational' }
    ],
    position: [-2.0, 1.4, -1.0]
  }
];
