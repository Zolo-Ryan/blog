export default function Youtube({ id }: { id: string }) {
    return (
        <div className="video-container">
            <iframe width="560" height="315" 
            src={`https://www.youtube.com/embed/${id}`}
            title="YouTube video player" 
            frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
    );
}