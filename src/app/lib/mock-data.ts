
import { Invoice, Vendor, RiskAssessment, GraphNode, GraphEdge } from '@/domain/models/entities';

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
    riskScore: 34, 
    riskLevel: 'LOW',
    networkMetrics: { chainDepth: 2, clusterRisk: 0.15, degreeCentrality: 4 }
  },
  { 
    gstin: '07JKLMN9012P3Q4', 
    name: 'Prime Manufacturing Corp', 
    legalName: 'Prime Manufacturing Corporation',
    stateCode: '07',
    registrationType: 'Composition',
    riskScore: 56, 
    riskLevel: 'MEDIUM',
    networkMetrics: { chainDepth: 3, clusterRisk: 0.45, degreeCentrality: 8 }
  },
  { 
    gstin: '19OPQRS3456T5U6', 
    name: 'Zenith Marketing Inc', 
    legalName: 'Zenith Marketing India Pvt Ltd',
    stateCode: '19',
    registrationType: 'Regular',
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
    source: 'GSTR_1',
    status: 'PARTIAL_MATCH',
    riskScore: 45,
    flags: ['IRN_MISSING'],
    einvoiceStatus: 'Missing',
    paymentCoverageRatio: 0.9
  }
];

export const MOCK_RISK_ASSESSMENTS: RiskAssessment[] = MOCK_VENDORS.map(v => ({
  vendorGstin: v.gstin,
  riskScore: v.riskScore,
  riskLevel: v.riskLevel,
  contributingFactors: [
    'Inconsistent IRN generation patterns',
    'Detected circular trading patterns',
    'Tax payment coverage ratio below industry average'
  ],
  rulesTriggered: [
    { ruleId: 'IRN_CANCEL_FRAUD', weight: 0.5, scoreContribution: 40 },
    { ruleId: 'PAYMENT_UNDER_THRESHOLD', weight: 0.3, scoreContribution: 20 }
  ]
}));

export const MOCK_GRAPH_DATA = {
  nodes: [
    { id: 'ROOT_ORG', label: 'Enterprise Root', type: 'BUYER', riskLevel: 'LOW' },
    { id: 'V-29ABC', label: 'ABC Tech', type: 'VENDOR', riskLevel: 'HIGH' },
    { id: 'I-001', label: 'INV-001', type: 'INVOICE', riskLevel: 'HIGH' },
    { id: 'IRN-001', label: 'IRN:5af6', type: 'IRN', riskLevel: 'CRITICAL' },
    { id: 'RP-2024-01', label: 'Jan 2024', type: 'RETURN', riskLevel: 'LOW' },
  ] as GraphNode[],
  links: [
    { source: 'ROOT_ORG', target: 'I-001', type: 'MATCHED_WITH' },
    { source: 'I-001', target: 'V-29ABC', type: 'REPORTED_IN' },
    { source: 'I-001', target: 'IRN-001', type: 'HAS_IRN' },
    { source: 'V-29ABC', target: 'RP-2024-01', type: 'TAX_PAYMENT_FOUND' },
  ] as GraphEdge[]
};
