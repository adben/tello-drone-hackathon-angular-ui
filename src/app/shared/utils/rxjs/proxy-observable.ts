import { Observable } from 'rxjs';

/**
 * An `Observable` that delegates to a source observable. This is convenient if you need to define a reusable data flow in the form of a
 * class. In the context of Angular applications this can be used to create injectable streams:
 *
 * ```typescript
 * export class BreadcrumbsStream extends ProxyObservable<BreadcrumbItem[]> {
 *   constructor(router: Router) {
 *     super(
 *       router.events.pipe(
 *         filter((event) => event instanceof NavigationEnd),
 *         startWith(undefined),
 *         map(() => extractBreadcrumbEntries(router.routerState.root.snapshot)),
 *       ),
 *     );
 *   }
 * }
 *
 * class BreadcrumbsComponent {
 *   constructor(
 *     public readonly breadcrumbs$: BreadcrumbsStream
 *   ) {}
 * }
 * ```
 */
export abstract class ProxyObservable<T> extends Observable<T> {
  protected constructor(source$: Observable<T>) {
    super((observer) => source$.subscribe(observer));
  }
}
