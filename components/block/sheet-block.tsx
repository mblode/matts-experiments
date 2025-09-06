import { MultiStageSheet } from "@/components/ui/multi-stage-sheet";
import { Button } from "../ui/button";

export const SheetBlock = () => {
  return (
    <div className="my-4">
      <MultiStageSheet trigger={<Button>Open multi-stage sheet</Button>} />
    </div>
  );
};
