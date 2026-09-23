declare module "bpmn-moddle" {
  export class BpmnModdle {
    constructor(extensions?: Record<string, unknown>);
    create(type: string, attrs?: Record<string, unknown>): any;
  }
}
