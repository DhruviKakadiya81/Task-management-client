import Link from "next/link";
import { CheckCircle2, ArrowRight, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-background via-muted/10 to-background">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase">
          <CheckCircle2 className="w-4 h-4" />
          Modern Task Management
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Organize your work with{" "}
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            A fast, full-stack dashboard designed to help you create, prioritize, track, and complete tasks effortlessly.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            href="/login"
            className={buttonVariants({ variant: "default", size: "lg" })}
          >
            Sign In to Dashboard <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
          <Link
            href="/register"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Create Free Account
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 text-left border-t border-border">
          <div className="p-4 rounded-xl border border-border/60 bg-card/60">
            <Zap className="w-5 h-5 text-amber-500 mb-2" />
            <h3 className="font-semibold text-sm">Real-time Tracking</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Instant task updates, status changes, and priority filters.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/60 bg-card/60">
            <BarChart3 className="w-5 h-5 text-blue-500 mb-2" />
            <h3 className="font-semibold text-sm">Live Analytics</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Task completion counts and workload distribution at a glance.
            </p>
          </div>
          <div className="p-4 rounded-xl border border-border/60 bg-card/60">
            <ShieldCheck className="w-5 h-5 text-emerald-500 mb-2" />
            <h3 className="font-semibold text-sm">Secure Authentication</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Protected HttpOnly JWT cookies and strict user data isolation.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
