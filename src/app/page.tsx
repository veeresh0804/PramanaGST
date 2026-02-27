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
  HelpCircle
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
  Area,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { useMemo } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function DashboardPage() {
  const stats = useMemo(() => {
    const totalVolume = MOCK_INVOICES.reduce((acc, inv) => acc + inv.totalAmount, 0);
    const riskAnomalies = MOCK_INVOICES.filter(inv => inv.status === 'FLAGGED').length;
    const matchedCount = MOCK_INVOICES.filter(inv => inv.status === 'MATCHED').length;
    const reconHealth = (matchedCount / MOCK_INVOICES.length) * 100;
    return { totalVolume, riskAnomalies, reconHealth };
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">Official Intelligence Dashboard</h1>
        <p className="text-slate-500 font-medium">Consolidated compliance oversight and predictive risk modeling.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Main content area */}
        <div className="lg:col-span-3 space-y-8">
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="aadhaar-card p-8 group">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                Execute Matching Engine <ChevronRight className="h-5 w-5 text-accent" />
              </h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Trigger the deterministic reconciliation process for current period Purchase Registers against GSTR-2B data nodes.
              </p>
              <Link href="/upload" className="text-primary font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                Run Engine Pipeline <Activity className="h-3 w-3" />
              </Link>
            </div>

            <div className="aadhaar-card p-8">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                Verify Risk Nodes <ChevronRight className="h-5 w-5 text-accent" />
              </h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Review flagged entities and high-centrality shell network clusters detected in the knowledge graph traversal.
              </p>
              <Link href="/vendors" className="text-primary font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                Check Intelligence Status <ShieldAlert className="h-3 w-3" />
              </Link>
            </div>

            <div className="aadhaar-card p-8">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                Investigation Module <ChevronRight className="h-5 w-5 text-accent" />
              </h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Access the AI-powered Explainability Layer for detailed reasoning on specific transaction mismatches and fraud rings.
              </p>
              <Link href="/investigate" className="text-primary font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                Open Case Manager <Search className="h-3 w-3" />
              </Link>
            </div>

            <div className="aadhaar-card p-8 bg-slate-50/50">
              <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                Relationship Explorer <ChevronRight className="h-5 w-5 text-accent" />
              </h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Visualize the multi-layered GST network and trace the lineage of tax credits through the supply chain.
              </p>
              <Link href="/graph" className="text-primary font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-1">
                Launch Graph Visualizer <Database className="h-3 w-3" />
              </Link>
            </div>
          </div>

          <Card className="rounded-none border shadow-sm">
            <CardHeader className="bg-slate-50 border-b py-4">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">Compliance Efficiency Trend</CardTitle>
            </CardHeader>
            <CardContent className="p-8 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { month: 'Aug', score: 72 }, { month: 'Sep', score: 75 }, { month: 'Oct', score: 70 },
                  { month: 'Nov', score: 82 }, { month: 'Dec', score: 85 }, { month: 'Jan', score: stats.reconHealth }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#003366" strokeWidth={2} fill="#00336610" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar panel */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <FileText className="h-4 w-4 text-primary" /> References
            </h3>
            <div className="bg-white border rounded divide-y">
              {[
                "Statutory Filing Manual v2.1",
                "Rule-based Logic Documentation",
                "Graph Schema Definition",
                "Audit Certification Standards",
                "Risk Weightage Policy 2024"
              ].map((item, i) => (
                <div key={i} className="px-4 py-3 flex items-center justify-between group cursor-pointer hover:bg-slate-50">
                  <span className="text-xs font-medium text-slate-600">{item}</span>
                  <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <HelpCircle className="h-4 w-4 text-primary" /> Common Queries
            </h3>
            <Accordion type="single" collapsible className="w-full bg-white border rounded">
              <AccordionItem value="item-1" className="px-4 border-b">
                <AccordionTrigger className="text-xs font-bold py-3 text-left">How are risk scores calculated?</AccordionTrigger>
                <AccordionContent className="text-[11px] text-slate-500 leading-relaxed">
                  Risk scores are deterministic outputs of graph traversal algorithms measuring network centrality and statutory filing mismatches.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="px-4 border-b">
                <AccordionTrigger className="text-xs font-bold py-3 text-left">What is the IRN verification logic?</AccordionTrigger>
                <AccordionContent className="text-[11px] text-slate-500 leading-relaxed">
                  The system cross-references the Invoice Reference Number against portal logs to detect post-issuance cancellations.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="px-4">
                <AccordionTrigger className="text-xs font-bold py-3 text-left">Circular flow detection rules?</AccordionTrigger>
                <AccordionContent className="text-[11px] text-slate-500 leading-relaxed">
                  Cycles are identified when ITC flows return to an originating entity or its direct affiliates without commercial substance.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <Card className="bg-primary text-white p-6 rounded-none">
             <div className="flex items-center gap-3 mb-4">
               <Zap className="h-5 w-5 text-accent" />
               <h4 className="font-bold text-sm">Pramana Assistant</h4>
             </div>
             <p className="text-[11px] leading-relaxed text-white/80 italic">
               "System observation: Suspicious loop detected in Cluster 72. Analysis suggests immediate audit escalation for Entity ZEN-91."
             </p>
             <Button size="sm" className="w-full mt-4 bg-white text-primary hover:bg-white/90 font-bold text-xs uppercase rounded-none">
               Draft Report
             </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
