export interface QuickCommand {
  label: string;
  command: string;
  subsystem: string;
}

export const QUICK_COMMANDS: QuickCommand[] = [
  {
    label: 'Analyze KeenaNet Architecture',
    command: 'nadi analyze --target=keena-architecture --depth=full',
    subsystem: 'SYS_ARCH'
  },
  {
    label: 'Inspect Automation Workflows',
    command: 'nadi inspect workflows --engine=n8n --status=all',
    subsystem: 'AUTO_N8N'
  },
  {
    label: 'Explore AI Coding Agents',
    command: 'nadi agents status --cluster=openclaw --format=matrix',
    subsystem: 'AGENTS'
  },
  {
    label: 'Show Network Topology',
    command: 'nadi network map --gateway=mikrotik --routes=active',
    subsystem: 'NET_CORE'
  },
  {
    label: 'Explain NADI Capabilities',
    command: 'nadi identity --verbose --display=capabilities',
    subsystem: 'CORE_ID'
  },
  {
    label: 'Diagnose Homelab Server Load',
    command: 'nadi telemetry health --target=optiplex-3050',
    subsystem: 'SYS_METRIC'
  },
  {
    label: 'Audit Zero-Trust Security',
    command: 'nadi audit security --profile=hardened --strict',
    subsystem: 'SEC_AUDIT'
  }
];

export function getSimulatedResponse(command: string): { text: string; subsystem: string; latency: string } {
  const normalized = command.toLowerCase().trim();

  if (normalized.includes('architecture') || normalized.includes('keena-architecture')) {
    return {
      subsystem: 'SYS_ARCH',
      latency: '24ms',
      text: `[DIAGNOSTIC REPORT: KEENANET ARCHITECTURE]
----------------------------------------------------------------
NODE HARDWARE: Dell OptiPlex 3050 Micro (Intel Core i5, 8GB DDR4, NVMe SSD)
OPERATING SYSTEM: Ubuntu 24.04 LTS (Kernel 6.8.0-generic, low-latency profile)
ORCHESTRATION LAYER: CasaOS + Docker Engine v26.1.4 (18 active containers)
GATEWAY: OpenClaw FastMCP Agent Interconnect on port :8080

TOPOLOGY SUMMARY:
• Core Services: n8n, GoWA, Nextcloud, Immich, Jellyfin, Grafana/Prometheus
• Network Perimeter: MikroTik RouterOS Gateway + WireGuard Mesh (:51820)
• Security Posture: Strict VLAN Segregation (Core/IoT/Admin), Cloudflare Tunnel
• Memory Allocation: 5.2GB utilized / 2.8GB cached / Zero swap pressure

EVALUATION: Stable. Resource headroom within nominal limits for 24/7 autonomous operations.`
    };
  }

  if (normalized.includes('workflow') || normalized.includes('n8n')) {
    return {
      subsystem: 'AUTO_N8N',
      latency: '18ms',
      text: `[AUTOMATION PIPELINE INSPECTION]
----------------------------------------------------------------
ENGINE: n8n Workflow Automation (v1.64.3)
ACTIVE WORKFLOWS: 38 registered / 38 enabled
DAILY EXECUTION RATE: 1,248 executions (avg 52/hr)
FAILURE RATE: 0.24% (All auto-retried with exponential backoff)

KEY PIPELINES:
1. [SYS-ALERT-01] Prometheus Trigger -> GoWA WhatsApp Alert -> Admin Phone (Priority: HIGH)
2. [BACKUP-NIGHTLY] DB Dumps -> Nextcloud Encrypted Vault -> Offsite Sync (03:00 UTC)
3. [AGENT-INGEST] Telegram Inbound -> OpenClaw Reasoning -> Action Dispatcher
4. [MEDIA-AUTO] Immich Ingestion Pipeline -> Machine Learning Tagging Worker

STATUS: All webhook listeners responsive. Queue backlog: 0 tasks.`
    };
  }

  if (normalized.includes('agent') || normalized.includes('openclaw')) {
    return {
      subsystem: 'AGENTS',
      latency: '31ms',
      text: `[OPENCLAW MULTI-AGENT ORCHESTRATION MESH]
----------------------------------------------------------------
ORCHESTRATOR: NADI (Primary Engineering Co-Pilot)
PROTOCOL: FastMCP (Model Context Protocol) JSON-RPC 2.0
EMBEDDING STORE: Local ChromaDB Vector Store on NVMe

CONNECTED AGENTS & ROLES:
• [NADI-CORE] Master Architectural Reasoner & Code Reviewer (Active)
• [DEV-COPILOT] Cursor & IDE Context Bridge (Listening)
• [NET-GUARDIAN] MikroTik Connection State & Log Anomaly Scanner (Daemon)
• [TASK-DISPATCHER] Event router bridging n8n webhooks with LLM prompts

GOVERNANCE: Strict human approval required for write-level infrastructure modifications.`
    };
  }

  if (normalized.includes('network') || normalized.includes('mikrotik') || normalized.includes('topology')) {
    return {
      subsystem: 'NET_CORE',
      latency: '14ms',
      text: `[NETWORK TOPOLOGY & ROUTING STATUS]
----------------------------------------------------------------
GATEWAY ROUTER: MikroTik RouterOS v7.15 (Hardware NAT enabled)
INTERFACES:
• WAN1: Fiber Uplink (100 Mbps symmetric, Dynamic IP, DDNS synced)
• LAN_TRUNK (ether2): 802.1Q VLANs [10: Management, 20: Servers, 30: IoT, 40: Guest]
• WG0 (WireGuard): 10.100.0.0/24 (ChaCha20 encrypted mesh, 6 peers connected)

SECURITY STATUS:
• Drop Invalid Connections: ENABLED
• ICMP Rate Limiting: 5 packets/sec max
• Fail2ban API Bridge: 3 IPs currently quarantined (Brute-force SSH attempts)`
    };
  }

  if (normalized.includes('identity') || normalized.includes('capabilities') || normalized.includes('explain')) {
    return {
      subsystem: 'CORE_ID',
      latency: '12ms',
      text: `[NADI SPECIFICATION & OPERATIONAL MANDATE]
----------------------------------------------------------------
DESIGNATION: NADI (Network, Automation, Development & Intelligence)
IDENTITY: Futuristic AI Engineering Guardian & Technical Co-Pilot
PHILOSOPHY: Think critically. Build deliberately. Automate responsibly.

CORE COMPETENCIES:
1. Network Engineering: MikroTik configuration, VLAN design, WireGuard tunnels.
2. Software Development: Clean TypeScript, Python async services, React architecture.
3. DevOps: Docker Compose recipes, Ubuntu hardening, Coolify GitOps pipelines.
4. Automation: n8n workflow design, WhatsApp GoWA notification bridges.
5. AI Orchestration: OpenClaw multi-agent synthesis & deterministic execution.
6. Homelab Resilience: Sizing workloads efficiently for the Dell OptiPlex 3050 Micro.`
    };
  }

  if (normalized.includes('telemetry') || normalized.includes('health') || normalized.includes('load') || normalized.includes('server')) {
    return {
      subsystem: 'SYS_METRIC',
      latency: '16ms',
      text: `[HOMELAB TELEMETRY — DELL OPTIPLEX 3050 MICRO]
----------------------------------------------------------------
CPU: Intel Core i5-7500T @ 2.70GHz (4 Cores / 4 Threads)
  • Utilization: 18.4% (TDP: 35W) | Temp: 43°C (Fan: 1,420 RPM silent)
MEMORY: 8GB DDR4 2400MHz SODIMM
  • Used: 4.88 GB (61.0%) | Buffer/Cache: 2.12 GB | Swap: 0 MB / 4 GB
STORAGE: 512GB NVMe M.2 SSD + 2TB External SATA Array
  • Root Pool (/): 42% used (189 GB / 450 GB available)
  • Media Vault (/mnt/data): 68% used (1.3 TB / 1.9 TB)
UPTIME: 46 days, 14 hours, 22 minutes (Zero unexpected reboots)`
    };
  }

  if (normalized.includes('security') || normalized.includes('audit')) {
    return {
      subsystem: 'SEC_AUDIT',
      latency: '28ms',
      text: `[ZERO-TRUST CYBERSECURITY AUDIT]
----------------------------------------------------------------
AUDIT PROFILE: Hardened Production Benchmark (CIS Level 1 compliant)
PORTS EXPOSED EXTERNALLY: 0 (Zero ports forwarded on WAN)
INGRESS ROUTE: Cloudflare Zero Trust Tunnel + WireGuard mTLS only

CHECK RESULTS:
[PASS] SSH Password Authentication: DISABLED (ed25519 keys only)
[PASS] Docker Socket Exposure: PROTECTED via Socket-Proxy (read-only queries)
[PASS] Root Login: DISABLED across all nodes
[PASS] MikroTik WebFig: BOUND to management VLAN 10 only
[PASS] TLS Certificates: Let's Encrypt automated ECDSA auto-renewal active

RISK RATING: LOW (0 Critical, 0 High, 1 Informational: Review backup snapshot age).`
    };
  }

  // Fallback intelligent processing
  return {
    subsystem: 'TERMINAL',
    latency: '22ms',
    text: `[NADI COMMAND PROCESSOR]
Received instruction: "${command}"
Analyzing semantic token vectors against KeenaNet knowledge base...

RECOMMENDATION:
NADI has evaluated your query. To inspect primary operational subsystems, invoke:
• "Analyze KeenaNet Architecture" - Full hardware and container stack
• "Inspect Automation Workflows" - n8n & GoWA message pipelines
• "Show Network Topology" - MikroTik VLANs & WireGuard tunnels
• "Audit Zero-Trust Security" - Perimeter firewall and auth state

Operational status: Standby. Awaiting further directives.`
  };
}
