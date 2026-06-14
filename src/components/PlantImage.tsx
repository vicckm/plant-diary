"use client";

import { useState } from "react";
import Image from "next/image";

interface PlantImageProps {
  src: string | null;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  containerClassName?: string;
  fallbackLabel?: string;
}

export function PlantImage({
  src,
  alt,
  width = 300,
  height = 300,
  className = "h-full w-full object-cover",
  containerClassName = "flex h-full w-full items-center justify-center text-5xl",
  fallbackLabel,
}: PlantImageProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div className={containerClassName}>
        <span role="img" aria-label={fallbackLabel ?? `${alt} sem foto`}>
          🪴
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setErrored(true)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={false}
    />
  );
}
