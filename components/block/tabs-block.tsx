"use client";

import * as React from "react";
import { Wallet, BarChart3, Users, Receipt } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function TabsClipPath() {
  return (
    <div className="w-full max-w-2xl mx-auto pt-16">
      <Tabs defaultValue="payments" className="w-full">
        <TabsList variant="clip-path" floatingBgClassName="bg-blue-500">
          {TABS.map((tab) => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value}
              className="flex items-center gap-2 rounded-full px-4"
            >
              {tab.icon}
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mt-6 text-center">
            <p className="text-gray-600">Content for {tab.name}</p>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

const TABS = [
  {
    name: "Payments",
    value: "payments",
    icon: <Wallet className="w-4 h-4" />,
  },
  {
    name: "Balances", 
    value: "balances",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    name: "Customers",
    value: "customers",
    icon: <Users className="w-4 h-4" />,
  },
  {
    name: "Billing",
    value: "billing",
    icon: <Receipt className="w-4 h-4" />,
  },
];