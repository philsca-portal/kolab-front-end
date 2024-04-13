"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import PricePlan from "@/components/ui/price-plan";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Pricing = () => {

    const { theme } = useTheme();

    const [activeSection, setActiveSection] = useState("");

    const [pricePlanRef, pricePlanView] = useInView({
      triggerOnce: true
    });

    const [planRef, planView] = useInView({
      triggerOnce: true
    });

    const [accordionRef, accordionView] = useInView({
      triggerOnce: true
    });

    useEffect(() => {
      const handleScroll = () => {
        let scrollPosition = window.scrollY;
        if (scrollPosition <= 3138) {
          setActiveSection("free");
        } else if (scrollPosition >= 3139 && scrollPosition <= 3598) {
          setActiveSection("basic");
        } else if (scrollPosition >= 3599) {
          setActiveSection("pro");
        } else {
          setActiveSection("");
        }
      };

      window.addEventListener("scroll", handleScroll);

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }, []);

    return(
        <section id="pricing" className="sm:p-6 lg:p-8 lg:mb-[10rem]">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="col-span-2">
                    <div ref={pricePlanRef} className={`${pricePlanView ? 'animate-opacity-translate-from-left-transition' : ''} space-y-4 sticky top-1/3`}>
                        <h1 className={`text-4xl sm:text-5xl text-center lg:text-left font-extrabold uppercase ${theme === 'dark' ? 'green-white-stroke' : 'green-black-stroke'}`}>₱rice Plans</h1>
                        <p className="text-gray-500 italic text-center lg:text-left">Choose the plan that best suits your needs and elevates your task management experience.</p>
                        <ul className="w-fit hidden lg:block">
                            <li className={`${activeSection === "free" ? "text-lg font-bold border-l border-[#5B7553]" : "text-sm font-normal border-l border-gray-300"} transition px-4 py-2`}>Free Plan</li>
                            <li className={`${activeSection === "basic" ? "text-lg font-bold border-l border-[#5B7553]" : "text-sm font-normal border-l border-gray-300"} transition px-4 py-2`}>Basic Plan</li>
                            <li className={` ${activeSection === "pro" ? "text-lg font-bold border-l border-[#5B7553]" : "text-sm font-normal border-l border-gray-300"} transition px-4 py-2`}>Pro Plan</li>
                        </ul>
                    </div>
                </div>
                <div ref={planRef} className={`${planView ? 'animate-opacity-scale-transition' : ''} col-span-3 flex flex-col px-4 gap-12 mt-10 lg:mt-0`}>
                    <div className="sticky top-[20%] lg:top-[27%] h-[25rem] sm:h-[27rem]">
                        <div className={`absolute z-0 top-0 left-0 right-0 bottom-0 border-dashed border-2 rounded-xl ${theme === 'dark' ? 'border-white bg-[#020817]' : 'border-black bg-white'} rotate-3`}>
                          <PricePlan plan="FREE" price="0" description="Perfect for those who are just starting out and need the essentials. The Free Plan provides basic task management tools to help you get organized without any cost."
                                     featureOne="Basic task management tools" featureTwo="Limited storage capacity" featureThree="Ideal for solo users or small teams with minimal requirements" featureFour="Standard customer support"  />
                        </div>
                    </div>
                    <div className="sticky top-[20%] lg:top-[27%] h-[26rem] lg:h-[27rem]">
                        <div className={`absolute z-0 top-0 left-0 right-0 bottom-0 border-dashed border-2 rounded-xl ${theme === 'dark' ? 'border-white bg-[#020817]' : 'border-black bg-white'}`}>
                          <PricePlan plan="BASIC" price="500" description="Ideal for individuals and small teams looking for comprehensive task management. The Basic Plan offers essential features to boost your productivity without breaking the bank."
                                     featureOne="Full access to essential task management tools" featureTwo="Adequate storage capacity" featureThree="Collaboration features for small to medium-sized teams" featureFour="Standard customer support" />
                        </div>
                    </div>
                    <div className="sticky top-[20%] lg:top-[27%] h-[27rem] lg:h-[27rem]">
                        <div className={`absolute z-0 top-0 left-0 right-0 bottom-0 border-dashed border-2 rounded-xl ${theme === 'dark' ? 'border-white bg-[#020817]' : 'border-black bg-white'} -rotate-3`}>
                          <PricePlan plan="PRO" price="1000" description="Take your task management to the next level with the Pro Plan. Designed for those who demand more, it offers advanced features and priority support for a more efficient workflow."
                                     featureOne="Advanced task management features for enhanced productivity" featureTwo="Increased storage capacity" featureThree="Priority access to new features" featureFour="Premium customer support with faster response times" />
                        </div>
                    </div>
                </div>
                <div ref={accordionRef} className={`${accordionView ? 'animate-opacity-translate-from-bottom-transition' : ''} col-span-1 lg:col-span-5 mt-16 lg:mt-40 flex justify-center`}>
                  <div className=" w-auto sm:w-4/5 lg:w-4/6">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="item-1">
                        <AccordionTrigger>Is there a free trial for the paid plans?</AccordionTrigger>
                        <AccordionContent>
                          Yes, all paid plans come with a 14-day free trial.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-2">
                        <AccordionTrigger>Can I switch plans later?</AccordionTrigger>
                        <AccordionContent>
                          Absolutely! You can upgrade or downgrade your plan at any time.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-3">
                        <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
                        <AccordionContent>
                          We accept major credit cards and offer secure payment processing.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="item-4">
                        <AccordionTrigger>Do you offer discounts for annual billing?</AccordionTrigger>
                        <AccordionContent>
                          Yes, save up to 20% when you choose annual billing.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>
            </div>
        </section>
    )
}

export default Pricing;