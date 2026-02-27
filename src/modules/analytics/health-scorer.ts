
import { HealthScore } from '@/domain/models/analytics';
import { MOCK_INVOICES, MOCK_VENDORS } from '@/app/lib/mock-data';

/**
 * Enhanced GST Health Scorer (Migration V2)
 * Formula: 
 * 30% Payment Consistency + 25% ITC Discipline + 20% Filing Consistency + 15% Network + 10% IRN Compliance
 */
export async function calculateGSTHealthScore(): Promise<HealthScore> {
  // Deriving metrics from new schema structure
  const totalInvoices = MOCK_INVOICES.length;
  const cancelledIRN = MOCK_INVOICES.filter(i => i.einvoiceStatus === 'Cancelled').length;
  const underpaidInvoices = MOCK_INVOICES.filter(i => i.flags?.includes('UNDER_PAYMENT')).length;
  const highRiskVendors = MOCK_VENDORS.filter(v => v.riskLevel === 'HIGH' || v.riskLevel === 'CRITICAL').length;

  // Deriving Scores
  const paymentScore = Math.max(0, 100 - (underpaidInvoices / totalInvoices) * 100);
  const irnScore = Math.max(0, 100 - (cancelledIRN / totalInvoices) * 100);
  const networkScore = Math.max(0, 100 - (highRiskVendors / MOCK_VENDORS.length) * 100);

  const finalScore = Math.round(
    (paymentScore * 0.30) + 
    (irnScore * 0.10) + 
    (networkScore * 0.15) + 
    (85 * 0.45) // Default baseline for filing/itc in mock
  );

  return {
    score: finalScore,
    lastUpdated: new Date(),
    factors: [
      { 
        label: 'Payment Consistency', 
        impact: 30, 
        status: paymentScore > 80 ? 'GOOD' : 'CONCERNING' 
      },
      { 
        label: 'IRN Compliance', 
        impact: 10, 
        status: irnScore > 90 ? 'GOOD' : 'BAD' 
      },
      { 
        label: 'Network Integrity', 
        impact: 15, 
        status: networkScore > 70 ? 'GOOD' : 'BAD' 
      }
    ],
    monthlyTrend: [
      { month: 'Oct', score: 72 },
      { month: 'Nov', score: 75 },
      { month: 'Dec', score: 80 },
      { month: 'Jan', score: finalScore },
    ]
  };
}
