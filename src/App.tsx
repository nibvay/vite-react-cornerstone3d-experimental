import { useEffect, useRef } from "react";
import {
  RenderingEngine,
  volumeLoader,
  cornerstoneStreamingImageVolumeLoader,
  setVolumesForViewports,
} from "@cornerstonejs/core";
import { init as csRenderInit } from "@cornerstonejs/core";
import { init as csToolsInit } from "@cornerstonejs/tools";
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader";

import createImageIdsAndCacheMetaData from "./lib/createImageIdsAndCacheMetaData";
import { IMAGE_INFO } from "./utils/image-info";
import { getViewportInput } from "./utils/viewport-input";
import { setTool } from "./utils/set-tool";
import { setSegmentation } from "./utils/set-segmentation";
import { generateOrthancAuthorization } from "../config";

const volumeName = "CT_VOLUME_ID"; // Id of the volume less loader prefix
const volumeLoaderScheme = "cornerstoneStreamingImageVolume"; // Loader id which defines which volume loader to use
const volumeId = `${volumeLoaderScheme}:${volumeName}`; // VolumeId with loader id + volume id

const toolGroupId = "myToolGroup";
const renderingEngineId = "myRenderingEngine";
const segmentationId = "MY_SEGMENTATION_ID";

volumeLoader.registerUnknownVolumeLoader(cornerstoneStreamingImageVolumeLoader);

async function init() {
  await csRenderInit();
  await csToolsInit();
  dicomImageLoaderInit({
    maxWebWorkers: 1,
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", generateOrthancAuthorization());
    },
  });
}

function App() {
  const elementRef1 = useRef<HTMLDivElement>(null);
  const elementRef2 = useRef<HTMLDivElement>(null);
  const elementRef3 = useRef<HTMLDivElement>(null);
  const running = useRef(false);

  useEffect(() => {
    const setup = async () => {
      if (running.current) {
        return;
      }
      running.current = true;

      await init();

      // Get Cornerstone imageIds and fetch metadata into RAM
      const imageIds = await createImageIdsAndCacheMetaData(IMAGE_INFO);

      // Instantiate a rendering engine
      const renderingEngine = new RenderingEngine(renderingEngineId);

      // Define a volume in memory
      const volume = await volumeLoader.createAndCacheVolume(volumeId, {
        imageIds,
      });

      const viewportInput = getViewportInput([
        elementRef1,
        elementRef2,
        elementRef3,
      ]);
      const viewportIds = viewportInput.map((v) => v.viewportId);
      renderingEngine.setViewports(viewportInput);

      // Set the volume to load
      volume.load();

      // add manipulation tools
      setTool(toolGroupId, viewportIds[0]);

      setVolumesForViewports(
        renderingEngine,
        [
          {
            volumeId,
            callback: ({ volumeActor }) => {
              // set the windowLevel after the volumeActor is created
              volumeActor
                .getProperty()
                .getRGBTransferFunction(0)
                .setMappingRange(-180, 220);
            },
          },
        ],
        viewportIds
      );
      await setSegmentation({
        volumeLoader,
        volumeId,
        viewportId: viewportIds[0],
        segmentationId,
      });
      renderingEngine.renderViewports(viewportIds);
    };

    setup();
  }, [elementRef1, elementRef2, running]);

  return (
    <>
      <h2>Viewport</h2>
      <div className="flex flex-row gap-1">
        <div>
          <label>AXIAL</label>
          <div
            ref={elementRef1}
            onContextMenu={(e) => e.preventDefault()}
            className="w-96 h-96 bg-black"
          />
        </div>
        <div>
          <label>SAGITTAL</label>
          <div ref={elementRef2} className="w-96 h-96 bg-black" />
        </div>
        <div>
          <label>CORONAL</label>
          <div ref={elementRef3} className="w-96 h-96 bg-black" />
        </div>
      </div>
    </>
  );
}

export default App;
