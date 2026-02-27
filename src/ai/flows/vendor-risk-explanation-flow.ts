'use server';
/**
 * @fileOverview A Genkit flow for generating human-readable explanations for vendor risk scores.
 *
 * - explainVendorRisk - A function that handles the generation of vendor risk explanations.
 * - VendorRiskExplanationInput - The input type for the explainVendorRisk function.
 * - VendorRiskExplanationOutput - The return type for the explainVendorRisk function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VendorRiskExplanationInputSchema = z.object({
  vendorGstin: z.string().describe('The GSTIN (Goods and Services Tax Identification Number) of the vendor.'),
  riskScore: z.number().int().min(0).max(100).describe('The calculated risk score for the vendor, ranging from 0 to 100.'),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).describe('The classified risk level for the vendor.'),
  contributingFactors: z.array(z.string()).describe('A list of primary factors contributing to the vendor\s risk score.'),
});
export type VendorRiskExplanationInput = z.infer<typeof VendorRiskExplanationInputSchema>;

const VendorRiskExplanationOutputSchema = z.object({
  explanation: z.string().describe('A human-readable explanation of the vendor\s risk assessment.'),
});
export type VendorRiskExplanationOutput = z.infer<typeof VendorRiskExplanationOutputSchema>;

export async function explainVendorRisk(input: VendorRiskExplanationInput): Promise<VendorRiskExplanationOutput> {
  return vendorRiskExplanationFlow(input);
}

const vendorRiskExplanationPrompt = ai.definePrompt({
  name: 'vendorRiskExplanationPrompt',
  input: { schema: VendorRiskExplanationInputSchema },
  output: { schema: VendorRiskExplanationOutputSchema },
  prompt: `You are a GST compliance expert. Explain the following risk assessment in clear, professional language.

Vendor GSTIN: {{{vendorGstin}}}
Risk Score: {{{riskScore}}}/100
Risk Level: {{{riskLevel}}}

Contributing Factors:
{{#each contributingFactors}}
- {{{this}}}
{{/each}}

Task: Provide a concise explanation (2-3 sentences) of why this vendor received this risk score, focusing on the most significant factors. Use language suitable for a tax compliance officer.

Explanation:`,
});

const vendorRiskExplanationFlow = ai.defineFlow(
  {
    name: 'vendorRiskExplanationFlow',
    inputSchema: VendorRiskExplanationInputSchema,
    outputSchema: VendorRiskExplanationOutputSchema,
  },
  async (input) => {
    const { output } = await vendorRiskExplanationPrompt(input);
    return output!;
  }
);
