const collectionConfigurations = {
  shuffle: false
}

const layerConfigurations = [
  {
    growEditionSizeTo: 10,
    layersOrder: [
      { name: "Background" },
      { name: "Eyeball" },
      { name: "Eye color" },
      { name: "Iris" },
      { name: "Shine" },
      { name: "Top lid" },
    ],
  },
];

module.exports = { layerConfigurations, collectionConfigurations }