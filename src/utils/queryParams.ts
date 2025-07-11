export interface SimpleCodec<T> {
  default: T;
  parse?: (raw: string) => T;
  serialize?: (val: T) => string;
}

export type SimpleSchema = Record<string, SimpleCodec<any>>;

export function createQueryParams<S extends SimpleSchema>(schema: S) {
  type Result = { [K in keyof S]: S[K]["default"] };

  const read = (): Result => {
    const search = new URLSearchParams(window.location.search);
    const obj: any = {};

    for (const key in schema) {
      const codec = schema[key as keyof S];
      const raw = search.get(key);
      obj[key] = raw !== null ? (codec.parse ? codec.parse(raw) : (raw as any)) : codec.default;
    }

    return obj as Result;
  };

  const append = (partial: Partial<Result>) => {
    const search = new URLSearchParams(window.location.search);

    for (const key in partial) {
      const codec = schema[key as keyof S];
      const val = partial[key as keyof Result] as any;

      // 초기로드시 기본값 쿼리파라미터는 url에 포함하지않음
      // 필터 등 인터랙션을 통한 쿼리파람 변경시 url에 포함함
      if (val == null) search.delete(key);
      else search.set(key, codec.serialize ? codec.serialize(val) : String(val));
    }

    const qs = search.toString();
    const newURL = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
    history.pushState(null, "", newURL);
  };

  return {
    read,
    append,
  };
}
