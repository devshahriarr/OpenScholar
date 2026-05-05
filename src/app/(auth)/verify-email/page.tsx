import Link from "next/link";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <div className="space-y-6 text-center">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <MailCheck className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-text-primary">Check your inbox</h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          We&apos;ve sent a verification link to your email address. Please click the link to
          activate your account.
        </p>
      </div>

      {/* Info box */}
      <div className="rounded-md border border-border bg-surface p-4 text-left space-y-2">
        <p className="text-sm font-medium text-text-primary">What to do next:</p>
        <ol className="space-y-1.5 text-sm text-text-secondary list-decimal list-inside">
          <li>Open your email inbox</li>
          <li>Find the email from OpenScholar</li>
          <li>Click the verification link</li>
          <li>Return here to sign in</li>
        </ol>
      </div>

      {/* Didn't receive */}
      <p className="text-sm text-text-secondary">
        Didn&apos;t receive the email?{" "}
        <span className="text-text-secondary">Check your spam folder or{" "}</span>
        <Link
          href="/register"
          className="font-medium text-primary hover:text-primary-hover transition-colors"
        >
          try again
        </Link>
      </p>

      {/* Back to login */}
      <Link
        href="/login"
        className="block text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
      >
        ← Back to sign in
      </Link>
    </div>
  );
}
