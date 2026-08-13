import { notFound } from "next/navigation";
import { SchoolTabs } from "@/components/dashboard/district/schools/detail/SchoolTabs";
import SchoolHeader from "@/components/dashboard/district/schools/detail/SchoolHeader";
import { getSchool } from "@/constants/districtData";

export default async function SchoolDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!getSchool(id)) notFound();

  return (
    <div className="space-y-6">
      <SchoolHeader schoolId={id} />
      <div>
        <SchoolTabs schoolId={id} />
      </div>
      <div>{children}</div>
    </div>
  );
}
