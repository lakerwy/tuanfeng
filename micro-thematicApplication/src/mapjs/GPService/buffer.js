import EsriJSON from "ol/format/EsriJSON";

const EsriUnitEnum = {
    degrees: "esriDecimalDegrees",
    miles: "esriMeters",
    kilometers: "esriKilometers",
};

/**
 * @param  {String} url GP Service url
 * @param  {Array(ol.Feature)} features 几何要素集
 * @param  {Number} radius 半径
 * @param  {String} unit 单位
 */
export async function exeBufferGP(url, features, radius, unit) {
    if (!Array.isArray(features) || !radius) {
        return;
    }

    let esriJsonObject = new EsriJSON().writeFeaturesObject(features);
    let buffer_distance_or_field = {
        distance: radius,
        units: EsriUnitEnum[unit],
    };

    let formData = new FormData();
    formData.append("f", "json");
    formData.append("geombuffer_distance_or_fieldetry", JSON.stringify(buffer_distance_or_field));
    formData.append("in_features", JSON.stringify(esriJsonObject));

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        // if (!data.messages || data.messages.length > 0) {
        //     return null;
        // }
        let featureArray = []
        data.results.forEach(i => {
            featureArray.push(i.value)
        })
        return new EsriJSON().readFeatures(featureArray[0]);
    } catch (error) {
        return null;
    }
}