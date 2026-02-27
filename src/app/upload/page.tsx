
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, FileText, CheckCircle, Info, Database, Loader2, Zap, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

export default function UploadPage() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string | null>(null);

  const steps = [
    "Normalizing CSV schema...",
    "Running rule-based engine...",
    "ML Fuzzy matching active...",
    "Detecting tax chain breaks...",
    "Syncing results to graph database..."
  ];

  const handleExecuteMatch = () => {
    setIsProcessing(true);
    setProgress(0);
    
    let localProgress = 0;
    const totalSteps = steps.length;
    
    const interval = setInterval(() => {
      localProgress += 4;
      
      if (localProgress >= 100) {
        clearInterval(interval);
        // Important: Update states outside of any functional logic to avoid side-effect warnings
        setProgress(100);
        setIsProcessing(false);
        setCurrentStep(null);
        toast({
          title: "Matching Engine Complete",
          description: "Successfully processed 1,240 records. 12 risk flags raised.",
        });
      } else {
        setProgress(localProgress);
        const currentStepIdx = Math.floor((localProgress / 100) * totalSteps);
        setCurrentStep(steps[Math.min(currentStepIdx, totalSteps - 1)]);
      }
    }, 150);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-top-2 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Data Ingestion Hub</h1>
        <p className="text-muted-foreground">Securely ingest purchase registers and GSTR data into the PramanaGST risk engine.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="bg-card/50 border border-dashed border-primary/40 hover:border-primary transition-all group cursor-pointer hover:bg-primary/5">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadCloud className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold">Purchase Register (ERP)</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-[250px]">Upload CSV/XLSX exports from SAP, Tally, or custom ERP systems.</p>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-[8px] border-primary/20 opacity-50">SAP S/4HANA</Badge>
                <Badge variant="outline" className="text-[8px] border-primary/20 opacity-50">TALLY PRIME</Badge>
              </div>
              <Button size="sm" className="mt-6 bg-primary text-primary-foreground">Select Invoices</Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border border-dashed border-secondary/40 hover:border-secondary transition-all group cursor-pointer hover:bg-secondary/5">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Database className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-bold">GSTR-2A / 2B Portal Data</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6 max-w-[250px]">Direct portal exports for automated multi-field matching.</p>
              <Button size="sm" variant="outline" className="border-secondary text-secondary hover:bg-secondary/10">Upload Portal Export</Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-card/50 border shadow-lg overflow-hidden relative">
            {isProcessing && (
              <div className="absolute top-0 left-0 h-1 bg-primary animate-pulse w-full z-10" />
            )}
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-secondary" />
                Real-Time Matching Engine
              </CardTitle>
              <CardDescription>Status of currently queued data pipelines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <span className="flex items-center gap-2">
                     {isProcessing ? <Loader2 className="h-3 w-3 animate-spin text-primary" /> : <CheckCircle className="h-3 w-3 text-secondary" />}
                     {isProcessing ? "Processing Stream..." : "Ready for batch processing"}
                  </span>
                  <span className="font-mono">{progress}%</span>
                </div>
                <Progress value={progress} className="h-1.5 bg-muted" />
                {currentStep && (
                   <p className="text-[10px] text-primary italic font-medium animate-pulse">{currentStep}</p>
                )}
              </div>
              
              <div className="space-y-3">
                 <div className="flex items-center gap-3 p-3 rounded-md bg-muted/20 border border-white/5 group hover:bg-muted/30 transition-colors">
                    <div className="h-8 w-8 rounded bg-muted flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">PR_JAN_2024_CONSOLIDATED.csv</p>
                      <p className="text-[10px] text-muted-foreground">1,240 records • Validated</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs text-primary h-8 gap-2 font-bold hover:bg-primary/10"
                      onClick={handleExecuteMatch}
                      disabled={isProcessing}
                    >
                      {isProcessing ? null : <Zap className="h-3 w-3" />}
                      {isProcessing ? "Reconciling..." : "Run Engine"}
                    </Button>
                 </div>

                 <div className="flex items-center gap-3 p-3 rounded-md bg-muted/10 border border-white/5 opacity-60">
                    <div className="h-8 w-8 rounded bg-muted/50 flex items-center justify-center shrink-0">
                      <FileText className="h-4 w-4 text-muted-foreground/50" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">GSTR_2B_JAN_PORTAL.xlsx</p>
                      <p className="text-[10px] text-muted-foreground">Awaiting dependency: PR_JAN</p>
                    </div>
                    <Badge variant="outline" className="text-[9px] uppercase">Queued</Badge>
                 </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 flex gap-4 shadow-inner">
             <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <AlertCircle className="h-5 w-5 text-primary" />
             </div>
             <div className="space-y-1">
               <p className="text-sm font-bold text-primary">Intelligent Normalization</p>
               <p className="text-xs text-muted-foreground leading-relaxed">
                 Our adapter layer automatically maps inconsistent column headers (e.g., 'Inv No' vs 'Invoice_ID') using a pre-trained semantic header transformer.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
