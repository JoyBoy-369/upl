"use client";

import { Carousel } from "flowbite-react";

type Props = {
  id: string;
  images: ImageMetadata[];
};

function ImageSlider({ images, id }: Props) {
  return (
    <div className="relative h-56 sm:h-64 lg:h-96">
      <Carousel>
        {images.map((image, index) => (
          <img
            key={`${id}-${index}`}
            src={image.src}
            width={image.width}
            height={image.height}
            alt="banner image"
            className="h-full w-full object-cover object-center"
          />
        ))}
      </Carousel>
    </div>
  );
}

export default ImageSlider;
