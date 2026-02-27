
import { Invoice, GSTIN } from '@/domain/models/entities';

/**
 * SSD Section 9: Ingestion Layer Responsibilities
 * Implements Contract 1: Normalizing raw dataset records to domain entities.
 * Handles mapping for Taxpayers, GSTR-1, GSTR-2B, Payments, and E-Invoice.
 */
export class SchemaMapper {
  static mapGSTR1ToInvoice(raw: any): Invoice {
    const cgst = parseFloat(raw.cgst_amount || 0);
    const sgst = parseFloat(raw.sgst_amount || 0);
    const igst = parseFloat(raw.igst_amount || 0);
    const totalTax = cgst + sgst + igst;
    
    const invoiceValue = parseFloat(raw.invoice_value || raw.total_amount || 0);
    const taxableAmount = invoiceValue - totalTax;

    return {
      id: `INV-${raw.invoice_number}`,
      invoiceNumber: raw.invoice_number,
      vendorGstin: raw.supplier_gstin || raw.vendorGstin,
      recipientGstin: raw.recipient_gstin,
      invoiceDate: new Date(raw.invoice_date || Date.now()),
      taxableAmount,
      cgst,
      sgst,
      igst,
      totalAmount: invoiceValue,
      source: 'GSTR_1',
      status: 'MATCHED',
      riskScore: 0,
      irn: raw.irn,
      einvoiceStatus: raw.irn ? 'Generated' : 'Missing',
      flags: []
    };
  }

  /**
   * SSD Derived Feature: Payment Coverage Ratio
   * Derived from payments.tax_paid vs gstr1 tax liability
   */
  static calculatePaymentCoverage(taxPaid: number, taxLiability: number): number {
    if (taxLiability <= 0) return 1.0;
    return Math.min(taxPaid / taxLiability, 1.0);
  }

  /**
   * SSD Derived Feature: ITC to Tax Ratio
   */
  static calculateITCRatio(itcClaimed: number, totalTax: number): number {
    if (totalTax <= 0) return 0;
    return Math.min(itcClaimed / totalTax, 1.0);
  }
}
