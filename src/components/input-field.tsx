'use client';

import { FieldError, FieldValues, UseFormRegister } from 'react-hook-form';

type InputFieldProps = {
  label: string;
  type?: string;
  name: string;
  register: UseFormRegister<FieldValues> | any;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  hidden?: boolean;
  checked?: boolean;
};

const InputField = ({
  label,
  type,
  name,
  register,
  defaultValue,
  error,
  inputProps,
  hidden,
  checked,
}: InputFieldProps) => {
  return (
    <div className={hidden ? 'hidden' : 'flex w-full flex-col gap-2 md:w-1/4'}>
      <label htmlFor='username' className='text-xs'>
        {label}
      </label>
      <input
        type={type}
        checked={checked}
        {...register(name)}
        className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
        {...inputProps}
        defaultValue={defaultValue}
      />
      {error?.message && (
        <p className='text-xs text-red-400'>{error?.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
