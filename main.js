console.clear();
gsap.registerPlugin(ScrollTrigger);

window.addEventListener('load', () => {
  gsap.timeline({
    scrollTrigger: {
      trigger: '.wrapper',
      start: 'top top',
      end: '+=200%',
      pin: true,
      scrub: true,
      markers: false
    }
  })
  .to('.tunnel img', {
    scale: 2,
    z: 500,
    rotationY: 10,
    transformOrigin: 'center center',
    ease: 'power1.inOut'
  })
  .to('.section.hero', {
    scale: 1.05,
    transformOrigin: 'center center',
    ease: 'power1.inOut'
  }, '<')
  .to('.hero .title', {
    scale: 3.5,
    opacity: 1,
    z: 300,
    ease: 'power1.inOut'
  }, '<');
});