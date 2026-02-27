
import { Invoice, Vendor, RiskAssessment, GraphNode, GraphEdge } from '@/domain/models/entities';

export const MOCK_VENDORS: Vendor[] = [
  { 
    gstin: '29ABCDE1234F1Z5', 
    name: 'ABC Technologies Pvt Ltd', 
    riskScore: 82, 
    riskLevel: 'HIGH',
    networkMetrics: { chainDepth: 5, clusterRisk: 0.85, degreeCentrality: 12 }
  },
  { 
    gstin: '27FGHIJ5678K2L3', 
    name: 'Global Logistics Solutions', 
    riskScore: 34, 
    riskLevel: 'LOW',
    networkMetrics: { chainDepth: 2, clusterRisk: 0.15, degreeCentrality: 4 }
  },
  { 
    gstin: '07JKLMN9012P3Q4', 
    name: 'Prime Manufacturing Corp', 
    riskScore: 56, 
    riskLevel: 'MEDIUM',
    networkMetrics: { chainDepth: 3, clusterRisk: 0.45, degreeCentrality: 8 }
  },
  { 
    gstin: '19OPQRS3456T5U6', 
    name: 'Zenith Marketing Inc', 
    riskScore: 91, 
    riskLevel: 'CRITICAL',
    networkMetrics: { chainDepth: 8, clusterRisk: 0.95, degreeCentrality: 22 }
  },
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-2024-001',
    invoiceNumber: 'PR-1029',
    vendorGstin: '29ABCDE1234F1Z5',
    invoiceDate: new Date('2024-01-15'),
    taxableAmount: 10000,
    cgst: 900,
    sgst: 900,
    igst: 0,
    totalAmount: 11800,
    source: 'PURCHASE_REGISTER',
    status: 'FLAGGED',
    riskScore: 78,
    flags: ['MISSING_TAX_PAYMENT', 'ITC_CHAIN_BROKEN']
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
    source: 'PURCHASE_REGISTER',
    status: 'MATCHED',
    riskScore: 12,
    flags: []
  },
  {
    id: 'INV-2024-003',
    invoiceNumber: 'PM-9932',
    vendorGstin: '07JKLMN9012P3Q4',
    invoiceDate: new Date('2024-01-20'),
    taxableAmount: 25000,
    cgst: 2250,
    sgst: 2250,
    igst: 0,
    totalAmount: 29500,
    source: 'PURCHASE_REGISTER',
    status: 'PARTIAL_MATCH',
    riskScore: 45,
    flags: ['VALUE_MISMATCH']
  }
];

export const MOCK_RISK_ASSESSMENTS: RiskAssessment[] = MOCK_VENDORS.map(v => ({
  vendorGstin: v.gstin,
  riskScore: v.riskScore,
  riskLevel: v.riskLevel,
  contributingFactors: [
    'Low matching rate with GSTR-2B',
    'Detected circular trading patterns',
    'Frequent invoice value modifications post-filing'
  ],
  rulesTriggered: [
    { ruleId: 'ITC_CHAIN_BROKEN', weight: 0.4, scoreContribution: 32 },
    { ruleId: 'HIGH_NETWORK_CLUSTER_RISK', weight: 0.3, scoreContribution: 24 }
  ]
}));

export const MOCK_GRAPH_DATA = {
  nodes: [
    { id: 'ROOT_ORG', label: 'Enterprise Root', type: 'BUYER', riskLevel: 'LOW' },
    { id: 'V-29ABC', label: 'ABC Tech', type: 'VENDOR', riskLevel: 'HIGH' },
    { id: 'V-27FGH', label: 'Global Logi', type: 'VENDOR', riskLevel: 'LOW' },
    { id: 'I-001', label: 'INV-001', type: 'INVOICE', riskLevel: 'HIGH' },
    { id: 'I-002', label: 'INV-002', type: 'INVOICE', riskLevel: 'LOW' },
    { id: 'SUB-V1', label: 'Tier-2 Vendor A', type: 'VENDOR', riskLevel: 'CRITICAL' },
  ] as GraphNode[],
  links: [
    { source: 'ROOT_ORG', target: 'I-001', type: 'MATCHED_WITH' },
    { source: 'ROOT_ORG', target: 'I-002', type: 'MATCHED_WITH' },
    { source: 'I-001', target: 'V-29ABC', type: 'REPORTED_IN' },
    { source: 'I-002', target: 'V-27FGH', type: 'REPORTED_IN' },
    { source: 'V-29ABC', target: 'SUB-V1', type: 'MISMATCH_WITH' },
  ] as GraphEdge[]
};
