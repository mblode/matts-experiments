import { MultiStageSheet } from "@/components/ui/multi-stage-sheet";
import { Button } from "../ui/button";

export const SheetBlock = () => {
  return (
    <div className="my-4">
      <MultiStageSheet
        trigger={
          <Button className="w-full">Open Multi-Stage Sheet</Button>
        }
      />
    </div>
  );
};
