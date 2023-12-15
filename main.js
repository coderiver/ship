import './style.sass'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollAnimations } from './src/js/ScrollAnimations.js'
import { SegmentsBackground } from './src/js/SegmentsBackground.js'
import { Ships } from './src/js/Ships.js'
import { vesselsParams } from './src/js/experience-params.js'

import ringsFragmentShader from './src/assets/shaders/ringsFragmentShader.glsl?raw'
import ringsVertexShader from './src/assets/shaders/ringsVertexShader.glsl?raw'
import floorFragmentShader from './src/assets/shaders/floorFragmentShader.glsl?raw'
import floorVertexShader from './src/assets/shaders/floorVertexShader.glsl?raw'

const satelliteLink = '/satellite.png'

gsap.registerPlugin(ScrollTrigger)

let instance = null
const shipName = document.querySelector('.ship__name')
const shipInfo = document.querySelectorAll('.ship__info')
const shipBlock1 = document.querySelector('.experience__info.with-time-icon')
const shipBlock2 = document.querySelector('.experience__info.with-map-icon')
const shipBock1Text = shipBlock1.querySelector('.experience__info-text')
const shipBlock2Text = shipBlock2.querySelector('.experience__info-text')
const shipSaving = document.querySelector('.experience__savings')
let currentShipIndex = 0

class Experience {
  constructor () {
    if (instance) return instance
    this.container = document.querySelector('#experience')
    this.scene = new THREE.Scene()

    this.particles = new THREE.Group()
    this.init()
    this.animate()
    instance = this
  }

  setupCamera () {
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 30)
    this.camera.position.set(0, 2.1, 11.5)
  }

  setupRenderer () {
    this.renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
    })
    this.renderer.setClearColor(0x0a1c2e, 1)
    this.renderer.setPixelRatio(2)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.container.appendChild(this.renderer.domElement)
  }

  setLights () {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3.5)
    directionalLight.position.set(0, 10, 10)
    directionalLight.lookAt(0, 0, 0)
    this.scene.add(directionalLight)
  }

  addGlowingCube (position) {
    if (!this.glowingParticleMap) {
      this.glowingParticleMap = new THREE.TextureLoader().load('/particle.png')
    }
    const particle = new THREE.Group()
    const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1)
    const edges = new THREE.EdgesGeometry(geometry)
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
      color: 0x00ffff,
      transparent: true,
      opacity: 0,
    }))
    particle.add(line)
    const material = new THREE.SpriteMaterial({
      map: this.glowingParticleMap,
      transparent: true,
      opacity: 0,
      depthTest: false,
      depthWrite: false,
    })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(0.5, 0.5, 0.5)
    particle.add(sprite)
    particle.position.set(...position)
    this.particles.add(particle)
  }

  setRings () {
    this.rings = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10), new THREE.ShaderMaterial({
        vertexShader: ringsVertexShader,
        fragmentShader: ringsFragmentShader,
        uniforms: {
          time: {
            get value () {
              return (Date.now() % 2000) / 2000
            },
          },
          opacity: { value: 1 },
        },
        transparent: true,
      }))
    this.rings.material.transparent = true
    this.rings.position.y = 0
    this.rings.rotation.x = -0.5 * Math.PI
    this.rings.scale.set(0.5, 0.5, 0.5)
    this.scene.add(this.rings)
  }

  setSatellite () {
    const satelliteTexture = new THREE.TextureLoader().load(satelliteLink)
    this.sattelite = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1, 1, 1),
      new THREE.MeshBasicMaterial({
        map: satelliteTexture,
        transparent: true,
      }),
    )
    this.sattelite.position.set(-1.5, 4.5, 3)
    this.scene.add(this.sattelite)
  }

  onShipsLoaded () {
    for (let i = 0; i < 50; i++) {
      const position = [
        Math.random() * 3.4 - 1.7 + -0.2,
        Math.random() * -0.45 - -0.22 + -0.22,
        Math.random() * 0.4 - 0.2 + -0.2,
      ]
      this.addGlowingCube(position)
    }
    this.particles.rotation.y = 0.75 * Math.PI
    this.scene.add(this.particles)
    this.scrollAnimations = new ScrollAnimations(this)
    this.eventListeners()
  }

  setupExperience () {
    this.shipModel = new Ships(this)
    this.segmentsBg = new SegmentsBackground(this)
    this.setSatellite()
    this.setLights()
    this.setRings()
    this.setupFloor()
  }

  resize () {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(window.innerWidth, window.innerHeight)
  }

  setupResize () {
    window.addEventListener('resize', this.resize.bind(this))
  }

  setupFloor () {
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 1.08, 40, 20), new THREE.ShaderMaterial({
        vertexShader: floorVertexShader,
        fragmentShader: floorFragmentShader,
        uniforms: {
          opacity: { value: 0 },
          uM1: { value: new THREE.Vector3(...vesselsParams[0].floor[0]) },
          uM2: { value: new THREE.Vector3(...vesselsParams[0].floor[1]) },
          uM3: { value: new THREE.Vector3(...vesselsParams[0].floor[2]) },
          uPixelRatio: { value: Math.min(window.devicePixelRatio) },
          resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
          pixelSize: { value: new THREE.Vector2(1.0 / window.innerWidth, 1.0 / window.innerHeight) },
          uElevation: { value: 0.0 },
        },
        transparent: true,
        opacity: 0.9,
        extensions: {
          derivatives: true,
        },
      }))
    floor.scale.set(5, 5, 5)

    const infoRed = document.querySelector('.experience__info.with-map-icon')
    gsap.set(infoRed, {
      yPercent: -45,
      overwrite: true,
    })

    this.wavePositions = {
      pos1: [
        [0.1, 0.9, 0.6],
        [0.1, -0.3, 0.8],
        [1.2, 0.5, 1.0],
      ],
      pos2: [
        [0.2, 0.9, 0.6],
        [0.14, -0.3, 0.8],
        [1.25, 0.7, 1.2],
      ],
      pos3: [
        [0.1, 0.9, 0.6],
        [0.1, -0.3, 0.8],
        [1.2, 0.5, 1.0],
      ],
    }
    floor.material.transparent = true
    floor.material.side = THREE.DoubleSide
    floor.position.y = 0.002
    floor.rotation.x = -0.5 * Math.PI
    floor.scale.set(5, 5, 5)
    this.floor = floor
    this.scene.add(floor)
  }

  switchShip () {
    currentShipIndex += 1
    const ship = vesselsParams[currentShipIndex % 3]
    shipName.innerHTML = ship.name
    shipInfo[0].innerHTML = ship.info[0]
    shipInfo[1].innerHTML = ship.info[1]
    shipInfo[2].innerHTML = ship.info[2]
    shipBock1Text.innerHTML = ship.block1
    shipBlock2Text.innerHTML = ship.block2
    shipSaving.innerHTML = ship.saving
    gsap.to(shipBlock1, {
      y: ship.block1Y,
      duration: 0.5,
    })
    gsap.to(shipBlock2, {
      y: ship.block2Y,
      duration: 0.5,
    })

    gsap.to(this.floor.material.uniforms.uM1.value, {
      x: ship.floor[0][0],
      y: ship.floor[0][1],
      z: ship.floor[0][2],
      overwrite: true,
    })
    gsap.to(this.floor.material.uniforms.uM2.value, {
      x: ship.floor[1][0],
      y: ship.floor[1][1],
      z: ship.floor[1][2],
      overwrite: true,
    })
    gsap.to(this.floor.material.uniforms.uM3.value, {
      x: ship.floor[2][0],
      y: ship.floor[2][1],
      z: ship.floor[2][2],
      overwrite: true,
    })

    gsap.to(this.ships.scene.children[0].rotation, {
      y: ship.shipSceneRotation,
    })

    this.shipModel.switchShip(ship.ship)
  }

  eventListeners () {
    const nextButton = document.querySelector('.js-change-ship')
    nextButton.addEventListener('click', () => {
      this.switchShip()
    })

    const navLinks = document.querySelectorAll('.progress__dot')

    for (let i = 0; i < navLinks.length; i++) {
      navLinks[i].addEventListener('click', (e) => {
        e.preventDefault()
        const point = this.scrollAnimations.tl.scrollTrigger.labelToScroll('section' + (i + 1))
        this.scrollAnimations.tl.scrollTrigger.scroll(point)
      })
    }
  }

  animate () {
    this.renderer.render(this.scene, this.camera)
    window.requestAnimationFrame(this.animate.bind(this))
  }

  init () {
    this.setupCamera()
    this.setupRenderer()
    this.setupResize()
    this.setupExperience()

    this.scene.rotation.x = 0.12 * Math.PI
  }
}

new Experience()
