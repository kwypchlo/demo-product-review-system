import { useRouter } from "next/router";

export function useRouterState<T extends string>(prop: string, defaultValue?: T): [T, (value: T) => void] {
  const router = useRouter();
  const setRouterState = (value: T) => {
    const { ...query } = router.query;

    if (value) {
      query[prop] = value;
    } else {
      delete query[prop];
    }

    void router.replace({ query }, undefined, { scroll: false });
  };

  return [(router.query[prop] as T) ?? defaultValue, setRouterState];
}
