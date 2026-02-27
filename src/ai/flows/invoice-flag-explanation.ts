'use server';
/**
 * @fileOverview This file provides a Genkit flow to generate a concise explanation for a flagged invoice.
 *
 * - explainInvoiceFlag - A function that generates an explanation for a flagged invoice.
 * - InvoiceFlagExplanationInput - The input type for the explainInvoiceFlag function.
 * - InvoiceFlagExplanationOutput - The return type for the explainInvoiceFlag function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InvoiceFlagExplanationInputSchema = z.object({
  invoiceId: z.string().describe('The identifier of the invoice.'),
  status: z
    .enum(['MATCHED', 'FLAGGED', 'UNMATCHED'])
    .describe('The reconciliation status of the invoice.'),
  riskScore: z.number().int().min(0).max(100).describe('The risk score of the invoice (0-100).'),
  factors: z.array(z.string()).describe('A list of contributing factors for the flagged status.'),
});
export type InvoiceFlagExplanationInput = z.infer<typeof InvoiceFlagExplanationInputSchema>;

const InvoiceFlagExplanationOutputSchema = z.object({
  explanation: z.string().describe('A concise explanation for why the invoice was flagged.'),
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
  prompt: `You are a GST compliance expert. Explain why invoice {{{invoiceId}}} was flagged.

Status: {{{status}}}
Risk Score: {{{riskScore}}}/100
Factors: {{#if factors}}{{#each factors}}- {{{this}}}\n{{/each}}{{else}}No specific factors provided.\n{{/if}}

Provide a brief, clear explanation (1-2 sentences) suitable for an investigation report. Ensure the explanation is direct and actionable.

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
      throw new Error('Failed to generate invoice flag explanation.');
    }
    return output;
  }
);
