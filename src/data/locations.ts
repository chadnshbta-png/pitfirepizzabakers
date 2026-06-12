export interface Location {
  id: string
  name: string
  address: string
  mapUrl: string
  image: string
}

export const locations: Location[] = [
  {
    id: 'abu-dhabi',
    name: 'Abu Dhabi',
    address: 'Waterfront Tower A',
    mapUrl: 'https://maps.app.goo.gl/FbHS6vwzpop2nSV8A?g_st=ipc',
    image: '/Loaction/Abu-Dhabi-600x428.jpg',
  },
  {
    id: 'jvc',
    name: 'JVC',
    address: 'Jumeirah Village Circle',
    mapUrl: 'https://maps.app.goo.gl/X583inGeetrXmzVm8?g_st=ipc',
    image: '/Loaction/JVC-480x600.png',
  },
  {
    id: 'arjan',
    name: 'Arjan',
    address: 'Vincitore Boulevard, Arjan',
    mapUrl: 'https://maps.app.goo.gl/XN7DT6JXUEfJGVfc8',
    image: '/Loaction/Vincitore-Boulevard-Arjan-480x600.jpg',
  },
  {
    id: 'dubai-hills',
    name: 'Dubai Hills',
    address: 'Dubai Hills Business Park, Building 1',
    mapUrl: 'https://maps.app.goo.gl/z89BcDy8gu62fWUp8',
    image: '/Loaction/Bubai-Hills-e1739288450978-458x600.jpg',
  },
  {
    id: 'jlt',
    name: 'JLT',
    address: 'Cluster D, on the lake front',
    mapUrl: 'https://maps.app.goo.gl/xaxDpyG3VYqs1S7A6',
    image: '/Loaction/JLT-Cluster-D-400x600.png',
  },
  {
    id: 'mirdif',
    name: 'Mirdif',
    address: 'Mirdif Hills Avenue Shop 23',
    mapUrl: 'https://maps.app.goo.gl/Zn4PmtUFmoWuwqMW9',
    image: '/Loaction/Mirdif-Hills-Avenue-480x600.jpg',
  },
]
