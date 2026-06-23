import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
    get<T>(_key: string): T | undefined {
        return undefined;
    }

    set<T>(_key: string, _value: T, _ttl?: number): boolean {
        return true;
    }

    del(_key: string): number {
        return 0;
    }

    flush(): void {
    }

    getStats() {
        return { keys: 0, hits: 0, misses: 0, ksize: 0, vsize: 0 };
    }
}
