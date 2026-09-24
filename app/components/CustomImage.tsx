import Image from "next/image";

export default function CustomImage({
    src,
    height,
    width,
    alt,
    type,
    title
}: CustomImageProps) {
    alt = alt || 'Image';
    title = title || 'Image';

    switch(type) {
        case 'big':
            height = height || 400;
            width = width || 400;
            break;
        case 'medium':
            height = height || 200;
            width = width || 200;
            break;
        case 'small':
            height = height || 100;
            width = width || 100;
            break;
        default:
            height = height || 300;
            width = width || 300;
    }

    return (
        <Image src={src} width={width} height={height} alt={alt} title={title} />
    )
}
