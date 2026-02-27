import { Invoice, GSTIN } from '@/domain/models/entities';
import { z } from 'zod';

/**
 * Statutory Ingestion Schemas (Zod)
 * Enforces strict data integrity for government artifacts.
 */
export const GSTR1Schema = z.object({
  invoice_number: z.string().min(1),
  supplier_gstin: z.string().length(15),
  recipient_gstin: z.string().length(15),
  invoice_date: z.string().or(z.date()),
  invoice_value: z.number().or(z.string().transform(v => parseFloat(v))),
  cgst_amount: z.number().optional().default(0),
  sgst_amount: z.number().optional().default(0),
  igst_amount: z.number().optional().default(0),
  irn: z.string().optional(),
});

/**
 * SSD Section 9: Ingestion Layer Responsibilities
 * Implements Contract 1: Normalizing raw dataset records to domain entities.
 */
export class SchemaMapper {
  static validateGSTR1(raw: any) {
    return GSTR1Schema.safeParse(raw);
  }

  static mapGSTR1ToInvoice(raw: any): Invoice {
    const validated = this.validateGSTR1(raw);
    if (!validated.success) {
      throw new Error(`Ingestion Validation Failed: ${validated.error.message}`);
    }
    
    const data = validated.data;
    const cgst = data.cgst_amount;
    const sgst = data.sgst_amount;
    const igst = data.igst_amount;
    const totalTax = cgst + sgst + igst;
    const taxableAmount = data.invoice_value - totalTax;

    return {
      id: `INV-${data.invoice_number}`,
      invoiceNumber: data.invoice_number,
      vendorGstin: data.supplier_gstin,
      recipientGstin: data.recipient_gstin,
      invoiceDate: new Date(data.invoice_date),
      taxableAmount,
      cgst,
      sgst,
      igst,
      totalAmount: data.invoice_value,
      source: 'GSTR_1',
      status: 'MATCHED',
      riskScore: 0,
      irn: data.irn,
      einvoiceStatus: data.irn ? 'Generated' : 'Missing',
      flags: []
    };
  }

  static calculatePaymentCoverage(taxPaid: number, taxLiability: number): number {
    if (taxLiability <= 0) return 1.0;
    return Math.min(taxPaid / taxLiability, 1.0);
  }

  static calculateITCRatio(itcClaimed: number, totalTax: number): number {
    if (totalTax <= 0) return 0;
    return Math.min(itcClaimed / totalTax, 1.0);
  }
}
