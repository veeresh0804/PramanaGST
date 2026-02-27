'use server';

import { HealthScore } from '@/domain/models/analytics';
import { MOCK_INVOICES, MOCK_VENDORS, MY_COMPANY_GSTIN } from '@/app/lib/mock-data';

/**
 * Hackathon-Grade Risk Scoring Engine
 * 40% Payment Risk | 30% ITC Risk | 20% Network Risk | 10% IRN Risk
 */
export async function calculateGSTHealthScore(): Promise<HealthScore> {
  // Aggregate stats for My Company (The Root)
  const myInvoices = MOCK_INVOICES.filter(i => i.recipientGstin === MY_COMPANY_GSTIN);
  
  // 1. Rolling Payment Coverage Risk (Simulated for demo)
  // Formula: sum(tax_paid) / sum(total_tax_liability)
  const totalLiability = myInvoices.reduce((acc, inv) => acc + (inv.cgst + inv.sgst + inv.igst), 0);
  const totalPaid = myInvoices.reduce((acc, inv) => acc + ((inv.cgst + inv.sgst + inv.igst) * (inv.paymentCoverageRatio || 1)), 0);
  const paymentCoverageRatio = totalLiability > 0 ? totalPaid / totalLiability : 1;
  const paymentRisk = Math.max(0, 1 - paymentCoverageRatio);

  // 2. ITC Discipline Risk
  // Formula: sum(itc_claimed) / sum(total_tax_liability)
  const totalItc = myInvoices.reduce((acc, inv) => acc + (inv.itcClaimed || 0), 0);
  const itcRatio = totalLiability > 0 ? totalItc / totalLiability : 0;
  const itcRisk = itcRatio > paymentCoverageRatio ? Math.min(1, itcRatio - paymentCoverageRatio) : 0;

  // 3. Network Exposure Risk
  // Average risk of suppliers + loop boost
  const avgSupplierRisk = MOCK_VENDORS.reduce((acc, v) => acc + v.riskScore, 0) / MOCK_VENDORS.length / 100;
  const hasLoop = MOCK_INVOICES.some(i => i.flags?.includes('CIRCULAR_TRADING_LOOP'));
  const networkRisk = Math.min(1, avgSupplierRisk + (hasLoop ? 0.15 : 0));

  // 4. IRN Integrity Risk
  const totalInvCount = myInvoices.length;
  const badIrn = myInvoices.filter(i => i.einvoiceStatus === 'Cancelled' || i.einvoiceStatus === 'Missing').length;
  const irnRisk = totalInvCount > 0 ? badIrn / totalInvCount : 0;

  // Final Composite Risk Score
  const compositeRisk = (
    (0.40 * paymentRisk) +
    (0.30 * itcRisk) +
    (0.20 * networkRisk) +
    (0.10 * irnRisk)
  );

  const finalRiskScore = Math.round(compositeRisk * 100);
  const healthScore = 100 - finalRiskScore;

  return {
    score: healthScore,
    lastUpdated: new Date(),
    factors: [
      { 
        label: 'Payment Coverage Risk', 
        impact: Math.round(paymentRisk * 40), 
        status: paymentRisk > 0.4 ? 'BAD' : paymentRisk > 0.2 ? 'CONCERNING' : 'GOOD' 
      },
      { 
        label: 'ITC Discipline Deviation', 
        impact: Math.round(itcRisk * 30), 
        status: itcRisk > 0.2 ? 'BAD' : 'GOOD' 
      },
      { 
        label: 'Supply Chain Network Exposure', 
        impact: Math.round(networkRisk * 20), 
        status: networkRisk > 0.5 ? 'BAD' : 'GOOD' 
      },
      { 
        label: 'IRN Compliance Index', 
        impact: Math.round(irnRisk * 10), 
        status: irnRisk > 0.3 ? 'BAD' : 'GOOD' 
      }
    ],
    monthlyTrend: [
      { month: 'Oct', score: 72 },
      { month: 'Nov', score: 75 },
      { month: 'Dec', score: 80 },
      { month: 'Jan', score: healthScore },
    ]
  };
}