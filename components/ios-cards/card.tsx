import { motion } from "framer-motion";

type Props = {
  id: string;
  title: string;
  category: string;
  backgroundColor: string;
  setSelectedId: (id: string | null) => void;
};

export const Card = ({
  id,
  title,
  category,
  backgroundColor,
  setSelectedId,
}: Props) => {
  return (
    <li className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-card rounded-xl cursor-pointer h-[420px]">
      <div
        className="w-full h-full relative block cursor-pointer"
        onClick={() => setSelectedId(id)}
      >
        <motion.div
          className="relative rounded-[20px] bg-ios-card-bg overflow-hidden w-full h-full"
          layoutId={`card-container-${id}`}
        >
          <motion.div
            className="absolute top-0 left-0 overflow-hidden h-[420px] w-full"
            layoutId={`card-image-container-${id}`}
          >
            <img
              src={`https://placehold.co/800x600/${backgroundColor.slice(
                1,
              )}/ffffff`}
              alt={title}
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute top-4 left-4 max-w-[300px]"
            layoutId={`title-container-${id}`}
          >
            <span className="text-white text-sm uppercase">{category}</span>
            <h2 className="text-white my-2 text-xl font-semibold">{title}</h2>
          </motion.div>
        </motion.div>
      </div>
    </li>
  );
};
