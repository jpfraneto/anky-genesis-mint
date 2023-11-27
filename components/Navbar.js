import React from 'react';
import Link from 'next/link';
import { GiSoundOn, GiSoundOff } from 'react-icons/gi';
import { usePrivy } from '@privy-io/react-auth';

const Navbar = ({ musicVolume, changeVolumeGradually }) => {
  const { login, authenticated, loading, logout } = usePrivy();
  return (
    <div className=' w-full text-gray-400 h-12 py-8  px-2 md:px-32 md:flex justify-between items-center'>
      <div className='flex space-x-2 md:space-x-5 justify-between w-full items-center'>
        <div className='flex space-x-2'>
          <Link href='/' passHref>
            <h2 className='text-bold text-2xl hover:text-white'>Anky</h2>
          </Link>
          <button
            onClick={() => {
              if (musicVolume === 0)
                return changeVolumeGradually(0, 1.0, 0, 50);
              changeVolumeGradually(1.0, 0, -0.01, 50);
            }}
          >
            {musicVolume === 0 ? (
              <GiSoundOff className='hover:text-white' size={30} />
            ) : (
              <GiSoundOn className='hover:text-white' size={30} />
            )}
          </button>
        </div>
        <div className='flex space-x-8'>
          <Link href='/wiki' className='hover:text-white '>
            Wiki
          </Link>

          <Link href='/games' className='hover:text-white '>
            Games
          </Link>
        </div>
        <div>
          {authenticated ? (
            <button onClick={logout}>logout</button>
          ) : (
            <button onClick={login}>login</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
