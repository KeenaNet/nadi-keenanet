export type SceneMode = 'avatar' | 'neural' | 'ecosystem' | 'terminal' | 'about';

export interface NeuralNodeData {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  capabilities: string[];
  metrics: { label: string; value: string }[];
  position: [number, number, number];
  color: string;
}

export interface EcosystemServiceData {
  id: string;
  name: string;
  category: 'Infrastructure' | 'Services' | 'Development' | 'Network';
  shortDescription: string;
  role: string;
  relationToNadi: string;
  tech: string;
  status: 'Online' | 'Synchronized' | 'Monitored';
  port?: string;
  description: string;
  features: string[];
  position: [number, number, number];
  color: string;
}

export interface CommandLog {
  id: string;
  type: 'user' | 'system' | 'nadi';
  text: string;
  timestamp: string;
  metadata?: {
    latency?: string;
    subsystem?: string;
    status?: 'success' | 'warning' | 'info';
  };
}

export interface AudioSettings {
  muted: boolean;
  volume: number;
}
