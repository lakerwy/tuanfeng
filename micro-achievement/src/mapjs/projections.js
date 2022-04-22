import { register } from "ol/proj/proj4.js";
import proj4 from "proj4";
import EPSG from "./project/epsgEnum";

export function registerProj() {
  if (EPSG) {
    for (const key in EPSG) {
      if (Object.hasOwnProperty.call(EPSG, key)) {
        proj4.defs(`EPSG:${key}`, EPSG[key]);
      }
    }
  }
  register(proj4);
}
