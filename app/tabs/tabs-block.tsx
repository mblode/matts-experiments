"use client";

import * as React from "react";
import { Wallet, BarChart3, Users, Receipt } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const TabsBlock = () => {
  return (
    <div className="w-full mx-auto">
      <Tabs defaultValue="payments" className="w-full">
        <div className="w-full overflow-x-auto">
          <TabsList
            variant="clip-path"
            floatingBgClassName="bg-blue-500"
            className="w-full"
          >
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 rounded-full px-4 flex-shrink-0"
              >
                {tab.icon}
                <span>{tab.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {TABS.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="mt-6 text-center border border-border rounded-3xl py-8"
          >
            <p className="text-gray-600">Content for {tab.name}</p>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

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
