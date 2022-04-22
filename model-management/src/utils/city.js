import { queryArcGISProperties } from "./arcgis";

/**
 * 根据配置的行政区划服务，获取县
 * @returns {Array<Object>} [{name,code,id}]
 */
export async function getCounty() {
  let county = window.globalUrl?.districts?.county;
  if (county) {
    if (county.type === "ArcGISServer") {
      let geojson = await queryArcGISProperties(county.url, county.id);
      if (geojson && geojson.features) {
        let features = geojson.features;
        return features.map(f => {
          let properties = f.properties;
          return {
            name: properties.Name,
            code: properties.ad_code,
            id: properties.id
          };
        });
      }
    }
  }
  return;
}

/**
 * 根据县的行政编码，获取乡镇集合
 * @param  {string} code
 * @returns {Array<Object>} [{name,code,id}]
 */
export async function getTown(code) {
  let town = window.globalUrl?.districts?.town;
  if (town) {
    if (town.type === "ArcGISServer") {
      let geojson = await queryArcGISProperties(town.url, town.id, {
        where: [{ key: "ad_code", value: `'${code}%'`, operator: "like" }]
      });
      if (geojson && geojson.features) {
        let features = geojson.features;
        return features.map(f => {
          let properties = f.properties;
          return {
            name: properties.Name,
            code: properties.ad_code,
            id: properties.id
          };
        });
      }
    }
  }
  return;
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
