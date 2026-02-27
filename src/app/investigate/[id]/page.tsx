'use client';

import { useParams } from 'next/navigation';
import { MOCK_INVOICES, MOCK_RISK_ASSESSMENTS, MOCK_VENDORS } from '@/app/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShieldAlert, 
  ArrowLeft, 
  IndianRupee,
  Zap,
  Hash,
  ShieldCheck,
  GitBranch,
  Search,
  AlertTriangle,
  FileText,
  Clock,
  Printer,
  Database
} from 'lucide-react';
import Link from 'next/link';
import { explainInvoiceFlag } from '@/ai/flows/invoice-flag-explanation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function InvestigationPage() {
  const params = useParams();
  const id = params.id as string;
  const [explanation, setExplanation] = useState<string>("Analyzing graph evidence...");
  const [mounted, setMounted] = useState(false);

  const invoice = MOCK_INVOICES.find(i => i.id === id) || MOCK_INVOICES[0];
  const assessment = MOCK_RISK_ASSESSMENTS.find(a => a.vendorGstin === invoice.vendorGstin) || MOCK_RISK_ASSESSMENTS[0];
  const vendor = MOCK_VENDORS.find(v => v.gstin === invoice.vendorGstin);

  useEffect(() => {
    setMounted(true);
    async function getExplanation() {
      try {
        const res = await explainInvoiceFlag({
          invoiceId: invoice.id,
          status: invoice.status,
          riskScore: invoice.riskScore,
          factors: [...(invoice.flags || []), ...(assessment.contributingFactors || [])]
        });
        setExplanation(res.explanation);
      } catch (err) {
        setExplanation("Error generating AI analysis. Please review manual flags below.");
      }
    }
    getExplanation();
  }, [invoice, assessment]);

  if (!mounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/investigate">
            <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-none border border-slate-200 bg-white shadow-sm">
              <ArrowLeft className="h-5 w-5 text-primary" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Case Analysis Node</span>
              <div className="h-1.5 w-1.5 rounded-full bg-accent" />
            </div>
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-primary">
              ID: {invoice.id}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 rounded-none text-[10px] font-bold uppercase tracking-widest border-primary/20 bg-white" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" /> Print Dossier
          </Button>
          <Badge variant="secondary" className={cn(
            "rounded-none uppercase font-bold tracking-widest text-[10px] px-4 py-1.5 border shadow-sm",
            invoice.status === 'FLAGGED' ? "bg-destructive/5 text-destructive border-destructive/20" : "bg-accent/5 text-accent border-accent/20"
          )}>
            STATUS: {invoice.status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100 rounded-none h-12 p-1 border border-slate-200 shadow-inner">
              <TabsTrigger value="overview" className="rounded-none font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md">Statutory Evidence</TabsTrigger>
              <TabsTrigger value="schema" className="rounded-none font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md">Graph Context</TabsTrigger>
              <TabsTrigger value="audit" className="rounded-none font-bold uppercase text-[10px] tracking-widest data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md">Filing Trail</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="bg-white border shadow-sm overflow-hidden border-t-4 border-t-accent">
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                    Pramāṇa (Proof-Based) Evidence Log
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-slate-400">HASH: 8f2b...9a1</span>
                </div>
                <div className="p-8 grid grid-cols-2 gap-8 md:grid-cols-4">
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                      <Hash className="h-3 w-3" /> IRN NODE
                    </p>
                    <div className={cn(
                      "font-bold text-sm border-l-2 pl-3",
                      invoice.einvoiceStatus === 'Generated' ? "text-accent border-accent" : "text-destructive border-destructive"
                    )}>
                      {invoice.einvoiceStatus || 'MISSING'}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                      <GitBranch className="h-3 w-3" /> TRAVERSAL
                    </p>
                    <div className="font-bold text-sm border-l-2 border-slate-300 pl-3">
                      {vendor?.networkMetrics?.chainDepth || 0} LAYERS
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" /> TAX VALUE
                    </p>
                    <div className="font-bold text-sm border-l-2 border-slate-300 pl-3">
                      ₹{invoice.totalAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
                      <Zap className="h-3 w-3" /> RISK INDEX
                    </p>
                    <div className={cn(
                      "font-bold text-sm border-l-2 pl-3",
                      invoice.riskScore > 70 ? "text-destructive border-destructive" : "text-amber-500 border-amber-500"
                    )}>{invoice.riskScore}/100</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="rounded-none border shadow-sm bg-white border-t-4 border-t-primary">
                  <CardHeader className="py-3 px-6 border-b border-slate-50 bg-slate-50/50">
                    <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Network Coverage Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-bold uppercase tracking-tighter">Traversal Key</span>
                        <Badge variant="outline" className="text-accent border-accent/20 font-bold text-[9px] rounded-none">STATUTORY_VERIFIED</Badge>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-bold uppercase tracking-tighter">Tax Remittance Ratio</span>
                        <span className={cn(
                          "font-mono font-bold",
                          (invoice.paymentCoverageRatio || 0) < 1.0 ? "text-destructive" : "text-accent"
                        )}>{(invoice.paymentCoverageRatio || 0) * 100}%</span>
                     </div>
                  </CardContent>
                </Card>

                <Card className="rounded-none border shadow-sm bg-white border-t-4 border-t-primary">
                  <CardHeader className="py-3 px-6 border-b border-slate-50 bg-slate-50/50">
                    <CardTitle className="text-[10px) font-bold uppercase tracking-widest text-slate-500">Entity Integrity Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-bold uppercase tracking-tighter">Cluster Risk Score</span>
                        <span className="font-mono font-bold text-destructive">{(vendor?.networkMetrics?.clusterRisk || 0) * 100}%</span>
                     </div>
                     <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-500 font-bold uppercase tracking-tighter">Registration Category</span>
                        <span className="font-bold text-primary">{vendor?.registrationType || 'REGULAR'}</span>
                     </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="schema" className="mt-6">
              <div className="bg-white border shadow-sm p-8 space-y-8 border-t-4 border-t-slate-800">
                <div className="flex items-center gap-2 border-b pb-4">
                  <Database className="h-5 w-5 text-slate-800" />
                  <h3 className="text-lg font-bold text-primary">Knowledge Graph Mapping (SSD-10)</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source Entity Node</p>
                        <p className="font-mono text-xs font-bold bg-slate-50 p-2 border border-slate-100">{invoice.vendorGstin}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Invoice Node</p>
                        <p className="font-mono text-xs font-bold bg-slate-50 p-2 border border-slate-100">{invoice.id}</p>
                     </div>
                  </div>
                  <div className="space-y-1 bg-slate-800 p-6 text-white/90 font-mono text-xs leading-relaxed border-l-4 border-l-accent shadow-inner">
                    <p className="mb-2 text-accent font-bold uppercase text-[9px]">Traversal Query Output:</p>
                    MATCH (v:Vendor {"{gstin: '" + invoice.vendorGstin + "'}"})<br/>
                    -[:ISSUED]->(i:Invoice {"{id: '" + invoice.id + "'}"})<br/>
                    -[:HAS_IRN]->(n:IRN)<br/>
                    -[:REPORTED_IN]->(r:Return)<br/>
                    RETURN v, i, n, r
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="audit" className="mt-6">
              <div className="bg-white border shadow-sm p-8 space-y-6 border-t-4 border-t-slate-800">
                 <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-6">Filing Chain Verification Dossier</h3>
                 <div className="space-y-6">
                    <div className="flex gap-6 items-start">
                       <div className="h-10 w-10 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                          <GitBranch className="h-5 w-5 text-primary" />
                       </div>
                       <div className="flex-1 pb-6 border-b border-slate-100">
                          <p className="text-sm font-extrabold text-primary mb-1">Path Analysis: ISSUED {"->"} PAID_TAX Break</p>
                          <p className="text-xs text-slate-600 leading-relaxed font-medium italic">"Deterministic traversal halted at Return Node JAN-2024: Tax payment relationship node missing for upstream supplier entity."</p>
                       </div>
                    </div>
                    <div className="flex gap-6 items-start">
                       <div className="h-10 w-10 rounded-full bg-destructive/5 border border-destructive/10 flex items-center justify-center shrink-0">
                          <AlertTriangle className="h-5 w-5 text-destructive" />
                       </div>
                       <div className="flex-1 pb-6 border-b border-slate-100">
                          <p className="text-sm font-extrabold text-destructive mb-1">Anomaly: IRN Status Mismatch Detection</p>
                          <p className="text-xs text-slate-600 leading-relaxed font-medium italic">"IRN Node state updated to status: CANCELLED on 2024-02-01. Mismatch detected against active recipient ITC claim."</p>
                       </div>
                    </div>
                    <div className="flex gap-6 items-start">
                       <div className="h-10 w-10 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center shrink-0">
                          <Clock className="h-5 w-5 text-accent" />
                       </div>
                       <div className="flex-1">
                          <p className="text-sm font-extrabold text-accent mb-1">Audit Generation Timestamp</p>
                          <p className="text-xs text-slate-600 font-mono font-bold">{new Date().toISOString()}</p>
                       </div>
                    </div>
                 </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          <div className="bg-white border-2 border-primary/10 shadow-xl overflow-hidden rounded-none">
            <div className="bg-primary text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Explainability Layer</span>
              </div>
              <Badge className="bg-white text-primary text-[8px] font-black tracking-widest rounded-none">ACTIVE</Badge>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="p-6 bg-slate-50 border-l-4 border-l-primary relative shadow-inner">
                <FileText className="absolute top-2 right-2 h-4 w-4 text-primary/10" />
                <p className="text-sm leading-relaxed italic text-slate-800 font-medium">
                  "{explanation}"
                </p>
              </div>
              <div className="pt-6 border-t border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] mb-4">Mismatch Reasoning Logic</p>
                <div className="space-y-3">
                  {invoice.flags?.map((flag, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 bg-destructive/5 border border-destructive/10 group hover:bg-destructive/10 transition-all">
                      <div className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />
                      <span className="text-[10px] font-bold text-destructive uppercase tracking-wide">{flag.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                  {(!invoice.flags || invoice.flags.length === 0) && (
                    <p className="text-xs italic text-slate-400">No rule-based anomalies detected.</p>
                  )}
                </div>
              </div>
              <Button className="w-full bg-primary text-white font-bold text-[10px] uppercase tracking-widest h-10 rounded-none shadow-md mt-4">
                Escalate to Zonal Office
              </Button>
            </CardContent>
          </div>

          <Alert className="bg-destructive/5 border-destructive/20 border-l-4 border-l-destructive rounded-none shadow-sm">
            <ShieldAlert className="h-5 w-5 text-destructive" />
            <AlertTitle className="text-destructive font-bold uppercase text-[10px] tracking-widest mb-2">Critical Chain Alert</AlertTitle>
            <AlertDescription className="text-xs text-slate-700 leading-relaxed font-medium">
              This entity is part of a "Circular Trading Cluster" (FRAUD-RING-72). Relationship traversal identifies looping credit flows without statutory substance.
            </AlertDescription>
          </Alert>
          
          <div className="p-6 bg-accent/5 border border-accent/20 rounded-none shadow-sm">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-accent mb-3">Statutory Linkage</h4>
            <div className="space-y-4">
               <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-500 font-bold">Rule 86B Impact</span>
                 <Badge variant="outline" className="text-destructive border-destructive/20 rounded-none text-[9px] font-black uppercase">RESTRICTED</Badge>
               </div>
               <div className="flex justify-between items-center text-xs">
                 <span className="text-slate-500 font-bold">Compliance Rank</span>
                 <span className="font-mono font-bold text-slate-700">#C22-RANK-LOW</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
