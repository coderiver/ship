import * as THREE from 'three'

// const glowingColor = 0x00ffff

export class SegmentsBackground {
  constructor (parent) {
    this.parent = parent
    this.animation = false
    this.addSegments()
  }

  addSegments () {
    const maxParticleCount = 400
    const r = 600
    const particleCount = 150
    const particlesData = []
    const segments = maxParticleCount * maxParticleCount
    const positions = new Float32Array(segments * 3)
    const colors = new Float32Array(segments * 3)
    const rHalf = r / 2
    const particlesGroup = new THREE.Group()
    const glowingColor = new THREE.Color(0x00ffff)

    const effectController = {
      showDots: true,
      showLines: true,
      minDistance: 100,
      limitConnections: true,
      maxConnections: 14,
      particleCount: 400,
    }

    const pMaterial = new THREE.PointsMaterial({
      color: glowingColor,
      size: 2.5,
      blending: THREE.AdditiveBlending,
      transparent: true,
      sizeAttenuation: false,
      opacity: 0.5,
    })

    const particles = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(maxParticleCount * 3)
    const particleVelocities = new Float32Array(maxParticleCount * 3)

    for (let i = 0; i < maxParticleCount; i++) {
      const x = Math.random() * r * 2 - r * 2 / 2
      const y = Math.random() * r - r / 2
      const z = Math.random() * r - r / 2

      particlePositions[i * 3] = x
      particlePositions[i * 3 + 1] = y
      particlePositions[i * 3 + 2] = z

      particleVelocities[i * 3] = -1 + Math.random() * 2
      particleVelocities[i * 3 + 1] = -1 + Math.random() * 2
      particleVelocities[i * 3 + 2] = -1 + Math.random() * 2

      particlesData.push({
        velocity: particleVelocities.subarray(i * 3, i * 3 + 3),
        numConnections: 0,
      })
    }

    particles.setDrawRange(0, particleCount)
    particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setUsage(THREE.DynamicDrawUsage))
    const pointCloud = new THREE.Points(particles, pMaterial)
    particlesGroup.add(pointCloud)

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage))
    geometry.computeBoundingSphere()
    geometry.setDrawRange(0, 0)

    const material = new THREE.LineBasicMaterial({
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.18,
      color: glowingColor,
    })

    const linesMesh = new THREE.LineSegments(geometry, material)

    particlesGroup.add(linesMesh)
    particlesGroup.scale.set(0.008, 0.008, 0.008)
    particlesGroup.position.set(0, 2.3, -4.5)

    this.parent.dotParticlesMaterials = [material, pMaterial]
    this.parent.dotParticlesMaterials.forEach((mat) => {
      mat.opacity = 0
    })

    this.parent.scene.add(particlesGroup)

    const animate = () => {
      if (!this.animation) {
        requestAnimationFrame(animate)
        return
      }

      let vertexpos = 0
      let colorpos = 0
      let numConnected = 0

      for (let i = 0; i < particleCount; i++) {
        particlesData[i].numConnections = 0
      }

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        const particleData = particlesData[i]

        particlePositions[i3] += particleData.velocity[0]
        particlePositions[i3 + 1] += particleData.velocity[1]
        particlePositions[i3 + 2] += particleData.velocity[2]

        if (particlePositions[i3 + 1] < -rHalf || particlePositions[i3 + 1] > rHalf) {
          particleData.velocity[1] = -particleData.velocity[1]
        }

        if (particlePositions[i3] < -rHalf || particlePositions[i3] > rHalf) {
          particleData.velocity[0] = -particleData.velocity[0]
        }

        if (particlePositions[i3 + 2] < -rHalf || particlePositions[i3 + 2] > rHalf) {
          particleData.velocity[2] = -particleData.velocity[2]
        }

        if (effectController.limitConnections && particleData.numConnections >= effectController.maxConnections) {
          continue
        }

        for (let j = i + 1; j < particleCount; j++) {
          const j3 = j * 3
          const particleDataB = particlesData[j]
          const dx = particlePositions[i3] - particlePositions[j3]
          const dy = particlePositions[i3 + 1] - particlePositions[j3 + 1]
          const dz = particlePositions[i3 + 2] - particlePositions[j3 + 2]
          const distSquared = dx * dx + dy * dy + dz * dz

          if (distSquared < effectController.minDistance ** 2) {
            particleData.numConnections++
            particleDataB.numConnections++

            const alpha = 1.0 - Math.sqrt(distSquared) / effectController.minDistance

            positions[vertexpos++] = particlePositions[i3]
            positions[vertexpos++] = particlePositions[i3 + 1]
            positions[vertexpos++] = particlePositions[i3 + 2]

            positions[vertexpos++] = particlePositions[j3]
            positions[vertexpos++] = particlePositions[j3 + 1]
            positions[vertexpos++] = particlePositions[j3 + 2]

            colors[colorpos++] = alpha
            colors[colorpos++] = alpha
            colors[colorpos++] = alpha

            colors[colorpos++] = alpha
            colors[colorpos++] = alpha
            colors[colorpos++] = alpha

            numConnected++
          }
        }
      }

      linesMesh.geometry.setDrawRange(0, numConnected * 2)
      linesMesh.geometry.attributes.position.needsUpdate = true
      linesMesh.geometry.attributes.color.needsUpdate = true

      pointCloud.geometry.attributes.position.needsUpdate = true

      requestAnimationFrame(animate)
    }

    animate()
  }
}
