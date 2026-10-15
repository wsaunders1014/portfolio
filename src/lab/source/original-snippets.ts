export const originals = {
  "conditions": {
    "file": "commerce-web / SKUinCartConditionalContent.tsx",
    "lines": "lines 45–74",
    "description": "My 2025 cart-visibility work checked selected SKUs against the current cart, with any/all and inclusion/exclusion options.",
    "context": "The demo preserves the interaction concept while separating rule evaluation from rendering and defining empty-rule behavior explicitly.",
    "code": "  /* Checks for a SKU in the cart. */\n  const hasSkuInCart = (sku: string): boolean => {\n    let hasSku: boolean = false\n    hasSku =\n      cart.cart?.lineItems?.some((item: any) => {\n        return item.variant.sku === sku\n      }) ?? false\n\n    return hasSku ?? false\n  }\n\n  let hasSKU: boolean = false\n  if (skus !== undefined && skus.length > 0) {\n    if (anyOrAll === 'Any') {\n      skus?.some((sku: string) => {\n        if (hasSkuInCart(sku)) {\n          hasSKU = true\n        }\n        // returns true if any of the SKUS are in the cart\n      })\n    } else {\n      // only show if ALL are there.\n      hasSKU = skus?.every((sku: string) => {\n        return hasSkuInCart(sku)\n      })\n      // returns true if ALL of the SKUS in showIfSkuInCart are in the cart\n    }\n  }\n  showContent = skusInOut === hasSKU\n"
  },
  "carousel": {
    "file": "harmony / carousel-basic-slider.tsx",
    "lines": "lines 64–84",
    "description": "My carousel work included fixing a swipe that could change the background without changing the slide. The original implementation subscribes to the carousel’s own slide state.",
    "context": "This is the post-fix excerpt from a shared component. My change removed the competing active-index updates from swipe handlers; it does not imply I authored the whole carousel.",
    "code": "    useEffect(() => {\n        function onChange() {\n            if (activeIndex !== carouselRef.current.carouselStore.getStoreState().currentSlide) {\n                setActiveIndex(carouselRef.current.carouselStore.getStoreState().currentSlide);\n                if (automaticScrollTimer === 0) pauseVideos();\n            }\n        }\n        carouselRef.current.carouselStore.subscribe(onChange);\n        return () => carouselRef.current.carouselStore.unsubscribe(onChange);\n    }, [activeIndex, carouselRef]);\n    useEffect(() => {\n        setCountryLanguage(getSiteLocale());\n    }, []);\n    const { ref: swipeRef } = useSwipeable({\n        onSwipedLeft: () => {\n            handleArrowsClickTracking(\"right\");\n        },\n        onSwipedRight: () => {\n            handleArrowsClickTracking(\"left\");\n        },\n    });"
  }
} as const;
