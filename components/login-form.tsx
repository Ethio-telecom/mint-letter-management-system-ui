"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { useTenant } from "@/lib/tenant";

export function LoginForm() {
  const { t } = useI18n();
  const { tenant } = useTenant();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitting(true);
        // TODO: replace with the real authentication call.
        router.push("/dashboard");
      }}
    >
      <div className="grid gap-2">
        <Label htmlFor="email">{t("Email or username")}</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="email" name="email" autoComplete="username" placeholder={`name@${tenant.domain}`} required className="h-10 pl-9" />
        </div>
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">{t("Password")}</Label>
          <a href="#" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
            {t("Forgot password?")}
          </a>
        </div>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder={t("Enter your password")}
            required
            className="h-10 px-9"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? t("Hide password") : t("Show password")}
            className="absolute top-1/2 right-2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="remember" name="remember" />
        <Label htmlFor="remember" className="font-normal text-muted-foreground">
          {t("Keep me signed in on this device")}
        </Label>
      </div>

      <Button type="submit" size="lg" className="h-10 w-full" disabled={submitting}>
        {submitting ? <Loader2 className="animate-spin" /> : null}
        {t("Sign in")}
      </Button>
    </form>
  );
}
