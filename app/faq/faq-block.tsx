import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FaqBlock = () => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <span className="text-lg font-bold">Is it accessible?</span>
        </AccordionTrigger>
        <AccordionContent>
          Aave is a decentralised non-custodial liquidity protocol where users
          can participate as suppliers or borrowers. Suppliers provide liquidity
          to the market while earning interest, and borrowers can access
          liquidity by providing collateral that exceeds the borrowed amount..
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>
          <span className="text-lg font-bold">Is it fun?</span>
        </AccordionTrigger>
        <AccordionContent>
          Aave is a decentralised non-custodial liquidity protocol where users
          can participate as suppliers or borrowers. Suppliers provide liquidity
          to the market while earning interest, and borrowers can access
          liquidity by providing collateral that exceeds the borrowed amount..
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger>
          <span className="text-lg font-bold">Is it cool?</span>
        </AccordionTrigger>
        <AccordionContent>
          Aave is a decentralised non-custodial liquidity protocol where users
          can participate as suppliers or borrowers. Suppliers provide liquidity
          to the market while earning interest, and borrowers can access
          liquidity by providing collateral that exceeds the borrowed amount..
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
