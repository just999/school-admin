import Image from 'next/image';
import Link from 'next/link';

import Menu from '../../components/menu';
import Navbar from '../../components/navbar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='flex h-screen text-black'>
      <div className='w-[14%] bg-gray-100 p-4 md:w-[8%] lg:w-[16%] xl:w-[16%]'>
        <Link
          href='/'
          className='flex items-center justify-center gap-2 lg:justify-start'
        >
          <Image src='/logo.svg' alt='logo' width={32} height={32} />{' '}
          <span className='hidden font-bold lg:block'>School</span>
        </Link>
        <Menu />
      </div>
      <div className='flex w-[86%] flex-col overflow-scroll bg-[#f7f8fa] md:w-[92%] lg:w-[84%] xl:w-[84%]'>
        <Navbar />
        {children}
      </div>
    </div>
  );
}
