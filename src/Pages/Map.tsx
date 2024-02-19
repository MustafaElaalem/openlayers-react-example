import LayerProvider from "../Components/Map/LayerProvider";
import MapComponent from "../Components/Map/MapComponent";

export default function Map() {
  return (
    <div>
      <LayerProvider>
        <MapComponent />
      </LayerProvider>
    </div>
  );
}
