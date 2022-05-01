const { layerConfigurations, collectionConfigurations } = require('./config')
const fs = require("fs");
const basePath = process.cwd();

const generateImageData = (layers) => {
    layers.layersOrder
}

//------------ Setup Layers ------------

const createLayerElementsObject = (layerIndex) => {
    const elements = []
    for(let i = 0; i < layerConfigurations[layerIndex].layersOrder.length; i++) {
        elements.push({
            elementName: layerConfigurations[layerIndex].layersOrder[i].name,
            innerElements: fs.readdirSync(`${basePath}/layers/${layerConfigurations[layerIndex].layersOrder[i].name}`)
        })
    }
    return elements;
}

const createLayerObject = () => {
    const layerElements = []
    for(let i = 0; i < layerConfigurations.length; i++) {
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
    for(let i = 0; i < count; i++) {
        array.push(firstIndexNumb)
        firstIndexNumb++
    }
    if(shuffle) {
        while(currentIndex != -1) {
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

const generateNfts = () => {
    const collectionCount = layerConfigurations[layerConfigurations.length-1].growEditionSizeTo;
    let imageIndexes = generateIndexes(collectionCount, collectionConfigurations.shuffle);
    let currentImage = 1;

    const layerObject = createLayerObject();

    while(currentImage < collectionCount) {
        for(let i = 0; i < layerObject.length; i++) {
            for(let j = currentImage; j <= layerObject[i].growEditionSizeTo; j++) {
                console.log(`Edition: ${j}`)
                console.log(`Image number: ${imageIndexes[j-1]}`)
                generateImageData(layerConfigurations[i])
                currentImage++;
            }
        }
    }
}

module.exports = {generateNfts}