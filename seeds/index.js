const mongoose = require('mongoose');
const { Campground } = require('../models');
const cities = require('./cities');
const {descriptors, types} = require('./helper');
const getCoordinates = require('./geocode');

let municipalitiesList = [];
let filteredList = [];

mongoose.connect('mongodb://127.0.0.1:27017/yelpCamp')
.then(() => {
    console.log("Database Connected");
})
.catch(e => {
    console.log("Failed DB Connection:", e);
})

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

const filterNames = (inputArray) => {
    let arr = [];
    for(let element of inputArray) {
        try{
            let item = element.name.slice(0, element.name.indexOf(' '));
            if (item.length < 5) continue;
            arr.push({name: item[0].toUpperCase() + item.slice(1).toLowerCase(), location: `${element.district}, ${element.province}`});
        } catch {
            let item = element.name;
            if (item.length < 5) continue;
            arr.push({name: item[0].toUpperCase() + item.slice(1).toLowerCase(), location: `${element.district}, ${element.province}`});
        }
    }
    return arr;
}

const prepareData = async () => {
    const provinces = [];
    const districts = [];
    const municipalities = [];
    for (let index = 0; index < 70; index++) {
        const id = Math.floor(Math.random() * 753) + 1;
        provinces.push(cities.provinceList.reduce((a,b) => {
            return Math.abs(a.districtList.reduce((a,b) => {
                return Math.abs(a.municipalityList.reduce((a,b) => {
                    return Math.abs(a.id - id) > Math.abs(b.id - id)  ? b : a;
                }).id - id) > Math.abs(b.municipalityList.reduce((a,b) => {
                    return Math.abs(a.id - id) > Math.abs(b.id - id) ? b : a;
                }).id - id) ? b : a
            }).id - id) > Math.abs(b.districtList.reduce((a,b) => {
                return Math.abs(a.municipalityList.reduce((a,b) => {
                    return Math.abs(a.id - id) > Math.abs(b.id - id) ? b : a;
                }).id - id) > Math.abs(b.municipalityList.reduce((a,b) => {
                    return Math.abs(a.id - id) > Math.abs(b.id - id) ? b : a;
                }).id - id)  ? b : a
            }).id - id) ? b : a
        }))
        for(let province of provinces) {
            districts.push(province.districtList.reduce((a,b) => {
                a.state = province.name[0].toUpperCase() + province.name.slice(1).toLowerCase();
                b.state = a.state;
                return Math.abs(a.municipalityList.reduce((a,b) => {
                        return Math.abs(a.id - id) > Math.abs(b.id - id)  ? b : a;
                    }).id - id) > Math.abs(b.municipalityList.reduce((a,b) => {
                        return Math.abs(a.id - id) > Math.abs(b.id - id) ? b : a;
                    }).id - id) ? b : a
            }))
        }
        
        for (let district of districts) {
            municipalities.push(district.municipalityList.reduce((a,b) => {
                a.province = capitalizeProper(district.state);
                b.province = a.province;
                a.district = capitalizeProper(district.name);
                b.district = a.district;
                return Math.abs(a.id - id) > Math.abs(b.id - id) ? b : a;
            }))
            
        }
        const idList = [];
        municipalitiesList =  municipalities.filter((item, index, arr) => {
            if(idList.includes(item.id)) {
                return false;
            } else {
                idList.push(item.id);
                return true;
            }
        })
    }
}

const seedDb = async () => {
    await Campground.deleteMany({});
    let count = 1;
    for(let item of filteredList) {
        try {
            
            // const { latitude, longitude } = await getCoordinates(item.name, item.location.slice(item.location.indexOf(', ')));
            
            const title = `${item.name} ${descriptors[Math.floor(Math.random() * descriptors.length)]} ${types[Math.floor(Math.random() * types.length)]}`;
            const location = `${item.location}`;
            const camp = new Campground({
                title,
                location,
            })
            await camp.save()
            console.log("Data stored", `${count} / ${filteredList.length}`);
            count++;
        } catch (e) {
            console.log("Error while seeding:" , e)
        }
    }
}

prepareData();
filteredList = filterNames(municipalitiesList);
seedDb().then(() => {
    mongoose.connection.close();
});

// filteredList.forEach((item) => console.log(item));