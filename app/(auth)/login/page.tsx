import AuthFormWrapper from "@/components/auth/auth-form-wrapper";

interface LoginPageProps {
  searchParams: Promise<{ redirectTo?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  return <AuthFormWrapper mode="login" redirectTo={params.redirectTo} />;
}
