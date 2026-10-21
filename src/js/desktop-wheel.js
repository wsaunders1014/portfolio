// Only horizontal wheel gestures navigate the route. Leave vertical scrolling
// entirely native, whether or not the content under the pointer overflows.
export function enableDesktopWheel(route, { isDesktop, onInterrupt, onNavigate }) {
  route.addEventListener('wheel', event => {
    if (!isDesktop() || event.defaultPrevented || event.ctrlKey || event.metaKey) return;
    if (!event.deltaX || Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    const delta = event.deltaX;
    onInterrupt();
    event.preventDefault();
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? route.clientWidth : 1;
    route.scrollLeft = Math.max(0, Math.min(route.scrollWidth - route.clientWidth, route.scrollLeft + delta * unit));
    onNavigate();
  }, { passive: false });
}
