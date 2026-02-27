import { Invoice, Vendor, RiskAssessment } from '@/domain/models/entities';

export const MOCK_VENDORS: Vendor[] = [
  { gstin: '29ABCDE1234F1Z5', name: 'ABC Technologies Pvt Ltd', riskScore: 82, riskLevel: 'HIGH' },
  { gstin: '27FGHIJ5678K2L3', name: 'Global Logistics Solutions', riskScore: 34, riskLevel: 'LOW' },
  { gstin: '07JKLMN9012P3Q4', name: 'Prime Manufacturing Corp', riskScore: 56, riskLevel: 'MEDIUM' },
  { gstin: '19OPQRS3456T5U6', name: 'Zenith Marketing Inc', riskScore: 91, riskLevel: 'CRITICAL' },
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
    status: 'FLAGGED'
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
    status: 'MATCHED'
  }
];

export const MOCK_RISK_ASSESSMENTS: RiskAssessment[] = MOCK_VENDORS.map(v => ({
  vendorGstin: v.gstin,
  riskScore: v.riskScore,
  riskLevel: v.riskLevel,
  contributingFactors: ['Low matching rate', 'Missing tax payments', 'Unusually high transaction volume']
}));