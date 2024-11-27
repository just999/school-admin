'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

type TableSearchProps = {};

const TableSearch = () => {
  const router = useRouter();

  const { register, handleSubmit } = useForm();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = (e.currentTarget[0] as HTMLInputElement).value;
    const params = new URLSearchParams(window.location.search);
    params.set('search', value);
    router.push(`${window.location.pathname}?${params}`);
  };
  return (
    <form
      onSubmit={onSubmit}
      className='flex w-full items-center gap-2 rounded-full px-2 text-xs ring-[1.5px] ring-gray-300 md:w-auto'
    >
      <Image src='/icons/search.png' alt='search' width={14} height={14} />
      <input
        type='text'
        {...register('search')}
        placeholder='search...'
        className='w-[200px] bg-transparent p-2 outline-none'
      />
    </form>
  );
};

export default TableSearch;
