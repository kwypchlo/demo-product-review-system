// function useRouterState<T>(prop: string, defaultValue?: T) {
//   const [state, setState] = useState<T | undefined>(defaultValue);
//   const router = useRouter();
//   const setRouterState = useCallback(
//     (value: T | undefined) => {
//       if (value) {
//         const serialized = JSON.stringify(value);

//         if (serialized !== router.query[prop]) {
//           router.push({ query: { ...router.query, [prop]: serialized } });
//         }
//       } else {
//         const { [prop]: _, ...query } = router.query;
//         router.push({ query });
//       }
//     },
//     [router, prop],
//   );

//   useEffect(() => {
//     if (router.isReady && JSON.stringify(state) !== router.query[prop]) {
//       setState(JSON.parse(router.query[prop] as string) as T | undefined);
//     }
//   }, [router]);

//   return [state, setRouterState];
// }
