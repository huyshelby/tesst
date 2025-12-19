"use client";

import * as React from "react";
import AppleHeader from "@/components/header/apple-header";
import Footer from "@/components/footer";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [query, setQuery] = React.useState("");

  return (
    <>
      <AppleHeader query={query} setQuery={setQuery} />
      {children}
      <Footer />
    </>
  );
}
