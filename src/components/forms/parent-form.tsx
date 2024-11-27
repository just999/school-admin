'use client';

import { createParent, updateParent } from '@/actions/parent-actions';
import { useZodForm } from '@/hooks/use-zod-form';

import { parentSchema, ParentSchema } from '@/schema/parent-schema';
import { useRouter } from 'next/navigation';
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import InputField from '../input-field';

type ParentFormProps = {
  type: 'create' | 'update';
  data?: any;
  setOpen: Dispatch<SetStateAction<boolean>>;
  relatedData: any;
};

interface ParentFormState {
  success: boolean;
  error: boolean;
  message?: string;
  fieldErrors?: {
    [key: string]: string[];
  };
}

const initialState: ParentFormState = {
  success: false,
  error: false,
  message: '',
  fieldErrors: {},
};

const ParentForm = ({ type, data, setOpen, relatedData }: ParentFormProps) => {
  const [img, setImg] = useState<any>();
  const [message, setMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useZodForm({
    schema: parentSchema,
    mode: 'onChange',
    defaultValues: data,
  });

  const router = useRouter();

  const parentAction = type === 'create' ? createParent : updateParent;

  const [state, formAction, isPending] = useActionState<
    ParentFormState,
    ParentSchema
  >(parentAction, initialState);
  useEffect(() => {
    if (state.success) {
      toast(`Parent has been ${type === 'create' ? 'created' : 'updated'}`);
      setOpen(false);

      router.refresh();
    }

    if (state.error) {
      toast.error(state.message || 'Something went wrong');
      setMessage(state.message || 'Error');

      // If you have field-specific errors, you can handle them here
      if (state.fieldErrors) {
        Object.entries(state.fieldErrors).forEach(([field, errors]) => {
          errors.forEach((error) => {
            toast.error(`${field}: ${error}`);
          });
        });
      }
    }
  }, [router, setOpen, state, type]);
  const onSubmit = (data: ParentSchema) => {
    if (data) {
      startTransition(() => formAction({ ...data }));
    } else {
      console.error('Form data is null or undefined');
    }
  };

  const { grades, classes } = relatedData;
  return (
    <form className='flex flex-col gap-8' onSubmit={handleSubmit(onSubmit)}>
      <h1 className='text-xl font-semibold'>
        {type === 'create' ? 'Create a new Parent' : 'Update Parent'}
      </h1>
      <span className='text-xs text-gray-400'>Authentication Information</span>
      {/* <div className='flex w-full flex-col gap-2 md:w-1/4'>
        <label htmlFor='username' className='text-xs'>
          Username
        </label>
        <input
          type='text'
          {...register('username')}
          className='w-full rounded-md p-2 text-sm ring-[1.5px] ring-gray-300'
        />
        {errors.username?.message && (
          <p className='text-xs text-red-400'>
            {errors.username?.message.toString()}
          </p>
        )}
      </div> */}
      <div className='flex flex-wrap justify-between gap-4'>
        <InputField
          type='text'
          register={register}
          label='username'
          name='username'
          error={errors?.username}
          defaultValue={data?.username}
        />
        <InputField
          type='email'
          register={register}
          label='Email'
          name='email'
          error={errors?.email}
          defaultValue={data?.email}
        />
        <InputField
          type='password'
          register={register}
          label='Password'
          name='password'
          error={errors?.password}
          defaultValue={data?.password}
        />
      </div>
      <span className='text-xs font-medium text-gray-400'>
        Personal Information
      </span>

      <div className='flex flex-wrap justify-between gap-4'>
        <InputField
          type='text'
          register={register}
          label='Name'
          name='name'
          error={errors?.name}
          defaultValue={data?.name}
        />
        <InputField
          type='text'
          register={register}
          label='Surname'
          name='surname'
          error={errors?.surname}
          defaultValue={data?.surname}
        />
        <InputField
          type='text'
          register={register}
          label='Phone'
          name='phone'
          error={errors?.phone}
          defaultValue={data?.phone}
        />
        <InputField
          type='text'
          register={register}
          label='Address'
          name='address'
          error={errors?.address}
          defaultValue={data?.address}
        />

        {data && (
          <InputField
            type='text'
            register={register}
            label='Id'
            name='id'
            error={errors?.id}
            defaultValue={data?.id}
            hidden
          />
        )}
      </div>

      {message && <span className='text-green-500'>{message}</span>}

      <button
        type='submit'
        disabled={isPending}
        className='rounded-md bg-blue-400 p-2 text-white'
      >
        {isPending && type === 'create'
          ? 'creating...'
          : isPending && type === 'update'
            ? 'updating...'
            : type === 'create'
              ? 'create parent'
              : 'update parent'}
      </button>

      {state.error && state.message && (
        <div className='mt-2 text-sm text-red-500'>{state.message}</div>
      )}
    </form>
  );
};

export default ParentForm;
