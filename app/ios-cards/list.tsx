import { items } from "./data";
import { Card } from "./card";

type Props = {
  setSelectedId: (id: string | null) => void;
};

export const List = ({ setSelectedId }: Props) => {
  return (
    <ul className="max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((card, index) => {
        return <Card key={card.id} {...card} setSelectedId={setSelectedId} />;
      })}
    </ul>
  );
};
