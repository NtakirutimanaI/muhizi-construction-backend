import { ExpressAdapter } from '@nestjs/platform-express';

export function patchExpressAdapter(): void {
  const proto = ExpressAdapter.prototype as any;
  proto._isMiddlewareApplied = proto.isMiddlewareApplied;
  proto.isMiddlewareApplied = function (name: string): boolean {
    const app = this.getInstance() as any;
    return (
      !!app._router &&
      !!app._router.stack &&
      typeof app._router.stack.filter === 'function' &&
      app._router.stack.some(
        (layer: any) => layer && layer.handle && layer.handle.name === name,
      )
    );
  };
}

