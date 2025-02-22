import * as csTools from "@cornerstonejs/tools";

const {
  ToolGroupManager,
  addTool,
  Enums: csToolsEnums,
  ZoomTool,
  WindowLevelTool,
  BrushTool,
  BidirectionalTool,
} = csTools;

const { MouseBindings } = csToolsEnums;

export function setTool(toolGroupId: string, viewportId: string) {
  const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

  // addTool(ZoomTool);
  // addTool(WindowLevelTool);
  // addTool(BidirectionalTool);
  addTool(BrushTool);
  // toolGroup.addTool(ZoomTool.toolName);
  // toolGroup.addTool(WindowLevelTool.toolName);
  // toolGroup.addTool(BidirectionalTool.toolName);
  toolGroup.addTool(BrushTool.toolName);

  toolGroup.addViewport(viewportId);

  // toolGroup.setToolActive(WindowLevelTool.toolName, {
  //   bindings: [
  //     {
  //       mouseButton: MouseBindings.Primary, // Left Click
  //     },
  //   ],
  // });

  // toolGroup.setToolActive(ZoomTool.toolName, {
  //   bindings: [
  //     {
  //       mouseButton: MouseBindings.Secondary, // Right Click
  //     },
  //   ],
  // });

  // toolGroup.setToolActive(BidirectionalTool.toolName, {
  //   bindings: [
  //     {
  //       mouseButton: csToolsEnums.MouseBindings.Primary, // Left Click
  //     },
  //   ],
  // });

  toolGroup.setToolActive(BrushTool.toolName, {
    bindings: [{ mouseButton: csToolsEnums.MouseBindings.Primary }],
  });
}
