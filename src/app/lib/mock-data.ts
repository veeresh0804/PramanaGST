
import { Invoice, Vendor, RiskAssessment, GraphNode, GraphEdge } from '@/domain/models/entities';

/**
 * SSD Section 7: Dataset Design Rules (Relationship-consistent generation)
 */
export const MOCK_VENDORS: Vendor[] = [
  { 
    gstin: '29ABCDE1234F1Z5', 
    name: 'ABC Technologies Pvt Ltd', 
    legalName: 'ABC Technologies Private Limited',
    stateCode: '29',
    registrationType: 'Regular',
    riskScore: 82, 
    riskLevel: 'HIGH',
    networkMetrics: { chainDepth: 5, clusterRisk: 0.85, degreeCentrality: 12 }
  },
  { 
    gstin: '27FGHIJ5678K2L3', 
    name: 'Global Logistics Solutions', 
    legalName: 'Global Logistics Solutions LLP',
    stateCode: '27',
    registrationType: 'Regular',
    riskScore: 22, 
    riskLevel: 'LOW',
    networkMetrics: { chainDepth: 2, clusterRisk: 0.15, degreeCentrality: 4 }
  },
  { 
    gstin: '19OPQRS3456T5U6', 
    name: 'Zenith Marketing Inc', 
    legalName: 'Zenith Marketing India Pvt Ltd',
    stateCode: '19',
    registrationType: 'Regular',
    riskScore: 94, 
    riskLevel: 'CRITICAL',
    networkMetrics: { chainDepth: 8, clusterRisk: 0.95, degreeCentrality: 22 }
  },
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-2024-001',
    invoiceNumber: 'PR-1029',
    vendorGstin: '29ABCDE1234F1Z5',
    recipientGstin: '27FGHIJ5678K2L3',
    invoiceDate: new Date('2024-01-15'),
    taxableAmount: 10000,
    cgst: 900,
    sgst: 900,
    igst: 0,
    totalAmount: 11800,
    source: 'GSTR_1',
    status: 'FLAGGED',
    riskScore: 78,
    flags: ['IRN_CANCELLED', 'UNDER_PAYMENT'],
    irn: '5af67...b12',
    einvoiceStatus: 'Cancelled',
    paymentCoverageRatio: 0.4
  },
  {
    id: 'INV-2024-002',
    invoiceNumber: 'GL-8821',
    vendorGstin: '27FGHIJ5678K2L3',
    invoiceDate: new Date('2024-01-18'),
    taxableAmount: 50000,
    cgst: 0,
    sgst: 0,
    igst: 9000,
    totalAmount: 59000,
    source: 'GSTR_1',
    status: 'MATCHED',
    riskScore: 12,
    flags: [],
    irn: 'c12d3...e90',
    einvoiceStatus: 'Generated',
    paymentCoverageRatio: 1.0
  }
];

export const MOCK_GRAPH_DATA = {
  nodes: [
    { id: 'BUYER_ORG', label: 'Buyer Enterprise', type: 'TAXPAYER', riskLevel: 'LOW' },
    { id: 'V-29ABC', label: 'ABC Tech', type: 'TAXPAYER', riskLevel: 'HIGH' },
    { id: 'V-27FGH', label: 'Global Logistics', type: 'TAXPAYER', riskLevel: 'LOW' },
    { id: 'I-001', label: 'INV-1029', type: 'INVOICE', riskLevel: 'HIGH' },
    { id: 'I-002', label: 'INV-8821', type: 'INVOICE', riskLevel: 'LOW' },
    { id: 'IRN-001', label: 'IRN:5af6', type: 'IRN', riskLevel: 'CRITICAL' },
    { id: 'IRN-002', label: 'IRN:c12d', type: 'IRN', riskLevel: 'LOW' },
    { id: 'RET-JAN-24', label: 'JAN-2024', type: 'RETURN', riskLevel: 'LOW' },
    { id: 'PAY-JAN-24', label: 'Tax Payment', type: 'PAYMENT', riskLevel: 'LOW' },
  ] as GraphNode[],
  links: [
    { source: 'V-29ABC', target: 'I-001', type: 'ISSUED' },
    { source: 'I-001', target: 'BUYER_ORG', type: 'RECEIVED_BY' },
    { source: 'I-001', target: 'IRN-001', type: 'HAS_IRN' },
    { source: 'I-001', target: 'RET-JAN-24', type: 'REPORTED_IN' },
    { source: 'V-29ABC', target: 'RET-JAN-24', type: 'PAID_TAX' },
    { source: 'RET-JAN-24', target: 'PAY-JAN-24', type: 'PAID_TAX' },
    { source: 'V-27FGH', target: 'I-002', type: 'ISSUED' },
    { source: 'I-002', target: 'BUYER_ORG', type: 'RECEIVED_BY' },
    { source: 'I-002', target: 'IRN-002', type: 'HAS_IRN' },
  ] as GraphEdge[]
};

export const MOCK_RISK_ASSESSMENTS: RiskAssessment[] = MOCK_VENDORS.map(v => ({
  vendorGstin: v.gstin,
  riskScore: v.riskScore,
  riskLevel: v.riskLevel,
  contributingFactors: [
    'Graph path validation failed for tax payment chain',
    'Circular trading loop detected in peer cluster',
    'IRN status cancelled post-ITC claiming'
  ],
  graphEvidence: MOCK_GRAPH_DATA
}));
