
import { MOCK_INVOICES, MOCK_RISK_ASSESSMENTS, MOCK_VENDORS } from '@/app/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShieldAlert, 
  ArrowLeft, 
  FileText,
  IndianRupee,
  Network,
  Zap,
  Hash,
  ShieldCheck,
  GitBranch
} from 'lucide-react';
import Link from 'next/link';
import { explainInvoiceFlag } from '@/ai/flows/invoice-flag-explanation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface InvestigationPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvestigationPage({ params }: InvestigationPageProps) {
  const { id } = await params;
  const invoice = MOCK_INVOICES.find(i => i.id === id) || MOCK_INVOICES[0];
  const assessment = MOCK_RISK_ASSESSMENTS.find(a => a.vendorGstin === invoice.vendorGstin) || MOCK_RISK_ASSESSMENTS[0];
  const vendor = MOCK_VENDORS.find(v => v.gstin === invoice.vendorGstin);

  const aiExplanation = await explainInvoiceFlag({
    invoiceId: invoice.id,
    status: invoice.status,
    riskScore: invoice.riskScore,
    factors: [...(invoice.flags || []), ...(assessment.contributingFactors || [])]
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/investigate">
            <div className="p-2 hover:bg-muted rounded-full transition-colors cursor-pointer">
              <ArrowLeft className="h-5 w-5" />
            </div>
          </Link>
          <div className="flex flex-col">
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              Case Analysis: {invoice.id}
            </h1>
            <p className="text-muted-foreground">Pramāṇa Traversal: Relationship validation & tax chain evidence.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="border-primary/20 text-primary uppercase font-bold tracking-widest text-[10px] px-3">
            Priority: {invoice.riskScore > 80 ? 'CRITICAL' : 'HIGH'}
          </Badge>
          <Badge variant="secondary" className={cn(
            "uppercase font-bold tracking-widest text-[10px] px-3",
            invoice.status === 'FLAGGED' ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
          )}>
            {invoice.status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/20">
              <TabsTrigger value="overview">Evidence</TabsTrigger>
              <TabsTrigger value="schema">Graph Context</TabsTrigger>
              <TabsTrigger value="audit">Audit Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-6">
              <Card className="bg-card/50 border">
                <CardHeader className="border-b bg-muted/20">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    Relationship Validation
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-2 gap-8 md:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                      <Hash className="h-3 w-3" /> IRN Node
                    </p>
                    <Badge variant="outline" className={cn(
                      "text-[10px]",
                      invoice.einvoiceStatus === 'Generated' ? "text-secondary border-secondary/20" : "text-destructive border-destructive/20"
                    )}>
                      {invoice.einvoiceStatus || 'Missing'}
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                      <GitBranch className="h-3 w-3" /> Traversal Depth
                    </p>
                    <p className="text-sm font-medium">{vendor?.networkMetrics?.chainDepth || 0} Layers</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" /> Tax Value
                    </p>
                    <p className="text-sm font-medium">₹{invoice.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                      <Zap className="h-3 w-3" /> Risk Score
                    </p>
                    <p className={cn(
                      "text-sm font-bold",
                      invoice.riskScore > 70 ? "text-destructive" : "text-amber-500"
                    )}>{invoice.riskScore}/100</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-card/50 border">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Reconciliation Adapter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">IRN Linkage Key</span>
                        <Badge variant="outline" className="text-secondary border-secondary/20 font-mono text-[10px]">VERIFIED</Badge>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Traversal Confidence</span>
                        <span className="font-mono text-primary">94.2%</span>
                     </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Entity Integrity</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Cluster Risk</span>
                        <span className="font-mono text-destructive">{(vendor?.networkMetrics?.clusterRisk || 0) * 100}%</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Registration</span>
                        <span className="font-mono">{vendor?.registrationType || 'Regular'}</span>
                     </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="schema" className="mt-6">
              <Card className="bg-card/50 border p-6">
                <h3 className="text-lg font-bold mb-4">Contract-1 Entity Mapping</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <span className="text-xs font-bold text-muted-foreground">TAXPAYER_GSTIN</span>
                    <span className="text-sm font-mono">{invoice.vendorGstin}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 border-b pb-4">
                    <span className="text-xs font-bold text-muted-foreground">IRN_REFERENCE</span>
                    <span className="text-sm font-mono truncate">{invoice.irn || 'NULL'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <span className="text-xs font-bold text-muted-foreground">PAYMENT_CONSISTENCY</span>
                    <span className="text-sm font-mono">{(invoice.paymentCoverageRatio || 0) * 100}%</span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="audit" className="mt-6">
              <Card className="bg-card/50 border p-6">
                 <div className="space-y-4">
                    <div className="flex gap-4">
                       <GitBranch className="h-5 w-5 text-primary" />
                       <div>
                          <p className="text-sm font-bold">Graph Path Validated</p>
                          <p className="text-xs text-muted-foreground">Invoice -> IRN -> Return -> Payment path verified for Jan-2024.</p>
                       </div>
                    </div>
                 </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 border border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Pramāṇa AI Insight
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm leading-relaxed italic text-foreground/90">
                  "{aiExplanation.explanation}"
                </p>
              </div>
            </CardContent>
          </Card>

          <Alert className="bg-destructive/5 border-destructive/20">
            <ShieldAlert className="h-4 w-4 text-destructive" />
            <AlertTitle className="text-destructive font-bold">ITC Chain Alert</AlertTitle>
            <AlertDescription className="text-sm">
              SSD Traversal Alert: IRN cancelled post-filing. This indicates a "Mismatch Post-Evidence" scenario where IRN-linked credit is no longer valid.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
