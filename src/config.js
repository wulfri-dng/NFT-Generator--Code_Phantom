const basePath = process.cwd();

const collectionConfigurations = {
  shuffle: false,
  pixelSize: 2000,
  fileSaveLocation: `${basePath}/output/generatedData/`,
  devideSaveFilesTo: [1667, 3334, 5001, 6668, 8335, 10000]
}

const layerConfigurations = [
  {
    growEditionSizeTo: 10000,
    layersOrder: [
      { name: "1_Backgrounds" },
      { name: "2_Base charachter" },
      { name: "3_Dresses" },
      { name: "4_1_Beard" },
      { name: "4_Small beard" },
      { name: "5_Nails" },
      { name: "6_Mouth with item" },
      { name: "7_Mustache" },
      { name: "8_Eyes" },
      { name: "9_Jacket" },
      { name: "10_Hats" },
      { name: "11_Hand with item" },
      { name: "12_Hand bangle" },
      { name: "13_Imaginations" },
      { name: "14_Shoulder with item" },
    ],
  },
];

const metadataConfigurations = {
  name: "Enter collection name",
  description: "Add collection description here",
  image: "ipfs://replaceThisWithURI",
  external_link: "https://exampleLink/1",
  animation_url: "A URL to a multi-media attachment for the item(GLTF, GLB, WEBM, MP4, M4V, OGV, and OGG, MP3, WAV, and OGA)",
  youtube_url: "A URL to a YouTube video",
  compiler: "Code Phantom Generate Engine"
}

module.exports = { layerConfigurations, collectionConfigurations, metadataConfigurations }