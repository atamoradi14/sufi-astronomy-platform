import { redirect } from "next/navigation";

/** Lessons live inside the aggregated Course hub. */
export default function LearnPage() {
  redirect("/course?tab=lessons");
}
