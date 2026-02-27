import { Invoice, Vendor, RiskAssessment, GraphNode, GraphEdge } from '@/domain/models/entities';

/**
 * SSD Section 7: Dataset Design Rules (Relationship-consistent generation)
 * Modeling real-world fraud scenarios: Circular Trading, ITC Chain Breaks, and IRN Cancellations.
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
  {
    gstin: '07KJHGF9876M1Z2',
    name: 'Nexus Supply Chain',
    legalName: 'Nexus Supply Chain Solutions',
    stateCode: '07',
    registrationType: 'Regular',
    riskScore: 45,
    riskLevel: 'MEDIUM',
    networkMetrics: { chainDepth: 3, clusterRisk: 0.4, degreeCentrality: 8 }
  },
  {
    gstin: '33QWERB1122C3D4',
    name: 'Southern Steels Ltd',
    legalName: 'Southern Steels and Alloys',
    stateCode: '33',
    registrationType: 'Regular',
    riskScore: 15,
    riskLevel: 'LOW',
    networkMetrics: { chainDepth: 1, clusterRisk: 0.05, degreeCentrality: 2 }
  },
  {
    gstin: '24PLMOK5544N6M7',
    name: 'Vibrant Textiles',
    legalName: 'Vibrant Textiles Gujarat Ltd',
    stateCode: '24',
    registrationType: 'Regular',
    riskScore: 76,
    riskLevel: 'HIGH',
    networkMetrics: { chainDepth: 6, clusterRisk: 0.7, degreeCentrality: 15 }
  },
  {
    gstin: '09ZXCVB4433P8R9',
    name: 'Bharat Infrastructure',
    legalName: 'Bharat Infra & Construction',
    stateCode: '09',
    registrationType: 'Regular',
    riskScore: 55,
    riskLevel: 'MEDIUM',
    networkMetrics: { chainDepth: 4, clusterRisk: 0.5, degreeCentrality: 10 }
  },
  // Circular Loop Entities
  { gstin: '27LOOPA1111A1Z1', name: 'Shell Entity Alpha', riskScore: 98, riskLevel: 'CRITICAL', networkMetrics: { chainDepth: 12, clusterRisk: 0.99, degreeCentrality: 30 } },
  { gstin: '27LOOPB2222B2Z2', name: 'Shell Entity Beta', riskScore: 98, riskLevel: 'CRITICAL', networkMetrics: { chainDepth: 12, clusterRisk: 0.99, degreeCentrality: 30 } },
  { gstin: '27LOOPC3333C3Z3', name: 'Shell Entity Gamma', riskScore: 98, riskLevel: 'CRITICAL', networkMetrics: { chainDepth: 12, clusterRisk: 0.99, degreeCentrality: 30 } },
];

export const MOCK_INVOICES: Invoice[] = [
  {
    id: 'INV-2024-001',
    invoiceNumber: 'PR-1029',
    vendorGstin: '29ABCDE1234F1Z5',
    recipientGstin: '27FGHIJ5678K2L3',
    invoiceDate: new Date('2024-01-15'),
    taxableAmount: 100000,
    cgst: 9000,
    sgst: 9000,
    igst: 0,
    totalAmount: 118000,
    source: 'GSTR_1',
    status: 'FLAGGED',
    riskScore: 78,
    flags: ['IRN_CANCELLED', 'ITC_CHAIN_BROKEN'],
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
    invoiceNumber: 'ZM-4491',
    vendorGstin: '19OPQRS3456T5U6',
    recipientGstin: '29ABCDE1234F1Z5',
    invoiceDate: new Date('2024-01-20'),
    taxableAmount: 200000,
    cgst: 18000,
    sgst: 18000,
    igst: 0,
    totalAmount: 236000,
    source: 'GSTR_1',
    status: 'FLAGGED',
    riskScore: 95,
    flags: ['CIRCULAR_TRADING_LOOP', 'UNDER_PAYMENT'],
    irn: 'f99a1...c01',
    einvoiceStatus: 'Generated',
    paymentCoverageRatio: 0.1
  },
  // Scenario: ITC Chain Break
  {
    id: 'INV-2024-004',
    invoiceNumber: 'NS-1122',
    vendorGstin: '07KJHGF9876M1Z2',
    recipientGstin: '24PLMOK5544N6M7',
    invoiceDate: new Date('2024-02-05'),
    taxableAmount: 450000,
    cgst: 40500,
    sgst: 40500,
    igst: 0,
    totalAmount: 531000,
    source: 'GSTR_1',
    status: 'PARTIAL_MATCH',
    riskScore: 62,
    flags: ['ITC_MISMATCH', 'LATE_FILING'],
    irn: 'd44e1...z99',
    einvoiceStatus: 'Generated',
    paymentCoverageRatio: 0.8
  },
  // Scenario: Large Inter-state trade spike
  {
    id: 'INV-2024-005',
    invoiceNumber: 'SS-9900',
    vendorGstin: '33QWERB1122C3D4',
    recipientGstin: '09ZXCVB4433P8R9',
    invoiceDate: new Date('2024-02-10'),
    taxableAmount: 1200000,
    cgst: 0,
    sgst: 0,
    igst: 216000,
    totalAmount: 1416000,
    source: 'GSTR_1',
    status: 'MATCHED',
    riskScore: 25,
    flags: [],
    irn: 'e00b1...x88',
    einvoiceStatus: 'Generated',
    paymentCoverageRatio: 1.0
  },
  // Scenario: Circular Trading Loop (Cluster)
  {
    id: 'INV-LOOP-001',
    invoiceNumber: 'LP-111',
    vendorGstin: '27LOOPA1111A1Z1',
    recipientGstin: '27LOOPB2222B2Z2',
    invoiceDate: new Date('2024-03-01'),
    taxableAmount: 1000000,
    totalAmount: 1180000,
    cgst: 90000, sgst: 90000, igst: 0,
    source: 'GSTR_1', status: 'FLAGGED', riskScore: 99,
    flags: ['CIRCULAR_TRADING_LOOP'], irn: 'loop-1',
    einvoiceStatus: 'Generated', paymentCoverageRatio: 0.05
  },
  {
    id: 'INV-LOOP-002',
    invoiceNumber: 'LP-222',
    vendorGstin: '27LOOPB2222B2Z2',
    recipientGstin: '27LOOPC3333C3Z3',
    invoiceDate: new Date('2024-03-02'),
    taxableAmount: 1000000,
    totalAmount: 1180000,
    cgst: 90000, sgst: 90000, igst: 0,
    source: 'GSTR_1', status: 'FLAGGED', riskScore: 99,
    flags: ['CIRCULAR_TRADING_LOOP'], irn: 'loop-2',
    einvoiceStatus: 'Generated', paymentCoverageRatio: 0.05
  },
  {
    id: 'INV-LOOP-003',
    invoiceNumber: 'LP-333',
    vendorGstin: '27LOOPC3333C3Z3',
    recipientGstin: '27LOOPA1111A1Z1',
    invoiceDate: new Date('2024-03-03'),
    taxableAmount: 1000000,
    totalAmount: 1180000,
    cgst: 90000, sgst: 90000, igst: 0,
    source: 'GSTR_1', status: 'FLAGGED', riskScore: 99,
    flags: ['CIRCULAR_TRADING_LOOP'], irn: 'loop-3',
    einvoiceStatus: 'Generated', paymentCoverageRatio: 0.05
  }
];

export const MOCK_GRAPH_DATA = {
  nodes: [
    { id: 'BUYER_ORG', label: 'Buyer Enterprise', type: 'TAXPAYER', riskLevel: 'LOW' },
    { id: 'V-29ABC', label: 'ABC Tech', type: 'TAXPAYER', riskLevel: 'HIGH' },
    { id: 'V-27FGH', label: 'Global Logistics', type: 'TAXPAYER', riskLevel: 'LOW' },
    { id: 'V-19OPQ', label: 'Zenith Marketing', type: 'TAXPAYER', riskLevel: 'CRITICAL' },
    { id: 'V-07KJH', label: 'Nexus Supply', type: 'TAXPAYER', riskLevel: 'MEDIUM' },
    { id: 'V-24PLM', label: 'Vibrant Textiles', type: 'TAXPAYER', riskLevel: 'HIGH' },
    { id: 'V-33QWE', label: 'Southern Steels', type: 'TAXPAYER', riskLevel: 'LOW' },
    
    // Circular Trading Cluster Nodes
    { id: 'V-LOOPA', label: 'Entity Alpha', type: 'TAXPAYER', riskLevel: 'CRITICAL' },
    { id: 'V-LOOPB', label: 'Entity Beta', type: 'TAXPAYER', riskLevel: 'CRITICAL' },
    { id: 'V-LOOPC', label: 'Entity Gamma', type: 'TAXPAYER', riskLevel: 'CRITICAL' },

    // Invoices
    { id: 'I-001', label: 'INV-1029', type: 'INVOICE', riskLevel: 'HIGH' },
    { id: 'I-002', label: 'INV-8821', type: 'INVOICE', riskLevel: 'LOW' },
    { id: 'I-003', label: 'INV-4491', type: 'INVOICE', riskLevel: 'CRITICAL' },
    { id: 'I-004', label: 'INV-1122', type: 'INVOICE', riskLevel: 'MEDIUM' },
    { id: 'I-LP1', label: 'LP-111', type: 'INVOICE', riskLevel: 'CRITICAL' },
    { id: 'I-LP2', label: 'LP-222', type: 'INVOICE', riskLevel: 'CRITICAL' },
    { id: 'I-LP3', label: 'LP-333', type: 'INVOICE', riskLevel: 'CRITICAL' },

    // Governance Nodes
    { id: 'IRN-001', label: 'IRN:5af6', type: 'IRN', riskLevel: 'CRITICAL' },
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
    { source: 'V-19OPQ', target: 'I-003', type: 'ISSUED' },
    { source: 'I-003', target: 'V-29ABC', type: 'RECEIVED_BY' },
    
    // ITC Chain Break
    { source: 'V-07KJH', target: 'I-004', type: 'ISSUED' },
    { source: 'I-004', target: 'V-24PLM', type: 'RECEIVED_BY' },

    // Circular Trading Cluster Loop
    { source: 'V-LOOPA', target: 'I-LP1', type: 'ISSUED' },
    { source: 'I-LP1', target: 'V-LOOPB', type: 'RECEIVED_BY' },
    { source: 'V-LOOPB', target: 'I-LP2', type: 'ISSUED' },
    { source: 'I-LP2', target: 'V-LOOPC', type: 'RECEIVED_BY' },
    { source: 'V-LOOPC', target: 'I-LP3', type: 'ISSUED' },
    { source: 'I-LP3', target: 'V-LOOPA', type: 'RECEIVED_BY' },
  ] as GraphEdge[]
};

export const MOCK_RISK_ASSESSMENTS: RiskAssessment[] = MOCK_VENDORS.map(v => ({
  vendorGstin: v.gstin,
  riskScore: v.riskScore,
  riskLevel: v.riskLevel,
  contributingFactors: [
    'Deterministic graph traversal found break in tax payment chain',
    'Neo4j cluster detection identified circular trading loop (FRAUD-LOOP-72)',
    'IRN status changed to CANCELLED post-claim',
    v.riskScore > 70 ? 'High degree centrality indicates central hub in risk network' : 'Low network variance detected'
  ],
  graphEvidence: MOCK_GRAPH_DATA
}));
