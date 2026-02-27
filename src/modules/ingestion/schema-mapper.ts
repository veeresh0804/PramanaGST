
import { Invoice, Vendor, GSTIN } from '@/domain/models/entities';

/**
 * @fileOverview Schema Adapter Layer
 * Responsibilities:
 * - Map raw CSV-style data to internal domain models.
 * - Calculate derived fraud features.
 * - Ensure backward compatibility with existing UI.
 */

export class SchemaMapper {
  static mapGSTR1ToInvoice(raw: any, einvoiceStatus?: string): Invoice {
    const totalTax = (raw.cgst_amount || 0) + (raw.sgst_amount || 0) + (raw.igst_amount || 0);
    
    return {
      id: `INV-${raw.invoice_number}`,
      invoiceNumber: raw.invoice_number,
      vendorGstin: raw.supplier_gstin,
      recipientGstin: raw.recipient_gstin,
      invoiceDate: new Date(raw.invoice_date),
      taxableAmount: raw.invoice_value - totalTax,
      cgst: raw.cgst_amount || 0,
      sgst: raw.sgst_amount || 0,
      igst: raw.igst_amount || 0,
      totalAmount: raw.invoice_value,
      source: 'GSTR_1',
      status: einvoiceStatus === 'Cancelled' ? 'FLAGGED' : 'MATCHED',
      riskScore: einvoiceStatus === 'Cancelled' ? 85 : 10,
      irn: raw.irn,
      einvoiceStatus: (einvoiceStatus as any) || 'Generated',
      flags: einvoiceStatus === 'Cancelled' ? ['IRN_CANCELLED'] : []
    };
  }

  static calculateRiskFlags(invoice: Invoice, payment: number, itc: number): string[] {
    const flags: string[] = [];
    const totalTax = invoice.cgst + invoice.sgst + invoice.igst;
    
    if (payment < totalTax) flags.push('UNDER_PAYMENT');
    if (itc > payment) flags.push('EXCESS_ITC_CLAIM');
    if (!invoice.irn) flags.push('IRN_MISSING');
    
    return flags;
  }
}
