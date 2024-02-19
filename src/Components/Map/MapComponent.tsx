import { Point } from "ol/geom";
import { toLonLat, transform } from "ol/proj";
import { useContext, useEffect, useRef, useState } from "react";
import { URL, travelModes } from "../../Consts/URL";
import { fetchApi } from "../../Helpers/Functions";
import { MapContextType, RoutingReturn } from "../../Types/Map";
import PlaceInput from "../Inputs/PlaceInput";
import { LayersContext } from "./LayerProvider";
import styles from "./MapStyles.module.css";
import useMapRoute from "./useMapRoute";
import Resizer from "./Resizer";

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { mapObject, markersLayer, routesLayer } = useContext(
    LayersContext
  ) as MapContextType;
  useEffect(() => {
    if (mapRef.current && mapObject) mapObject.setTarget(mapRef.current);
  }, [mapObject]);

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

      fetchApi(
        URL.getTomTomRoutingUrl([route.From, route.To], travelModes.car, true)
      )
        .then((res) => res.json())
        .then((routeData: RoutingReturn) => {
          console.log("routeData", routeData);
          const routePoints = routeData?.routes?.[0]?.legs?.[0]?.points.map(
            (rp) =>
              transform([rp.latitude, rp.longitude], "EPSG:4326", "EPSG:3857")
          );
          console.log("routeData", routeData);

          routesLayer
            ?.getSource()
            ?.getFeatures()
            .find((f) => f.get("name") === "routeLine")
            ?.getGeometry()
            ?.setCoordinates(routePoints);
        });
    }
  }, [route, routesLayer]);

  useMapRoute();
  const pannelRef = useRef<HTMLDivElement>(null);
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      <div
        ref={mapRef}
        style={{
          backgroundColor: "white",
          display: "flex",
          flexGrow: 1,
          position: "relative",
          zIndex: 0,
          width: "98.8vw",
          height: window.innerHeight,
        }}
      >
        <div ref={pannelRef} className={styles["placesInputsContainer"]}>
          <Resizer parentRef={pannelRef}/>
          <div className={styles["InputsContainer"]}>
            <PlaceInput type={"From"} markerid={"marker1"} />
            <PlaceInput type={"To"} markerid={"marker2"} />
          </div>
        </div>
      </div>
    </div>
  );
}
