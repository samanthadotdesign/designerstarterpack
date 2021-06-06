/* =============== HEADER ANIMATION =========== */

const headerTag = document.querySelector('header');

// When we scroll the page, at a certain point (80px)
// Toggle a class to the header
document.addEventListener('scroll', () => {
  const pixels = window.pageYOffset;

  if (pixels > 80) {
    headerTag.classList.add('scrolled');
  } else {
    headerTag.classList.remove('scrolled');
  }
});

/* =============== BACKGROUND FADE IN =========== */

const changeBgColorOnScroll = () => {
  const sections = document.querySelectorAll('.skills-section');

  const topViewport = window.pageYOffset;
  const midViewport = topViewport + (window.innerHeight / 2);

  // // For the middle of the section
  sections.forEach((section) => {
    const topSection = section.offsetTop;
    const midSection = topSection + (section.offsetHeight / 2);

    // How far away is the section from the visible area of the page
    const distanceToSection = midViewport - midSection;

    // Check the background
    if (distanceToSection > -300) {
      const dataBackground = section.getAttribute('data-background');
      const dataColor = section.getAttribute('data-color');
      const bodyTag = document.querySelector('body');
      bodyTag.style.backgroundColor = dataBackground;
      bodyTag.style.color = dataColor;
    }
  });
};

document.addEventListener('scroll', () => {
  changeBgColorOnScroll();
});

/* =============== BADGE ANIMATION =========== */

const badges = document.querySelectorAll('.badge');

const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

badges.forEach((badge, i) => {
  const randomNumber = random(0, 360);
  // create a bit of randomness for our animation delay
  console.log(randomNumber);
  badge.animate(
    [
      { transform: 'rotate(0deg)' },
      { transform: `rotate(${randomNumber}deg)` },
      { transform: 'rotate(0deg)' },
    ],
    {
      // Use the index to create a staggered animation delay
      delay: 300 * i,
      duration: 5000,
      iterations: Infinity,
    },
  );
});
