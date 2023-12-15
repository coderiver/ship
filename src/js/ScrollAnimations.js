import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(SplitText)

export class ScrollAnimations {
  constructor (parent) {
    this.parent = parent
    this.setupAnimations()
  }

  setupAnimations () {
    const experienceContainer = document.querySelector('#experience')
    const headings = experienceContainer.querySelectorAll('h2')

    const progressBar = document.querySelector('.progress__progress')
    const progressDots = document.querySelectorAll('.progress__dot')
    const processing = document.querySelector('.experience__processing')
    const processingPercent = document.querySelector('.js-processing-stage-1 span')
    const processingStage1 = document.querySelector('.js-processing-stage-1')
    const processingStage2 = document.querySelector('.js-processing-stage-2')
    const changeShipButton = document.querySelector('.js-change-ship')

    const slide5Elements = document.querySelectorAll('.experience__card, .experience__suggestions')
    const slide6Elements = document.querySelectorAll('.experience__info, .experience__savings, .experience__ship')

    const state = {
      processing: 0,
      currentProcessing: 0,
    }

    gsap.registerPlugin(SplitText)
    const headingsSplits = []
    const main = this.parent

    const wireframeShips = [
      main.ships.wireframe.ship1.mesh.position,
      main.ships.wireframe.ship2.mesh.position,
      main.ships.wireframe.ship3.mesh.position,
    ]

    headings.forEach((heading) => {
      headingsSplits.push(new SplitText(heading, {
        type: 'chars, lines',
        linesClass: 'line',
        charsClass: 'char',
      }))
    })

    headingsSplits.forEach((s, i) => {
      // if (i === 0) return
      gsap.set(s.lines, { overflow: 'hidden' })
      gsap.set(s.chars, { yPercent: 100 })
      gsap.set(s.chars, { autoAlpha: 1 })
    })

    const switchHeading = (index, tl, start) => {
      if (index !== 0) {
        tl.to(headings[index - 1].querySelectorAll('.char'), {
          yPercent: 100,
          duration: 0.25,
          stagger: 0.007,
          ease: 'power3.in',
        }, start)
      }
      tl.to(headings[index].querySelectorAll('.char'), {
        yPercent: 0,
        duration: 0.25,
        stagger: 0.0025,
        delay: index ? 0.3 : 0,
        ease: 'power3.in',
      }, start)
    }

    const tl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: 'power2.inOut',
      },
      scrollTrigger: {
        trigger: '#experience',
        start: 'top top',
        end: '+=600%',
        pin: true,
        scrub: 5,
        pinSpacing: false,
        anticipatePin: 0,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (self.progress > 0.25 && self.progress < 0.75) {
            main.segmentsBg.animation = true
          } else {
            main.segmentsBg.animation = false
          }
          const pr = self.progress * 1.2 - 0.2
          const pr2 = pr < 0 ? 0 : pr > 1 ? 1 : pr
          progressBar.style.transform = `scaleY(${pr2})`
          progressDots.forEach((dot, i) => {
            if (pr > 1) return
            if (i < pr * 5 + 0.1 && i > pr * 5 - 0.1) {
              dot.classList.add('is-active')
            } else {
              dot.classList.remove('is-active')
            }
          })

          const progressInSec = self.progress * 6
          if (progressInSec > 1.2 && progressInSec < 2.2) {
            main.particles.visible = true
          } else {
            main.particles.visible = false
          }
        },
      },
    })

    const updateProcessing = () => {
      if (state.processing !== state.currentProcessing) {
        processingPercent.innerHTML = Math.floor(state.processing).toString()
        state.currentProcessing = state.processing
      }
      requestAnimationFrame(updateProcessing)
    }
    updateProcessing()

    // ----------start animation----------- //
    tl.addLabel('start', 0)
    switchHeading(0, tl, 'start')
    tl.to(main.sattelite.position, {
      x: -0.8,
      y: 5.1,
      z: 4.8,
      duration: 0.65,
    }, 'start')

    // ----------section 1 animation----------- //
    tl.addLabel('section1', 1)
    switchHeading(1, tl, 'section1')
    tl.to(main.sattelite.position, {
      x: -0.4,
      y: 5.4,
      z: 5,
      duration: 0.65,
    }, 'section1')
    tl.to(main.ships.scene.rotation, {
      y: Math.PI,
      duration: 0.65,
    }, 'section1')
    tl.to(main.particles.rotation, {
      y: Math.PI,
    }, 'section1')
    main.particles.children.forEach((particle) => {
      const cubeMaterial = particle.children[0].material
      const spriteMaterial = particle.children[1].material
      const delay = Math.random() * 0.3

      gsap.set([cubeMaterial, spriteMaterial], {
        opacity: 0,
      })

      tl.to(cubeMaterial, {
        opacity: 1,
        duration: 0.1,
        delay: delay + 0.4,
      }, 'section1')
      tl.to(spriteMaterial, {
        opacity: 0.3,
        duration: 0.1,
        delay: delay + 0.5,
      }, 'section1')
      tl.to(particle.position, {
        x: 0.88,
        y: 4.2,
        z: 2,
        ease: 'sine.inOut',
        delay: delay + 0.4,
        duration: 0.35,
      }, 'section1')
      tl.to(particle.rotation, {
        y: Math.PI * 0.85,
        x: Math.PI * 0.85,
        z: Math.PI * 0.85,
        ease: 'none',
        duration: 0.35,
      }, '<')
      tl.to([cubeMaterial, spriteMaterial], {
        opacity: 0,
        delay: 0,
        duration: 0.1,
      }, '-=0.2')
    })
    tl.addLabel('section2', 2)

    // ----------section 2 animation----------- //
    switchHeading(2, tl, 'section2')
    tl.to(main.sattelite.material, {
      opacity: 0,
      duration: 0.25,
      ease: 'sine.inOut',
    }, 'section2')
    tl.to(processing, {
      autoAlpha: 1,
      duration: 0.25,
    }, 'section2')
    tl.to(state, {
      processing: 100,
      duration: 0.75,
      delay: 0.2,
      ease: 'power1.out',
    }, 'section2')
    tl.to(main.shipModel.timeLineShader.uniforms.opacity, {
      value: 1,
      duration: 0.3,
      delay: 0.1,
      ease: 'power3.out',
    }, 'section2')
    tl.to(main.dotParticlesMaterials, {
      opacity: 0.5,
      duration: 0.75,
    })
    tl.to(main.ships.scene.rotation, {
      y: Math.PI * 1.15,
    }, 'section2')
    tl.to(main.shipModel.timeLineShader.uniforms.time, {
      delay: 0.15,
      value: main.ships.wireframe.ship1.numSegments,
      ease: 'power2.inOut',
    }, 'section2')
    tl.to(main.rings.scale, {
      x: '*=2',
      y: '*=2',
      z: '*=2',
    }, 'section2')
    tl.to(main.rings.material.uniforms.opacity, {
      value: 0,
      ease: 'power2.inOut',
    }, 'section2')
    tl.to(main.dotParticlesMaterials, {
      opacity: 0.25,
    }, 'section2')
    tl.addLabel('section3', 3)

    // ----------section 3 animation----------- //
    switchHeading(3, tl, 'section3')
    tl.to(processingStage1, {
      autoAlpha: 0,
      display: 'none',
      duration: 0.25,
    }, 'section3')
    tl.to(processingStage2, {
      autoAlpha: 1,
      display: 'flex',
      delay: 0.25,
      duration: 0.25,
    }, 'section3')
    tl.to(main.dotParticlesMaterials, {
      opacity: 0,
      ease: 'sine.inOut',
    }, 'section3')

    tl.to(wireframeShips, {
      y: 0,
      ease: 'sine.inOut',
    }, 'section3')
    tl.addLabel('section4', 4)

    // ----------section 4 animation----------- //
    switchHeading(4, tl, 'section4')
    tl.to(main.floor.material.uniforms.opacity, {
      value: 1,
      ease: 'sine.inOut',
    }, 'section4')
    tl.to(processingStage2, {
      autoAlpha: 0,
      duration: 0.25,
    }, 'section4')
    tl.to(slide5Elements, {
      autoAlpha: 1,
      duration: 0.25,
      delay: 0.25,
    }, 'section4')
    tl.addLabel('section5', 5)

    // ----------section 5 animation----------- //
    switchHeading(5, tl, 'section5')
    tl.to(changeShipButton, {
      delay: 0.25,
      autoAlpha: 1,
      duration: 0.1,
      ease: 'power2.out',
    }, 'section5')
    tl.to(main.shipModel, {
      animation: 1,
      duration: 0.1,
    }, 'section5')
    tl.to(main.shipModel.directionMaterial, {
      opacity: 1,
      duration: 0.2,
      delay: 0.1,
    }, 'section5')
    tl.to(slide5Elements, {
      autoAlpha: 0,
      duration: 0.25,
    }, 'section5')
    tl.to(slide6Elements, {
      autoAlpha: 1,
      duration: 0.25,
      delay: 0.25,
    }, 'section5')
    tl.to(main.floor.material.uniforms.uElevation, {
      value: 1.0,
      duration: 0.5,
      ease: 'sine.inOut',
    }, 'section5')
    // tl.to(main.floor.material.uniforms.uM1.value, {
    //   z: 0.6,
    //   ease: 'sine.inOut',
    // }, 'section5')
    // tl.to(main.floor.material.uniforms.uM2.value, {
    //   z: 0.6,
    //   ease: 'sine.inOut',
    // }, 'section5')
    // tl.to(main.floor.material.uniforms.uM3.value, {
    //   z: 1.5,
    //   ease: 'sine.inOut',
    // }, 'section5')
    tl.to(main.ships.scene.rotation, {
      y: Math.PI * 1.1,
    }, 'section5')
    tl.addLabel('section6', 6)
    this.tl = tl
  }
}
