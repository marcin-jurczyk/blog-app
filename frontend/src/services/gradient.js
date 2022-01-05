const hash = require('string-hash')
const color = require('tinycolor2')

export const gradient = (uid, type = 'diagonal', opacity = 1) => {
    if (uid) {
        const n = hash(uid)
        let c1 = color({h: n % 360, s: 0.95, l: 0.5, a: opacity})
        let c1_ = c1.toRgbString()
        let c2 = c1.triad()[1]
        c2.setAlpha(opacity)
        c2 = c2.toRgbString()

        switch (type) {
            case 'diagonal':
                return `linear-gradient(to top right, ${c1_}, ${c2})`

            case 'radial':
                return `radial-gradient(circle, ${c1_}, ${c2})`

            case 'horizontal':
                return `linear-gradient(${c1_}, ${c2})`

            case 'vertical':
                return `linear-gradient(to right, ${c1_}, ${c2})`

            default:
                return `linear-gradient(to top right, ${c1_}, ${c2})`
        }
    }

    throw new TypeError('uid is required')
}

const tagsColors = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"];

export function tagColor(name) {
    let h = hash(name.tag);
    let n = ('' + h)[1]
    return tagsColors[n]
}

export function getTagColor(name) {
    let n = hash(name.tag);
    n = n +""
    n = parseInt(n.slice(4, 7))
    console.log(n)
    let c = color({h: n % 360, s: 0.95, l: 0.5})
    return c.toRgbString()
}

export function randomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export function randomType() {
    const words = ["diagonal", "vertical", "horizontal", "radial"];
    return words[Math.floor(Math.random() * words.length)]
}


// function randomGradient(opacity) {
//     const types = ["linear-gradient", "radial-gradient"];
//     let type = types[Math.floor(Math.random() * types.length)];
//     const options = ["to top", "to left", "to bottom left"]
//     let option = options[Math.floor(Math.random() * options.length)];
//     let val = [];
//     let min = Math.ceil(50);
//     let max = Math.floor(255);
//     for (let i = 0; i <= 6; i++) {
//         val.push(Math.floor(Math.random() * (max - min + 1)) + min);
//     }
//     if (type === 'radial-gradient') option = "circle at center"
//
//     // return type + '(' + option + ', rgba(' + val[0] + ', ' + val[1] + ', ' + val[3] + ', ' + opacity + '), ' +
//     // 'rgba(' + val[4] + ', ' + val[5] + ', ' + val[6] + ', ' + opacity + '))'
//
//     return type + '(' + option + ',' + getRandomColor() + ',' + getRandomColor() + ')'
// }

// function getRandomColor() {
//     const trans = '1';
//     let color = 'rgba(';
//     for (let i = 0; i < 3; i++) {
//         let min = Math.ceil(50);
//         let max = Math.floor(255);
//         color += Math.floor(Math.random() * (max - min + 1)) + min + ',';
//     }
//     color += trans + ')';
//     return color;
// }