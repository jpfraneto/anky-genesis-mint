import Head from "next/head";
import Link from "next/link";
import React from "react";

const LinksPage = () => {
  return (
    <>
      <Head>
        <title>Anky | Links</title>
      </Head>
      <div className="mt-4 flex flex-col items-center justify-center">
        <p className="mb-2">these are all the relevant links:</p>
        <div className="flex flex-col">
          <span>
            {" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 text-purple-600"
              href="https://wiki.anky.lat"
            >
              https://wiki.anky.lat (lore)
            </a>
          </span>

          <span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 text-purple-600"
              href="https://www.anky.lat"
            >
              https://www.anky.lat (writing app)
            </a>
          </span>
          <span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 text-purple-600"
              href="https://docs.google.com/document/d/1gyTjGKQx6vyBH5m4nG53SQDoBNZEUntCtUKpQ2GJygU/edit?usp=sharing"
            >
              Tokenomics Document (please contribute)
            </a>
          </span>
          <span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 text-purple-600"
              href="https://docs.google.com/spreadsheets/d/1SmOlqPNusWVTVau5Rq1C0-3GJS-KLPOsZbtELYkT-x0/edit#gid=560665020"
            >
              Budget Spreadsheet (please comment)
            </a>
          </span>
          <span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 text-purple-600"
              href="https://www.github.com/ankylat"
            >
              Github (all the code is open source)
            </a>
          </span>
          <span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 text-purple-600"
              href="https://opensea.io/collection/anky-genesis"
            >
              Opensea
            </a>
          </span>
          <span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-70 text-purple-600"
              href="https://etherscan.io/address/0x5806485215c8542c448ecf707ab6321b948cab90"
            >
              Etherscan
            </a>
          </span>
        </div>{" "}
      </div>
    </>
  );
};

export default LinksPage;
