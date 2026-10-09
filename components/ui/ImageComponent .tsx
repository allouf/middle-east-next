type ImageComponentProps = {
  src: string;
  alt?: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  loading?: "lazy" | "eager";
};

const ImageComponent = ({
  src,
  alt = "",
  className = "",
  width,
  height,
  loading = "lazy",
}: ImageComponentProps) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`h-auto object-contain ${className}`}
      loading={loading}
    />
  );
};

export default ImageComponent;
