const basePath = process.cwd();

const collectionConfigurations = {
  shuffle: true,
  pixelSize: 2000,
  fileSaveLocation: `${basePath}/output/generatedData/`,
  devideSaveFilesTo: []
}

const layerConfigurations = [
  {
    growEditionSizeTo: 15,
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

const currentNetworks = {
  eth: "eth",
  sol: "sol"
}

const metadataConfigurations = {
  // Select correct network
  network: currentNetworks.sol,

  name: "Enter collection name",
  description: "Add collection description here",
  image: "ipfs://replaceThisWithURI",
  external_link: "https://exampleLink/1",
  animation_url: "A URL to a multi-media attachment for the item(GLTF, GLB, WEBM, MP4, M4V, OGV, and OGG, MP3, WAV, and OGA)",
  youtube_url: "A URL to a YouTube video",
  compiler: "Code Phantom Generate Engine",

  // Below configs are unique to SOLANA network
  symbol: "unique symbol (DNG)",
  seller_fee_basis_points: 500, // This is the % of royalties the creator of the NFT will receive on each purchase. (500 equates to 5%).
  creators: [ // You can add multiple wallets and sum of share must be 100
    {
      address: "wallet address 1",
      share: 20
    },
    {
      address: "wallet address 2",
      share: 80
    },
  ],
  category: "image",
  type: "image/png"
}

module.exports = { layerConfigurations, collectionConfigurations, metadataConfigurations }