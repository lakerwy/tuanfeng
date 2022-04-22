/**
 * arcgis 属性查询
 * @param  {String} url
 * @param  {String} layerId
 * @param  {Object} params
 * @param  {Array({key,value,operator})} params.where
 * @param  {String} params.format
 */
export async function queryArcGISProperties(url, layerId, params) {
  let queryUrl = url + "/" + layerId + "/query";

  let where = "1=1";
  if (params && params.where) {
    let expressions = params.where.map((o) => {
      return `${o.key} ${o.operator} ${o.value}`;
    });
    where = expressions.join(" and ");
  }

  let format = "json";
  if (params && params.format) {
    format = params.format;
  }

  let formData = new FormData();
  formData.append("f", format);
  formData.append("where", where);
  formData.append("returnGeometry", "true");
  formData.append("outFields", "*");

  try {
    const response = await fetch(queryUrl, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export const FormatEnum = {
  EsriJSON: "json",
  GeoJSON: "geojson",
};
