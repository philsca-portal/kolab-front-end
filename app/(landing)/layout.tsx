"use client"

import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import Loader from "@/components/ui/Loader";
import { useEffect, useState } from "react";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
        setIsMounted(true);
        setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      },4000);
  },[]);

  if(!isMounted){
      return null;
  }

  return (
      <div>
        {isLoading && <Loader />}
        <Navbar />
        {children}
        <Footer />
      </div>
  )
}
