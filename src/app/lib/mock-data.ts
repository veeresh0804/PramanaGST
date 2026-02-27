
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
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-2024-001', invoiceNumber: 'PR-1029', vendorGstin: '29ABCDE1234F1Z5', recipientGstin: MY_COMPANY_GSTIN, invoiceDate: new Date('2024-01-15'), taxableAmount: 100000, cgst: 9000, sgst: 9000, igst: 0, totalAmount: 118000, source: 'GSTR_1', status: 'FLAGGED', riskScore: 78, flags: ['IRN_CANCELLED', 'ITC_CHAIN_BROKEN'], irn: '5af67...b12', einvoiceStatus: 'Cancelled', paymentCoverageRatio: 0.4 },
  { id: 'INV-2024-002', invoiceNumber: 'GL-8821', vendorGstin: '27FGHIJ5678K2L3', recipientGstin: MY_COMPANY_GSTIN, invoiceDate: new Date('2024-01-18'), taxableAmount: 50000, cgst: 0, sgst: 0, igst: 9000, totalAmount: 59000, source: 'GSTR_1', status: 'MATCHED', riskScore: 12, flags: [], irn: 'c12d3...e90', einvoiceStatus: 'Generated', paymentCoverageRatio: 1.0 },
  { id: 'INV-2024-003', invoiceNumber: 'ZM-4491', vendorGstin: '19OPQRS3456T5U6', recipientGstin: MY_COMPANY_GSTIN, invoiceDate: new Date('2024-01-20'), taxableAmount: 200000, cgst: 18000, sgst: 18000, igst: 0, totalAmount: 236000, source: 'GSTR_1', status: 'FLAGGED', riskScore: 95, flags: ['CIRCULAR_TRADING_LOOP'], irn: 'f99a1...c01', einvoiceStatus: 'Generated', paymentCoverageRatio: 0.1 },
  { id: 'OUT-2024-001', invoiceNumber: 'SL-5512', vendorGstin: MY_COMPANY_GSTIN, recipientGstin: '07KJHGF9876M1Z2', invoiceDate: new Date('2024-02-05'), taxableAmount: 300000, cgst: 27000, sgst: 27000, igst: 0, totalAmount: 354000, source: 'GSTR_1', status: 'MATCHED', riskScore: 5, flags: [], irn: 'irn-out-1', einvoiceStatus: 'Generated', paymentCoverageRatio: 1.0 },
];

export const MOCK_GRAPH_DATA = {
  nodes: [
    { id: MY_COMPANY_GSTIN, label: 'My Company (Primary)', type: 'ROOT_NODE' as const, riskLevel: 'LOW' },
    // Inbound Suppliers
    { id: '29ABCDE1234F1Z5', label: 'ABC Tech', type: 'SUPPLIER' as const, riskLevel: 'HIGH' },
    { id: '27FGHIJ5678K2L3', label: 'Global Logistics', type: 'SUPPLIER' as const, riskLevel: 'LOW' },
    { id: '19OPQRS3456T5U6', label: 'Zenith Marketing', type: 'SUPPLIER' as const, riskLevel: 'CRITICAL' },
    // Outbound Buyer
    { id: '07KJHGF9876M1Z2', label: 'Nexus Supply Chain', type: 'BUYER' as const, riskLevel: 'MEDIUM' },
    // Invoices
    { id: 'INV-2024-001', label: 'PR-1029', type: 'INVOICE' as const, riskLevel: 'HIGH', properties: { value: 118000 } },
    { id: 'INV-2024-002', label: 'GL-8821', type: 'INVOICE' as const, riskLevel: 'LOW', properties: { value: 59000 } },
    { id: 'INV-2024-003', label: 'ZM-4491', type: 'INVOICE' as const, riskLevel: 'CRITICAL', properties: { value: 236000 } },
    { id: 'OUT-2024-001', label: 'SL-5512', type: 'INVOICE' as const, riskLevel: 'LOW', properties: { value: 354000 } },
    // Metadata Nodes
    { id: 'IRN-ZM-4491', label: 'IRN VALID', type: 'IRN' as const, riskLevel: 'LOW' },
    { id: 'RET-JAN-24', label: 'JAN-2024', type: 'RETURN_PERIOD' as const, riskLevel: 'LOW' },
  ] as GraphNode[],
  links: [
    { source: '29ABCDE1234F1Z5', target: 'INV-2024-001', type: 'ISSUED' as const, status: 'RISK' as const },
    { source: 'INV-2024-001', target: MY_COMPANY_GSTIN, type: 'RECEIVED_BY' as const, status: 'RISK' as const },
    
    { source: '27FGHIJ5678K2L3', target: 'INV-2024-002', type: 'ISSUED' as const, status: 'CLEAN' as const },
    { source: 'INV-2024-002', target: MY_COMPANY_GSTIN, type: 'RECEIVED_BY' as const, status: 'CLEAN' as const },
    
    { source: '19OPQRS3456T5U6', target: 'INV-2024-003', type: 'ISSUED' as const, status: 'RISK' as const },
    { source: 'INV-2024-003', target: MY_COMPANY_GSTIN, type: 'RECEIVED_BY' as const, status: 'RISK' as const },
    { source: 'INV-2024-003', target: 'IRN-ZM-4491', type: 'HAS_IRN' as const, status: 'CLEAN' as const },
    
    { source: MY_COMPANY_GSTIN, target: 'OUT-2024-001', type: 'ISSUED' as const, status: 'CLEAN' as const },
    { source: 'OUT-2024-001', target: '07KJHGF9876M1Z2', type: 'RECEIVED_BY' as const, status: 'CLEAN' as const },
    
    { source: MY_COMPANY_GSTIN, target: 'RET-JAN-24', type: 'REPORTED_IN' as const, status: 'CLEAN' as const },
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
