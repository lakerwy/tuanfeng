import { queryArcGISProperties } from './arcgis'


export const xiangGeoJson = async () => {
  let res = await queryArcGISProperties(window.globalUrl.districts.town.url, window.tuanfengxian.xiang, {format: 'geojson'});
  return res
}


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
