import { Button } from "@/components/ui/button";
import { MultiStageSheet } from "@/components/ui/multi-stage-sheet";

export const SheetBlock = () => {
  return (
    <div className="my-4">
      <MultiStageSheet trigger={<Button>Open multi-stage sheet</Button>} />
    </div>
  );
};
