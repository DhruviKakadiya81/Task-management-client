import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-2">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight">TaskFlow</h1>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Full-stack task management dashboard. Setup completed successfully.
        </p>

        <div className="flex items-center justify-center gap-3 pt-4">
          <Link href="/login" className={buttonVariants({ variant: "default" })}>
            Get Started <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
          <Link href="/register" className={buttonVariants({ variant: "outline" })}>
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
