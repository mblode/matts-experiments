import { Card } from "./card";
import { items } from "./data";

interface Props {
  setSelectedId: (id: string | null) => void;
}

export const List = ({ setSelectedId }: Props) => {
  return (
    <ul className="mx-auto grid w-full max-w-2xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:px-8">
      {items.map((card, _index) => {
        return <Card key={card.id} {...card} setSelectedId={setSelectedId} />;
      })}
    </ul>
  );
};
