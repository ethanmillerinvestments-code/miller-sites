import type { Metadata } from "next";

import NotFoundPage from "@/components/pages/NotFoundPage";

export const metadata: Metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return <NotFoundPage />;
}
