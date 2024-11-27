import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';

type NavbarProps = Record<string, unknown>;

const Navbar = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  // const newObjectId = new ObjectId();
  return (
    <div className='flex items-center justify-between p-4'>
      <div className='hidden items-center gap-2 rounded-full px-2 text-xs ring-[1.5px] ring-gray-300 md:flex'>
        <Image src='/icons/search.png' alt='search' width={14} height={14} />
        <input
          type='text'
          placeholder='search...'
          className='w-[200px] bg-transparent p-2 outline-none'
        />
      </div>
      <div className='flex w-full items-center justify-end gap-6'>
        <div className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white'>
          <Image
            src='/icons/message.png'
            alt='messages'
            width={20}
            height={20}
          />
        </div>
        <div className='relative flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-white'>
          <Image
            src='/icons/announcement.png'
            alt='messages'
            width={20}
            height={20}
          />
          <div className='absolute -right-3 -top-3 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-sm text-white'>
            1
          </div>
        </div>
        <div className='flex flex-col'>
          <span className='text-xs font-medium leading-3'>
            {user?.username}
          </span>
          <span className='text-right text-[10px] text-gray-500'>{role}</span>
        </div>
        {/* <Image
          src='/icons/avatar.png'
          alt='avatar'
          width={36}
          height={36}
          className='rounded-full'
        /> */}
        <UserButton />
      </div>
    </div>
  );
};

export default Navbar;
