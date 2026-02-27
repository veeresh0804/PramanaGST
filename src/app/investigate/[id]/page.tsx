import { MOCK_INVOICES, MOCK_RISK_ASSESSMENTS } from '@/app/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  ShieldAlert, 
  ArrowLeft, 
  ExternalLink, 
  Info, 
  Share2,
  FileText,
  User,
  Calendar,
  IndianRupee
} from 'lucide-react';
import Link from 'next/link';
import { explainInvoiceFlag } from '@/ai/flows/invoice-flag-explanation';

export default async function InvestigationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = MOCK_INVOICES.find(i => i.id === id) || MOCK_INVOICES[0];
  const assessment = MOCK_RISK_ASSESSMENTS[0];
  
  const aiExplanation = await explainInvoiceFlag({
    invoiceId: invoice.id,
    status: invoice.status,
    riskScore: 78,
    factors: assessment.contributingFactors
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
              Investigate: {invoice.id}
            </h1>
            <p className="text-muted-foreground">Transaction analysis and knowledge graph exploration.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="border-primary/20 text-primary uppercase font-bold tracking-widest text-[10px] px-3">
            Priority High
          </Badge>
          <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20 uppercase font-bold tracking-widest text-[10px] px-3">
            {invoice.status}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card/50 border overflow-hidden">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                Invoice Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-2 gap-8 md:grid-cols-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                  <User className="h-3 w-3" /> Vendor
                </p>
                <p className="text-sm font-medium">ABC Technologies</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Date
                </p>
                <p className="text-sm font-medium">{invoice.invoiceDate.toLocaleDateString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                  <IndianRupee className="h-3 w-3" /> Total Amount
                </p>
                <p className="text-sm font-medium">₹{invoice.totalAmount.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1">
                  <ShieldAlert className="h-3 w-3" /> Risk Score
                </p>
                <p className="text-sm font-bold text-destructive">78/100</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border min-h-[400px] graph-container overflow-hidden relative group">
            <CardHeader className="bg-black/20 backdrop-blur-sm z-10 border-b relative">
              <CardTitle className="text-lg font-medium flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-secondary" />
                  Knowledge Graph
                </div>
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="h-2 w-2 rounded-full bg-secondary" />
                  <div className="h-2 w-2 rounded-full bg-destructive" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[350px]">
              <div className="relative w-full h-full p-8 flex items-center justify-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center shadow-[0_0_30px_rgba(90,194,255,0.3)] animate-pulse">
                  <span className="text-[10px] font-bold">INV-2024</span>
                </div>
                
                <div className="absolute top-1/4 left-1/3 w-16 h-16 rounded-full bg-secondary/20 border border-secondary flex items-center justify-center">
                   <span className="text-[8px] font-medium uppercase">Vendor</span>
                </div>
                <div className="absolute bottom-1/4 right-1/4 w-16 h-16 rounded-full bg-destructive/20 border border-destructive flex items-center justify-center">
                   <span className="text-[8px] font-medium uppercase">ITC Link</span>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-full h-[1px] w-24 bg-gradient-to-r from-transparent to-primary -rotate-45 origin-right opacity-50" />
                <div className="absolute top-1/2 left-1/2 h-[1px] w-32 bg-gradient-to-l from-transparent to-destructive rotate-12 origin-left opacity-50" />
              </div>
              <div className="absolute bottom-4 left-4 text-[10px] text-muted-foreground bg-black/40 px-2 py-1 rounded backdrop-blur border border-white/10 uppercase tracking-widest font-bold">
                Force-Directed Layout v1.2
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 border border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                AI Investigation Report
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <p className="text-sm leading-relaxed italic text-foreground/90">
                  "{aiExplanation.explanation}"
                </p>
              </div>
              
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Primary Risk Factors</p>
                <div className="space-y-2">
                  {assessment.contributingFactors.map((factor, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                      {factor}
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
            <CardContent className="p-4">
              <button className="w-full flex items-center justify-between text-sm font-medium hover:text-primary transition-colors">
                Export Detailed Case PDF
                <ExternalLink className="h-4 w-4" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
