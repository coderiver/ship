import * as THREE from 'three'
import shipVertexShader from '../assets/shaders/shipVertexShader.glsl?raw'
import shipFragmentShader from '../assets/shaders/shipFragmentShader.glsl?raw'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const glowingColor = 0x00ffff
const shipsLink = '/ship.glb'

export class Ships {
  constructor (parent) {
    this.parent = parent
    this.clock = new THREE.Clock()

    this.timeLineShader = {
      uniforms: {
        color: {
          value: new THREE.Color(glowingColor),
        },
        time: { value: 0 },
        opacity: { value: 0 },
      },
      vertexShader: shipVertexShader,
      fragmentShader: shipFragmentShader,
    }

    this.material = new THREE.ShaderMaterial(this.timeLineShader)

    this.directionMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.TextureLoader().load('/particle.png'),
      transparent: true,
      opacity: 0,
    })
    this.animation = -1

    this.loadShips()
  }

  addWireframeShip (ship, scene, name) {
    const geometry = new THREE.EdgesGeometry(ship.geometry.clone())
    const numVertices = geometry.getAttribute('position').count
    const counts = new Float32Array(numVertices)
    // every 2 points is one line segment, so we want the numbers to go
    // 0, 1, 1, 2, 2, 3, 3, 4, 4, 5 etc
    const numSegments = numVertices / 2
    for (let seg = 0; seg < numSegments; ++seg) {
      const off = seg * 2
      counts[off] = seg
      counts[off + 1] = seg + 1
    }
    const itemSize = 1
    const normalized = false
    const colorAttrib = new THREE.BufferAttribute(counts, itemSize, normalized)
    geometry.setAttribute('count', colorAttrib)
    const mesh = new THREE.LineSegments(geometry, this.material)

    const scale = this.ships.ship1.scale.x * 1.018

    mesh.scale.set(scale, scale, scale)
    mesh.position.set(...this.ships.ship1.position)
    mesh.position.y = 0.3
    mesh.visible = true
    mesh.material.transparent = true
    mesh.material.opacity = 0
    scene.children[0].add(mesh)
    this.ships.wireframe = this.ships.wireframe || {}
    this.ships.wireframe[name] = {
      mesh,
      timeLineShader: this.timeLineShader,
      numSegments,
    }
  }

  addDirections () {
    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1)
    const qty = 5
    const startX = 0.28
    const startY = 0.072

    const planes = []
    for (let i = 0; i < 5; i++) {
      const plane = new THREE.Mesh(geometry, this.directionMaterial)
      // this.ships.scene.add(plane)
      this.ships.scene.children[0].add(plane)
      plane.position.set(startX, startY, 0)
      plane.scale.set(0.02, 0.02, 0.02)
      planes.push(plane)
    }
    const animationTime = 4
    const animate = () => {
      if (this.animation < 0) {
        requestAnimationFrame(animate)
        return
      }
      const time = this.clock.getElapsedTime()

      planes.forEach((plane, i) => {
        plane.lookAt(this.parent.camera.position)
        const pt = animationTime / qty * i
        plane.position.x = startX + (time - pt) % animationTime * 0.1
        plane.position.y = startY + Math.sin((time - pt) % animationTime * 0.5) * 0.05
      })
      requestAnimationFrame(animate)
    }
    animate()
  }

  loadShips () {
    const loader = new GLTFLoader()
    // const dracoLoader = new DRACOLoader()
    // dracoLoader.setDecoderPath('/gltf/')
    // loader.setDRACOLoader(dracoLoader)
    loader.load(
      shipsLink,
      gltf => {
        const ships = {
          scene: gltf.scene,
          ship1: gltf.scene.children[0].children[0],
          ship2: gltf.scene.children[0].children[1],
          ship3: gltf.scene.children[0].children[2],
        }
        ships.ship1.visible = true
        ships.ship2.visible = false
        ships.ship3.visible = false

        ships.scene.position.set(0, 0, 0.25)
        ships.scene.scale.set(8, 8, 8)
        ships.scene.rotation.y = 0.75 * Math.PI
        this.ships = ships

        this.addWireframeShip(ships.ship1, ships.scene, 'ship1')
        this.addWireframeShip(ships.ship2, ships.scene, 'ship2')
        this.addWireframeShip(ships.ship3, ships.scene, 'ship3')
        this.ships.wireframe.ship1.mesh.visible = true
        this.ships.wireframe.ship2.mesh.visible = false
        this.ships.wireframe.ship3.mesh.visible = false
        this.parent.ships = ships
        this.parent.scene.add(ships.scene)

        this.parent.onShipsLoaded()
        this.addDirections()
      },
      undefined,
      error => {
        console.error(error)
      }
    )
  }

  switchShip (ship) {
    this.ships.ship1.visible = false
    this.ships.ship2.visible = false
    this.ships.ship3.visible = false
    this.ships[ship].visible = true
    this.ships.wireframe.ship1.mesh.visible = false
    this.ships.wireframe.ship2.mesh.visible = false
    this.ships.wireframe.ship3.mesh.visible = false
    this.ships.wireframe[ship].mesh.visible = true
  }
}
