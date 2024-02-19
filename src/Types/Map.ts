import { Feature, Map } from "ol"
import { LineString, Point } from "ol/geom";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

export type MapContextType = {
    mapObject: Map | undefined,
    markersLayer: VectorLayer<VectorSource<Feature<Point>>> | undefined,
    routesLayer: VectorLayer<VectorSource<Feature<LineString>>> | undefined,
    // setFirstMarkerCoords: (coords: Array<number>) => void
}

export type geocodePlaceReturn = {
    type: string;
    id: string;
    score: number;
    matchConfidence: {
        score: number;
    };
    address: {
        streetName: string;
        municipality: string;
        countrySecondarySubdivision: string;
        countrySubdivision: string;
        countrySubdivisionName: string;
        countrySubdivisionCode: string;
        postalCode: string;
        extendedPostalCode: string;
        countryCode: string;
        country: string;
        countryCodeISO3: string;
        freeformAddress: string;
        localName: string;
    };
    position: {
        lat: number;
        lon: number;
    };
    viewport: {
        topLeftPoint: {
            lat: number;
            lon: number;
        };
        btmRightPoint: {
            lat: number;
            lon: number;
        };
    };
};

type Summary = {
    "lengthInMeters": number,
    "travelTimeInSeconds": number,
    "trafficDelayInSeconds": number,
    "trafficLengthInMeters": number,
    "departureTime": string,
    "arrivalTime": string,
}
type Route = {
    summary: Summary
    legs: Array<{
        summary: Summary
        points: Array<{ longitude: number, latitude: number }>,
        sections: Array<{
            "startPointIndex": number,
            "endPointIndex": number,
            "sectionType": string,
            "travelMode": string,
        }>
    }>
}
export type RoutingReturn = {
    "formatVersion": string,
    "routes": Array<Route>
}

export type NominatimGeocodeReturn = {
    "place_id": number,
    "licence": string,
    "osm_type": string,
    "osm_id": number,
    "lat": string,
    "lon": string,
    "class": string,
    "type": string,
    "place_rank": number,
    "importance": number,
    "addresstype": string,
    "name": string,
    "display_name": string,
    "boundingbox": Array<number>
}