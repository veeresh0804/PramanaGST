
'use server';
/**
 * @fileOverview SSD Section 6: AI-Based Risk Explanation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const VendorRiskExplanationInputSchema = z.object({
  vendorGstin: z.string().describe('GSTIN of the vendor.'),
  riskScore: z.number().int().min(0).max(100).describe('AI Risk Score.'),
  riskLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).describe('Risk classification.'),
  contributingFactors: z.array(z.string()).describe('Graph network anomaly metrics.'),
});
export type VendorRiskExplanationInput = z.infer<typeof VendorRiskExplanationInputSchema>;

const VendorRiskExplanationOutputSchema = z.object({
  explanation: z.string().describe('Human-readable risk assessment.'),
});
export type VendorRiskExplanationOutput = z.infer<typeof VendorRiskExplanationOutputSchema>;

export async function explainVendorRisk(input: VendorRiskExplanationInput): Promise<VendorRiskExplanationOutput> {
  return vendorRiskExplanationFlow(input);
}

const vendorRiskExplanationPrompt = ai.definePrompt({
  name: 'vendorRiskExplanationPrompt',
  input: { schema: VendorRiskExplanationInputSchema },
  output: { schema: VendorRiskExplanationOutputSchema },
  prompt: `You are the senior software architect for PramanaGST. Analyze the network risk for Vendor {{{vendorGstin}}}.

Risk Level: {{{riskLevel}}} (Score: {{{riskScore}}}/100)
Network Evidence:
{{#each contributingFactors}}
- {{{this}}}
{{/each}}

Task: Provide a concise (2-3 sentences) risk summary. Focus on the relationship traversal (circular trading clusters, tax payment breaks) as detected in the Neo4j knowledge graph.

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
