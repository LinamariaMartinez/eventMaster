import AuthFormWrapper from "@/components/auth/auth-form-wrapper";

interface RegisterPageProps {
  searchParams: Promise<{ redirectTo?: string }>;
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const params = await searchParams;
  return <AuthFormWrapper mode="register" redirectTo={params.redirectTo} />;
}
