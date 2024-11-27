export interface ButtonProps {
  label: string;
}

/** Primary UI component for user interaction */
export default function Button({ label }: ButtonProps) {
  return (
    <button type='button' className='bg-blue-800 px-5 py-2 text-2xl text-white'>
      {label}
    </button>
  );
}
