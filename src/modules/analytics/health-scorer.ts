
import { HealthScore } from '@/domain/models/analytics';
import { MOCK_INVOICES, MOCK_VENDORS } from '@/app/lib/mock-data';

/**
 * GST Health Scorer (Isolated Module)
 * Formula: Base 100 - (Flagged Ratio * 40) - (High Risk Vendor Ratio * 40) + (Stability Bonus * 20)
 */
export async function calculateGSTHealthScore(): Promise<HealthScore> {
  const totalInvoices = MOCK_INVOICES.length;
  const flaggedInvoices = MOCK_INVOICES.filter(i => i.status === 'FLAGGED').length;
  const highRiskVendors = MOCK_VENDORS.filter(v => v.riskLevel === 'HIGH' || v.riskLevel === 'CRITICAL').length;

  const flaggedPenalty = (flaggedInvoices / totalInvoices) * 40;
  const vendorPenalty = (highRiskVendors / MOCK_VENDORS.length) * 40;
  
  const finalScore = Math.max(0, Math.min(100, Math.round(100 - flaggedPenalty - vendorPenalty)));

  return {
    score: finalScore,
    lastUpdated: new Date(),
    factors: [
      { 
        label: 'Invoice Accuracy', 
        impact: flaggedPenalty, 
        status: flaggedPenalty > 15 ? 'BAD' : flaggedPenalty > 5 ? 'CONCERNING' : 'GOOD' 
      },
      { 
        label: 'Network Integrity', 
        impact: vendorPenalty, 
        status: vendorPenalty > 20 ? 'BAD' : 'GOOD' 
      }
    ],
    monthlyTrend: [
      { month: 'Oct', score: 82 },
      { month: 'Nov', score: 78 },
      { month: 'Dec', score: 85 },
      { month: 'Jan', score: finalScore },
    ]
  };
}
