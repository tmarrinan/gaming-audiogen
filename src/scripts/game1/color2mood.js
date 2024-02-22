const COLORS = {
    red: {color: [0.922, 0.000, 0.000], hue: 0.0, checkHue: true},
    orange: {color: [0.949, 0.502, 0.059], hue: 0.0, checkHue: true},
    yellow: {color: [0.980, 0.980, 0.137], hue: 0.0, checkHue: true},
    green: {color: [0.106, 0.769, 0.251], hue: 0.0, checkHue: true},
    cyan: {color: [0.353, 0.980, 0.980], hue: 0.0, checkHue: true},
    blue: {color: [0.239, 0.404, 0.820], hue: 0.0, checkHue: true},
    purple: {color: [0.553, 0.122, 0.769], hue: 0.0, checkHue: true},
    pink: {color: [0.910, 0.667, 0.690], hue: 0.0, checkHue: true},
    brown: {color: [0.478, 0.310, 0.114], hue: 0.0, checkHue: true},
    black: {color: [0.0, 0.0, 0.0], hue: 0.0, checkHue: false},
    white: {color: [1.0, 1.0, 1.0], hue: 0.0, checkHue: false}
};

const DESCRIPTIONS = {
    red: 'intense',
    orange: 'energetic',
    yellow: 'cheery',
    green: 'fresh',
    cyan: 'lively',
    blue: 'peaceful',
    purple: 'mysterious',
    pink: 'cute',
    brown: 'practical',
    black: 'dark',
    white: 'simple'
}

function ColorArrayToMoodDescription(color_array) {
    let colors = {}
    color_array.forEach((color_hex) => {
        let color = [
            colorComponentToFloat(color_hex, 0xFF0000, 16),
            colorComponentToFloat(color_hex, 0x00FF00, 8),
            colorComponentToFloat(color_hex, 0x0000FF, 0)
        ];
        let hue = colorHue(color);
        let min_distance = 9.9e12;
        let nearest_color = '';
        for (let base_color in COLORS) {
            let distance = colorDistance(color, COLORS[base_color].color);
            let skip = false;
            if (COLORS[base_color].checkHue && !hueInRange(hue, COLORS[base_color].hue, 45.0)) {
                skip = true;
            }
            if (!skip && distance < min_distance) {
                min_distance = distance;
                nearest_color = base_color;
            }
        }
        if (colors.hasOwnProperty(nearest_color)) {
            colors[nearest_color]++;
        }
        else {
            colors[nearest_color] = 1;
        }
    });

    let description = ''
    let num_colors = 0;
    for (let c in colors) {
        if (c !== 'white' && c !== 'brown' && c !== 'black') {
            num_colors++;
        }
    }
    if (num_colors >= 4) {
        description = 'playful' // rainbow
    }
    else {
        let top3 = largestKeys(colors, 3);
        if (top3[0].value >= 2 * top3[1].value || (top3.length >= 3 && top3[1].value === top3[2].value)) {
            description = DESCRIPTIONS[top3[0].key];
        }
        else {
            description = DESCRIPTIONS[top3[0].key] + ' ' + DESCRIPTIONS[top3[1].key];
        }
    }
    return description;
}

function colorComponentToFloat(color, component_mask, shift) {
    return ((color & component_mask) >> shift) / 255.0;
}

function colorHue(color) {
    let c_min = Math.min(color[0], color[1], color[2]);
    let c_max = Math.max(color[0], color[1], color[2]);
    let c_delta = c_max - c_min;
    let hue = 0.0;
    if (c_delta !== 0.0 && c_max === color[0]) {
        hue = (color[1] - color[2]) / c_delta
    }
    else if (c_delta !== 0.0 && c_max === color[1]) {
        hue = 2 + (color[2] - color[0]) / c_delta;
    }
    else if (c_delta !== 0.0) {
        hue = 4 + (color[0] - color[1]) / c_delta;
    }
    hue = hue < 0 ? hue + 6 : hue;
    return 60.0 * hue;
}

function hueInRange(hue, base_hue, range) {
    let min = base_hue - range;
    let max = base_hue + range;
    let in_range = false;
    if (min < 0) {
        if (hue <= max || hue >= (min + 360)) {
            in_range = true;
        }
    }
    else if (max > 360) {
        if (hue >= min || hue <= (max - 360)) {
            in_range = true;
        }
    }
    else {
        if (hue >= min && hue <= max) {
            in_range = true;
        }
    }
    return in_range;
}

function colorDistance(c1, c2) {
    let d_r = (c2[0] - c1[0]) * 0.299;
    let d_g = (c2[1] - c1[1]) * 0.587;
    let d_b = (c2[2] - c1[2]) * 0.114;
    return Math.sqrt(d_r * d_r + d_g * d_g + d_b * d_b);
}

function largestKeys(object, n) {
    let key_list = [];
    Object.keys(object).sort((a, b) => object[b] - object[a]).forEach((key, ind) => {
        if(ind < n) {
            key_list.push({key: key, value: object[key]});
        }
    });
    return key_list;
 };

for (let base_color in COLORS) {
    COLORS[base_color].hue = colorHue(COLORS[base_color].color);
}
console.log(COLORS);

export { ColorArrayToMoodDescription };