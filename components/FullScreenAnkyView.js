import React from "react";
import Image from "next/image";
import { useSwipeable } from "react-swipeable";

const FullScreenAnkyView = ({ anky, onClose, onNext, onPrevious }) => {
  const handlers = useSwipeable({
    onSwipedLeft: onNext,
    onSwipedRight: onPrevious,
  });

  return (
    <div
      {...handlers}
      className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-black p-2 overflow-y-auto"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-4xl leading-none z-50"
      >
        &times;
      </button>
      <div className="relative p-4 w-full aspect-square md:w-96">
        <Image
          src={`/images/${anky.index}.png`}
          alt={anky.name}
          layout="fill"
        />
      </div>
      <p className="text-white">{anky.name}</p>
    </div>
  );
};

export default FullScreenAnkyView;
