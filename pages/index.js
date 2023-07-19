import { useState, useEffect } from 'react';
import Image from 'next/image';
import YoutubeIframe from '../components/YoutubeIframe';
import { useRouter } from 'next/router';
import {
  BsInstagram,
  BsWhatsapp,
  BsTiktok,
  BsYoutube,
  BsTwitter,
  BsTelegram,
} from 'react-icons/bs';
import { BiLogoTelegram } from 'react-icons/bi';
import { SiSubstack } from 'react-icons/si';

export default function Home(props) {
  const { onVideoPlay, onVideoStop } = props;
  const router = useRouter();
  const [socialsForDisplay, setSocialsForDisplay] = useState(false);
  const [socialsLink, setSocialsLink] = useState('');
  const [countdown, setCountdown] = useState(`Xd Yh Xm Bs`);
  const [handleMintLink, setHandleMintLink] = useState(false);
  const [handleWikiLink, setHandleWikiLink] = useState(false);
  const videoId = 'A4WPgKdSp1c';

  const socials = social => {
    switch (social) {
      case 'instagram':
        return setSocialsLink('https://www.instagram.com/papasiendopapa');
      case 'tiktok':
        return setSocialsLink('https://www.tiktok.com/@kithkui');
      case 'whatsapp':
        return setSocialsLink('https://wa.me/56985491126');
      case 'youtube':
        return setSocialsLink(
          'https://www.youtube.com/channel/UCsO2sX4NjuIOy8Yx0m5n02w'
        );
      case 'twitter':
        return setSocialsLink('https://www.twitter.com/kithkui');
      case 'substack':
        return setSocialsLink('https://jpfraneto.substack.com');
      case 'telegram':
        return setSocialsLink('https://t.me/jpfraneto');
    }
  };

  useEffect(() => {
    const countdownDate = new Date('July 18, 2023 11:11:00 EST').getTime();

    const updateCountdown = setInterval(() => {
      const now = new Date().getTime();
      const distance = countdownDate - now;

      if (distance < 0) {
        clearInterval(updateCountdown);
        setCountdown('Minting has started!');
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => {
      clearInterval(updateCountdown);
    };
  }, []);

  return (
    <div className='flex flex-col justify-center text-gray-400 w-screen pb-8'>
      <div className='h-screen flex flex-col items-center pt-32 px-3 md:w-1/2 mx-auto '>
        <h1 className='text-5xl font-bold mb-8 '>who am i ?</h1>
        <p className='text-gray-400 text-xl mb-4'>
          Anky is a brand distilled from the eternal exploration into this
          inquiry. It all starts from the story of an ape that is depressed.
        </p>

        <div className='flex space-x-8'>
          <button
            onMouseEnter={() => setHandleMintLink(true)}
            onMouseLeave={() => setHandleMintLink(false)}
            onClick={() => router.push('/mint')}
            className=' w-28 text-2xl py-2 rounded-xl border-white border  hover:bg-gray-300 hover:text-black'
          >
            {handleMintLink ? '/mint' : 'mint'}
          </button>

          {/* <button
            onMouseEnter={() => setHandleWikiLink(true)}
            onMouseLeave={() => setHandleWikiLink(false)}
            onClick={() => router.push('/wiki')}
            className='w-28 py-2 text-2xl rounded-xl border-white border  hover:bg-gray-300 hover:text-black'
          >
            {handleWikiLink ? '/wiki' : 'wiki'}
          </button> */}
        </div>
        <small className='mt-4'>TL;DR: One mint per wallet, 0.01618 eth.</small>
        <div className=' flex flex-col justify-center items-center'>
          <p className='mt-24 md:mt-48 mb-2'></p>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='18'
            height='35'
            viewBox='0 0 18 35'
            fill='none'
          >
            <link
              xmlns=''
              type='text/css'
              rel='stylesheet'
              id='dark-mode-custom-link'
            />
            <link
              xmlns=''
              type='text/css'
              rel='stylesheet'
              id='dark-mode-general-link'
            />
            <style
              xmlns=''
              lang='en'
              type='text/css'
              id='dark-mode-custom-style'
            />
            <style
              xmlns=''
              lang='en'
              type='text/css'
              id='dark-mode-native-style'
            />
            <style
              xmlns=''
              lang='en'
              type='text/css'
              id='dark-mode-native-sheet'
            />
            <g clip-path='url(#clip0)'>
              <path
                d='M8.49967 0.699902C7.49967 11.7999 7.49967 22.9999 8.59967 34.1999C8.69967 35.1999 10.1997 35.1999 10.0997 34.1999C8.99967 23.0999 8.89967 11.8999 9.99967 0.699902C10.0997 -0.200098 8.59967 -0.200098 8.49967 0.699902Z'
                fill='gray'
              />
              <path
                d='M0.199957 27.8998C2.69996 29.9998 5.09996 32.2998 7.59996 34.2998C8.59996 35.0998 9.69996 35.2998 10.8 34.5998C11.4 34.1998 11.9 33.5998 12.3 32.9998C13.1 31.5998 13.5 29.7998 13.9 28.1998C14.4 26.2998 14.7 24.3998 15.2 22.4998C15.6 20.9998 15.9 19.0998 17.1 17.9998C17.8 17.2998 16.7 16.2998 16 16.8998C15.1 17.7998 14.6 19.0998 14.2 20.2998C13.7 21.8998 13.3 23.5998 13 25.2998C12.6 26.9998 12.3 28.6998 11.7 30.3998C11.5 30.9998 11.3 31.5998 10.9 32.1998C10.5 32.7998 9.79996 33.6998 8.99996 33.3998C8.29996 33.0998 7.69996 32.3998 7.19996 31.8998C6.59996 31.3998 5.89996 30.7998 5.29996 30.2998C3.89996 29.0998 2.59996 27.9998 1.19996 26.7998C0.599957 26.2998 -0.500043 27.2998 0.199957 27.8998Z'
                fill='gray'
              />
            </g>
            <defs>
              <clipPath id='clip0'>
                <rect width='17.3' height='35' fill='white' />
              </clipPath>
            </defs>
          </svg>
        </div>
      </div>
      <div className='h-screen px-4 flex flex-col items-center pt-16 md:w-1/2 mx-auto '>
        <h1 className='text-3xl md:text-5xl font-bold mb-8 '>
          i&apos;m jp. this is my truth
        </h1>
        <YoutubeIframe
          videoId='8l36xDYaTtE'
          autoPlay={false}
          title='this is my truth'
          onVideoPlay={onVideoPlay}
          onVideoStop={onVideoStop}
        />

        <small className='mt-4'>
          i wrote a 1300 page manuscript about this stuff. the mission runs
          through my veins.
        </small>
        <a
          href='https://www.dukkha.xyz'
          target='_blank'
          rel='noopener noreferrer'
          className='text-xs hover:text-blue-300 hover:cursor-pointer'
        >
          click here to read it (this link will take you to
          https://www.dukkha.xyz)
        </a>
      </div>
      <div className=' flex flex-col items-center pt-16  mx-auto '>
        <h1 className='text-3xl md:text-5xl font-bold mb-8 '>
          enter the ankyverse
        </h1>
        <p className='w-4/5 text-gray-400 text-xl text-center'>
          we are wired for stories, and anky is the protagonist in this one.
        </p>
        <p className='w-4/5 text-gray-400 text-xl mb-16 text-center'>
          anky is you.
        </p>
        <div className='flex flex-col m-2 space-x-2 md:flex-row w-full flex-wrap items-center justify-center'>
          {[1, 2, 3, 4].map((x, i) => (
            <div key={i} className=' relative w-64 aspect-square '>
              <Image src={`/images/${x}.png`} fill alt={`Anky number ${x}}`} />
            </div>
          ))}
        </div>
        <button
          onMouseEnter={() => setHandleMintLink(true)}
          onMouseLeave={() => setHandleMintLink(false)}
          onClick={() => router.push('/mint')}
          className=' w-28 mt-4 md:mt-8 mb-8 text-2xl py-2 rounded-xl border-white border  hover:bg-gray-300 hover:text-black'
        >
          {handleMintLink ? '/mint' : 'mint'}
        </button>
      </div>
      <div className='px-3 md:w-10/12 mx-auto mb-4'>
        <hr className='h-px my-4 bg-gray-200 border-0 dark:bg-gray-700' />
        <small className='mt-4'>
          This project is built with a fundamental belief in mind: Perfection is
          the enemy of evolution. I have made mistakes. There are things that
          don&apos;t look as good as they could. And it is alright, you know? It
          is all good. I tried my best. Every day. And I rest in that. And I
          will keep doing it, until I die. The fire is just too hot.
        </small>
        <hr className='h-px mt-4 mb-8 bg-gray-200 border-0 dark:bg-gray-700' />
        <div className='flex justify-center space-x-4 mt-4'>
          <a
            target='_blank'
            onMouseEnter={() => {
              socials('instagram');
              setSocialsForDisplay(true);
            }}
            onMouseLeave={() => {
              setSocialsForDisplay(false);
            }}
            rel='noopener noreferrer'
            className='hover:opacity-70 text-gray-400'
            href='https://www.instagram.com/papasiendopapa'
          >
            <BsInstagram size={40} />
          </a>
          <a
            target='_blank'
            onMouseEnter={() => {
              socials('whatsapp');
              setSocialsForDisplay(true);
            }}
            onMouseLeave={() => {
              setSocialsForDisplay(false);
            }}
            rel='noopener noreferrer'
            className='hover:opacity-70 text-gray-400'
            href='https://wa.me/56985491126'
          >
            <BsWhatsapp size={40} />
          </a>
          <a
            target='_blank'
            onMouseEnter={() => {
              socials('telegram');
              setSocialsForDisplay(true);
            }}
            onMouseLeave={() => {
              setSocialsForDisplay(false);
            }}
            rel='noopener noreferrer'
            className='hover:opacity-70 text-gray-400'
            href='https://t.me/jpfraneto'
          >
            <BiLogoTelegram size={40} />
          </a>
          <a
            target='_blank'
            onMouseEnter={() => {
              socials('youtube');
              setSocialsForDisplay(true);
            }}
            onMouseLeave={() => {
              setSocialsForDisplay(false);
            }}
            rel='noopener noreferrer'
            className='hover:opacity-70 text-gray-400'
            href='https://www.youtube.com/channel/UCsO2sX4NjuIOy8Yx0m5n02w'
          >
            <BsYoutube size={40} />
          </a>
          <a
            target='_blank'
            onMouseEnter={() => {
              socials('twitter');
              setSocialsForDisplay(true);
            }}
            onMouseLeave={() => {
              setSocialsForDisplay(false);
            }}
            rel='noopener noreferrer'
            className='hover:opacity-70 text-gray-400'
            href='https://www.twitter.com/kithkui'
          >
            <BsTwitter size={40} />
          </a>
          <a
            target='_blank'
            rel='noopener noreferrer'
            onMouseEnter={() => {
              socials('tiktok');
              setSocialsForDisplay(true);
            }}
            onMouseLeave={() => {
              setSocialsForDisplay(false);
            }}
            className='hover:opacity-70 text-gray-400'
            href='https://www.tiktok.com/@kithkui'
          >
            <BsTiktok size={40} />
          </a>
          <a
            target='_blank'
            onMouseEnter={() => {
              socials('substack');
              setSocialsForDisplay(true);
            }}
            onMouseLeave={() => {
              setSocialsForDisplay(false);
            }}
            rel='noopener noreferrer'
            className='hover:opacity-70 text-gray-400'
            href='https://jpfraneto.substack.com'
          >
            <SiSubstack size={40} />
          </a>
        </div>
        {setSocialsForDisplay && (
          <p className='text-center mt-4 text-grey-400'>{socialsLink}</p>
        )}
      </div>

      {/* <p className='text-4xl mt-4 text-purple-500'>{countdown}</p>
      <div className='flex mt-4 space-x-2'>
        {[1, 2, 3, 4].map((x, i) => {
          return (
            <div key={i} className='rounded-xl overflow-hidden'>
              <Image src={`/images/${x}.png`} width={222} height={222} />
            </div>
          );
        })}
      </div> */}
    </div>
  );
}
