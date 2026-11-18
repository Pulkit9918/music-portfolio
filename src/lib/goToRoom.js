export function goToRoom(key) {
  const el = document.querySelector(`[data-room="${key}"]`);
  if (!el) return;

  if (window.innerWidth <= 700) {
    el.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const track = document.querySelector(".horizontal-track");
  const st = window.__scrollTriggerHorizontal;
  if (!track || !st || !window.__lenis) return;
  const scrollLength = track.scrollWidth - window.innerWidth;
  const roomProgress = el.offsetLeft / scrollLength;
  window.__lenis.scrollTo(st.start + roomProgress * (st.end - st.start), { duration: 1.2 });
}