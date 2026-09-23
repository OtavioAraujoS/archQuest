import { getBusinessObject, is } from "bpmn-js/lib/util/ModelUtil";

export interface TextStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  color?: string;
}

export const DEFAULT_TEXT_STYLE: TextStyle = {
  bold: false,
  italic: false,
  underline: false,
};

export interface ModdleElement {
  $type: string;
  $parent?: ModdleElement;
  get: (name: string) => unknown;
  [key: string]: unknown;
}

interface BpmnElementLike {
  businessObject?: ModdleElement;
  labelTarget?: BpmnElementLike;
}

export interface BpmnFactory {
  create: (type: string, attrs?: Record<string, unknown>) => ModdleElement;
}

export interface TextStyleModeling {
  updateModdleProperties: (
    element: unknown,
    moddleElement: ModdleElement,
    properties: Record<string, unknown>,
  ) => void;
}

export interface TextStyleEventBus {
  fire: (event: string, payload: unknown) => void;
}

function findTextStyleEntry(
  businessObject: ModdleElement | undefined,
): ModdleElement | undefined {
  const extensionElements = businessObject?.extensionElements as
    | ModdleElement
    | undefined;
  if (!extensionElements) return undefined;

  const values = extensionElements.get("values") as ModdleElement[];
  return values.find((value) => is(value, "archquest:TextStyle"));
}

export function getTextStyle(element: BpmnElementLike): TextStyle {
  const businessObject = getBusinessObject(element as never) as
    | ModdleElement
    | undefined;
  const entry = findTextStyleEntry(businessObject);

  return {
    bold: Boolean(entry?.bold),
    italic: Boolean(entry?.italic),
    underline: Boolean(entry?.underline),
    color: (entry?.color as string | undefined) || undefined,
  };
}

export function setTextStyle(
  element: BpmnElementLike,
  style: Partial<TextStyle>,
  services: {
    modeling: TextStyleModeling;
    bpmnFactory: BpmnFactory;
    eventBus: TextStyleEventBus;
  },
) {
  const { modeling, bpmnFactory, eventBus } = services;
  const businessObject = getBusinessObject(element as never) as ModdleElement;

  let extensionElements = businessObject.extensionElements as
    | ModdleElement
    | undefined;

  if (!extensionElements) {
    extensionElements = bpmnFactory.create("bpmn:ExtensionElements", {
      values: [],
    });
    extensionElements.$parent = businessObject;
  }

  const values = extensionElements.get("values") as ModdleElement[];
  let entry = values.find((value) => is(value, "archquest:TextStyle"));

  if (!entry) {
    entry = bpmnFactory.create("archquest:TextStyle");
    entry.$parent = extensionElements;
    values.push(entry);
  }

  Object.assign(entry, style);

  modeling.updateModdleProperties(element, businessObject, {
    extensionElements,
  });

  const target = element as BpmnElementLike & { label?: unknown };
  const elementsToRedraw = [target, target.label].filter(Boolean);
  eventBus.fire("elements.changed", { elements: elementsToRedraw });
}
