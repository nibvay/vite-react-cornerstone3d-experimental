import { Enums } from "@cornerstonejs/core";

const viewportId1 = "CT_AXIAL";
const viewportId2 = "CT_SAGITTAL";
const viewportId3 = "CT_CORONAL";

export function getViewportInput(elements: React.MutableRefObject<HTMLDivElement>[]) {
  const viewportInput = [
    {
      viewportId: viewportId1,
      element: elements[0].current,
      type: Enums.ViewportType.ORTHOGRAPHIC,
      defaultOptions: {
        orientation: Enums.OrientationAxis.AXIAL,
      },
    },
    {
      viewportId: viewportId2,
      element: elements[1].current,
      type: Enums.ViewportType.ORTHOGRAPHIC,
      defaultOptions: {
        orientation: Enums.OrientationAxis.SAGITTAL,
      },
    },
    {
      viewportId: viewportId3,
      element: elements[2].current,
      type: Enums.ViewportType.ORTHOGRAPHIC,
      defaultOptions: {
        orientation: Enums.OrientationAxis.CORONAL,
      },
    },
  ];

  return viewportInput;
}
