import React, { useState, useEffect } from "react";
import Image from "next/image";
import metadata from "../../lib/metadata.json";
import MintAnkyButton from "../MintAnkyButton";
import { useSwipeable } from "react-swipeable";
import { Button } from "react-bootstrap";
import { usePrivy } from "@privy-io/react-auth";

const CollectionPage = ({
  mintAnky,
  setDisplayFullScreenIndex,
  ethBalance,
  mintingError,
  loadingMintAnky,
}) => {
  const { authenticated, login } = usePrivy();
  const orderedMetadata = orderByIndex(metadata);

  function orderByIndex(arr) {
    return arr.sort((a, b) => a.index - b.index);
  }

  return (
    <div className="flex flex-col pt-4 pb-8">
      <p className="px-3 mb-2">
        These are only 30 of the 8888 characters of the Anky Genesis NFT
        collection.
      </p>
      <p className="px-3 mb-2">
        Each one of them has a unique story as part of the Ankyverse.
      </p>
      {authenticated ? (
        <div className="flex ">
          <MintAnkyButton
            mintAnky={mintAnky}
            loadingMintAnky={loadingMintAnky}
            ethBalance={ethBalance}
            mintingError={mintingError}
          />
          <div className=" px-4">
            <p className="">it is 0.01618, on eth mainnet</p>
            <p>only one per wallet</p>
          </div>
        </div>
      ) : (
        <div className="flex ml-4">
          <Button variant="outline-primary" onClick={login}>
            login to mint yours
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
        {orderedMetadata.map((anky, index) => (
          <div
            key={anky.index}
            className="aspect-square relative rounded-xl overflow-hidden border-2 border-black"
          >
            <button
              onClick={() => {
                console.log("in here, the anky is: ", anky);
                setDisplayFullScreenIndex({ ...anky, index });
              }}
              className="w-full h-full "
            >
              <Image
                src={`/images/${anky.index}.png`}
                alt={anky.name}
                layout="fill"
              />
            </button>
            <p className="text-xs text-center">{anky.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionPage;
