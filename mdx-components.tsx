import type { MDXComponents } from 'mdx/types'
import Image from 'next/image';
import { ImageProps } from 'next/image';
 
const components: MDXComponents = {
  img: (props) => {
    console.log("HI", props);
    return (
    <Image
      sizes="100vw"
      width={100}
      height={100}
      placeholder='blur'
      blurDataURL='...'
      {...(props as ImageProps)}
    />
  )}
} satisfies MDXComponents;
 
export function useMDXComponents(): MDXComponents {
  return components
}