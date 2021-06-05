// Scroll effect for changing background color
const bgColorChange = function () {
  const sections = document.querySelectorAll('section');
  const a = document.querySelectorAll('a');

  const topViewport = window.pageYOffset;
  const midViewport = topViewport + (window.innerHeight / 2);

  sections.forEach((section, index) => {
    const topSection = section.offsetTop;
    const midSection = topSection + (section.offsetHeight / 2);

    const distanceToSection = midViewport - midSection;

    if (distanceToSection > -300) {
      const dataBackground = section.getAttribute('data-background');
      const dataColor = section.getAttribute('data-color');
      const bodyTag = document.querySelector('body');
      const menuDivP_tag = document.querySelector('.menu-icon p');
      const menuicon_1 = document.querySelector('#top-line');
      const menuicon_2 = document.querySelector('#bottom-line');
      bodyTag.style.backgroundColor = dataBackground;
      bodyTag.style.color = dataColor;
      menuDivP_tag.style.color = dataColor;
      menuicon_1.style.fill = dataColor;
      menuicon_2.style.fill = dataColor;
    }
  });
};

const runObserver = function () {
  const sections = document.querySelectorAll('section');
  // intersection observer for h1 fade in and background color change
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio > 0.0) {
        bgColorChange();
      }
    });
  }, {
    threshold: [0.0, 0.0, 1.0],
  });

  sections.forEach((section) => {
    observer.observe(section);
  });

  document.addEventListener('scroll', () => {
    bgColorChange();
  });
};

runObserver();

// homepage transition
const sections = document.querySelectorAll('section');
const mainTag = document.querySelector('main');
// bodyTag is in Barba-transition.js

mainTag.style.position = 'fixed';
mainTag.style.top = '0px';
mainTag.style.left = '0px';
mainTag.style.width = '100%';

let currentScroll = 0;
let aimScroll = 0;

const changeScroll = function () {
  // offsetHeight will give the exact height of the mainTag
  bodyTag.style.height = `${mainTag.offsetHeight}px`;
  currentScroll += (aimScroll - currentScroll) * 0.09;
  // currentScroll = currentScroll + 1
  // this will create a loop for the scroll
  mainTag.style.top = `${-1 * currentScroll}px`;
  requestAnimationFrame(changeScroll);
};

// want the currentScroll to go towards the aimScroll
window.addEventListener('scroll', () => {
  aimScroll = window.pageYOffset;
});

changeScroll();

// page transition element
// https://www.youtube.com/watch?v=ckJ7gdIeebc&ab_channel=TylerPotts
window.onload = () => {
  const transitionEl = document.querySelector('.transition');
  const anchors = document.querySelectorAll('a');
  bodyTag.style.overflow = 'hidden';
  setTimeout(() => {
    transitionEl.classList.remove('is-active');
    bodyTag.style.overflow = 'auto';
  });

  anchors.forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = e.currentTarget.href;
      transitionEl.classList.add('is-active');

      setTimeout(() => {
        window.location.href = target;
      });
    });
  });
};

document.addEventListener('DOMContentLoaded', (event) => {
  // Your code to run since DOM is loaded and ready
  const h1s = document.querySelectorAll('h1.in-view');

  h1s.forEach((h1) => {
    const fadeIn_h1Timeline = gsap.timeline();

    fadeIn_h1Timeline
      .set(h1, { y: 800, rotation: -15, opacity: 0 })
      .to(h1, {
        y: 0, rotation: 0, opacity: 1, delay: 0.3, duration: 3, ease: Power2.easeInOut,
      });
  });
});
