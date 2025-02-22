import * as csTools from "@cornerstonejs/tools";

const { Enums: csToolsEnums, segmentation } = csTools;

interface SetSegmentationParams {
  volumeLoader: any;
  volumeId: string;
  viewportId: string;
  segmentationId: string;
}

export async function setSegmentation({ volumeLoader, volumeId, viewportId, segmentationId }: SetSegmentationParams) {
  // Create a segmentation of the same resolution as the source data for the CT volume
  volumeLoader.createAndCacheDerivedLabelmapVolume(volumeId, {
    volumeId: segmentationId,
  });

  // Add the segmentations to state. As seen the labelmap data
  // which is the cached volumeId is provided to the state
  segmentation.addSegmentations([
    {
      segmentationId,
      representation: {
        // The type of segmentation
        type: csToolsEnums.SegmentationRepresentations.Labelmap,
        // The actual segmentation data, in the case of labelmap this is a
        // reference to the source volume of the segmentation.
        data: {
          volumeId: segmentationId,
        },
      },
    },
  ]);

  await segmentation.addLabelmapRepresentationToViewportMap({
    [viewportId]: [
      {
        segmentationId,
        type: csToolsEnums.SegmentationRepresentations.Labelmap,
      },
    ],
  });
}
