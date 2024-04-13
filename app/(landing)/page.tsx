"use client";

import Container from "@/components/ui/Container";
import useMenuModal from "@/hook/use-menu-modal";
import MainSection from "./components/main-section";
import Features from "./components/feature";
import About from "./components/about";
import Pricing from "./components/pricing";
import Creator from "./components/creator";

export default function Page() {
  const menuModal = useMenuModal();
  
  return (
    <div className={`${menuModal.isOpen === true ? 'hidden lg:block' : ''}`}>
      <Container>
        <MainSection />
        <Features />
        <About />
        <Pricing />
        <Creator />
      </Container>
    </div>
  )
}
