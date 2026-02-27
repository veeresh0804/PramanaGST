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
  const [explanation, setExplanation] = useState<string>("Analyzing multi-factor compliance markers...");
  const [mounted, setMounted] = useState(false);
  const [timestamp, setTimestamp] = useState<string>("");

  const invoice = MOCK_INVOICES.find(i => i.id === id) || MOCK_INVOICES[0];
  const assessment = MOCK_RISK_ASSESSMENTS.find(a => a.vendorGstin === invoice.vendorGstin) || MOCK_RISK_ASSESSMENTS[0];
  const vendor = MOCK_VENDORS.find(v => v.gstin === invoice.vendorGstin);

  useEffect(() => {
    setMounted(true);
    setTimestamp(new Date().toISOString());
    async function getExplanation() {
      try {
        const res = await explainInvoiceFlag({
          invoiceId: invoice.id,
          status: invoice.status,
          riskScore: invoice.riskScore,
          factors: [
            `Rolling Payment Coverage: ${((invoice.paymentCoverageRatio || 0) * 100).toFixed(0)}%`,
            `ITC Ratio Risk: ${(((invoice.itcClaimed || 0) / invoice.totalAmount) * 100).toFixed(0)}%`,
            ...(invoice.flags || [])
          ]
        });
        setExplanation(res.explanation);
      } catch (err) {
        setExplanation("Error generating AI analysis. Multi-factor components available in tabular view.");
      }
    }
    getExplanation();
  }, [invoice]);

  if (!mounted) return null;

  const coverage = (invoice.paymentCoverageRatio || 0) * 100;
  const itcRatio = ((invoice.itcClaimed || 0) / (invoice.cgst + invoice.sgst + invoice.igst)) * 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <Link href="/investigate">
            <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-none border border-slate-200 bg-white">
              <ArrowLeft className="h-5 w-5 text-primary" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Case ID: {invoice.id}</span>
            <h1 className="font-headline text-2xl font-black tracking-tight text-primary">Statutory Evidence Log</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 rounded-none text-[10px] font-bold uppercase tracking-widest bg-white" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" /> Print Dossier
          </Button>
          <Badge className={cn(
            "rounded-none uppercase font-black tracking-widest text-[10px] px-4 py-1.5",
            invoice.riskScore >= 80 ? "bg-destructive text-white" : "bg-primary text-white"
          )}>
            RISK: {invoice.riskScore}
          </Badge>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="rounded-none border shadow-sm">
               <CardContent className="p-4 space-y-2">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Coverage (40%)</p>
                 <p className={cn("text-xl font-black", coverage < 50 ? "text-destructive" : "text-primary")}>{coverage.toFixed(0)}%</p>
               </CardContent>
            </Card>
            <Card className="rounded-none border shadow-sm">
               <CardContent className="p-4 space-y-2">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ITC Deviation (30%)</p>
                 <p className={cn("text-xl font-black", itcRatio > 100 ? "text-destructive" : "text-accent")}>{itcRatio.toFixed(0)}%</p>
               </CardContent>
            </Card>
            <Card className="rounded-none border shadow-sm">
               <CardContent className="p-4 space-y-2">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Network Risk (20%)</p>
                 <p className="text-xl font-black text-primary">{(vendor?.networkMetrics?.clusterRisk || 0) * 100}%</p>
               </CardContent>
            </Card>
            <Card className="rounded-none border shadow-sm">
               <CardContent className="p-4 space-y-2">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">IRN Status (10%)</p>
                 <Badge variant="outline" className="rounded-none text-[9px] border-primary/20 text-primary h-5">{invoice.einvoiceStatus}</Badge>
               </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="evidence" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100 rounded-none h-12 p-1 border">
              <TabsTrigger value="evidence" className="rounded-none font-bold uppercase text-[10px] tracking-widest">Audit Evidence</TabsTrigger>
              <TabsTrigger value="graph" className="rounded-none font-bold uppercase text-[10px] tracking-widest">Graph Context</TabsTrigger>
            </TabsList>
            
            <TabsContent value="evidence" className="mt-6 space-y-6">
              <div className="bg-white border shadow-sm p-8 space-y-6 border-t-4 border-t-primary">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <ShieldCheck className="h-5 w-5 text-accent" />
                  <h3 className="text-sm font-black uppercase text-primary">Pramāṇa Verification Summary</h3>
                </div>
                <div className="grid gap-6">
                   <div className="flex justify-between items-center text-sm border-b pb-3 border-dashed">
                      <span className="text-slate-500 font-bold">Invoiced Amount</span>
                      <span className="font-mono font-black">₹{invoice.totalAmount.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm border-b pb-3 border-dashed">
                      <span className="text-slate-500 font-bold">Tax remitted by Supplier</span>
                      <span className={cn("font-mono font-black", coverage < 50 ? "text-destructive" : "text-green-600")}>
                        ₹{(invoice.totalAmount * (invoice.paymentCoverageRatio || 0) * 0.18).toLocaleString()}
                      </span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-bold">Compliance Status</span>
                      <Badge className="bg-slate-900 text-white rounded-none uppercase text-[9px] font-black">{invoice.status}</Badge>
                   </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="graph" className="mt-6">
              <Card className="rounded-none border-t-4 border-t-slate-800 bg-slate-50/50">
                 <CardContent className="p-8">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Graph Traversal Logic (SSD-10)</p>
                    <div className="bg-slate-900 p-6 rounded-none font-mono text-xs text-green-400 leading-relaxed overflow-x-auto shadow-inner">
                       <p className="text-white/40 mb-2">// Trace network dependency risk</p>
                       MATCH (v:Vendor {"{gstin: '" + invoice.vendorGstin + "'}"})<br/>
                       -[:ISSUED]-&gt;(i:Invoice {"{id: '" + invoice.id + "'}"})<br/>
                       -[:CLAIMED_BY]-&gt;(m:Me)<br/>
                       WHERE v.risk_score &gt; 60<br/>
                       RETURN v, i, m
                    </div>
                 </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <div className="bg-white border shadow-sm border-t-4 border-t-accent overflow-hidden">
            <div className="bg-slate-50 px-6 py-3 border-b flex items-center justify-between">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" />
                Intelligence Layer
              </h4>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="p-4 bg-slate-50 border-l-4 border-l-primary italic text-sm text-slate-800 font-medium">
                "{explanation}"
              </div>
              <div className="space-y-3">
                 <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Red Flag Indicators</p>
                 {invoice.flags?.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-destructive bg-destructive/5 p-2 border border-destructive/10">
                       <ShieldAlert className="h-3 w-3" />
                       {f.replace(/_/g, ' ')}
                    </div>
                 ))}
              </div>
              <Button className="w-full h-11 bg-primary text-white font-bold text-[10px] uppercase tracking-widest rounded-none shadow-md">
                Escalate Investigation
              </Button>
            </CardContent>
          </div>

          <Alert className="rounded-none border-destructive/20 bg-destructive/5 border-l-4 border-l-destructive">
             <AlertTriangle className="h-5 w-5 text-destructive" />
             <AlertTitle className="text-destructive font-black uppercase text-[10px] tracking-widest mb-1">Risk Threshold Breach</AlertTitle>
             <AlertDescription className="text-xs text-slate-700 leading-relaxed font-medium">
               Statutory threshold breached for multi-factor risk model 2.0. Expected coverage &gt; 90% for standard ITC validation.
             </AlertDescription>
          </Alert>
          
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center italic opacity-60">
             Audit Stamp: {timestamp}
          </div>
        </div>
      </div>
    </div>
  );
}
