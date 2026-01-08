export type AxeImpact = "minor" | "moderate" | "serious" | "critical";

export type AxeNode = {
  html?: string;
  target?: string[];
  failureSummary?: string;
};

export type AxeViolation = {
  id: string;
  impact?: AxeImpact;
  description: string;
  help: string;
  helpUrl?: string;
  tags: string[];
  nodes: AxeNode[];
};

export type ScanResponse = {
  ok: boolean;
  url?: string;
  timestamp?: string;
  violations: AxeViolation[];
  error?: string;
};
