import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCallback } from "react";

export const PromiseBlock = () => {
  const handleClick = useCallback(() => {
    const promise = () =>
      new Promise((resolve, reject) => {
        setTimeout(() => {
          // Randomly succeed or fail for testing
          if (Math.random() > 0.5) {
            resolve({ name: "Sonner" });
          } else {
            reject(new Error("Something went wrong"));
          }
        }, 2000);
      });

    toast.promise(promise, {
      loading: "Loading...",
      success: (data: { name: string }) => {
        return `${data.name} toast has been added`;
      },
      error: "Error",
    });
  }, []);

  return (
    <div>
      <Button onClick={handleClick}>Click me</Button>
    </div>
  );
};
