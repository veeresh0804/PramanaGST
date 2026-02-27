import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, FileText, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export default function UploadPage() {
  return (
    <div className="space-y-8 animate-in slide-in-from-top-2 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Data Ingestion</h1>
        <p className="text-muted-foreground">Securely upload your purchase registers and GSTR data for AI analysis.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="bg-card/50 border border-dashed border-primary/50 hover:border-primary transition-all group cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Purchase Register</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-[200px]">Drag & drop CSV or Excel files from your accounting system.</p>
              <Button size="sm" className="bg-primary text-primary-foreground">Select Files</Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border border-dashed border-secondary/50 hover:border-secondary transition-all group cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Database className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-bold">GSTR Data (2A/2B)</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-[200px]">Direct upload of GST portal exports for automated matching.</p>
              <Button size="sm" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">Select Files</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 border">
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-secondary" />
                Ingestion Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <span>Processing PR_JAN_2024.csv</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-1.5 bg-muted" />
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-md bg-muted/20 border border-white/5">
                <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">GSTR_2B_JAN.xlsx</p>
                  <p className="text-[10px] text-muted-foreground">Ready for reconciliation</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-primary h-7">Execute Match</Button>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 flex gap-3">
             <Info className="h-5 w-5 text-amber-500 shrink-0" />
             <div className="space-y-1">
               <p className="text-sm font-bold text-amber-500">Security Note</p>
               <p className="text-xs text-amber-500/80 leading-relaxed">
                 All data is encrypted in transit and at rest. We use anti-corruption layer patterns to ensure your sensitive business keys never leak outside the application domain.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Database(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}