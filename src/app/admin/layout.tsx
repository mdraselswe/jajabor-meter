import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "অ্যাডমিন প্যানেল | যাযাবর মিটার",
  description: "যাযাবর মিটার অ্যাডমিন কন্ট্রোল সেন্টার ও ভিজিটর অ্যানালিটিক্স",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
