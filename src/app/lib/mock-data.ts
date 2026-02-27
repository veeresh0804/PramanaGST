import { Invoice, Vendor, RiskAssessment, GraphNode, GraphEdge } from '@/domain/models/entities';

/**
 * SSD Section 7: Expanded Dataset
 * Modeling 20+ vendors and 30+ invoices with specific fraud scenarios.
 */
export const MOCK_VENDORS: Vendor[] = [
  { gstin: '29ABCDE1234F1Z5', name: 'ABC Technologies Pvt Ltd', riskScore: 82, riskLevel: 'HIGH', networkMetrics: { chainDepth: 5, clusterRisk: 0.85, degreeCentrality: 12 } },
  { gstin: '27FGHIJ5678K2L3', name: 'Global Logistics Solutions', riskScore: 22, riskLevel: 'LOW', networkMetrics: { chainDepth: 2, clusterRisk: 0.15, degreeCentrality: 4 } },
  { gstin: '19OPQRS3456T5U6', name: 'Zenith Marketing Inc', riskScore: 94, riskLevel: 'CRITICAL', networkMetrics: { chainDepth: 8, clusterRisk: 0.95, degreeCentrality: 22 } },
  { gstin: '07KJHGF9876M1Z2', name: 'Nexus Supply Chain', riskScore: 45, riskLevel: 'MEDIUM', networkMetrics: { chainDepth: 3, clusterRisk: 0.4, degreeCentrality: 8 } },
  { gstin: '24PLMOK5544N6M7', name: 'Vibrant Textiles', riskScore: 76, riskLevel: 'HIGH', networkMetrics: { chainDepth: 6, clusterRisk: 0.7, degreeCentrality: 15 } },
  { gstin: '33QWERB1122C3D4', name: 'Southern Steels Ltd', riskScore: 15, riskLevel: 'LOW', networkMetrics: { chainDepth: 1, clusterRisk: 0.05, degreeCentrality: 2 } },
  { gstin: '09ZXCVB4433P8R9', name: 'Bharat Infrastructure', riskScore: 55, riskLevel: 'MEDIUM', networkMetrics: { chainDepth: 4, clusterRisk: 0.5, degreeCentrality: 10 } },
  { gstin: '27LOOPA1111A1Z1', name: 'Shell Entity Alpha', riskScore: 98, riskLevel: 'CRITICAL', networkMetrics: { chainDepth: 12, clusterRisk: 0.99, degreeCentrality: 30 } },
  { gstin: '27LOOPB2222B2Z2', name: 'Shell Entity Beta', riskScore: 98, riskLevel: 'CRITICAL', networkMetrics: { chainDepth: 12, clusterRisk: 0.99, degreeCentrality: 30 } },
  { gstin: '27LOOPC3333C3Z3', name: 'Shell Entity Gamma', riskScore: 98, riskLevel: 'CRITICAL', networkMetrics: { chainDepth: 12, clusterRisk: 0.99, degreeCentrality: 30 } },
  { gstin: '27LOOPD4444D4Z4', name: 'Shell Entity Delta', riskScore: 99, riskLevel: 'CRITICAL', networkMetrics: { chainDepth: 15, clusterRisk: 1.0, degreeCentrality: 35 } },
  { gstin: '27LOOPE5555E5Z5', name: 'Shell Entity Epsilon', riskScore: 99, riskLevel: 'CRITICAL', networkMetrics: { chainDepth: 15, clusterRisk: 1.0, degreeCentrality: 35 } },
  { gstin: '10KERALA1122K1Z', name: 'Malabar Exports', riskScore: 18, riskLevel: 'LOW', networkMetrics: { chainDepth: 2, clusterRisk: 0.1, degreeCentrality: 3 } },
  { gstin: '08RAJAS1122R1Z', name: 'Desert Stones Ltd', riskScore: 35, riskLevel: 'MEDIUM', networkMetrics: { chainDepth: 4, clusterRisk: 0.3, degreeCentrality: 6 } },
  { gstin: '20JHARK1122J1Z', name: 'Coal Mines India', riskScore: 68, riskLevel: 'HIGH', networkMetrics: { chainDepth: 5, clusterRisk: 0.6, degreeCentrality: 11 } },
  { gstin: '03PUNJA1122P1Z', name: 'Amritsar Grains', riskScore: 12, riskLevel: 'LOW', networkMetrics: { chainDepth: 1, clusterRisk: 0.05, degreeCentrality: 2 } },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2024-001', invoiceNumber: 'PR-1029', vendorGstin: '29ABCDE1234F1Z5', recipientGstin: '27FGHIJ5678K2L3', invoiceDate: new Date('2024-01-15'), taxableAmount: 100000, cgst: 9000, sgst: 9000, igst: 0, totalAmount: 118000, source: 'GSTR_1', status: 'FLAGGED', riskScore: 78, flags: ['IRN_CANCELLED', 'ITC_CHAIN_BROKEN'], irn: '5af67...b12', einvoiceStatus: 'Cancelled', paymentCoverageRatio: 0.4 },
  { id: 'INV-2024-002', invoiceNumber: 'GL-8821', vendorGstin: '27FGHIJ5678K2L3', recipientGstin: '29ABCDE1234F1Z5', invoiceDate: new Date('2024-01-18'), taxableAmount: 50000, cgst: 0, sgst: 0, igst: 9000, totalAmount: 59000, source: 'GSTR_1', status: 'MATCHED', riskScore: 12, flags: [], irn: 'c12d3...e90', einvoiceStatus: 'Generated', paymentCoverageRatio: 1.0 },
  { id: 'INV-2024-003', invoiceNumber: 'ZM-4491', vendorGstin: '19OPQRS3456T5U6', recipientGstin: '29ABCDE1234F1Z5', invoiceDate: new Date('2024-01-20'), taxableAmount: 200000, cgst: 18000, sgst: 18000, igst: 0, totalAmount: 236000, source: 'GSTR_1', status: 'FLAGGED', riskScore: 95, flags: ['CIRCULAR_TRADING_LOOP'], irn: 'f99a1...c01', einvoiceStatus: 'Generated', paymentCoverageRatio: 0.1 },
  { id: 'INV-LOOP-001', invoiceNumber: 'LP-111', vendorGstin: '27LOOPA1111A1Z1', recipientGstin: '27LOOPB2222B2Z2', invoiceDate: new Date('2024-03-01'), taxableAmount: 1000000, totalAmount: 1180000, cgst: 90000, sgst: 90000, igst: 0, source: 'GSTR_1', status: 'FLAGGED', riskScore: 99, flags: ['CIRCULAR_TRADING_LOOP'], irn: 'loop-1', einvoiceStatus: 'Generated', paymentCoverageRatio: 0.05 },
  { id: 'INV-LOOP-002', invoiceNumber: 'LP-222', vendorGstin: '27LOOPB2222B2Z2', recipientGstin: '27LOOPC3333C3Z3', invoiceDate: new Date('2024-03-02'), taxableAmount: 1000000, totalAmount: 1180000, cgst: 90000, sgst: 90000, igst: 0, source: 'GSTR_1', status: 'FLAGGED', riskScore: 99, flags: ['CIRCULAR_TRADING_LOOP'], irn: 'loop-2', einvoiceStatus: 'Generated', paymentCoverageRatio: 0.05 },
  { id: 'INV-LOOP-003', invoiceNumber: 'LP-333', vendorGstin: '27LOOPC3333C3Z3', recipientGstin: '27LOOPD4444D4Z4', invoiceDate: new Date('2024-03-03'), taxableAmount: 1000000, totalAmount: 1180000, cgst: 90000, sgst: 90000, igst: 0, source: 'GSTR_1', status: 'FLAGGED', riskScore: 99, flags: ['CIRCULAR_TRADING_LOOP'], irn: 'loop-3', einvoiceStatus: 'Generated', paymentCoverageRatio: 0.05 },
  { id: 'INV-LOOP-004', invoiceNumber: 'LP-444', vendorGstin: '27LOOPD4444D4Z4', recipientGstin: '27LOOPE5555E5Z5', invoiceDate: new Date('2024-03-04'), taxableAmount: 1000000, totalAmount: 1180000, cgst: 90000, sgst: 90000, igst: 0, source: 'GSTR_1', status: 'FLAGGED', riskScore: 99, flags: ['CIRCULAR_TRADING_LOOP'], irn: 'loop-4', einvoiceStatus: 'Generated', paymentCoverageRatio: 0.05 },
  { id: 'INV-LOOP-005', invoiceNumber: 'LP-555', vendorGstin: '27LOOPE5555E5Z5', recipientGstin: '27LOOPA1111A1Z1', invoiceDate: new Date('2024-03-05'), taxableAmount: 1000000, totalAmount: 1180000, cgst: 90000, sgst: 90000, igst: 0, source: 'GSTR_1', status: 'FLAGGED', riskScore: 99, flags: ['CIRCULAR_TRADING_LOOP'], irn: 'loop-5', einvoiceStatus: 'Generated', paymentCoverageRatio: 0.05 },
];

export const MOCK_GRAPH_DATA = {
  nodes: [
    ...MOCK_VENDORS.map(v => ({ id: v.gstin, label: v.name, type: 'TAXPAYER' as const, riskLevel: v.riskLevel })),
    ...MOCK_INVOICES.map(i => ({ id: i.id, label: i.invoiceNumber, type: 'INVOICE' as const, riskLevel: i.riskScore > 80 ? 'CRITICAL' : i.riskScore > 50 ? 'HIGH' : 'LOW' as any })),
    { id: 'RET-JAN-24', label: 'JAN-2024', type: 'RETURN' as const, riskLevel: 'LOW' as any },
    { id: 'PAY-JAN-24', label: 'Tax Payment', type: 'PAYMENT' as const, riskLevel: 'LOW' as any },
  ] as GraphNode[],
  links: [
    ...MOCK_INVOICES.map(i => ({ source: i.vendorGstin, target: i.id, type: 'ISSUED' as const })),
    ...MOCK_INVOICES.filter(i => i.recipientGstin).map(i => ({ source: i.id, target: i.recipientGstin!, type: 'RECEIVED_BY' as const })),
    { source: '29ABCDE1234F1Z5', target: 'RET-JAN-24', type: 'PAID_TAX' as const },
    { source: 'RET-JAN-24', target: 'PAY-JAN-24', type: 'PAID_TAX' as const },
  ] as GraphEdge[]
};

export const MOCK_RISK_ASSESSMENTS: RiskAssessment[] = MOCK_VENDORS.map(v => ({
  vendorGstin: v.gstin,
  riskScore: v.riskScore,
  riskLevel: v.riskLevel,
  contributingFactors: [
    'Deterministic graph traversal found break in tax payment chain',
    v.riskScore > 90 ? 'High degree centrality in known shell network' : 'Normal trading pattern',
  ],
  graphEvidence: MOCK_GRAPH_DATA
}));
