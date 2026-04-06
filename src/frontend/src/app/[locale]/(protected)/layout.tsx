export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout applies to all protected routes (applicant, employee, admin)
  // Role-based access is handled by middleware and context
  return <>{children}</>;
}
