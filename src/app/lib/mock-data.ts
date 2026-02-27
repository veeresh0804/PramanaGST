import { Invoice, Vendor, RiskAssessment, GraphNode, GraphEdge } from '@/domain/models/entities';

export const MY_COMPANY_GSTIN = '27MYCOMP1234F1Z';

export const MOCK_VENDORS: Vendor[] = [
  { gstin: '29ABCDE1234F1Z5', name: 'ABC Technologies Pvt Ltd', riskScore: 82, riskLevel: 'HIGH', networkMetrics: { chainDepth: 5, clusterRisk: 0.85, degreeCentrality: 12 } },
  { gstin: '27FGHIJ5678K2L3', name: 'Global Logistics Solutions', riskScore: 22, riskLevel: 'LOW', networkMetrics: { chainDepth: 2, clusterRisk: 0.15, degreeCentrality: 4 } },
  { gstin: '19OPQRS3456T5U6', name: 'Zenith Marketing Inc', riskScore: 94, riskLevel: 'CRITICAL', networkMetrics: { chainDepth: 8, clusterRisk: 0.95, degreeCentrality: 22 } },
  { gstin: '07KJHGF9876M1Z2', name: 'Nexus Supply Chain', riskScore: 45, riskLevel: 'MEDIUM', networkMetrics: { chainDepth: 3, clusterRisk: 0.4, degreeCentrality: 8 } },
  { gstin: '24PLMOK5544N6M7', name: 'Vibrant Textiles', riskScore: 76, riskLevel: 'HIGH', networkMetrics: { chainDepth: 6, clusterRisk: 0.7, degreeCentrality: 15 } },
  { gstin: '27LOOPA1111A1Z1', name: 'Shell Entity Alpha', riskScore: 98, riskLevel: 'CRITICAL', networkMetrics: { chainDepth: 12, clusterRisk: 0.99, degreeCentrality: 30 } },
  { gstin: '27LOOPB2222B2Z2', name: 'Shell Entity Beta', riskScore: 98, riskLevel: 'CRITICAL', networkMetrics: { chainDepth: 12, clusterRisk: 0.99, degreeCentrality: 30 } },
  { gstin: '27LOOPC3333C3Z3', name: 'Shell Entity Gamma', riskScore: 95, riskLevel: 'CRITICAL', networkMetrics: { chainDepth: 10, clusterRisk: 0.92, degreeCentrality: 25 } },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2024-001', invoiceNumber: 'PR-1029', vendorGstin: '29ABCDE1234F1Z5', recipientGstin: MY_COMPANY_GSTIN, invoiceDate: new Date('2024-01-15'), taxableAmount: 100000, cgst: 9000, sgst: 9000, igst: 0, totalAmount: 118000, source: 'GSTR_1', status: 'FLAGGED', riskScore: 78, flags: ['IRN_CANCELLED', 'ITC_CHAIN_BROKEN'], irn: '5af67...b12', einvoiceStatus: 'Cancelled', paymentCoverageRatio: 0.4, itcClaimed: 18000 },
  { id: 'INV-2024-002', invoiceNumber: 'GL-8821', vendorGstin: '27FGHIJ5678K2L3', recipientGstin: MY_COMPANY_GSTIN, invoiceDate: new Date('2024-01-18'), taxableAmount: 50000, cgst: 0, sgst: 0, igst: 9000, totalAmount: 59000, source: 'GSTR_1', status: 'MATCHED', riskScore: 12, flags: [], irn: 'c12d3...e90', einvoiceStatus: 'Generated', paymentCoverageRatio: 1.0, itcClaimed: 9000 },
  { id: 'INV-2024-003', invoiceNumber: 'ZM-4491', vendorGstin: '19OPQRS3456T5U6', recipientGstin: MY_COMPANY_GSTIN, invoiceDate: new Date('2024-01-20'), taxableAmount: 200000, cgst: 18000, sgst: 18000, igst: 0, totalAmount: 236000, source: 'GSTR_1', status: 'FLAGGED', riskScore: 95, flags: ['CIRCULAR_TRADING_LOOP'], irn: 'f99a1...c01', einvoiceStatus: 'Generated', paymentCoverageRatio: 0.1, itcClaimed: 36000 },
  { id: 'INV-LOOP-001', invoiceNumber: 'LP-111', vendorGstin: '27LOOPA1111A1Z1', recipientGstin: '27LOOPB2222B2Z2', invoiceDate: new Date('2024-01-01'), taxableAmount: 1000000, cgst: 90000, sgst: 90000, igst: 0, totalAmount: 1180000, source: 'GSTR_1', status: 'FLAGGED', riskScore: 99, flags: ['CIRCULAR_TRADING_LOOP', 'SYMMETRY_DETECTED', 'TAX_GAP_90'], irn: 'lp111...x1', einvoiceStatus: 'Generated', paymentCoverageRatio: 0.0, itcClaimed: 180000 },
  { id: 'INV-LOOP-002', invoiceNumber: 'LP-222', vendorGstin: '27LOOPB2222B2Z2', recipientGstin: '27LOOPC3333C3Z3', invoiceDate: new Date('2024-01-03'), taxableAmount: 1002000, cgst: 90180, sgst: 90180, igst: 0, totalAmount: 1182360, source: 'GSTR_1', status: 'FLAGGED', riskScore: 99, flags: ['CIRCULAR_TRADING_LOOP', 'SHORT_WINDOW_3D'], irn: 'lp222...y2', einvoiceStatus: 'Generated', paymentCoverageRatio: 0.05, itcClaimed: 180360 },
  { id: 'INV-LOOP-003', invoiceNumber: 'LP-333', vendorGstin: '27LOOPC3333C3Z3', recipientGstin: '27LOOPA1111A1Z1', invoiceDate: new Date('2024-01-05'), taxableAmount: 998000, cgst: 89820, sgst: 89820, igst: 0, totalAmount: 1177640, source: 'GSTR_1', status: 'FLAGGED', riskScore: 95, flags: ['CIRCULAR_TRADING_LOOP', 'VALUE_RECIRCULATION'], irn: 'lp333...z3', einvoiceStatus: 'Generated', paymentCoverageRatio: 0.0, itcClaimed: 179640 },
];

export const MOCK_GRAPH_DATA = {
  nodes: [
    { id: MY_COMPANY_GSTIN, label: 'My Company (Primary)', type: 'ROOT_NODE' as const, riskLevel: 'LOW' },
    { id: '29ABCDE1234F1Z5', label: 'ABC Tech', type: 'SUPPLIER' as const, riskLevel: 'HIGH' },
    { id: '27FGHIJ5678K2L3', label: 'Global Logistics', type: 'SUPPLIER' as const, riskLevel: 'LOW' },
    { id: '19OPQRS3456T5U6', label: 'Zenith Marketing', type: 'SUPPLIER' as const, riskLevel: 'CRITICAL' },
    { id: '27LOOPA1111A1Z1', label: 'Shell Alpha', type: 'SUPPLIER' as const, riskLevel: 'CRITICAL' },
    { id: '27LOOPB2222B2Z2', label: 'Shell Beta', type: 'SUPPLIER' as const, riskLevel: 'CRITICAL' },
    { id: '27LOOPC3333C3Z3', label: 'Shell Gamma', type: 'SUPPLIER' as const, riskLevel: 'CRITICAL' },
    ...MOCK_INVOICES.map(inv => ({
      id: inv.id,
      label: inv.invoiceNumber,
      type: 'INVOICE' as const,
      riskLevel: inv.riskScore > 90 ? 'CRITICAL' : inv.riskScore > 70 ? 'HIGH' : 'LOW'
    }))
  ] as GraphNode[],
  links: [
    { source: '27LOOPA1111A1Z1', target: 'INV-LOOP-001', type: 'ISSUED' as const, status: 'RISK' as const },
    { source: 'INV-LOOP-001', target: '27LOOPB2222B2Z2', type: 'RECEIVED_BY' as const, status: 'RISK' as const },
    { source: '27LOOPB2222B2Z2', target: 'INV-LOOP-002', type: 'ISSUED' as const, status: 'RISK' as const },
    { source: 'INV-LOOP-002', target: '27LOOPC3333C3Z3', type: 'RECEIVED_BY' as const, status: 'RISK' as const },
    { source: '27LOOPC3333C3Z3', target: 'INV-LOOP-003', type: 'ISSUED' as const, status: 'RISK' as const },
    { source: 'INV-LOOP-003', target: '27LOOPA1111A1Z1', type: 'RECEIVED_BY' as const, status: 'RISK' as const },
  ] as GraphEdge[]
};

export const MOCK_RISK_ASSESSMENTS: RiskAssessment[] = MOCK_VENDORS.map(v => ({
  vendorGstin: v.gstin,
  riskScore: v.riskScore,
  riskLevel: v.riskLevel,
  contributingFactors: [
    'Risk-weighted circular pattern detected (Symmetry: 98%)',
    'Tax Coverage Gap: >90% deficiency in reported remittance',
    'Short transaction window (<48h) between multi-hop entities'
  ],
  graphEvidence: MOCK_GRAPH_DATA
}));
