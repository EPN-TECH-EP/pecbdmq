import { RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';

export class CustomRouteReuseStrategy implements RouteReuseStrategy {

    private routeStore = new Map<string, DetachedRouteHandle>();


  shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    current: ActivatedRouteSnapshot
  ): boolean {
    return future.routeConfig === current.routeConfig;
  }

  store(
    route: ActivatedRouteSnapshot,
    handle: DetachedRouteHandle
  ): void {
    this.routeStore.set(route.routeConfig.path, handle);
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const path = route.routeConfig.path;
    return this.routeStore.get(path);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = route.routeConfig.path;
    return (
      path && ['principal'].includes(path) && !!this.routeStore.get(path)
    );
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const path = route.routeConfig.path;
    return path && ['principal'].includes(path);
  }
}
