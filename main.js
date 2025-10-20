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
            markers: true
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
    }, '<');
});
