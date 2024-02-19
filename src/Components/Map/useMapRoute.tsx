import { Point } from "ol/geom";
import { fromLonLat, toLonLat, transform } from "ol/proj";
import { useContext, useEffect, useState } from "react";
import { URL, profiles } from "../../Consts/URL";
import { fetchApi } from "../../Helpers/Functions";
import { MapContextType } from "../../Types/Map";
import { LayersContext } from "./LayerProvider";

export default function useMapRoute() {
  const { markersLayer, routesLayer } = useContext(
    LayersContext
  ) as MapContextType;
  const [route, setRoute] = useState<{ From: number[]; To: number[] }>({
    From: [],
    To: [],
  });
  useEffect(() => {
    if (markersLayer) {
      markersLayer.getSource()?.on("changefeature", (e) => {
        const feature = e.feature;
        const type = feature?.get("type");
        const p = feature?.getGeometry() as Point;
        const coords = p.getCoordinates();
        setRoute((old) => {
          if (type == "From") {
            return {
              ...old,
              From: toLonLat(coords),
            };
          } else {
            return {
              ...old,
              To: toLonLat(coords),
            };
          }
        });
      });
    }
  }, [markersLayer]);

  useEffect(() => {
    if (routesLayer && route.From.length && route.To.length) {
      console.log("[route.From, route.To]", [route.From, route.To]);

      fetchApi(URL.getOSRMRoutingUrl([route.From, route.To], profiles.car))
        .then((res) => res.json())
        .then((routeData: any) => {
          console.log("routeData", routeData);
          const steps = routeData.routes[0].legs[0].steps.reduce(
            (
              acc: Array<Array<number>>,
              step: { intersections: Array<{ location: Array<number> }> }
            ) => {
              const interStep = step.intersections.reduce<Array<Array<number>>>(
                (
                  acc2: Array<Array<number>>,
                  inter: { location: Array<number> }
                ) => {
                  acc.push(inter.location);
                  return acc;
                },
                []
              );
              console.log("interStep", interStep);
              // acc.push(interStep);
              return acc;
            },
            []
          );
          console.log("stepssteps", steps);

          // const routePoints = routeData?.routes?.[0]?.legs?.[0]?.points.map(
          //   (rp: { latitude: any; longitude: any }) =>
          //     transform([rp.latitude, rp.longitude], "EPSG:4326", "EPSG:3857")
          // );
          const routePoints = steps.map((s: any) => fromLonLat(s));
          setTimeout(() => {
            routesLayer
              ?.getSource()
              ?.getFeatures()
              .find((f) => f.get("name") === "routeLine")
              ?.getGeometry()
              ?.setCoordinates(routePoints);
          }, 2000);
        });
    }
  }, [route, routesLayer]);

  return null;
}
