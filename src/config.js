const collectionConfigurations = {
  shuffle: true
}

const layerConfigurations = [
  {
    growEditionSizeTo: 10000,
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