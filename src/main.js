const { layerConfigurations, collectionConfigurations } = require('./config')
const fs = require("fs");
const basePath = process.cwd();
const sha1 = require('../node_modules/sha1')
const { createCanvas, loadImage } = require('canvas');
const { resolve } = require('path');


const dnaList = []
const imageDataList = []

//--------- Image data and DNA ---------

const getfileDetails = (fileNames) => {
    const fileDetails = []
    for (let i = 0; i < fileNames.innerElements.length; i++) {
        let nameWithoutExtension = fileNames.innerElements[i].slice(0, -4);
        fileDetails.push({
            elementName: fileNames.elementName,
            fileName: fileNames.innerElements[i],
            index: i,
            name: nameWithoutExtension.split('#')[0],
            weight: nameWithoutExtension.split('#')[1]
        })
    }
    return fileDetails
}

const isValidDna = (dna) => {
    for (let i = 0; i < dnaList.length; i++) {
        if (dnaList[i] === dna) {
            console.log("NOTE : Duplicate DNA found")
            return false
        }
    }
    return true
}

const generateImageData = (layerDetails) => {
    const selectedInnerElements = []
    const selectedInnerElementsFileNames = []
    for (let i = 0; i < layerDetails.elements.length; i++) {
        let totalWeight = 0
        let innerElement;
        const fileDetails = getfileDetails(layerDetails.elements[i])
        const elementName =
            fileDetails.map(file => totalWeight += parseInt(file.weight))
        const random = Math.floor(Math.random() * totalWeight)
        let temp = parseInt(fileDetails[0].weight)
        for (let j = 0; j < fileDetails.length; j++) {
            if (random <= temp) {
                innerElement = fileDetails[j]
                break
            }
            temp += parseInt(fileDetails[j + 1].weight)
        }
        selectedInnerElements.push(innerElement)
    }
    selectedInnerElements.map(element => selectedInnerElementsFileNames.push(element.fileName))
    let dna = sha1(selectedInnerElementsFileNames.join("-"))
    console.log(dna)
    return {
        imageData: selectedInnerElements,
        dna: dna
    }
}

//--------------------------------------

//------------ Setup Layers ------------

const createLayerElementsObject = (layerIndex) => {
    const elements = []
    for (let i = 0; i < layerConfigurations[layerIndex].layersOrder.length; i++) {
        elements.push({
            elementName: layerConfigurations[layerIndex].layersOrder[i].name,
            innerElements: fs.readdirSync(`${basePath}/layers/${layerConfigurations[layerIndex].layersOrder[i].name}`)
        })
    }
    return elements;
}

const createLayerObject = () => {
    const layerElements = []
    for (let i = 0; i < layerConfigurations.length; i++) {
        layerElements.push({
            id: i,
            growEditionSizeTo: layerConfigurations[i].growEditionSizeTo,
            elements: createLayerElementsObject(i)
        })
    }
    return layerElements;
}

//-------------------------------------

//---- Generate indexes of images -----

const generateIndexes = (count, shuffle) => {
    const array = [];
    let firstIndexNumb = 1;
    currentIndex = count - 1;
    for (let i = 0; i < count; i++) {
        array.push(firstIndexNumb)
        firstIndexNumb++
    }
    if (shuffle) {
        while (currentIndex != -1) {
            randomIndex = Math.floor(Math.random() * currentIndex)
            let temp = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temp;
            currentIndex--;
        }
    }
    return array;
}

const loadCurrentImage = async (file) => {
    loadedLayersArray = []
    try {
        return new Promise(async (resolve) => {
            loadedLayersArray[loadedLayersIndex] = loadImage(`${basePath}/layers/${file.elementName}/${file.fileName}`);
            resolve()
        })
    } catch(err) {
        console.log(err)
    }
}

const generateImage = (data, index, currentImage) => {
    const canvas = createCanvas(1000, 1000)
    const context = canvas.getContext('2d')
    let buffer;
    // console.log(data)
    let time = 0
    const loadedLayersArray = []
    data.imageData.map((file, loadedLayersIndex) => {
        // const loadedLayer = loadImage(`${basePath}/layers/${file.elementName}/${file.fileName}`)

        loadImage(`${basePath}/layers/${file.elementName}/${file.fileName}`).then(image => {
            console.time('draw Time');
            context.drawImage(image, 0, 0, 1000, 1000)
            canvas.toBuffer((err, buff) => {
                console.time('Spent Time');
                if(err) throw console.error();
                buffer = buff
                if(loadedLayersIndex == data.imageData.length-1) {
                    saveImage()
                }
                // saveImage()
                console.timeEnd('Spent Time');
            })
           console.timeEnd('draw Time');

        // loadedLayersArray[loadedLayersIndex] = loadImage(`${basePath}/layers/${file.elementName}/${file.fileName}`)

        // loadImage(`${basePath}/layers/${file.elementName}/${file.fileName}`).then(image => {
        //     context.drawImage(image, 0, 0, 1000, 1000)
        //     // const buffer = canvas.toBuffer('image/png')
        //     canvas.toBuffer((err, buffer) => {
        //         console.time('buff Time');
        //         if (err) throw err
        //         fs.writeFileSync(`./images/${index}.png`, buffer)
        //         console.timeEnd('buff Time');
        //     })
        //     console.log(`${currentImage}s generating`)
        })
        function saveImage() {
            fs.writeFileSync(`./images/${index}.png`, buffer)
        }
    })
    
    // console.log(loadedLayersArray)
}

//-------------------------------------

const generateNfts = () => {
    const collectionCount = layerConfigurations[layerConfigurations.length - 1].growEditionSizeTo;
    let imageIndexes = generateIndexes(collectionCount, collectionConfigurations.shuffle);
    let currentImage = 1;

    const layerObject = createLayerObject();

    console.time('Execution Time');
    let isRun = true
    while (currentImage < collectionCount && isRun) {
        for (let i = 0; i < layerObject.length && isRun; i++) {
            for (let j = currentImage; j <= layerObject[i].growEditionSizeTo && isRun; j++) {
                console.log(`\nEdition: ${j}`)
                console.log(`Image number: ${imageIndexes[j - 1]}\n`)

                let loops = 0
                while (true) {
                    const data = generateImageData(layerObject[i])
                    if (isValidDna(data.dna)) {
                        dnaList.push(data.dna)
                        imageDataList.push(data)
                        // fs.writeFileSync(
                        //     `${basePath}/src/data.json`,
                        //     `fileName: ${data.imageData.map(singleFile => (singleFile.fileName))}\n`,
                        //     { flag: "a+" }
                        // )
                        // const data1 = data.imageData.splice(0, 500)
                        // const data2 = data.imageData.splice(500, data.imageData.length)
                        generateImage(data, imageIndexes[j - 1], currentImage)
                        // generateImage(data, imageIndexes[imageIndexes.length - j], collectionCount - currentImage)
                        currentImage++;
                        break
                    }
                    loops++
                    console.log(loops)
                    if (loops == 100) {
                        isRun = false
                        break
                    }
                }
            }
        }
    }
    dnaList.map(dna => console.log(dna))
    // imageDataList.map(imageData => console.log(imageData))
    if (!isRun) {
        console.log("Need more attributes! Cannot generate anymore")
        console.log(`${imageDataList.length} variations created`)
    }
    console.timeEnd('Execution Time');
}

module.exports = { generateNfts }