const basePath = process.cwd();

const collectionConfigurations = {
  shuffle: true,
  pixelSize: 512,
  fileSaveLocation: `${basePath}/output/generatedData/`,
  devideSaveFilesTo: []
}

const layerConfigurations = [
  {
    growEditionSizeTo: 20,
    layersOrder: [
      { name: "1/Background" },
      { name: "1/1st Base" },
      { name: "1/Package 1" },
      { name: "1/Package 2" },
      { name: "1/Package 3" },
      { name: "1/Package 4" },
      { name: "1/Package 5" },
      { name: "1/Package 6" },
      { name: "1/Package 7" },
      { name: "1/Package 8" },
      { name: "1/Package 9" },
      { name: "1/Package 10" },
      { name: "1/Package 11" },
      { name: "1/Package 12" },
      { name: "1/Layer 2 Special" },
    ],
  },
  {
    growEditionSizeTo: 40,
    layersOrder: [
      { name: "1/Background" },
      { name: "1/1st Base" },
      { name: "1/Package 1" },
      { name: "1/Package 2" },
      { name: "1/Package 3" },
      { name: "1/Package 4" },
      { name: "1/Package 5" },
      { name: "1/Package 6" },
      { name: "1/Package 7" },
      { name: "1/Package 8" },
      { name: "1/Package 9" },
      { name: "1/Package 10" },
      { name: "1/Package 11" },
      { name: "1/Package 12" },
      { name: "2/2nd Base" },
      { name: "2/Package 13" },
      { name: "2/Package 14" },
      { name: "2/Package 15" },
      { name: "2/Package 16" },
      { name: "2/Package 17" },
      { name: "2/Layer 3 Special" },
    ],
  },
  {
    growEditionSizeTo: 60,
    layersOrder: [
      { name: "1/Background" },
      { name: "1/1st Base" },
      { name: "1/Package 1" },
      { name: "1/Package 2" },
      { name: "1/Package 3" },
      { name: "1/Package 4" },
      { name: "1/Package 5" },
      { name: "1/Package 6" },
      { name: "1/Package 7" },
      { name: "1/Package 8" },
      { name: "1/Package 9" },
      { name: "1/Package 10" },
      { name: "1/Package 11" },
      { name: "1/Package 12" },
      { name: "2/2nd Base" },
      { name: "2/Package 13" },
      { name: "2/Package 14" },
      { name: "2/Package 15" },
      { name: "2/Package 16" },
      { name: "2/Package 17" },
      { name: "2/Layer 3 Special" },
      { name: "3/3rd Base" },
      { name: "3/Package 18" },
      { name: "3/Package 19" },
      { name: "3/Package 20" },
      { name: "3/Package 21" },
      { name: "3/Layer 4 Special" },
    ],
  },
  {
    growEditionSizeTo: 80,
    layersOrder: [
      { name: "1/Background" },
      { name: "1/1st Base" },
      { name: "1/Package 1" },
      { name: "1/Package 2" },
      { name: "1/Package 3" },
      { name: "1/Package 4" },
      { name: "1/Package 5" },
      { name: "1/Package 6" },
      { name: "1/Package 7" },
      { name: "1/Package 8" },
      { name: "1/Package 9" },
      { name: "1/Package 10" },
      { name: "1/Package 11" },
      { name: "1/Package 12" },
      { name: "2/2nd Base" },
      { name: "2/Package 13" },
      { name: "2/Package 14" },
      { name: "2/Package 15" },
      { name: "2/Package 16" },
      { name: "2/Package 17" },
      { name: "2/Layer 3 Special" },
      { name: "3/3rd Base" },
      { name: "3/Package 18" },
      { name: "3/Package 19" },
      { name: "3/Package 20" },
      { name: "3/Package 21" },
      { name: "3/Layer 4 Special" },
      { name: "4/4th Base" },
      { name: "4/Package 22" },
      { name: "4/Package 23" },
      { name: "4/Package 24" },
      { name: "4/Layer 5 Special" },
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