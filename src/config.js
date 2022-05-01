const collectionConfigurations = {
  shuffle: false
}

const layerConfigurations = [
  {
    growEditionSizeTo: 5,
    layersOrder: [
      { name: "Background" },
      { name: "Eyeball" },
      { name: "Eye color" },
      { name: "Iris" },
      { name: "Shine" },
    ],
  },
  {
    growEditionSizeTo: 15,
    layersOrder: [
      { name: "Background" },
      { name: "Eyeball" },
      { name: "Eye color" },
      { name: "Shine" },
      { name: "Top lid" },
    ],
  },
];

module.exports = { layerConfigurations, collectionConfigurations }