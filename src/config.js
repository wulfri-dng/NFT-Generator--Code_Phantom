const basePath = process.cwd();

const collectionConfigurations = {
  shuffle: false,
  fileSaveLocation: `${basePath}/output/generatedData/`,
  devideSaveFilesTo: [100, 200, 300]
}

const layerConfigurations = [
  {
    growEditionSizeTo: 300,
    layersOrder: [
      { name: "Base" },
      { name: "Eye" },
      { name: "Clothing" },
      { name: "Necklace" },
      { name: "Earring" },
      { name: "Hair" },
      { name: "Hat" },
      { name: "Mouth" },
      { name: "Glasses" },
      { name: "Special Accessory" },
    ],
  },
];

module.exports = { layerConfigurations, collectionConfigurations }