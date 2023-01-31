import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[let]', // eslint-disable-line @angular-eslint/directive-selector,
  standalone: true,
})
export class LetDirective<T> {
  @Input() public set let(value: T) {
    Object.assign(this.context, value);
    this.context.$implicit = value;
    this.context.let = value;

    if (!this.viewRefCreated) {
      this.viewRefCreated = true;
      this.viewContainer.createEmbeddedView(this.templateRef, this.context);
    }
  }

  private readonly context = {} as unknown as LetDirectiveContext<T>;
  private viewRefCreated = false;

  constructor(
    private readonly viewContainer: ViewContainerRef,
    private readonly templateRef: TemplateRef<LetDirectiveContext<T>>,
  ) {}

  public static ngTemplateContextGuard<T>(_directive: LetDirective<T>, context: unknown): context is LetDirectiveContext<T> {
    return !!context;
  }
}

export type LetDirectiveContext<T> = T & {
  $implicit: T;
  let: T;
};
