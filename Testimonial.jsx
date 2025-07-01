import React, { useEffect, useRef, useState } from "react";
import { FaStar } from "react-icons/fa";
function Testimonials() {
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoSlideRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const testimonials = [
    {
      name: "Yogita Kumkar",
      feedback: "A good products n a good quality. Must buy n try for best look.👍",
      rating: 5
    },
    {
      name: "Afreen Ansari",
      feedback: "I wore Ornaora’s AD earrings to a wedding and stole the show people couldn’t stop asking where I got them from. Lightweight, sparkly, and super classy!",
      rating: 5
    },
    {
      name: "Rekha Sontakke",
      feedback: "I was honestly a bit skeptical about ordering from Ornaora since they’re a new brand, but I came across some really unique and beautiful jewelry pieces that completely won me over. I couldn’t stop myself from placing an order and I’m so glad I did! The jhumkas I got are absolutely stunning great quality, anti tarnish, and they look so classy. Totally worth it! Thanks",
      rating: 5
    },
    {
      name: "Aayesha Shaikh",
      feedback: "Found Ornaora recently and I’ve already placed my third order. Their service is so smooth and every piece feels like it’s made with love. The packaging is also super thoughtful!",
      rating: 4
    },
    {
      name: "Babita Vishwakarma",
      feedback: "Good price and best quality products and given fantastic service to the customer",
      rating: 5
    },
    {
      name: "Dr.Archana Jadhav",
      feedback: "Honestly, Ornaora delivers that high-end look without burning a hole in your pocket. The craftsmanship, finishing, and detail are impressive at this price point! and makes me feel so graceful every time I wear it. Thank you Ornaora for such a stunning piece!❤️",
      rating: 5
    },
    {
      name: "Nazneen Bi",
      feedback: "Ornaora isn’t just selling jewelry they’re delivering joy, elegance, and confidence in every package. The experience feels premium from order to delivery.",
      rating: 4
    },
    {
      name: "Prachi Betkar",
      feedback: "I am so happy with this kundan chandbali it's elegant, detailed, and adds the perfect touch to my decor. Looks even better in person, such a charming little piece It looks premium and instantly brightens up my self!! Great value for the price.",
      rating: 4
    },

  ];


  useEffect(() => {
    const container = containerRef.current;
    const cards = container.querySelectorAll(".testimonials-card");
    const dots = document.querySelectorAll(".dot-10");

    function updatePopupCard() {
      const containerCenter = container.scrollLeft + container.offsetWidth / 2;
      let closestCard = null;
      let closestDistance = Infinity;
      let closestIdx = 0;

      cards.forEach((card, index) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const distance = Math.abs(containerCenter - cardCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestCard = card;
          closestIdx = index;
        }
      });

      cards.forEach(card => card.classList.remove("popup-active"));
      if (closestCard) closestCard.classList.add("popup-active");

      setCurrentIndex(closestIdx);

      dots.forEach((dot, i) => {
        dot.style.backgroundColor = i === closestIdx ? "#6933be" : "white";
      });
    }

    const scrollToCard = (index) => {
      const total = cards.length;
      const newIndex = ((index % total) + total) % total;
      const targetCard = cards[newIndex];
      if (!targetCard) return;

      container.scrollTo({
        left: targetCard.offsetLeft - (container.offsetWidth - targetCard.offsetWidth) / 2,
        behavior: "smooth",
      });

      setCurrentIndex(newIndex);

      dots.forEach((dot, i) => {
        dot.style.backgroundColor = i === newIndex ? "#6933be" : "white";
      });
    };

    autoSlideRef.current = setInterval(() => {
      scrollToCard(currentIndex + 1);
    }, 4000);

    container.addEventListener("scroll", () => {
      requestAnimationFrame(updatePopupCard);
    });

    document.querySelectorAll(".dot-10").forEach((dot, index) => {
      dot.addEventListener("click", () => {
        scrollToCard(index);
      });
    });

    // Drag functionality
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      startXRef.current = e.pageX - container.offsetLeft;
      scrollLeftRef.current = container.scrollLeft;
      container.classList.add("dragging");
      clearInterval(autoSlideRef.current);
    };

    const handleMouseLeave = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        container.classList.remove("dragging");
        autoSlideRef.current = setInterval(() => {
          scrollToCard(currentIndex + 1);
        }, 4000);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        container.classList.remove("dragging");
        autoSlideRef.current = setInterval(() => {
          scrollToCard(currentIndex + 1);
        }, 4000);
      }
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startXRef.current) * 2;
      container.scrollLeft = scrollLeftRef.current - walk;
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);

    updatePopupCard(); // initial popup

    return () => {
      clearInterval(autoSlideRef.current);
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, [currentIndex]);

  return (
    <div className="all-in-one-cont-div">
      <div className="title-what-say">
        <h1>What Our Customers Say About Us</h1>
      </div>

      <div className="want-to-make-fl" id="testimonialContainer" ref={containerRef}>
        {testimonials.map((item, index) => (
          <div className="testimonials-card dont-1-for-pad" key={index}>
            <div className="rat-5-or-4">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  style={{
                    color: i < item.rating ? 'rgb(255, 200, 0)' : 'rgb(201, 201, 201)',
                    fontSize: '16px',
                  }}
                />
              ))}

            </div>
            <div className="cont-of-user">
              <p>{item.feedback}</p>
            </div>
            <div className="test-user_name">
              <p>{item.name}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pagi-10-for-dot" id="paginationDots">
        {testimonials.map((_, i) => (
          <span key={i} className="dot-10"></span>
        ))}
      </div>
    </div>
  );

}

export default Testimonials;
