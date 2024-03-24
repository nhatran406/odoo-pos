import { ButtonProps } from '@chakra-ui/react';

export interface DictionaryOf<T> {
  [key: string]: T | undefined;
}

export type SizedImages = Record<'128' | '256' | '512' | '1024', Blob>;

export interface ActionButtonProps extends ButtonProps {
  to?: string;
}
