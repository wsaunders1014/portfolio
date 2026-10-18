# Original ship artwork

These PNG masters are preserved outside the served site. The active versions
in `src/img/` are transparent WebP images. The larger ships are resized to
432 pixels wide (three times their 144-pixel desktop display width), encoded
at quality 88 with method 6. Serenity retains its native 185 × 100 dimensions
and uses lossless WebP. Padding and aspect ratios are preserved so engine
and laser alignment does not change.

Conversion uses Pillow: convert to RGBA, thumbnail within 432 × 432 using
LANCZOS, then save as WebP. Do not deploy this reference directory.
