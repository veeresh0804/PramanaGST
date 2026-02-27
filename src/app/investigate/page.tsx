'use client';

export default function InvestigationsListPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] space-y-4 animate-in fade-in duration-700">
      <div className="p-8 rounded-xl bg-card/50 border-2 border-primary/20 shadow-2xl">
        <h1 className="text-3xl font-headline font-bold tracking-tight text-primary">
          invsetiga is working
        </h1>
      </div>
      <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-bold">
        Pramāṇa System Node Status: Online
      </p>
    </div>
  );
}
