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
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Aave is a decentralised non-custodial liquidity protocol where users
          can participate as suppliers or borrowers. Suppliers provide liquidity
          to the market while earning interest, and borrowers can access
          liquidity by providing collateral that exceeds the borrowed amount..
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>Is it fun?</AccordionTrigger>
        <AccordionContent>
          Aave is a decentralised non-custodial liquidity protocol where users
          can participate as suppliers or borrowers. Suppliers provide liquidity
          to the market while earning interest, and borrowers can access
          liquidity by providing collateral that exceeds the borrowed amount..
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger>Is it cool?</AccordionTrigger>
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
