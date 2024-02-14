export default {
    background: [
        0x0E0E0E,
        0x101010,
        0x121212,
        0x141414,
        0x161616,
        0x181818,
        0x1A1A1A,
        0x1C1C1C,
        0x421F1A,
        0x381105,
        0x703F23,
        0x381105,
        0x1C1C1C,
        0x1A1A1A
    ],
    platforms: [
        // ground
        {x: 0, y: 0, w: '45%', h: 64, color: 0xE2E2E2},
        {x: '55%', y: 0, w: '45%', h: 64, color: 0xE2E2E2},
        // skull
        {x: 352, y: 416, w: 32, h: 96, color: 0xE2E2E2},
        {x: 640, y: 416, w: 32, h: 96, color: 0xE2E2E2},
        {x: 384, y: 512, w: 256, h: 32, color: 0xE2E2E2},
        {x: 424, y: 192, w: 32, h: 128, color: 0xE2E2E2},
        {x: 496, y: 192, w: 32, h: 128, color: 0xE2E2E2},
        {x: 568, y: 192, w: 32, h: 128, color: 0xE2E2E2},
        {x: 416, y: 384, w: 64, h: 32, color: 0xE2E2E2},
        {x: 416, y: 448, w: 64, h: 32, color: 0xE2E2E2},
        {x: 432, y: 416, w: 32, h: 32, color: 0xE2E2E2},
        {x: 544, y: 384, w: 64, h: 32, color: 0xE2E2E2},
        {x: 544, y: 448, w: 64, h: 32, color: 0xE2E2E2},
        {x: 560, y: 416, w: 32, h: 32, color: 0xE2E2E2},
        // rocks
        {x: 288, y: 224, w: 32, h: 32, color: 0xE2E2E2},
        // stalactites (on cieling)
        {x: 0, y: 544, w: '100%', h: 32, color: 0xE2E2E2},
        {x: 800, y: 512, w: 32, h: 32, color: 0xE2E2E2},
        {x: 832, y: 416, w: 32, h: 128, color: 0xE2E2E2},
        {x: 864, y: 480, w: 32, h: 64, color: 0xE2E2E2},
        // stalagmites (on ground)
        {x: 128, y: 64, w: 32, h: 64, color: 0xE2E2E2},
        {x: 160, y: 64, w: 32, h: 128, color: 0xE2E2E2},
        {x: 192, y: 64, w: 32, h: 32, color: 0xE2E2E2},
        // torches
        {x: 0, y: 64, w: 32, h: 64, color: 0x592E04},
        {x: 0, y: 128, w: 32, h: 32, color: 0xDEA035},
        {x: 384, y: 64, w: 32, h: 64, color: 0x592E04},
        {x: 384, y: 128, w: 32, h: 32, color: 0xDEA035},
        {x: 608, y: 64, w: 32, h: 64, color: 0x592E04},
        {x: 608, y: 128, w: 32, h: 32, color: 0xDEA035},
        {x: 896, y: 64, w: 32, h: 64, color: 0x592E04},
        {x: 896, y: 128, w: 32, h: 32, color: 0xDEA035},
    ],
    goal: {x: 960, y: 64}
};
