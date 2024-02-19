import { Feature } from "ol";
import { Point } from "ol/geom";
import { transform } from "ol/proj";
import { CSSProperties, useContext, useEffect, useState } from "react";
import Select, { StylesConfig } from "react-select";
import { URL } from "../../Consts/URL";
import { fetchApi } from "../../Helpers/Functions";
import {
  MapContextType,
  NominatimGeocodeReturn,
  geocodePlaceReturn,
} from "../../Types/Map";
import { LayersContext } from "../Map/LayerProvider";

type selectOption = { value: string; label: string };
export default function PlaceInput({
  markerid,
  type,
}: {
  markerid: string;
  type: string;
}) {
  const { mapObject, markersLayer } = useContext(
    LayersContext
  ) as MapContextType;
  //   const [placesOptions, setPlacesOptions] = useState<Array<geocodePlaceReturn>>(
  //     []
  //   );
  const [placesOptions, setPlacesOptions] = useState<
    Array<NominatimGeocodeReturn>
  >([]);
  //   const [selectedPlace, setSelectedPlace] = useState<geocodePlaceReturn>();
  const [selectedValue, setSelectedValue] = useState<selectOption>({
    value: "",
    label: "",
  });
  const [selectedPlace, setSelectedPlace] = useState<NominatimGeocodeReturn>();
  const [query, setQuery] = useState("");
  useEffect(() => {
    const getData = setTimeout(() => {
      if (query)
        fetchApi(
          // URL.getTomTomGeocodingUrl(query)
          URL.getNominatimGeocodingUrl(query)
        )
          .then((res) => res.json())
          .then((data: any) => {
            setPlacesOptions(data ?? []);
          });
      else setPlacesOptions([]);
    }, 1000);
    return () => clearTimeout(getData);
  }, [query]);

  useEffect(() => {
    if (markersLayer) {
      const createMarker = () => {
        const markerFeature = new Feature({
          geometry: new Point([]),
          name: markerid,
          type: type,
        });
        markersLayer?.getSource()?.addFeature(markerFeature);
      };
      createMarker();
    }
    return () => {};
  }, [markersLayer]);

  useEffect(() => {
    if (selectedPlace) {
      //   const originalCoords = [
      //     selectedPlace?.position.lon,
      //     selectedPlace.position.lat,
      //   ];
      const originalCoords = [
        Number(selectedPlace?.lon),
        Number(selectedPlace?.lat),
      ];
      const coords = transform(originalCoords, "EPSG:4326", "EPSG:3857");

      markersLayer
        ?.getSource()
        ?.getFeatures()
        .find((f) => f.get("name") === markerid)
        ?.getGeometry()
        ?.setCoordinates(coords);
      mapObject?.getView().animate({ zoom: 13 }, { center: coords });
    }
  }, [selectedPlace]);

  const style: { [key: string]: CSSProperties } = {
    container: {
      display: "flex",
      width: "260px",
    },
    label: {
      fontSize: ".75rem",
      fontWeight: "bold",
      lineHeight: 2,
      color: "black",
      width: "2rem",
      textAlign: "left",
    },
  };
  const colourStyles: StylesConfig<{ value: string; label: string }> = {
    control: (styles) => ({
      ...styles,
      backgroundColor: "white",
    }),
    option: (styles) => {
      return {
        ...styles,
        color: "black",
        borderBottom: "1px solid #d6d6d6",
      };
    },
    input: (styles) => ({ height: "1rem", width: "12rem", ...styles }),
    placeholder: (styles) => ({ ...styles }),
    singleValue: (styles) => ({ color: "black", ...styles }),
    menu: (styles, prop) => {
      console.log("prop", prop);
      if (!prop.options.length) return { display: "none" };
      return { ...styles };
    },
    indicatorsContainer: () => ({ display: "none" }),
  };

  return (
    <div style={style.container}>
      <label id={markerid} style={style.label} htmlFor={`${markerid}-input`}>
        {type}
      </label>
      &nbsp;&nbsp;
      <Select
        styles={colourStyles}
        aria-labelledby={markerid}
        inputId={`${markerid}-input`}
        name="aria-live-color"
        onChange={(selected) => {
          const selectedOption = selected as selectOption;
          setSelectedValue(selectedOption);
          const value = selectedOption.value;
          const po = placesOptions.find((p) => String(p.place_id) == value);
          setSelectedPlace(po);
        }}
        menuPlacement="top"
        onInputChange={setQuery}
        options={placesOptions.map<selectOption>((p) => ({
          value: String(p.place_id),
          label: p.display_name,
        }))}
        inputValue={query || selectedValue.label}
        // onFocus={() => {
        //   console.log("z");
        //   setSelectedValue({ value: "", label: "" });
        // }}
        value={selectedValue}
      />
    </div>
  );
}
