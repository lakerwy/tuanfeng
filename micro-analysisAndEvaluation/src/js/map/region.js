import { queryArcGISProperties } from './arcgis'

export const getRegions = async (url, id) => {
  let res = await queryArcGISProperties(url, id, {format: 'geojson'});
  if(res) {
    let region = res.features.map(item => {
      return {
        id: item.id,
        name: item.properties.Name,
        code: item.properties.ad_code
      }
    })
    return region
  }
}
