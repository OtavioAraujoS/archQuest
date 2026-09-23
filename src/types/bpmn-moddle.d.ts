declare module "bpmn-moddle" {
  export class BpmnModdle {
    constructor(extensions?: Record<string, unknown>);
    create(type: string, attrs?: Record<string, unknown>): any;
    fromXML(xml: string): Promise<{
      rootElement: any;
      elementsById: Record<string, any>;
      warnings: unknown[];
    }>;
  }
}
