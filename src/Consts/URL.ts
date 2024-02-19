const countrySet = "EG"
const limit = 20
export const zamazlkCoords = [31.222170096529567, 30.055463608825804];
export const URL = {
    tomtomApi: "https://api.tomtom.com",
    getTomTomGeocodingUrl: (query: string) => `${URL.tomtomApi}/search/2/geocode/${query}.json?storeResult=false&lon=${zamazlkCoords[0]}&lat=${zamazlkCoords[1]}&limit=${limit}&countrySet=${countrySet}&view=Unified&key=${import.meta.env.VITE_TOMTOM}`,
    getTomTomRoutingUrl: (stations: number[][], travelMode: string, avoidToll: boolean) => {
        const urlLocations = stations.reduce((acc, coordinates, i) => {
            const lon = coordinates[0]
            const lat = coordinates[1]
            if (i === 0) return `${lon},${lat}`
            return `${acc}:${lon},${lat}`
        }, "")
        return `${URL.tomtomApi}/routing/1/calculateRoute/${urlLocations}/json?key=${import.meta.env.VITE_TOMTOM}&routeType=fastest&traffic=true${avoidToll ? "&avoid=tollRoads" : ""}&travelMode=${travelMode}`
    },
    getNominatimGeocodingUrl : (q: string) => `https://nominatim.openstreetmap.org/search?q=${q}&format=json&countrycodes=EG`,
    getOSRMRoutingUrl: (stations: number[][], profile: string) => {
        const urlLocations = stations.reduce((acc, coordinates, i) => {
            const lon = coordinates[0]
            const lat = coordinates[1]
            if (i === 0) return `${lon},${lat}`
            return `${acc};${lon},${lat}`
        }, "")
        return `http://router.project-osrm.org/route/v1/${profile}/${urlLocations}?alternatives=true&steps=true&annotations=true`
    },
}

export const travelModes = {
    car: "car",
    taxi: "taxi",
    bus: "bus",
    pedestrian: "pedestrian",
    motorcycle: "motorcycle",
}

export const profiles = {
    car: "car",
    bike: "bike",
    foot: "foot",
    driving: "driving",
}