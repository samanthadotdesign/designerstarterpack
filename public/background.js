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

/* =============== SECTION PARALLAX =========== */

const sections = document.querySelectorAll('.skills-section');
const bodyTag = document.querySelector('body');

const addPageScroll = () => {
  const topViewport = window.pageYOffset;
  const midViewport = topViewport + (window.innerHeight / 2);

  // // For the middle of the section
  sections.forEach((section, i) => {
  //   // For every even section, add the data-background attribute
  //   if (i % 2 === 0) {
  //     section.setAttribute('data-background', '#000');
  //   } else {
  //     section.setAttribute('data-background', '#fff');
  //   }

    const topSection = section.offsetTop;
    const midSection = topSection + (section.offsetHeight / 2);

    // How far away is the section from the visible area of the page
    const distanceToSection = midViewport - midSection;

    // Check the background
    if (distanceToSection > -100) {
    // const dataBackground = section.getAttribute('data-background');
      bodyTag.style.backgroundColor = '#ccc';
      console.log('yay');
    }
  });
};

addPageScroll();

document.addEventListener('scroll', () => {
  addPageScroll();
});

window.addEventListener('resize', () => {
  addPageScroll();
});

// // Scroll effect for changing background color
// const bgColorChange = () => {
//   const sections = document.querySelectorAll('section');
//   const a = document.querySelectorAll('a');

//   const topViewport = window.pageYOffset;
//   const midViewport = topViewport + (window.innerHeight / 2);

//   sections.forEach((section, index) => {
//     const topSection = section.offsetTop;
//     const midSection = topSection + (section.offsetHeight / 2);

//     const distanceToSection = midViewport - midSection;

//     if (distanceToSection > -300) {
//       const dataBackground = section.getAttribute('data-background');
//       const dataColor = section.getAttribute('data-color');
//       const bodyTag = document.querySelector('body');
//       const menuDivP_tag = document.querySelector('.menu-icon p');
//       const menuicon_1 = document.querySelector('#top-line');
//       const menuicon_2 = document.querySelector('#bottom-line');
//       bodyTag.style.backgroundColor = dataBackground;
//       bodyTag.style.color = dataColor;
//       menuDivP_tag.style.color = dataColor;
//       menuicon_1.style.fill = dataColor;
//       menuicon_2.style.fill = dataColor;
//     }
//   });
// };

// const runObserver = () => {
//   const sections = document.querySelectorAll('section');
//   // intersection observer for h1 fade in and background color change
//   const observer = new IntersectionObserver((entries) => {
//     entries.forEach((entry) => {
//       if (entry.intersectionRatio > 0.0) {
//         bgColorChange();
//       }
//     });
//   }, {
//     threshold: [0.0, 0.0, 1.0],
//   });

//   sections.forEach((section) => {
//     observer.observe(section);
//   });

//   document.addEventListener('scroll', () => {
//     bgColorChange();
//   });
// };

// runObserver();
