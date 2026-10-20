const getCoordinates = require('./geocode');
const {descriptors, types} = require('./helper');

const capitalizeProper = (str) => {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => {
            if (word.length === 0) return '';
            return word[0].toUpperCase() + word.slice(1);
        })
        .join(' ');
}

const getCoords = (name, location) => {
    return getCoordinates(name, location).then(res => res).catch(e => console.log(e));
}

const capitalizeAndFilter = (str) => {
    try{
        const item = str.slice(0, str.indexOf(' '));
        return capitalizeProper(item);
    } catch {
        const item = str;
        return capitalizeProper(item);
    }
}

const generateRandomNumbers = (max, count) => {
    const randomNums = [];
    for (let i = 0; i < count; i++) {
        const rN = Math.floor(Math.random() * max) + 1;
        if(!randomNums.includes(rN)) {
            randomNums.push(rN);
        } else {
            i--;
        }
    }
    return randomNums.sort((a,b) => a-b);
}

const flattenList = (dataList, idList) => {
    const outputList = [];
    dataList.provinceList.flatMap(x => {
        let province = capitalizeProper(x.name);
        return x.districtList.flatMap(x => {
            return x.municipalityList.flatMap(x => {
                const municipality = capitalizeAndFilter(x.name);
                if(idList.includes(x.id) && municipality.length >= 5) {
                    const name = `${municipality} ${descriptors[Math.floor(Math.random() * descriptors.length)]} ${types[Math.floor(Math.random() * types.length)]}`;
                    const location = `${municipality}, ${province}`;
                    const image = `https://picsum.photos/400?random=${Math.random()}`;
                    const price = Math.floor(Math.random() * 20) + 10;
                    const description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi facilis a inventore quod laborum quas, voluptas illum provident dolorem quae amet incidunt reprehenderit assumenda nisi eveniet sunt fuga officiis deserunt!';
                    outputList.push({ name, location, image, price, description });
                } else if(idList.includes(x.id)) {
                    const name = `${municipality} ${descriptors[Math.floor(Math.random() * descriptors.length)]} ${types[Math.floor(Math.random() * types.length)]}`;
                    const location = `${capitalizeProper(x.name)}, ${province}`;
                    outputList.push({ name, location });
                }
                return x;
            })
        })
    })
    return outputList;
}

module.exports = {
    getCoords,
    generateRandomNumbers,
    capitalizeProper,
    capitalizeAndFilter,
    flattenList
}