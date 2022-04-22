
import { queryArcGISProperties } from "@/utils/arcgis.js"
export async function getTFGeoJSON() {
    let { town, county } = window.globalUrl.districts
    let xianRes = await queryArcGISProperties(county.url, county.id)
    let xiangRes = await queryArcGISProperties(town.url, town.id)
    return [xianRes,xiangRes]
}