/*
 * @Author: 任继民
 * @Date: 2021-04-27 11:11:01
 * @LastEditors: 任继民
 * @LastEditTime: 2021-04-27 11:13:02
 * @Description:
 */

import { queryArcGISProperties } from "./arcgis.js"
export async function getTFGeoJSON() {
    let { town, county } = window.globalUrl.districts
    let xianRes = await queryArcGISProperties(county.url, county.id)
    let xiangRes = await queryArcGISProperties(town.url, town.id)
    return [xianRes,xiangRes]
}
