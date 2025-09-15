import { motion } from "motion/react";

type Props = {
  id: string;
  title: string;
  category: string;
  backgroundColor: string;
  imageUrl: string;
  setSelectedId: (id: string | null) => void;
};

export const Card = ({
  id,
  title,
  category,
  backgroundColor,
  imageUrl,
  setSelectedId,
}: Props) => {
  return (
    <li className="flex flex-col justify-between items-center hover:bg-card/5 rounded-xl cursor-pointer h-[300px] sm:h-[420px] transition-colors">
      <div
        className="w-full h-full relative block cursor-pointer"
        onClick={() => setSelectedId(id)}
      >
        <motion.div
          className="relative rounded-[20px] bg-ios-card-bg overflow-hidden w-full h-full"
          layoutId={`card-container-${id}`}
        >
          <motion.div
            className="absolute top-0 left-0 overflow-hidden h-full w-full"
            layoutId={`card-image-container-${id}`}
          >
            <img
              src={imageUrl}
              alt={title}
              width={600}
              height={400}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            className="absolute top-3 sm:top-4 left-3 sm:left-4 max-w-[250px] sm:max-w-[300px]"
            layoutId={`title-container-${id}`}
          >
            <span className="text-white text-xs sm:text-sm uppercase">
              {category}
            </span>
            <h2 className="text-white my-1 sm:my-2 text-lg sm:text-xl font-semibold">
              {title}
            </h2>
          </motion.div>
        </motion.div>
      </div>
    </li>
  );
};
