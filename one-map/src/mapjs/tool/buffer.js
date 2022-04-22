// npm install @turf/turf
import buffer from "@turf/buffer";
import {
  point as TPoint,
  lineString as TLineString,
  polygon as TPolygon,
} from "@turf/helpers";
import GeoJSON from "ol/format/GeoJSON";
import { Point, LineString, Polygon } from "ol/geom";
import Feature from "ol/Feature";

export const unitEnum = {
  miles: "miles",
  kilometers: "kilometers",
  degrees: "degrees",
};

export function getBufferFeature(feature, radius, unit) {
  if (!feature && !radius) {
    return;
  }
  unit = unit ? unit : unitEnum.miles;

  let geometry = feature.getGeometry();
  let coordinates = geometry.getCoordinates();
  let TFeature = null;
  if (geometry instanceof Point) {
    TFeature = TPoint(coordinates);
  } else if (geometry instanceof LineString) {
    TFeature = TLineString(coordinates);
  } else if (geometry instanceof Polygon) {
    TFeature = TPolygon(coordinates);
  }

  let geojsonFeature = new GeoJSON().writeFeatureObject(feature);
  console.log(unit)
  // let buffered = buffer(geojsonFeature, radius, { units: unit });
  let buffered = buffer(TFeature, radius, { units: unit, steps: 360});

  let resultFeature = new GeoJSON().readFeature(buffered);
  return resultFeature;
}

export function test() {
  let feature = new Feature({
    geometry: new Point([115.0, 30.73]),
  });
  let radius = 100;
  let result = getBufferFeature(feature, radius,unitEnum.kilometers);
  return result
}
