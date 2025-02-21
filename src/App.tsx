import { useEffect, useRef } from "react"
import { RenderingEngine, type Types, volumeLoader, cornerstoneStreamingImageVolumeLoader, setVolumesForViewports } from "@cornerstonejs/core"
import { init as csRenderInit } from "@cornerstonejs/core"
import { init as csToolsInit } from "@cornerstonejs/tools"
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader"

import createImageIdsAndCacheMetaData from "./lib/createImageIdsAndCacheMetaData"
import { IMAGE_INFO } from "./utils/image-info"
import { getViewportInput } from "./utils/viewport-input"

volumeLoader.registerUnknownVolumeLoader(
  cornerstoneStreamingImageVolumeLoader
)

function App() {
  // const [orientation, setOrientation] = useState(Enums.OrientationAxis.AXIAL)

  const elementRef1 = useRef<HTMLDivElement>(null)
  const elementRef2 = useRef<HTMLDivElement>(null)
  const elementRef3 = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<Types.IVolumeViewport | null>(null)
  const running = useRef(false)

  useEffect(() => {
    const setup = async () => {
      if (running.current) {
        return
      }
      running.current = true

      await csRenderInit()
      await csToolsInit()
      dicomImageLoaderInit({ maxWebWorkers: 1 })

      // Get Cornerstone imageIds and fetch metadata into RAM
      const imageIds = await createImageIdsAndCacheMetaData(IMAGE_INFO)

      // Instantiate a rendering engine
      const renderingEngineId = "myRenderingEngine"
      const renderingEngine = new RenderingEngine(renderingEngineId)

      // Define a volume in memory
      const volumeId = "streamingImageVolume"
      const volume = await volumeLoader.createAndCacheVolume(volumeId, {
        imageIds,
      })

      const viewportInput = getViewportInput([elementRef1, elementRef2, elementRef3]);
      renderingEngine.setViewports(viewportInput);

      // Set the volume to load
      volume.load()

      setVolumesForViewports(
        renderingEngine,
        [{ volumeId }],
        viewportInput.map((v) => v.viewportId),
      );
    }

    setup()

  }, [elementRef1, elementRef2, running])

  return (
    <>
      <h2>Viewport</h2>
      <div>
        <div
          ref={elementRef1}
          style={{
            width: "512px",
            height: "512px",
            backgroundColor: "#000",
          }}
        />
        <div
          ref={elementRef2}
          style={{
            width: "512px",
            height: "512px",
            backgroundColor: "#000",
          }}
        />
        <div
          ref={elementRef3}
          style={{
            width: "512px",
            height: "512px",
            backgroundColor: "#000",
          }}
        />
      </div>
    </>
  )
}

export default App
