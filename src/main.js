const { layerConfigurations, collectionConfigurations, metadataConfigurations } = require('./config')
const fs = require("fs");
const basePath = process.cwd();
const sha1 = require('../node_modules/sha1')
const { createCanvas, loadImage } = require('canvas');
let canvas = createCanvas(collectionConfigurations.pixelSize, collectionConfigurations.pixelSize)
let context = canvas.getContext('2d')
const lineReader = require('line-reader');
const dnaList = []

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

//-----------------------------------------------------------------------

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
        context.drawImage(image, 0, 0, collectionConfigurations.pixelSize, collectionConfigurations.pixelSize)
    })
    fs.writeFileSync(`./images/${index}.png`, canvas.toBuffer())
}

const generateImage = (data) => {
    console.log("start")
    context.clearRect(0, 0, collectionConfigurations.pixelSize, collectionConfigurations.pixelSize);
    console.time("drawSelectedImage")
    getImagePromises(data, data.index).then((promises) => {
        drawSelectedImage(promises, data.index)
    })
    console.timeEnd("drawSelectedImage")
    console.log("end")
}

//-----------------------------------------------------------------------

const generateNftData = () => {
    const collectionCount = layerConfigurations[layerConfigurations.length - 1].growEditionSizeTo;
    let imageIndexes = generateIndexes(collectionCount, collectionConfigurations.shuffle);
    let currentImage = 1;
    const layerObject = createLayerObject();

    let isRun = true
    let currentSaveFileNumb = 1;
    while (currentImage < collectionCount && isRun) {
        for (let i = 0; i < layerObject.length && isRun; i++) {
            for (let j = currentImage; j <= layerObject[i].growEditionSizeTo && isRun; j++) {
                console.log(`\nEdition: ${j}`)
                console.log(`Image number: ${imageIndexes[j - 1]}\n`)

                let loops = 0
                while (true) {
                    const data = generateImageData(layerObject[i], imageIndexes[j - 1])
                    if (isValidDna(data.dna)) {
                        dnaList.push(data.dna);
                        var dataContent = JSON.stringify(data);
                        fs.writeFileSync( // Save image to the json file
                            `${basePath}/src/data.json`,
                            `${dataContent}\n`,
                            { flag: "a+" }
                        )

                        if (collectionConfigurations.devideSaveFilesTo.length > 0) {
                            fs.writeFileSync( // Save image to the json file
                                `${basePath}/output/generatedData/dataFile-${currentSaveFileNumb}.json`,
                                `${dataContent}\n`,
                                { flag: "a+" }
                            )
                            if (currentImage >= collectionConfigurations.devideSaveFilesTo[currentSaveFileNumb - 1]) {
                                currentSaveFileNumb++;
                            }
                        }

                        currentImage++;
                        break
                    }
                    loops++
                    console.log(loops)
                    if (loops == 6000) {
                        isRun = false
                        break
                    }
                }
            }
        }
    }
    if (!isRun) {
        console.log("Need more attributes! Cannot generate anymore")
        console.log(`${currentImage - 1} variations created`)
    }
}

//------------------ Read saved data from .json file --------------------

const readDataFromSeperateFilesAndGenerate = () => {
    const savedFiles = fs.readdirSync(`${collectionConfigurations.fileSaveLocation}`);
    for (let i = 0; i < savedFiles.length; i++) {
        lineReader.eachLine(`${collectionConfigurations.fileSaveLocation}${savedFiles[i]}`, (line, last) => {
            const lineData = JSON.parse(line)
            generateImage(lineData)
        });
    }
}

const readDataFromDataFileAndGenerate = () => {
    lineReader.eachLine(`${basePath}/src/data.json`, (line, last) => {
        const lineData = JSON.parse(line)
        generateImage(lineData)
    });
}

//------------ Generate metadata files from data.json file --------------

const generateMetaData = () => {
    const metadataArray = [];

    lineReader.eachLine(`${basePath}/src/data.json`, (line, last) => {
        const lineData = JSON.parse(line)

        const metadata = {
            name: metadataConfigurations.name,
            description: metadataConfigurations.description,
            image: `${metadataConfigurations.image}/${lineData.index}`,
            external_link: metadataConfigurations.external_link,
            attributes: []
        }

        lineData.imageData.map((element) => {
            metadata.attributes.push(
                {
                    trait_type: element.elementName,
                    value: element.name,
                }
            )
        })
        metadataArray.push(metadata)

        fs.writeFileSync(`${basePath}/output/metadata/${lineData.index}.json`, JSON.stringify(metadata, null, 2))
        console.log(`index ${lineData.index} metadata saved`)

        if (last) {
            fs.writeFileSync(`${basePath}/output/metadata/metadata.json`, JSON.stringify(metadataArray, null, 2))
            console.log(`metadata.json generated`)
        }
    });
}

//-----------------------------------------------------------------------

module.exports = { generateNftData, readDataFromSeperateFilesAndGenerate, readDataFromDataFileAndGenerate, generateMetaData }