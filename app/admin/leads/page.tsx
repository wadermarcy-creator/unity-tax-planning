import { redirect } from "next/navigation";

export default function AdminLeadsRedirectPage() {
  redirect("/mission-control/assessments");
}