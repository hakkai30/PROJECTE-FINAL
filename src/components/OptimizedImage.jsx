import React from "react";

function buildSrcSet(url, widths = [300, 500, 800]) {
  try {
    // Build a valid srcset list with width descriptors.
    return widths
      .map((w) => {
        if (/w=\d+/.test(url)) return `${url.replace(/w=\d+/, `w=${w}`)} ${w}w`;
        return `${url}${url.includes("?") ? `&w=${w}` : `?w=${w}`} ${w}w`;
      })
      .join(", ");
  } catch (e) {
    return url;
  }
}

function appendFormat(srcSetValue, format) {
  return srcSetValue
    .split(", ")
    .map((entry) => {
      const [entryUrl, descriptor] = entry.split(" ");
      const withFormat =
        entryUrl.includes("fm=")
          ? entryUrl.replace(/fm=[^&]+/, `fm=${format}`)
          : `${entryUrl}${entryUrl.includes("?") ? "&" : "?"}fm=${format}`;
      return descriptor ? `${withFormat} ${descriptor}` : withFormat;
    })
    .join(", ");
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
  const isRemoteHttp = /^https?:\/\//i.test(src);
  const supportsQueryParams = isRemoteHttp && !src.startsWith("data:");

  if (!supportsQueryParams) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        width={width}
        height={height}
        style={style}
      />
    );
  }

  const fallbackSrcSet = buildSrcSet(src, [300, 500, 800]);
  const webpSrcSet = appendFormat(fallbackSrcSet, "webp");

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
