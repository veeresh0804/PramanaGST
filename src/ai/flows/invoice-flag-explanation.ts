
'use server';
/**
 * @fileOverview A Genkit flow to generate a concise "Pramāṇa" (proof-based) explanation.
 * Adheres to SSD Section 6 (Explainability Layer).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InvoiceFlagExplanationInputSchema = z.object({
  invoiceId: z.string().describe('The identifier of the invoice.'),
  status: z
    .enum(['MATCHED', 'PARTIAL_MATCH', 'FAILED', 'FLAGGED', 'UNMATCHED'])
    .describe('The reconciliation status.'),
  riskScore: z.number().int().min(0).max(100).describe('The risk score.'),
  factors: z.array(z.string()).describe('Graph traversal mismatch factors.'),
});
export type InvoiceFlagExplanationInput = z.infer<typeof InvoiceFlagExplanationInputSchema>;

const InvoiceFlagExplanationOutputSchema = z.object({
  explanation: z.string().describe('A proof-based explanation (Pramāṇa).'),
});
export type InvoiceFlagExplanationOutput = z.infer<typeof InvoiceFlagExplanationOutputSchema>;

export async function explainInvoiceFlag(
  input: InvoiceFlagExplanationInput
): Promise<InvoiceFlagExplanationOutput> {
  return invoiceFlagExplanationFlow(input);
}

const invoiceFlagExplanationPrompt = ai.definePrompt({
  name: 'invoiceFlagExplanationPrompt',
  input: {schema: InvoiceFlagExplanationInputSchema},
  output: {schema: InvoiceFlagExplanationOutputSchema},
  prompt: `You are the Pramāṇa GST Auditor. Your task is to provide a deterministic explanation for the status of invoice {{{invoiceId}}} based on Knowledge Graph traversal evidence.

Status: {{{status}}}
Risk Score: {{{riskScore}}}/100
Traversal Evidence:
{{#each factors}}
- {{{this}}}
{{/each}}

Explain in 1-2 sentences how the graph relationships (ISSUED, PAID_TAX, HAS_IRN) support this risk assessment. Use professional, audit-ready language.

Explanation:`,
});

const invoiceFlagExplanationFlow = ai.defineFlow(
  {
    name: 'invoiceFlagExplanationFlow',
    inputSchema: InvoiceFlagExplanationInputSchema,
    outputSchema: InvoiceFlagExplanationOutputSchema,
  },
  async (input) => {
    const {output} = await invoiceFlagExplanationPrompt(input);
    if (!output) {
      throw new Error('Failed to generate Pramāṇa explanation.');
    }
    return output;
  }
);
