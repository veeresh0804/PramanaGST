
export type GSTIN = string;

export type InvoiceStatus = 'MATCHED' | 'PARTIAL_MATCH' | 'FAILED' | 'FLAGGED' | 'UNMATCHED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * SSD Section 10: Knowledge Graph Model Node Labels (Redesign V3)
 */
export type GraphNodeType = 
  | 'ROOT_NODE' 
  | 'SUPPLIER' 
  | 'BUYER' 
  | 'INVOICE' 
  | 'RETURN_PERIOD' 
  | 'IRN' 
  | 'PAYMENT' 
  | 'CREDIT_NOTE';

/**
 * SSD Section 6.2: Required Relationships (Deterministic Traversal)
 */
export type GraphEdgeType = 
  | 'ITC_CLAIMED' 
  | 'ITC_AVAILABLE' 
  | 'TAX_PAID' 
  | 'TAX_NOT_PAID' 
  | 'IRN_VALID' 
  | 'IRN_CANCELLED' 
  | 'HIGH_RISK' 
  | 'MATCHED' 
  | 'MISMATCHED'
  | 'ISSUED'
  | 'RECEIVED_BY'
  | 'REPORTED_IN';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorGstin: GSTIN;
  recipientGstin?: GSTIN;
  invoiceDate: Date;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  source: 'GSTR_1' | 'GSTR_2A' | 'GSTR_2B' | 'PURCHASE_REGISTER';
  status: InvoiceStatus;
  riskScore: number;
  flags?: string[];
  irn?: string;
  einvoiceStatus?: 'Generated' | 'Cancelled' | 'Missing';
  itcClaimed?: number;
  paymentCoverageRatio?: number;
}

export interface Vendor {
  gstin: GSTIN;
  name: string;
  legalName?: string;
  stateCode?: string;
  registrationType?: 'Regular' | 'Composition';
  riskScore: number;
  riskLevel: RiskLevel;
  networkMetrics?: {
    chainDepth: number;
    clusterRisk: number;
    degreeCentrality: number;
  };
}

export interface GraphNode {
  id: string;
  label: string;
  type: GraphNodeType;
  riskLevel?: RiskLevel;
  properties?: Record<string, any>;
  x?: number;
  y?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  type: GraphEdgeType;
  status?: 'CLEAN' | 'WARNING' | 'RISK' | 'PENDING';
  properties?: Record<string, any>;
}

export interface RiskAssessment {
  vendorGstin: GSTIN;
  riskScore: number;
  riskLevel: RiskLevel;
  contributingFactors: string[];
  graphEvidence?: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
}
