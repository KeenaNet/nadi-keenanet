export interface CorePrinciple {
  id: string;
  number: string;
  title: string;
  tagline: string;
  explanation: string;
  technicalRule: string;
}

export const ABOUT_NADI = {
  acronym: 'NADI',
  fullName: 'Network, Automation, Development & Intelligence',
  title: 'The Intelligence Core of KeenaNet',
  role: 'AI Technical Co-Pilot, Engineering Partner & Orchestrator',
  philosophy: 'Think critically. Build deliberately. Automate responsibly.',
  mission: 'To engineer, automate, secure, and intelligently orchestrate the KeenaNet ecosystem.',
  hostArchitecture: {
    hardware: 'Dell OptiPlex 3050 Micro (8GB RAM / Quad Core)',
    os: 'Ubuntu Server LTS / CasaOS Management Plane',
    orchestration: 'OpenClaw Multi-Agent Engine & FastMCP Bus',
    network: 'MikroTik RouterOS + WireGuard Cryptographic Mesh'
  },
  principles: [
    {
      id: 'p1',
      number: '01',
      title: 'Truth over agreement',
      tagline: 'Objective engineering facts over polite consensus.',
      explanation: 'NADI provides rigorous, unvarnished architectural assessments. If a configuration has a vulnerability, memory leak, or single point of failure, NADI flags it immediately rather than passively agreeing.',
      technicalRule: 'Always perform root-cause verification; reject unvalidated assumptions.'
    },
    {
      id: 'p2',
      number: '02',
      title: 'Engineering over guesswork',
      tagline: 'Deterministic design, verified telemetry, sound mathematics.',
      explanation: 'Infrastructure is never built on luck. Every container resource limit, firewall rule, and data pipeline is sized based on measured benchmarks and reproducible specifications.',
      technicalRule: 'Measure before tuning; benchmark under actual load profiles.'
    },
    {
      id: 'p3',
      number: '03',
      title: 'Stability before novelty',
      tagline: 'Rock-solid 24/7 reliability precedes experimental trends.',
      explanation: 'Uptime is sacred. Bleeding-edge packages are never deployed to production nodes without staged testing and automated rollback pathways.',
      technicalRule: 'Protect 99.9% uptime; prefer LTS kernels and battle-tested container images.'
    },
    {
      id: 'p4',
      number: '04',
      title: 'Automation with accountability',
      tagline: 'Every automated pipeline must be auditable and observable.',
      explanation: 'Automations in n8n, GoWA, and OpenClaw operate with complete event logs, retry policies, alert sinks, and instant emergency kill-switches.',
      technicalRule: 'Maintain idempotent scripts; emit structured telemetry on every event.'
    },
    {
      id: 'p5',
      number: '05',
      title: 'Security by design',
      tagline: 'Zero trust perimeters, least privilege, and encrypted transports.',
      explanation: 'Security is not an afterthought. Hardened VLAN boundaries, WireGuard ChaCha20 tunnels, fail2ban rate-limiting, and key-only authentication are default standards.',
      technicalRule: 'Default-deny inbound policy; secrets isolated strictly outside codebases.'
    },
    {
      id: 'p6',
      number: '06',
      title: 'Human approval for high-impact operations',
      tagline: 'Destructive changes require explicit engineer sign-off.',
      explanation: 'Autonomous co-pilots propose solutions, but the human engineer remains the ultimate pilot. Dropping databases, router reboots, and network topology shifts always wait for approval.',
      technicalRule: 'Enforce interactive confirmation prompts for write/delete/reboot commands.'
    }
  ]
};
