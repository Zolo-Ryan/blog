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
            width = width || 600;
            break;
        case 'medium':
            height = height || 200;
            width = width || 300;
            break;
        case 'small':
            height = height || 100;
            width = width || 166;
            break;
        default:
            height = height || 300;
            width = width || 450;
    }

    return (
        <Image src={src} width={width} height={height} alt={alt} title={title} />
    )
}
