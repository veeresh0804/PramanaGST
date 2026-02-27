'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UploadCloud, FileText, CheckCircle, Database, Loader2, Zap, AlertCircle, FileSpreadsheet, Server } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function UploadPage() {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const steps = [
    "Normalizing CSV schema...",
    "Running rule-based engine...",
    "ML Fuzzy matching active...",
    "Detecting tax chain breaks...",
    "Syncing results to graph database..."
  ];

  useEffect(() => {
    if (progress === 100 && isProcessing) {
      setIsProcessing(false);
      setCurrentStep(null);
      toast({
        title: "Reconciliation Process Complete",
        description: "Successfully processed 1,240 records from PR_JAN. 12 risk flags raised for investigation.",
      });
    }
  }, [progress, isProcessing, toast]);

  const handleExecuteMatch = useCallback(() => {
    if (isProcessing) return;

    setIsProcessing(true);
    setProgress(0);
    
    let localProgress = 0;
    const totalSteps = steps.length;
    
    intervalRef.current = setInterval(() => {
      localProgress += 2;
      
      if (localProgress >= 100) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setProgress(100);
      } else {
        const stepIdx = Math.floor((localProgress / 100) * totalSteps);
        const nextStep = steps[Math.min(stepIdx, totalSteps - 1)];
        
        setProgress(localProgress);
        setCurrentStep(nextStep);
      }
    }, 100);
  }, [isProcessing, steps]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="space-y-8 animate-in slide-in-from-top-2 duration-500 pb-10">
      <div className="flex flex-col gap-1 border-b border-slate-200 pb-6">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-primary">Data Ingestion & Processing Hub</h1>
        <p className="text-muted-foreground font-medium">Securely ingest purchase registers and statutory GSTR data into the Pramana intelligence engine.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="bg-white border p-12 text-center group cursor-pointer hover:bg-slate-50 transition-all border-t-4 border-t-accent shadow-sm">
            <div className="h-20 w-20 rounded-full bg-accent/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform border border-accent/10">
              <UploadCloud className="h-10 w-10 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Internal Purchase Register (ERP)</h3>
            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">Statutory import of internal records from SAP, Tally Prime, or Oracle ERP modules.</p>
            <div className="flex justify-center gap-3 mb-8">
              <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-slate-200">CSV</Badge>
              <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-slate-200">XLSX</Badge>
              <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-slate-200">JSON</Badge>
            </div>
            <Button className="bg-primary text-white font-bold text-xs uppercase tracking-widest rounded-none h-11 px-8 shadow-md">Select Case Files</Button>
          </div>

          <div className="bg-white border p-12 text-center group cursor-pointer hover:bg-slate-50 transition-all border-t-4 border-t-primary shadow-sm">
            <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-6 group-hover:scale-105 transition-transform border border-primary/10">
              <Server className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">GSTR-2A / 2B Portal Artifacts</h3>
            <p className="text-sm text-slate-500 mb-8 max-w-sm mx-auto leading-relaxed">Direct statutory exports from the GST portal for deterministic multi-field verification.</p>
            <Button variant="outline" className="border-primary text-primary font-bold text-xs uppercase tracking-widest rounded-none h-11 px-8 shadow-sm">Upload Portal Export</Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="rounded-none border shadow-lg overflow-hidden relative bg-white">
            {isProcessing && (
              <div className="absolute top-0 left-0 h-1 bg-accent animate-pulse w-full z-10" />
            )}
            <CardHeader className="bg-slate-50 border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-primary">
                <Zap className="h-4 w-4 text-accent" />
                Deterministic Execution Engine
              </CardTitle>
              <CardDescription className="text-xs font-medium">Monitoring status of active data processing pipelines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                  <span className="flex items-center gap-2">
                     {isProcessing ? <Loader2 className="h-4 w-4 animate-spin text-accent" /> : <CheckCircle className="h-4 w-4 text-accent" />}
                     {isProcessing ? "ENGINE PROCESSING STREAM..." : "ENGINE READY FOR EXECUTION"}
                  </span>
                  <span className="font-mono text-sm">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-slate-100 rounded-none overflow-hidden [&>div]:bg-accent transition-all" />
                {currentStep && (
                   <div className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-accent animate-ping" />
                      <p className="text-[10px] text-accent italic font-bold tracking-wider">{currentStep}</p>
                   </div>
                )}
              </div>
              
              <div className="space-y-4 pt-4">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Batch Queue</p>
                 <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 shadow-inner group transition-all">
                    <div className="h-10 w-10 rounded bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="h-5 w-5 text-slate-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate text-primary">PR_JAN_2024_CONSOLIDATED.csv</p>
                      <p className="text-[10px] text-muted-foreground font-bold">1,240 RECORDS • STATUTORY READY</p>
                    </div>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="text-[10px] font-bold uppercase tracking-widest h-9 px-4 rounded-none bg-accent hover:bg-accent/90 shadow-md disabled:opacity-50"
                      onClick={handleExecuteMatch}
                      disabled={isProcessing}
                    >
                      {!isProcessing && <Zap className="h-3.5 w-3.5 mr-2" />}
                      {isProcessing ? "Processing..." : "Run Engine"}
                    </Button>
                 </div>

                 <div className="flex items-center gap-4 p-4 bg-slate-50/50 border border-slate-100 opacity-50 grayscale">
                    <div className="h-10 w-10 rounded bg-white/50 border border-slate-200 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-slate-300" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">GSTR_2B_JAN_PORTAL.xlsx</p>
                      <p className="text-[10px] text-muted-foreground font-bold">AWAITING DEPENDENCY: PR_JAN</p>
                    </div>
                    <Badge variant="outline" className="text-[9px] uppercase font-bold tracking-widest rounded-none">QUEUED</Badge>
                 </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-6 bg-slate-100 border border-slate-200 flex gap-4 shadow-inner">
             <div className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                <AlertCircle className="h-6 w-6 text-primary" />
             </div>
             <div className="space-y-1">
               <p className="text-sm font-bold text-primary uppercase tracking-wider">Semantic Header Mapping</p>
               <p className="text-xs text-slate-600 leading-relaxed font-medium">
                 The ingestion adapter automatically maps inconsistent column headers using a pre-trained semantic transformer, ensuring ERP-to-Portal compatibility without manual intervention.
               </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}