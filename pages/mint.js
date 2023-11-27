import Image from 'next/image';
import { useState, useEffect, useMemo } from 'react';
import { useWallets, usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/router';
import { ethers, BigNumber } from 'ethers';
import MintedAnkyCard from '../components/MintedAnkyCard';
import ankyGenesisAbi from '../lib/anky_genesis_abi.json';

const MintPage = () => {
  const router = useRouter();
  const { authenticated, loading, login } = usePrivy();
  const [mintAmount, setMintAmount] = useState(1);
  const [contractHovered, setContractHovered] = useState(false);
  const [totalMinted, setTotalMinted] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [balance, setBalance] = useState(null);
  const [transactionLoading, setTransactionLoading] = useState(true);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [alreadyMinted, setAlreadyMinted] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [errorFromTransaction, setErrorFromTransaction] = useState(false);
  const [transactionSent, setTransactionSent] = useState(false);
  const [revealAnky, setRevealAnky] = useState(false);
  const [contract, setContract] = useState(null);
  const [mintedTokenId, setMintedTokenId] = useState('');
  const { wallets } = useWallets();
  const thisWallet = wallets[0];

  useEffect(() => {
    const loadSmartContract = async () => {
      if (thisWallet && thisWallet.address) {
        console.log('inside the load smart contract function');
        let provider = await thisWallet.getEthersProvider();
        console.log('the provider is: ', provider);
        let signer = await provider.getSigner();
        const ankyGenesisContract = new ethers.Contract(
          process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
          ankyGenesisAbi,
          signer
        );
        console.log('the anky genesis contract is: ', ankyGenesisContract);
        setContract(ankyGenesisContract);
      }
    };
    loadSmartContract();
  }, [thisWallet]);

  useEffect(() => {
    const checkIfMinted = async () => {
      console.log('inside the check if minted function');
      try {
        if (!contract || !thisWallet.address) return;
        const address = thisWallet.address;
        const hasBalance = await contract.balanceOf(address);
        console.log('has balance', hasBalance);
        const balance = ethers.utils.formatUnits(hasBalance, 0);

        if (balance > 0) {
          const data = await contract.tokenOfOwnerByIndex(address, 0);
          const tokenOfAddress = BigNumber.from(data._hex).toString();
          setAlreadyMinted(true);
          setMintedTokenId(tokenOfAddress);
        }
      } catch (error) {
        console.log('the error is: ', error);
      }
    };
    checkIfMinted();
  }, [thisWallet, contract]);

  async function mintAnky() {
    try {
      console.log('inside the mint anky function', contract);
      setErrorFromTransaction(false);
      setTransactionLoading(true);

      let provider = await thisWallet.getEthersProvider();
      console.log('the provider is: ', provider);
      let signer = await provider.getSigner();
      const ankyGenesisContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
        ankyGenesisAbi,
        signer
      );
      const price = await ethers.utils.parseEther('0.01618');
      setTransactionSent(true);
      console.log('the price is: ', price);
      const tx = await ankyGenesisContract.mint({ value: price });
      console.log('the tx response is: ', tx);

      const receipt = await tx.wait();
      setTransactionLoading(false);

      setTransactionSuccess(true);
    } catch (error) {
      console.log('there was an error', error);
      setTransactionLoading(false);
      setErrorFromTransaction(true);
    }
  }

  if (loading)
    return (
      <div className='h-full text-gray-300 w-full flex flex-col justify-center items-center pt-20'>
        <div className='flex flex-col items-center justify-center'>
          <p className='mb-3 text-2xl'>This setup is loading...</p>
          <small className='italic text-sm'>
            “Do you have the patience to wait until your mud settles and the
            water is clear?” ~ Lao Tzu
          </small>
        </div>
      </div>
    );

  if (!authenticated)
    return (
      <div className='h-full text-gray-300 w-full flex flex-col justify-center items-center pt-20'>
        <div className='flex flex-col items-center justify-center'>
          <p className='mb-3 text-2xl'>
            Please connect your wallet to proceed.
          </p>
          <button onClick={login}>login</button>
        </div>
      </div>
    );

  if (!contract)
    return (
      <div className='h-full text-gray-300 w-full flex flex-col justify-center items-center pt-20'>
        <div className='flex flex-col items-center justify-center'>
          <p className='mb-3'>
            The ankyverse is experiencing some technical difficulties, please
            refresh this page.
          </p>
        </div>
      </div>
    );

  return (
    <div className='h-full text-gray-300 w-full flex flex-col justify-center items-center pt-20'>
      {/* <div className='flex  mt-20 mb-2 space-x-2 justify-center text-2xl'>
        <button
          onClick={() =>
            setMintAmount(x => {
              if (x === 1) return x;
              return x - 1;
            })
          }
        >
          -
        </button>
        <p>{mintAmount}</p>
        <button
          onClick={() =>
            setMintAmount(x => {
              if (x === 8) return x;
              return x + 1;
            })
          }
        >
          +
        </button>
      </div> */}
      <div className='flex flex-col space-y-2'>
        {thisWallet.address ? (
          <div>
            {alreadyMinted ? (
              <div className='flex justify-center flex-col items-center'>
                <p>You already minted. This is your Anky:</p>
                {mintedTokenId && <MintedAnkyCard tokenId={mintedTokenId} />}
              </div>
            ) : (
              <div>
                {transactionSent ? (
                  <div>
                    {transactionLoading ? (
                      <div className='flex flex-col space-y-4 items-center justify-center'>
                        <div className='rounded-full glowing mb-4 overflow-hidden shadow-lg border-4 border-thewhite'>
                          <Image
                            src='/images/anky.png'
                            width={333}
                            height={333}
                            className=''
                            alt='Anky'
                          />
                        </div>
                        <p>Your transaction is loading...</p>
                        <small className='italic'>
                          “Be patient. Everything comes to you in the right
                          moment.”
                        </small>
                      </div>
                    ) : (
                      <div>
                        {transactionSuccess || !errorFromTransaction ? (
                          <div>
                            {revealAnky ? (
                              <MintedAnkyCard tokenId={mintedTokenId} />
                            ) : (
                              <div>
                                <p>
                                  This was successful, and you now own an anky.
                                </p>
                                <p>It is on your wallet.</p>
                                <button
                                  className='px-2 py-1 mt-4 rounded-lg w-48 text-black bg-green-500 hover:opacity-70'
                                  onClick={() => setRevealAnky(true)}
                                >
                                  Reveal My Anky
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <p>
                              There was an error in the transaction. I&apos;m
                              really sorry.
                            </p>
                            <p className='my-2'>Please double check:</p>
                            <p>
                              - That your wallet&apos;s active network is the
                              Ethereum Mainnet.
                            </p>
                            <p>
                              - That you have at least 0.01618 eth plus a bit
                              more for gas.
                            </p>
                            <p>
                              - That you haven&apos;t already minted an Anky.
                            </p>
                            <p>
                              - That you didn&apos;t revert the transaction.
                            </p>
                            <p>
                              - If the issue persists, please DM me on twitter
                              at @kithkui.
                            </p>

                            <button
                              onClick={() => {
                                setTransactionSent(false);
                              }}
                              className='px-2 py-1 mt-4 rounded-lg w-48 text-black bg-green-500 hover:opacity-70'
                            >
                              Retry
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className='flex flex-col items-center justify-center'>
                    <div className='w-fit rounded-full mb-4 overflow-hidden shadow-lg border-4 border-thewhite'>
                      <Image
                        src='/images/anky.png'
                        width={333}
                        height={333}
                        className=''
                        alt='Anky'
                      />
                    </div>
                    <div className='flex flex-col  items-center space-x-2 mt-4 justify-center'>
                      <button
                        className='px-2 py-1 rounded-lg w-48 text-black bg-green-500 hover:opacity-70'
                        onClick={mintAnky}
                      >
                        mint 1 anky <br />
                      </button>
                      <div className='mt-3 text-gray-400'>
                        <p className=''>
                          This transaction will take place on the Ethereum
                          Mainnet.
                        </p>
                        <p className=''>
                          The cost of the Anky Genesis NFT is 0.01618 eth.
                        </p>
                        <p className='relative'>
                          You are interacting with the following contract:{' '}
                          <a
                            target='_blank'
                            onMouseEnter={() => setContractHovered(true)}
                            onMouseLeave={() => setContractHovered(false)}
                            rel='noopener noreferrer'
                            className='hover:opacity-70 text-gray-400 w-124'
                            href='https://etherscan.io/address/0x5806485215C8542C448EcF707aB6321b948cAb90'
                          >
                            0x5806485215C8542C448EcF707aB6321b948cAb90
                          </a>
                          {contractHovered && (
                            <span className='absolute fadeIn text-gray-600 -top-4 right-0'>
                              click to open in etherscan
                            </span>
                          )}
                        </p>
                        <p className=''>
                          PLEASE triple check all this information when signing
                          the transaction.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center'>
            <p className='mb-3'>Please login to proceed.</p>
            <button onClick={login}>login</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MintPage;
