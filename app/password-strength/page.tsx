"use client";
import { Header } from "@/components/ui/header";
import { PasswordStrengthBlock } from "./password-strength-block";

export default function Page() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-4xl">
        <Header id="password-strength" />
        <PasswordStrengthBlock />
      </div>
    </div>
  );
}
