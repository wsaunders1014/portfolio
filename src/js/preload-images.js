// Eager markup starts downloads during HTML parsing, even for distant sections.
// Decode the rendered candidates too, including the hidden Bird Karma fallback,
// so fast navigation and gallery switches can reuse already prepared images.
// Keep srcset/sizes intact: preload only the browser's chosen responsive size.
for (const image of document.images) {
  image.decode().catch(() => {
    // A changed ship selection can cancel an in-flight decode. Its own loader
    // handles readiness; an unavailable image must not block the rest of the site.
  });
}
