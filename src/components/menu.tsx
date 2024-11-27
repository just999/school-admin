import { menuItems } from '@/lib/helper';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';

type MenuProps = Record<string, unknown>;

const Menu = async () => {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  return (
    <div className='mt-4 text-sm'>
      {menuItems.map((item, i) => (
        <div key={item.title} className='flex flex-col gap-2'>
          <span className='my-4 hidden font-light text-gray-400 lg:block'>
            {item.title}
          </span>
          {item.items.map((menu, i) => {
            if (menu.visible.includes(role)) {
              return (
                <Link
                  href={menu.href}
                  key={menu.label}
                  className='flex items-center justify-center gap-4 rounded-md py-2 text-gray-500 hover:bg-babyBlueLight md:px-2 lg:justify-start'
                >
                  <Image src={menu.icon} alt='icon' width={20} height={20} />
                  <span className='hidden lg:block'>{menu.label}</span>
                </Link>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
};

export default Menu;
