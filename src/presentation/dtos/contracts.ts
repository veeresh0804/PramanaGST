export type RiskLevelDTO = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface VendorRiskItemDTO {
  gstin: string;
  risk_score: number;
  risk_level: RiskLevelDTO;
}

export interface VendorRiskResponseDTO {
  vendors: VendorRiskItemDTO[];
}

export type InvoiceStatusDTO = 'MATCHED' | 'FLAGGED' | 'UNMATCHED';

export interface GraphNodeDTO {
  id: string;
  label?: string;
  type?: string;
}

export interface GraphEdgeDTO {
  source: string;
  target: string;
  relationship?: string;
}

export interface InvestigationResponseDTO {
  invoice_id: string;
  status: InvoiceStatusDTO;
  risk_score: number;
  explanation: string;
  graph_nodes: GraphNodeDTO[];
  graph_edges: GraphEdgeDTO[];
}