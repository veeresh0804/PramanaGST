
export type RiskLevelDTO = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type InvoiceStatusDTO = 'MATCHED' | 'PARTIAL_MATCH' | 'FAILED' | 'FLAGGED' | 'UNMATCHED';

export interface VendorRiskItemDTO {
  gstin: string;
  name: string;
  risk_score: number;
  risk_level: RiskLevelDTO;
  network_metrics: {
    chain_depth: number;
    cluster_risk: number;
    degree_centrality: number;
  };
}

export interface VendorRiskResponseDTO {
  vendors: VendorRiskItemDTO[];
}

export interface GraphNodeDTO {
  id: string;
  label: string;
  type: string;
  risk_level?: RiskLevelDTO;
}

export interface GraphEdgeDTO {
  source: string;
  target: string;
  type: string;
}

export interface InvestigationResponseDTO {
  invoice_id: string;
  status: InvoiceStatusDTO;
  risk_score: number;
  explanation: string;
  factors: string[];
  graph: {
    nodes: GraphNodeDTO[];
    edges: GraphEdgeDTO[];
  };
}
