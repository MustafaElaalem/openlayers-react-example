import { Feature, Map as MapConstructor, View } from "ol";
import { defaults as defaultControls } from "ol/control";
import { LineString, Point } from "ol/geom";
import {
  DragRotateAndZoom,
  defaults as defaultInteractions,
} from "ol/interaction";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import VectorSource from "ol/source/Vector";
import XYZ from "ol/source/XYZ";
import Icon from "ol/style/Icon";
import Style from "ol/style/Style";
import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { MapContextType } from "../../Types/Map";
import pinPng from "/pin.png";
import { zamazlkCoords } from "../../Consts/URL";
import Stroke from "ol/style/Stroke";
import Fill from "ol/style/Fill";

export const LayersContext = createContext({} as MapContextType);
export default function LayerProvider(props: PropsWithChildren) {
  const [map, setmap] = useState<MapConstructor>();
  const [markersLayer, setMarkersLayer] =
    useState<VectorLayer<VectorSource<Feature<Point>>>>();
  const [routesLayer, setRoutesLayer] =
    useState<VectorLayer<VectorSource<Feature<LineString>>>>();
  useEffect(() => {
    const baseLayer = new TileLayer({
      source: new XYZ({
        // url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png",
        url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png",
      }),
      // minZoom: 1,
      // maxZoom: 12,
    });
    const markersLayerObject = new VectorLayer({
      source: new VectorSource({
        features: [],
      }),
      style: new Style({
        image: new Icon({
          src: pinPng,
          // anchor: [],
          scale: 0.05,
        }),
      }),
    });
    setMarkersLayer(markersLayerObject);
    const routeLine = new Feature({
      geometry: new LineString([]),
      name: "routeLine",
    });
    const routesLayerObject = new VectorLayer({
      source: new VectorSource({
        features: [routeLine],
      }),
      style: new Style({
        stroke: new Stroke({
          color: "#282828",
          width: 2,
        }),
        fill: new Fill({
          color: "#282828",
        }),
      }),
    });
    setRoutesLayer(routesLayerObject);
    const view = new View({
      zoom: 5,
      center: fromLonLat(zamazlkCoords),
      // maxZoom: 35,
    });
    const mapObject = new MapConstructor({
      target: undefined,
      view: view,
      layers: [baseLayer, markersLayerObject, routesLayerObject],
      controls: defaultControls({
        zoom: true,
        rotate: true,
        attribution: false,
      }),
      // ?.extend([new FullScreen({ tipLabel: "Full Screen" }), new ScaleLine()]),
      interactions: defaultInteractions()?.extend([new DragRotateAndZoom()]),
    });
    setmap(mapObject);
  }, []);

  return (
    <LayersContext.Provider
      value={{ mapObject: map, markersLayer, routesLayer }}
    >
      {props.children}
    </LayersContext.Provider>
  );
}
