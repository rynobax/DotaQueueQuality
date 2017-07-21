const now = new Date();
let past1 = new Date(now.getTime())
past1.setHours(past1.getHours()-1);
let past2 = new Date(past1.getTime())
past2.setHours(past2.getHours()-1);
past2.setMinutes(past2.getMinutes()-30);
module.exports = [
  {
    date: past2.getTime(),
    data: {
      US_EAST: [
        6000,
        5900,
        5700,
        5650
      ],
      EUROPE: [
        6600,
        6500,
        6400,
        6000,
        5800,
        5600,
        5500
      ]
    }
  },
  {
    date: past1.getTime(),
    data: {
      US_EAST: [
        5900,
        5500,
        5450
      ],
      EUROPE: [
        7800,
        6400,
        6400,
        6300,
        6000,
        5300,
        5200,
        5100
      ]
    }
  },
  {
    date: now.getTime(),
    data: {
      US_EAST: [
        6100,
        5800,
        5600,
        5250
      ],
      EUROPE: [
        6800,
        6700,
        6400,
        6300,
        5900,
        5700,
        5600
      ]
    }
  }
]