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
const spiders = many (2,spawn)
addEventListener("pointermove", (e) => {
spiders.forEach(spider => {
spider.follow (e.clientX, e.clientY)
    })
});
requestAnimationFrame(function anim(t) {
if (w !== innerWidth) w = canvas.width = innerWidth;
if (h !== innerHeight) h = canvas.height = innerHeight;
ctx.fillStyle = "#000";
drawCircle(0,0, w = 10);
ctx.fillStyle = ctx.strokeStyle = "#fff";
t/=1000
spiders.forEach(spider => spider.tick(t))
requestAnimationFrame(anim);
});