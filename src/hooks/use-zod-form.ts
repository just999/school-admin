import { zodResolver } from '@hookform/resolvers/zod';
import { UseFormProps, useForm } from 'react-hook-form';
import { z } from 'zod';

export function useZodForm<TSchema extends z.ZodType>(
  props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
    schema: TSchema;
  }
) {
  const form = useForm<TSchema['_input']>({
    ...props,
    resolver: async (data, context, options) => {
      console.log('formData', data);
      console.log(
        'validation result',
        await zodResolver(props.schema)(data, context, options)
      );
      return zodResolver(props.schema)(data, context, options);
    },
  });
  return form;
}
