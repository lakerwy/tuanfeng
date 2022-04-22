import service from "@/utils/service";
import axios from "axios";
const STATISTICS_API = window.globalUrl.API_ONEMAP_STATISTICS; // window.globalUrl.API_ONEMAP_STATISTICS; //http://192.168.250.208:5000
const ANALYSIS_API = window.globalUrl.API_ONEMAP_STATISTICS; // "http://192.168.99.216:5000"
// 两规冲突检测
export async function TGCGCheckInfo(params) {
  return service.post(
    `${STATISTICS_API}/TFGTKJGH/YTGZService/TGCGDifCheck`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", //'application/x-www-form-urlencoded'//'application/json'
      },
    },
  );
}
// 合规性分析
export async function HGAnalysisInfo(params) {
  return service.post(
    `${STATISTICS_API}/TFGTKJGH/YTGZService/HGAnalysis`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", //'application/x-www-form-urlencoded'//'application/json'
      },
    },
  );
}
// 土地利用现状分析
export async function TDLYAnalysisInfo(params) {
  return service.post(
    `${ANALYSIS_API}/TFGTKJGH/YTGZService/AnalyLandUseStatus`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", //'application/x-www-form-urlencoded'//'application/json'
      },
    },
  );
}

// 闲置用地分析
export async function AnalyIdleLand(params) {
  return service.post(
    `${ANALYSIS_API}/TFGTKJGH/YTGZService/AnalyIdleLand`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded", //'application/x-www-form-urlencoded'//'application/json'
      },
    },
  );
}
