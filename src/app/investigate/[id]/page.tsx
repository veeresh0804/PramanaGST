import { MOCK_INVOICES, MOCK_RISK_ASSESSMENTS, MOCK_VENDORS } from '@/app/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShieldAlert, 
  ArrowLeft, 
  FileText,
  User,
  Calendar,
  IndianRupee,
  Network,
  Scale,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { explainInvoiceFlag } from '@/ai/flows/invoice-flag-explanation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default async function InvestigationPage({ params }: { params: Promise<{ id: string }> }) {
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
            <p className="text-muted-foreground">Deep dive investigation into transaction lineage and tax compliance.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="border-primary/20 text-primary uppercase font-bold tracking-widest text-[10px] px-3">
            Priority: High
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
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="graph">Knowledge Graph</TabsTrigger>
              <TabsTrigger value="audit">Audit Log</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-6">
              <Card className="bg-card/50 border">
                <CardHeader className="border-b bg-muted/20">
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    Transaction Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-2 gap-8 md:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                      <User className="h-3 w-3" /> Vendor
                    </p>
                    <p className="text-sm font-medium">{vendor?.name || 'ABC Technologies'}</p>
                    <p className="text-[10px] font-mono opacity-50">{invoice.vendorGstin}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> Posting Date
                    </p>
                    <p className="text-sm font-medium">{invoice.invoiceDate.toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" /> Gross Value
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
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Match Engine Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Matching Type</span>
                        <Badge variant="outline" className="text-secondary border-secondary/20">FUZZY ML</Badge>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Confidence</span>
                        <span className="font-mono">82%</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Source Deviation</span>
                        <span className="text-destructive font-mono">+₹4,200</span>
                     </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Network Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Chain Depth</span>
                        <span className="font-mono">{vendor?.networkMetrics?.chainDepth || 0}</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Cluster Risk</span>
                        <span className="font-mono">{(vendor?.networkMetrics?.clusterRisk || 0) * 100}%</span>
                     </div>
                     <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Degree Centrality</span>
                        <span className="font-mono">{vendor?.networkMetrics?.degreeCentrality || 0}</span>
                     </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="graph" className="mt-6">
              <Card className="bg-card/50 border min-h-[500px] graph-container overflow-hidden relative group">
                <CardHeader className="bg-black/20 backdrop-blur-sm z-10 border-b relative">
                  <CardTitle className="text-lg font-medium flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Network className="h-4 w-4 text-secondary" />
                      Visual Lineage
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[400px]">
                  <div className="relative w-full h-full p-8 flex items-center justify-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shadow-[0_0_30px_rgba(90,194,255,0.3)] animate-pulse">
                      <span className="text-[10px] font-bold">{invoice.id}</span>
                    </div>
                    
                    <div className="absolute top-1/4 left-1/3 w-16 h-16 rounded-full bg-secondary/20 border border-secondary flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                       <span className="text-[8px] font-medium uppercase">VENDOR</span>
                    </div>
                    <div className="absolute bottom-1/4 right-1/4 w-16 h-16 rounded-full bg-destructive/20 border border-destructive flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                       <span className="text-[8px] font-medium uppercase">ITC_BREAK</span>
                    </div>

                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                       <line x1="50%" y1="50%" x2="35%" y2="28%" stroke="#5AC2FF" strokeWidth="1" strokeDasharray="4" />
                       <line x1="50%" y1="50%" x2="72%" y2="72%" stroke="#ef4444" strokeWidth="1" />
                    </svg>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit" className="mt-6">
              <Card className="bg-card/50 border">
                 <CardHeader>
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Audit Trail</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="space-y-4">
                       <div className="flex gap-4 items-start pb-4 border-b border-white/5">
                          <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                          <div className="space-y-1">
                             <p className="text-sm font-medium">Invoiced ingested via PR upload</p>
                             <p className="text-xs text-muted-foreground">Jan 15, 2024 • 09:42 AM</p>
                          </div>
                       </div>
                       <div className="flex gap-4 items-start pb-4 border-b border-white/5">
                          <div className="h-2 w-2 rounded-full bg-secondary mt-1.5 shrink-0" />
                          <div className="space-y-1">
                             <p className="text-sm font-medium">GSTR-2B matching executed</p>
                             <p className="text-xs text-muted-foreground">Jan 16, 2024 • 11:20 AM</p>
                          </div>
                       </div>
                       <div className="flex gap-4 items-start">
                          <div className="h-2 w-2 rounded-full bg-destructive mt-1.5 shrink-0" />
                          <div className="space-y-1">
                             <p className="text-sm font-medium">ML Anomaly Flag Raised: Value Deviation</p>
                             <p className="text-xs text-muted-foreground">Jan 16, 2024 • 11:21 AM</p>
                          </div>
                       </div>
                    </div>
                 </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 border border-primary/20 shadow-[0_0_20px_rgba(90,194,255,0.05)]">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Explainable AI Insight
              </CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-wider">Generated by Gemini 2.5 Flash</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
                <p className="text-sm leading-relaxed italic text-foreground/90">
                  "{aiExplanation.explanation}"
                </p>
              </div>
              
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Risk Rule Triggers</p>
                <div className="space-y-2">
                  {(invoice.flags || assessment.rulesTriggered || []).map((factor, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm group cursor-help">
                      <div className="h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                      <span className="text-xs font-mono opacity-80">{typeof factor === 'string' ? factor : factor.ruleId}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Alert className="bg-destructive/5 border-destructive/20">
            <ShieldAlert className="h-4 w-4 text-destructive" />
            <AlertTitle className="text-destructive font-bold">Action Recommended</AlertTitle>
            <AlertDescription className="text-sm">
              Significant discrepancies found in IGST claims. Recommended to freeze ITC claim for this period until vendor proof of payment is verified.
            </AlertDescription>
          </Alert>

          <Card className="bg-card/50 border">
             <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold uppercase text-muted-foreground">Compliance Scorecard</CardTitle>
             </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span>Rule Accuracy</span>
                <span className="text-secondary font-bold">98.2%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span>Peer Benchmark</span>
                <span className="text-amber-500 font-bold">Above Average Risk</span>
              </div>
              <Button variant="outline" className="w-full text-xs h-8 mt-2">
                <Scale className="h-3 w-3 mr-2" /> Verify Peer Deviation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
