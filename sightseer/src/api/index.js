import axios from 'axios';

export const getCoordinates = async (city) => {
  const url = 'https://opentripmap-places-v1.p.rapidapi.com/en/places/geoname';
  try {
    const {data} = await axios.get(url, {  
      params: {name: city},
      headers: {
        'X-RapidAPI-Key': '68af8ba831mshfe56df005a9386bp178d86jsn8d9ab6b3b0cf',
        'X-RapidAPI-Host': 'opentripmap-places-v1.p.rapidapi.com'
      }
    })
    return data  
  }
  catch (err) {
    console.log(err)
  }  
}

export const getAttractions = async (ne, sw) => {
    const url = 'https://travel-advisor.p.rapidapi.com/attractions/list-in-boundary';
    try {
      const {data: {data}} = await axios.get(url, {
        params: {
          tr_longitude: ne.lng,
          tr_latitude: ne.lat,
          bl_longitude: sw.lng,
          bl_latitude: sw.lat,      
        },
        headers: {
          'X-RapidAPI-Key': '91ba1339femsh54d307e91a5ff34p1c16c6jsn3b6c90306952',
          'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
      })  
      return data;
    }
     catch(err) {
      console.log(err)
     }
}

