import { motion } from "motion/react";

interface Props {
  id: string;
  title: string;
  category: string;
  backgroundColor: string;
  imageUrl: string;
  setSelectedId: (id: string | null) => void;
}

export const Card = ({
  id,
  title,
  category,
  backgroundColor: _backgroundColor,
  imageUrl,
  setSelectedId,
}: Props) => {
  return (
    <li className="flex h-[300px] cursor-pointer flex-col items-center justify-between rounded-xl transition-colors hover:bg-card/5 sm:h-[420px]">
      <div
        className="relative block h-full w-full cursor-pointer"
        onClick={() => setSelectedId(id)}
      >
        <motion.div
          className="relative h-full w-full overflow-hidden rounded-[20px] bg-ios-card-bg"
          layoutId={`card-container-${id}`}
        >
          <motion.div
            className="absolute top-0 left-0 h-full w-full overflow-hidden"
            layoutId={`card-image-container-${id}`}
          >
            <img
              alt={title}
              className="h-full w-full object-cover"
              height={400}
              src={imageUrl}
              width={600}
            />
          </motion.div>

          <motion.div
            className="absolute top-3 left-3 max-w-[250px] sm:top-4 sm:left-4 sm:max-w-[300px]"
            layoutId={`title-container-${id}`}
          >
            <span className="text-white text-xs uppercase sm:text-sm">
              {category}
            </span>
            <h2 className="my-1 font-semibold text-lg text-white sm:my-2 sm:text-xl">
              {title}
            </h2>
          </motion.div>
        </motion.div>
      </div>
    </li>
  );
};
