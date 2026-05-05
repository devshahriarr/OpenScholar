"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { Button } from "@/components/ui/Button";
import { registerUser } from "@/modules/auth/service";
import { RegisterCredentials, UserRole } from "@/types/auth";

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
}

interface RegisterFormData extends RegisterCredentials {
  confirmPassword: string;
}

const ROLE_OPTIONS = [
  { value: "student", label: "Student / Researcher" },
  { value: "admin", label: "Administrator" },
];

function validateRegisterForm(data: RegisterFormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Full name is required.";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

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

  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setServerError(null);
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setFormData((prev) => ({ ...prev, role: e.target.value as UserRole }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateRegisterForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setServerError(null);

    try {
      await registerUser({
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      router.push("/verify-email");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-text-primary">Create your account</h1>
        <p className="text-sm text-text-secondary">
          Join OpenScholar to access and share research
        </p>
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
          label="Full name"
          id="register-name"
          name="name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
          disabled={isLoading}
        />

        <FormInput
          label="Email address"
          id="register-email"
          name="email"
          type="email"
          placeholder="john@example.com"
          autoComplete="email"
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          disabled={isLoading}
        />

        <FormSelect
          label="I am a"
          id="register-role"
          name="role"
          options={ROLE_OPTIONS}
          value={formData.role}
          onChange={handleSelectChange}
          error={errors.role}
          disabled={isLoading}
        />

        <FormInput
          label="Password"
          id="register-password"
          name="password"
          showToggle
          placeholder="Min. 6 characters"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          disabled={isLoading}
        />

        <FormInput
          label="Confirm password"
          id="register-confirm-password"
          name="confirmPassword"
          showToggle
          placeholder="Re-enter your password"
          autoComplete="new-password"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
          aria-label="Create your OpenScholar account"
        >
          Create account
        </Button>
      </form>

      {/* Footer link */}
      <p className="text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:text-primary-hover transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
