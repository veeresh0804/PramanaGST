
'use client';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOCK_VENDORS } from '../lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ShieldAlert, Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function VendorsPage() {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="font-headline text-3xl font-bold tracking-tight">Vendor Risk Intelligence</h1>
        <p className="text-muted-foreground">AI-driven risk assessment of all trading partners based on GST filing patterns.</p>
      </div>

      <Card className="bg-card/50 border overflow-hidden">
        <CardHeader className="bg-muted/30 py-4 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">Active Vendors</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="text-xs font-normal border-primary/20 text-primary">All: 156</Badge>
              <Badge variant="outline" className="text-xs font-normal border-destructive/20 text-destructive">Critical: 8</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/10">
              <TableRow>
                <TableHead className="w-[300px]">Vendor Name</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead className="text-center">Risk Score</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_VENDORS.map((vendor) => (
                <TableRow key={vendor.gstin} className="hover:bg-muted/5">
                  <TableCell className="font-medium py-4">{vendor.name}</TableCell>
                  <TableCell className="font-mono text-xs">{vendor.gstin}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className={cn(
                        "text-base font-bold",
                        vendor.riskScore > 75 ? "text-destructive" : vendor.riskScore > 50 ? "text-amber-500" : "text-secondary"
                      )}>
                        {vendor.riskScore}
                      </span>
                      <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full",
                            vendor.riskScore > 75 ? "bg-destructive" : vendor.riskScore > 50 ? "bg-amber-500" : "bg-secondary"
                          )} 
                          style={{ width: `${vendor.riskScore}%` }} 
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={cn(
                      "font-semibold tracking-wide",
                      vendor.riskLevel === 'CRITICAL' && "bg-destructive/10 text-destructive border-destructive/20",
                      vendor.riskLevel === 'HIGH' && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                      vendor.riskLevel === 'MEDIUM' && "bg-primary/10 text-primary border-primary/20",
                      vendor.riskLevel === 'LOW' && "bg-secondary/10 text-secondary border-secondary/20",
                    )}>
                      {vendor.riskLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button className="text-muted-foreground hover:text-primary transition-colors p-2">
                            <Info className="h-4 w-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="bg-card border p-4 max-w-xs">
                          <div className="space-y-2">
                            <p className="font-bold text-xs uppercase tracking-wider text-muted-foreground">AI Rationale</p>
                            <p className="text-sm">High transaction volume detected with inconsistent tax filing delays compared to historical averages.</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
