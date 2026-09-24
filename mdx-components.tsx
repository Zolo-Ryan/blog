import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import type { ImageProps } from 'next/image';
import Parent from './app/components/Parent';

const components: MDXComponents = {
  wrapper: ({ children }) => <Parent>{children}</Parent>,
  img: (props) => (
    <Image
      sizes="100vw"
      width={100}
      height={100}
      placeholder="blur"
      blurDataURL="..."
      {...(props as ImageProps)}
    />
  ),
} satisfies MDXComponents;

export function useMDXComponents(): MDXComponents {
  return components;
}