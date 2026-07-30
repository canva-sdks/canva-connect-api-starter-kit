import { Box, CardMedia, IconButton } from "@mui/material";
import { useState, useEffect } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export type ImageCarouselProps = {
  /** Array of image URLs to display in the carousel */
  images: string[];
  /** Alt text for the images */
  alt: string;
  /** Height of the carousel in pixels */
  height?: number;
  /** Border radius for the images */
  borderRadius?: number;
  /** Whether to show navigation controls */
  showControls?: boolean;
  /** Whether to show dot indicators */
  showDots?: boolean;
  /** Object fit for images */
  objectFit?: "cover" | "contain";
  /** Optional click handler for images */
  onImageClick?: (index: number) => void;
};

export const ImageCarousel = ({
  images,
  alt,
  height = 240,
  borderRadius = 2,
  showControls = true,
  showDots = true,
  objectFit = "cover",
  onImageClick,
}: ImageCarouselProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  if (!images || images.length === 0) {
    return null;
  }

  const goToPrevious = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  const goToNext = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(currentImageIndex);
    }
  };

  useEffect(() => {
    if (!isFocused || images.length <= 1) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goToPrevious();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFocused, images.length]);

  const mediaStyles = {
    borderRadius,
    height,
    objectFit,
    transition: "opacity 0.5s ease-in-out",
    cursor: onImageClick ? "pointer" : "default",
  };

  const currentImage = images[currentImageIndex];
  const hasMultipleImages = images.length > 1;

  return (
    <Box
      className="carousel-root"
      position="relative"
      tabIndex={hasMultipleImages ? 0 : -1}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      sx={{ borderRadius: 1 }}
    >
      <CardMedia
        component="img"
        image={currentImage}
        alt={alt}
        sx={mediaStyles}
        onClick={handleImageClick}
      />

      {/* Navigation arrows — hidden by default, revealed on carousel hover or
          keyboard focus so they don't clutter the image at rest. */}
      {hasMultipleImages && showControls && (
        <>
          <IconButton
            onClick={goToPrevious}
            aria-label="Previous image"
            className="carousel-arrow"
            sx={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(0, 0, 0, 0.45)",
              backdropFilter: "blur(4px)",
              color: "white",
              width: 34,
              height: 34,
              opacity: 0,
              transition: "opacity 0.25s ease, background-color 0.2s ease",
              ".carousel-root:hover &": { opacity: 1 },
              "&:focus-visible": { opacity: 1 },
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            <ChevronLeftIcon fontSize="small" />
          </IconButton>

          <IconButton
            onClick={goToNext}
            aria-label="Next image"
            className="carousel-arrow"
            sx={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              bgcolor: "rgba(0, 0, 0, 0.45)",
              backdropFilter: "blur(4px)",
              color: "white",
              width: 34,
              height: 34,
              opacity: 0,
              transition: "opacity 0.25s ease, background-color 0.2s ease",
              ".carousel-root:hover &": { opacity: 1 },
              "&:focus-visible": { opacity: 1 },
              "&:hover": {
                bgcolor: "rgba(0, 0, 0, 0.7)",
              },
            }}
          >
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </>
      )}

      {hasMultipleImages && showDots && (
        <Box
          sx={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 0.5,
          }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              onClick={() => goToImage(index)}
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor:
                  index === currentImageIndex
                    ? "white"
                    : "rgba(255, 255, 255, 0.5)",
                transition: "all 0.1s ease",
                cursor: "pointer",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                "&:hover": {
                  bgcolor: "white",
                  transform: "scale(1.2)",
                },
              }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};
