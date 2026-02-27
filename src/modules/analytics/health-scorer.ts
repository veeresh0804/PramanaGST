'use server';

import { HealthScore } from '@/domain/models/analytics';
import { MOCK_INVOICES, MOCK_VENDORS } from '@/app/lib/mock-data';

/**
 * Server-Side GST Health Scorer
 * Implements deterministic scoring based on statutory compliance markers.
 */
export async function calculateGSTHealthScore(): Promise<HealthScore> {
  const totalInvoices = MOCK_INVOICES.length;
  const cancelledIRN = MOCK_INVOICES.filter(i => i.einvoiceStatus === 'Cancelled').length;
  const highRiskVendors = MOCK_VENDORS.filter(v => v.riskLevel === 'HIGH' || v.riskLevel === 'CRITICAL').length;

  const paymentScore = 85; // Baseline for simulated data
  const irnScore = Math.max(0, 100 - (cancelledIRN / totalInvoices) * 100);
  const networkScore = Math.max(0, 100 - (highRiskVendors / MOCK_VENDORS.length) * 100);

  const finalScore = Math.round(
    (paymentScore * 0.30) + 
    (irnScore * 0.10) + 
    (networkScore * 0.15) + 
    (85 * 0.45)
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
