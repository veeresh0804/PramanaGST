'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShieldAlert, 
  CheckCircle2, 
  TrendingUp,
  Database,
  ArrowRight,
  Activity,
  Zap,
  Search,
  Users,
  ChevronRight,
  FileText,
  HelpCircle,
  FileSearch,
  AlertTriangle
} from 'lucide-react';
import { MOCK_VENDORS, MOCK_INVOICES } from './lib/mock-data';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from 'recharts';
import { useMemo } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function DashboardPage() {
  const stats = useMemo(() => {
    const totalVolume = MOCK_INVOICES.reduce((acc, inv) => acc + inv.totalAmount, 0);
    const riskAnomalies = MOCK_INVOICES.filter(inv => inv.status === 'FLAGGED').length;
    const matchedCount = MOCK_INVOICES.filter(inv => inv.status === 'MATCHED').length;
    const reconHealth = Math.round((matchedCount / MOCK_INVOICES.length) * 100);
    return { totalVolume, riskAnomalies, reconHealth };
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">Official Compliance Dashboard</h1>
        <p className="text-slate-500 font-medium">Consolidated statutory oversight, predictive risk modeling, and graph intelligence.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main content area */}
        <div className="lg:col-span-3 space-y-8">
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="aadhaar-card p-8 group">
              <div className="h-10 w-10 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                <Activity className="h-5 w-5 text-accent" />
              </div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                Execute Matching Engine <ChevronRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" />
              </h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Trigger the deterministic reconciliation process for current period Purchase Registers against GSTR-2B data nodes.
              </p>
              <Link href="/upload">
                <Button variant="outline" className="text-primary font-bold text-[10px] uppercase tracking-widest border-primary/20 hover:bg-primary hover:text-white rounded-none w-full sm:w-auto">
                  Run Engine Pipeline
                </Button>
              </Link>
            </div>

            <div className="aadhaar-card p-8 group">
              <div className="h-10 w-10 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                Verify Risk Nodes <ChevronRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" />
              </h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Review flagged entities and high-centrality shell network clusters detected in the knowledge graph traversal.
              </p>
              <Link href="/vendors">
                <Button variant="outline" className="text-primary font-bold text-[10px] uppercase tracking-widest border-primary/20 hover:bg-primary hover:text-white rounded-none w-full sm:w-auto">
                  Check Intelligence Status
                </Button>
              </Link>
            </div>

            <div className="aadhaar-card p-8 group">
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Search className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                Investigation Module <ChevronRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" />
              </h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Access the AI-powered Explainability Layer for detailed reasoning on specific transaction mismatches and fraud rings.
              </p>
              <Link href="/investigate">
                <Button variant="outline" className="text-primary font-bold text-[10px] uppercase tracking-widest border-primary/20 hover:bg-primary hover:text-white rounded-none w-full sm:w-auto">
                  Open Case Manager
                </Button>
              </Link>
            </div>

            <div className="aadhaar-card p-8 bg-slate-50/50 group">
              <div className="h-10 w-10 bg-sky-600/10 rounded-full flex items-center justify-center mb-4">
                <Database className="h-5 w-5 text-sky-600" />
              </div>
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                Relationship Explorer <ChevronRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" />
              </h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Visualize the multi-layered GST network and trace the lineage of tax credits through the supply chain.
              </p>
              <Link href="/graph">
                <Button variant="outline" className="text-primary font-bold text-[10px] uppercase tracking-widest border-primary/20 hover:bg-primary hover:text-white rounded-none w-full sm:w-auto">
                  Launch Graph Visualizer
                </Button>
              </Link>
            </div>
          </div>

          <Card className="rounded-none border shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50 border-b py-4">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Compliance Efficiency Trend (FY 2023-24)</CardTitle>
            </CardHeader>
            <CardContent className="p-8 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { month: 'Aug', score: 72 }, { month: 'Sep', score: 75 }, { month: 'Oct', score: 70 },
                  { month: 'Nov', score: 82 }, { month: 'Dec', score: 85 }, { month: 'Jan', score: stats.reconHealth }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '0px', border: '1px solid #e2e8f0' }}
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#003366" strokeWidth={3} fill="#003366" fillOpacity={0.05} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar panel */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wider">
              <FileText className="h-4 w-4 text-primary" /> Statutory Resources
            </h3>
            <div className="bg-white border rounded divide-y shadow-sm">
              {[
                { title: "Filing Manual v2.1", href: "#" },
                { title: "Rule Engine Specs", href: "#" },
                { title: "Graph Schema (Neo4j)", href: "#" },
                { title: "Audit Certification v4", href: "#" },
                { title: "Risk Weightage Policy", href: "#" }
              ].map((item, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between group cursor-pointer hover:bg-slate-50 transition-colors">
                  <span className="text-xs font-bold text-slate-600">{item.title}</span>
                  <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800 uppercase tracking-wider">
              <HelpCircle className="h-4 w-4 text-primary" /> Statutory FAQ
            </h3>
            <Accordion type="single" collapsible className="w-full bg-white border rounded shadow-sm">
              <AccordionItem value="item-1" className="px-4 border-b">
                <AccordionTrigger className="text-[11px] font-bold py-3 text-left hover:no-underline">How is the Risk Score derived?</AccordionTrigger>
                <AccordionContent className="text-[10px] text-slate-500 leading-relaxed font-medium">
                  The Risk Score is a deterministic output of recursive graph traversal algorithms that measure network centrality, transaction loops, and IRN post-issuance status.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="px-4 border-b">
                <AccordionTrigger className="text-[11px] font-bold py-3 text-left hover:no-underline">What is IRN Validation logic?</AccordionTrigger>
                <AccordionContent className="text-[10px] text-slate-500 leading-relaxed font-medium">
                  The system cross-references the Invoice Reference Number against the central portal logs every 6 hours to detect "Generated-then-Cancelled" anomalies.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="px-4">
                <AccordionTrigger className="text-[11px] font-bold py-3 text-left hover:no-underline">Circular Flow Detection?</AccordionTrigger>
                <AccordionContent className="text-[10px] text-slate-500 leading-relaxed font-medium">
                  Cycles are identified when ITC flows return to an originating entity (Source GSTIN) within 5 traversal layers without significant value addition.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <Card className="bg-primary text-white p-6 rounded-none shadow-lg border-none relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
               <Zap className="h-20 w-20" />
             </div>
             <div className="flex items-center gap-3 mb-4">
               <Zap className="h-5 w-5 text-accent" />
               <h4 className="font-bold text-xs uppercase tracking-widest">Pramana Assistant</h4>
             </div>
             <p className="text-[11px] leading-relaxed text-white/90 italic font-medium">
               "Automated Observation: Cluster 72 exhibits high-risk circular flow. I suggest drafting a priority audit report for review by the zonal officer."
             </p>
             <Link href="/audit/FRAUD-RING-72" className="block mt-6">
                <Button size="sm" className="w-full bg-white text-primary hover:bg-slate-100 font-bold text-[10px] uppercase rounded-none tracking-widest">
                  View Suggested Report
                </Button>
             </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}