export const vesselsParams = [
  {
    name: 'MV <strong>Pioneer</strong>',
    info: [
      'ETA <strong>3 days</strong>',
      'Max speed <strong>21kts</strong>',
      'Fouling <strong>2%</strong>',
    ],
    block1: 'Maintain speed through <strong>adverse wind</strong>',
    block2: 'Harness strong <strong>positive currents</strong>',
    saving: 'Saving <strong>5<span>%</span></strong>',
    block1Y: 0,
    block2Y: 0,
    floor: [
      [0.2, 0.9, 0.8],
      [0.1, -0.5, 0.8],
      [1.2, 0.65, 1.4],
    ],
    shipSceneRotation: 0,
    ship: 'ship1', // do not change
  },
  {
    name: 'MV <strong>Melina</strong>',
    info: [
      'ETA <strong>14 days</strong>',
      'Max speed <strong>14 kts</strong>',
      'Fouling <strong>5%</strong>',
    ],
    block1: 'Harness strong <strong>positive currents</strong>',
    block2: 'Maintain speed ahead of <strong>heavy weather</strong>',
    saving: 'Saving <strong>8<span>%</span></strong>',
    block1Y: -20,
    block2Y: 10,
    floor: [
      [0.2, 0.9, 0.6],
      [0.14, -0.3, 0.8],
      [1.25, 0.5, 1.6],
    ],
    shipSceneRotation: -0.14 * Math.PI,
    ship: 'ship2', // do not change
  },
  {
    name: 'MV <strong>Nebula</strong>',
    info: [
      'ETA <strong>73 hours</strong>',
      'Max speed <strong>12 kts</strong>',
      'Fouling <strong>1%</strong>',
    ],
    block1: 'Change headings to <strong>avoid moderate currents</strong>',
    block2: 'Slow down as <strong>wind decreases</strong>',
    saving: 'Saving <strong>7<span>%</span></strong>',
    block1Y: -40,
    block2Y: 70,
    floor: [
      [0.1, 1.2, 0.8],
      [0.1, -0.3, 1.0],
      [1.2, 0.5, 1.8],
    ],
    shipSceneRotation: -0.1 * Math.PI,
    ship: 'ship3', // do not change
  },
]
