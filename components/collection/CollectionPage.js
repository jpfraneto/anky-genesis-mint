import React, { useState } from "react";
import Image from "next/image";
import metadata from "../../lib/metadata.json";
import MintAnkyButton from "../MintAnkyButton";

const CollectionPage = ({ setDisplayFullScreen, ethBalance }) => {
  console.log("the metadata is: ", metadata);
  function orderByIndex(arr) {
    return arr.sort((a, b) => a.index - b.index);
  }
  const orderedMetadata = orderByIndex(metadata);

  return (
    <div className="flex flex-col pt-4 pb-8">
      <p className="px-3 mb-2">
        These are 30 of the 8888 characters of the Anky Genesis NFT collection.
      </p>
      <p className="px-3 mb-2">
        Each one of them was uniquely generated using midjourney and has its
        unique lore.
      </p>
      <div className="flex ">
        <MintAnkyButton ethBalance={ethBalance} />
        <div className=" px-4">
          <p className="">it is 0.01618, on eth mainnet</p>
          <p>only one per wallet</p>
        </div>
      </div>

      <div className="flex flex-wrap px-2 relative">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((x, i) => {
          return (
            <ImageComponent
              setDisplayFullScreen={setDisplayFullScreen}
              thisAnky={x}
              key={i}
              name={orderedMetadata[i].name}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CollectionPage;

const ImageComponent = ({ thisAnky, setDisplayFullScreen, name }) => {
  const ankyElement = { number: thisAnky, name };
  return (
    <div
      onClick={() => setDisplayFullScreen(ankyElement)}
      className="w-1/3 p-0.5 aspect-square relative"
    >
      <div className="relative w-full aspect-square p-1 ">
        <Image src={`/images/${thisAnky}.png`} fill />
      </div>
      <p className="text-xs pl-1 text-center md:text-2xl">{name}</p>
    </div>
  );
};
