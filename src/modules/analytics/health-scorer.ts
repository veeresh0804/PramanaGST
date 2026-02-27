'use server';

import { HealthScore } from '@/domain/models/analytics';
import { MOCK_INVOICES, MOCK_VENDORS } from '@/app/lib/mock-data';

/**
 * Server-Side GST Health Scorer
 * Implements risk-weighted circular trading detection.
 */
export async function calculateGSTHealthScore(): Promise<HealthScore> {
  const totalInvoices = MOCK_INVOICES.length;
  
  // Detection Logic for Circular Loops
  // Loop Risk = 30% Tax Gap + 25% Symmetry + 15% Window + 15% IRN + 15% Centrality
  const loopInvoices = MOCK_INVOICES.filter(i => i.flags?.includes('CIRCULAR_TRADING_LOOP'));
  const taxGapScore = loopInvoices.length > 0 ? 95 : 0; // Simulated gap detection
  const symmetryScore = 98; // Simulated value symmetry (₹10L vs ₹10.02L)
  
  const paymentScore = 85; 
  const networkScore = Math.max(0, 100 - (MOCK_VENDORS.filter(v => v.riskLevel === 'CRITICAL').length / MOCK_VENDORS.length) * 100);

  const finalScore = Math.round(
    (paymentScore * 0.30) + 
    (networkScore * 0.20) + 
    (45 * 0.50) // Baseline compliance
  );

  return {
    score: finalScore,
    lastUpdated: new Date(),
    factors: [
      { 
        label: 'Loop Risk Weighted Index', 
        impact: 30, 
        status: taxGapScore > 80 ? 'BAD' : 'GOOD' 
      },
      { 
        label: 'Value Symmetry Analysis', 
        impact: 25, 
        status: symmetryScore > 90 ? 'CONCERNING' : 'GOOD' 
      },
      { 
        label: 'Network Coverage Gap', 
        impact: 15, 
        status: networkScore < 70 ? 'BAD' : 'GOOD' 
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
