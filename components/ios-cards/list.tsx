import { items } from "./data";
import { Card } from "./card";

type Props = {
  setSelectedId: (id: string | null) => void;
};

export const List = ({ setSelectedId }: Props) => {
  return (
    <ul className="max-w-2xl mx-auto w-full gap-4">
      {items.map((card, index) => {
        return <Card key={card.id} {...card} setSelectedId={setSelectedId} />;
      })}
    </ul>
  );
};
