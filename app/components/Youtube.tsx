export default function Youtube({ 
    videoId, 
    width, 
    height, 
    title, 
}: YoutubeProps) {
    width = width || 560;
    height = height || 315;
    title = title || 'YouTube video player';
    
    return (
        <div className="video-container">
            <iframe width={width} height={height} 
            src={`https://www.youtube.com/embed/${videoId}`}
            title={title} 
            frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
    );
}