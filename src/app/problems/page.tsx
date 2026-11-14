import { redirect } from "next/navigation";

/** Problems live inside the aggregated Course hub. */
export default function ProblemsPage() {
  redirect("/course?tab=problems");
}
