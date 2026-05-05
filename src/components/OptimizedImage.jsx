import React from "react";

function buildSrcSet(url, widths = [300, 500, 800]) {
  try {
    // Replace existing w=NUMBER param if present, otherwise append
    return widths
      .map((w) => {
        if (/w=\d+/.test(url)) return url.replace(/w=\d+/, `w=${w}`);
        return url + (url.includes("?") ? `&w=${w}` : `?w=${w}`);
      })
      .join(", ");
  } catch (e) {
    return url;
  }
}

export default function OptimizedImage({
  src,
  alt = "",
  className = "",
  width,
  height,
  sizes = "100vw",
  loading = "lazy",
  decoding = "async",
  style = {},
}) {
  if (!src) return null;
  const fallbackSrcSet = buildSrcSet(src, [300, 500, 800]);
  const webpSrcSet = fallbackSrcSet
    .split(", ")
    .map((s) => s + "&fm=webp")
    .join(", ");

  return (
    <picture>
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <img
        src={src}
        srcSet={fallbackSrcSet}
        sizes={sizes}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        width={width}
        height={height}
        style={style}
      />
    </picture>
  );
}
