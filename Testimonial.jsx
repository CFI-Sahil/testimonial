import React, { useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
import { testimonialsDataOfPeople } from "./TestiData";
import "./testimony.css";

const AUTOPLAY_MS = 4000;

const Testimonials = () => {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const autoSlideId = useRef(null);

  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const getCards = () => {
    const container = containerRef.current;
    if (!container) return [];
    return Array.from(container.querySelectorAll(".testimonials-card"));
  };

  const scrollToCard = (index) => {
    const cards = getCards();
    if (!cards.length || !containerRef.current) return;
    const total = cards.length;
    const newIndex = ((index % total) + total) % total;
    const target = cards[newIndex];
    containerRef.current.scrollTo({
      left:
        target.offsetLeft -
        (containerRef.current.offsetWidth - target.offsetWidth) / 2,
      behavior: "smooth",
    });
    setCurrentIndex(newIndex);
  };

  const updateActiveCard = () => {
    const container = containerRef.current;
    if (!container) return;
    const cards = getCards();
    if (!cards.length) return;

    const containerCenter = container.scrollLeft + container.offsetWidth / 2;
    let closestIdx = 0;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(containerCenter - cardCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = idx;
      }
    });

    setCurrentIndex(closestIdx);
  };

  useEffect(() => {
    const startAuto = () => {
      stopAuto();
      autoSlideId.current = setInterval(() => {
        scrollToCard(currentIndexRef.current + 1);
      }, AUTOPLAY_MS);
    };

    const stopAuto = () => {
      if (autoSlideId.current !== null) {
        clearInterval(autoSlideId.current);
        autoSlideId.current = null;
      }
    };

    startAuto();

    const handleVisibility = () => {
      if (document.hidden) stopAuto();
      else startAuto();
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stopAuto();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e) => {
      isDragging = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      if (autoSlideId.current !== null) {
        clearInterval(autoSlideId.current);
        autoSlideId.current = null;
      }
      container.classList.add("dragging");
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      container.classList.remove("dragging");
      autoSlideId.current = setInterval(() => {
        scrollToCard(currentIndexRef.current + 1);
      }, AUTOPLAY_MS);
      updateActiveCard();
      setTimeout(updateActiveCard, 120);
    };

    const onTouchStart = (e) => {
      isDragging = true;
      startX = e.touches[0].pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
      if (autoSlideId.current !== null) {
        clearInterval(autoSlideId.current);
        autoSlideId.current = null;
      }
    };

    const onTouchMove = (e) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - container.offsetLeft;
      const walk = (x - startX) * 1.5;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", endDrag);
    container.addEventListener("mouseleave", endDrag);

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", endDrag);

    const onScroll = () => {
      requestAnimationFrame(updateActiveCard);
    };
    container.addEventListener("scroll", onScroll, { passive: true });

    setTimeout(updateActiveCard, 50);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", endDrag);
      container.removeEventListener("mouseleave", endDrag);

      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", endDrag);

      container.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="testimonials-section w-full mt-10">
      <div className="w-full px-3 md:px-10 xl:px-20">
        <div className="max-w-[1800px] w-full block overflow-visible select-none">
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold col-ch-to-pr">
              What Our Client Say About Us
            </h2>
            <div className="w-20 h-[3px] mx-auto mt-2 rounded-full" />
          </div>

          <div
            ref={containerRef}
            className="testimonials-container flex gap-6 overflow-x-scroll scroll-smooth no-scrollbar px-2 py-2 w-full"
          >
            {testimonialsDataOfPeople.map((item, idx) => (
              <article
                key={item.id}
                className={`testimonials-card bg-[#F0F6FF] shrink-0 rounded-2xl p-6 w-80 lg:w-96 transition-all duration-300 ${
                  currentIndex === idx ? "scale-105 shadow-sm" : "scale-100 shadow-md"
                }`}
                aria-hidden={currentIndex !== idx}
              >
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className="mr-1"
                      style={{
                        fontSize: 16,
                        color: i < item.rating ? "#FFA41C" : "#d1d5db",
                      }}
                    />
                  ))}
                </div>

                <p className="text-center italic text-sm">“{item.feedback}”</p>
                <p className="text-center font-semibold mt-4">{item.name}</p>
              </article>
            ))}
          </div>

          <div className="flex gap-2 mt-4 justify-center">
            {testimonialsDataOfPeople.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => scrollToCard(i)}
                className={`h-2 w-2 rounded-full border transition-transform ${
                  i === currentIndex ? "scale-110" : ""
                }`}
                style={{
                  borderColor: "#007BFF", // blue border
                  backgroundColor: i === currentIndex ? "#007BFF" : "transparent", // blue active
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
