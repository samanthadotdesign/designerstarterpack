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
