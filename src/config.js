const collectionConfigurations = {
  shuffle: true
}

const layerConfigurations = [
  {
    growEditionSizeTo: 1000,
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