"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/forms/FormInput";
import { Button } from "@/components/ui/Button";
import { loginUser } from "@/modules/auth/service";
import { LoginCredentials } from "@/types/auth";

interface FormErrors {
  email?: string;
  password?: string;
}

function validateLoginForm(data: LoginCredentials): FormErrors {
  const errors: FormErrors = {};

  if (!data.email) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
}

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginCredentials>({ email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setServerError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateLoginForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setServerError(null);

    try {
      const response = await loginUser(formData);
      // Store token securely
      localStorage.setItem("accessToken", response.accessToken);
      router.push("/dashboard");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-text-primary">Welcome back</h1>
        <p className="text-sm text-text-secondary">Sign in to your OpenScholar account</p>
      </div>

      {/* Server error */}
      {serverError && (
        <div
          role="alert"
          className="rounded-md border border-error/20 bg-error/5 px-4 py-3 text-sm text-error"
        >
          {serverError}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormInput
          label="Email address"
          id="login-email"
          name="email"
          type="email"
          placeholder="john@example.com"
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          disabled={isLoading}
        />

        <div className="space-y-1.5">
          <FormInput
            label="Password"
            id="login-password"
            name="password"
            showToggle
            placeholder="••••••••"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
          />
          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:text-primary-hover transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
          aria-label="Sign in to your account"
        >
          Sign in
        </Button>
      </form>

      {/* Footer link */}
      <p className="text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:text-primary-hover transition-colors"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}
