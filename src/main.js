const { layerConfigurations, collectionConfigurations } = require('./config')
const fs = require("fs");
const basePath = process.cwd();
const sha1 = require('../node_modules/sha1')
const { createCanvas, loadImage } = require('canvas');
const { resolve } = require('path');
let canvas = createCanvas(2048, 2048)
let context = canvas.getContext('2d')
const nReadlines = require('n-readlines');

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

const generateImageData = (layerDetails, index) => {
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
        dna: dna,
        index: index
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

//-------------------------------------

const getImagePromises = (data, index) => {
    console.time('getImagePromises');
    const promises = []
    data.imageData.map((file, index) => {
        promises.push(loadImage(`${basePath}/layers/${file.elementName}/${file.fileName}`))
    })
    console.timeEnd('getImagePromises');
    return Promise.all(promises)
}

const drawSelectedImage = (imagePromises, index) => {
    imagePromises.forEach((image, loadedLayersIndex) => {
        context.drawImage(image, 0, 0, 2048, 2048)
    })
    fs.writeFileSync(`./images/${index}.png`, canvas.toBuffer())
}

const generateImage = async (data, index, currentImage) => {
    console.log("start")
    context.clearRect(0, 0, 2048, 2048);
    console.time("drawSelectedImage")
    drawSelectedImage((await getImagePromises(data, index)), index)
    console.timeEnd("drawSelectedImage")
    console.log("end")
}

//-------------------------------------
fs.writeFileSync(
    `${basePath}/src/data.json`,
    `[\n`,
    { flag: "a+" }
)
const generateNfts = async () => {
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
                    const data = generateImageData(layerObject[i], imageIndexes[j - 1])

                    var dataContent = JSON.stringify(data);
                    // fs.writeFile(`${basePath}/src/data.json`, dataContent, 'utf8', function (err) {
                    //     if (err) {
                    //         console.log("An error occured while writing JSON Object to File.");
                    //         return console.log(err);
                    //     }
                    //     console.log("JSON file has been saved.");
                    // });

                    if (isValidDna(data.dna)) {
                        dnaList.push(data.dna)
                        imageDataList.push(data)
                        fs.writeFileSync(
                            `${basePath}/src/data.json`,
                            `${dataContent},\n`,
                            { flag: "a+" }
                        )
                        // const data1 = data.imageData.splice(0, 500)
                        // const data2 = data.imageData.splice(500, data.imageData.length)

                        // await generateImage(data, imageIndexes[j - 1], currentImage)

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
    fs.writeFileSync(
        `${basePath}/src/data.json`,
        `]\n`,
        { flag: "a+" }
    )

    //------------------ Read saved data from .json file --------------------
    const broadbandLines = new nReadlines(`${basePath}/src/data.json`);
    let line;
    let lineNumber = 1;
    
    while (line = broadbandLines.next()) {
        let dataLine = JSON.stringify(line.toString('ascii'));
        console.log(dataLine)
        // console.log(`Line ${lineNumber} has: ${line.toString('ascii')}`);
        lineNumber++;
    }

    // dnaList.map(dna => console.log(dna))
    // imageDataList.map(imageData => console.log(imageData))
    if (!isRun) {
        console.log("Need more attributes! Cannot generate anymore")
        console.log(`${imageDataList.length} variations created`)
    }
    console.timeEnd('Execution Time');
}

module.exports = { generateNfts }