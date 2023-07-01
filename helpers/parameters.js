export let parameters = {
    color: '#f0f',
    spin: () => {
        gsap.to(cube1.rotation, {
            y: cube1.rotation.y + Math.PI * 2,
            duration: 1,
        });
    },
};
