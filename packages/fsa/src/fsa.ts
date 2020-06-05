import uuid from 'uuid/v4'
import {now} from 'moment'
export * from './ExtractAction'

export const factoryDelimeter = '/'


export type DefaultMeta = {
  source?: string
  persistent?: boolean
  rebroadcast?: boolean
  aggregator?: string
  userId?: string
}

export interface FactoryAction<P> {
  type: string
  payload: P
  error?: boolean
  timestamp?: number
  meta?: DefaultMeta
  guid: string
  sourceGuid?: string
  parentGuid?:string
  storeGuid?: string
  userId?: string
  isCommand?: boolean
}

export const getActionInfo = (action: FactoryAnyAction) =>
    'ACTION ' + action.type + ' ' + action.guid + ' by ' + (action.userId || '')

export type FactoryAnyAction = FactoryAction<any>

export type ActionSelector<P> = (
  action: FactoryAction<P>,
) => action is FactoryAction<P>

export type IConsumer<I, A, O = I> = (state: I, action: A) => O

export const reducerFactory = <I, P, O>(
  reducer: IConsumer<I, FactoryAction<P>, O>,
) => (selector: ActionSelector<P>) => (state: I, action: FactoryAction<P>): O =>
  selector(action) ? reducer(state, action) : ((state as any) as O)

export interface Success<P, S> {
  params?: P
  result: S
}

export interface Failure<P, E = string[]> {
  params?: P
  errors: string[]
}

export const isType = <P>(
  actionCreator: ActionCreator<P> | EmptyActionCreator,
) => {
    if (!actionCreator)
      debugger

    return () => (action: FactoryAnyAction): action is FactoryAction<P> =>
      action.type === actionCreator['type']
}

export const isTypeOfAny = <P>(actionCreator: Array<ActionCreator<P>>) => (
  action: FactoryAnyAction,
): action is FactoryAction<P> =>
  actionCreator.some(creator => creator.type === action.type)

export const isHasCreatorFactory = (
  acf: any,
): acf is { factory: ActionCreatorFactory } => acf && acf['factory']

export const isNamespace = (
  actionFactory: ActionCreatorFactory | { factory: ActionCreatorFactory },
) => (action: FactoryAnyAction) =>
  isHasCreatorFactory(actionFactory)
    ? action.type.startsWith(actionFactory.factory.base)
    : action.type.startsWith(actionFactory.base)

export interface ActionCreator<P> {
  type: string
  isType: (action: any) => action is FactoryAction<P>
  example: FactoryAction<P>
  handler: (payload: P) => any
  payloadReducer: ReducerBuilder<P, P>
  reduce: <I, A, O>(reducer: IConsumer<I, A, O>) => IConsumer<I, A, O>
  (payload: P, meta?: any | null, obj?: null | {userId?: string}): FactoryAction<P>
}

export type EmptyActionCreator = (
  payload?: undefined,
  meta?: any | null,
) => ActionCreator<undefined>

export const asyncStatuses = ['started', 'done' , 'failed' , 'unset']
export type AsyncStatus = typeof asyncStatuses[number] //'started' | 'done' | 'failed' | 'unset'

export type WithStatus<K extends string = 'asyncStatus'> = {
  [key in K]: AsyncStatus
}

export type AsyncActionCreators<P, S, E = string[]> = {
  type: string
  unset: EmptyActionCreator
  started: ActionCreator<P>
  done: ActionCreator<Success<P, S>>
  failed: ActionCreator<Failure<P, E>>
  defaultState: AsyncState<S, P, E>
  asyncReducer: ReducerBuilder<AsyncState<S, P, E>, AsyncState<S, P, E>>
}

export interface EmptySuccess<S> {
  result: S
}

export interface EmptyFailure<E> {
  error: E
}

export interface EmptyAsyncActionCreators<S, E> {
  type: string
  unset: EmptyActionCreator
  started: EmptyActionCreator
  done: ActionCreator<EmptySuccess<S>>
  failed: ActionCreator<EmptyFailure<E>>
}

export interface ActionCreatorFactory {
  (type: string, commonMeta?: any, error?: boolean): EmptyActionCreator

  <P>(
    type: string,
    commonMeta?: any,
    isError?: (payload: P) => boolean | boolean,
  ): ActionCreator<P>

  base: string

  async<P, S = undefined>(type: string, commonMeta?: any): AsyncActionCreators<P, S, any>

  async<undefined, S, E>(
    type: string,
    commonMeta?: any,
  ): EmptyAsyncActionCreators<S, E>

  async<P, S, E>(type: string, commonMeta?: any): AsyncActionCreators<P, S, E>
}

declare const process: {
  env: {
    NODE_ENV?: string;
  };
}

export type AsyncState<S, P = any, E = string> = {
  status: AsyncStatus | undefined;
  params: P | undefined;
  value: S | undefined;
  error: E | undefined;
}

export function actionCreatorFactory(
  prefix?: string | null,
  factoryMeta: {} = {},
  defaultIsError = (p: any) => p instanceof Error,
): ActionCreatorFactory {
  const actionTypes: { [type: string]: boolean } = {}

  const base = prefix ? `${prefix}${factoryDelimeter}` : ''

  function actionCreator<P = undefined>(
    type: string,
    commonMeta?: {} | null,
    isError: ((payload: P) => boolean) | boolean = defaultIsError,
  ): ActionCreator<P> {
    const fullType = base + type

    if (process.env.NODE_ENV !== 'production') {
      if (actionTypes[fullType])
        throw new Error(`Duplicate action types   : ${fullType}`)

      actionTypes[fullType] = true
    }
    const creator = Object.assign(
      (payload: P, meta?: {} | null, obj?: {userId?: string} | null) => {
        const action: FactoryAction<P> = {
          type: fullType,
          guid: uuid(),
          ...obj,
          //timestamp: now(),
          payload,
        }

        if (commonMeta || meta || factoryMeta)
          action.meta = Object.assign(factoryMeta, commonMeta, meta)

        if (isError && (typeof isError === 'boolean' || isError(payload)))
          action.error = true

        return action
      },
      {
        reduce: <I, O = I>(
          f: IConsumer<I, FactoryAction<P>, O>,
        ): IConsumer<I, FactoryAction<P>, O> => f,
        type: fullType,
        base,
      },
    )

    const reduce = <I, O>(reducer: IConsumer<I, FactoryAction<P>, O>) =>
      // @ts-ignore
      reducerFactory(reducer)(isType((creator as any) as ActionCreator<P>))

    const isType = (action: any) => action.type && action.type === fullType
    const handler = (payload: P): any => ({})

    const result = Object.assign(
      creator,
      { example: ({} as any) as FactoryAction<P> },
      {
        reduce,
        handler,
        isType,
        payloadReducer: (_ = {}, action: any) => {
          return isType(action) ? action.payload : _
        },
      },
    )

    return (result as any) as ActionCreator<P>
  }

  function asyncActionCreators<P, S, E>(
    type: string,
    commonMeta?: {} | null,
  ): AsyncActionCreators<P, S, E> {
    const started = actionCreator<P>(`${type}_STARTED`, commonMeta, false)
    const done = actionCreator<Success<P, S>>(
      `${type}_DONE`,
      commonMeta,
      false,
    )
    const failed = actionCreator<Failure<P, E>>(
      `${type}_FAILED`,
      commonMeta,
      true,
    )
    const unset = (actionCreator(
      `${type}_EMPTY`,
      commonMeta,
      false,
    ) as any) as EmptyActionCreator


    const defaultState = {
      value: undefined as any as S,
      error: undefined as any as string[],
      status: undefined,
      params: {} as any as P,
    }
    return {
      type: base + type,
      started,
      defaultState,
      done,
      failed,
      unset,
      asyncReducer: reducerWithInitialState((defaultState) as AsyncState<S, P, E>)
        .case(started, (state, payload) => ({
          value: undefined,
          error: undefined,
          status: 'started',
          params: payload,
        }))
        .case(done, (state, payload) => {
          return {
            value: payload.result,
            error: undefined,
            status: 'done',
            params: payload.params,
          }
        })
        .case(failed, (state, payload) => ({
          value: undefined,
          errors: payload.errors,
          status: 'failed',
          params: payload.params,
        }))
        .case(unset, _ => ({
          value: undefined,
          error: undefined,
          status: undefined,
          params: undefined,
        })),
    }
  }

  return (Object.assign(actionCreator, {
    async: asyncActionCreators,
    base,
  }) as any) as ActionCreatorFactory
}







export interface ReducerBuilder<InS extends OutS, OutS = InS> {
  case<P>(
      actionCreator: ActionCreator<P>,
      handler: Handler<InS, OutS, P>,
  ): ReducerBuilder<InS, OutS>;
  caseWithAction<P>(
      actionCreator: ActionCreator<P>,
      handler: Handler<InS, OutS, FactoryAction<P>>,
  ): ReducerBuilder<InS, OutS>;

  // cases variadic overloads
  cases<P1>(
      actionCreators: [ActionCreator<P1>],
      handler: Handler<InS, OutS, P1>,
  ): ReducerBuilder<InS, OutS>;
  cases<P1, P2>(
      actionCreators: [ActionCreator<P1>, ActionCreator<P2>],
      handler: Handler<InS, OutS, P1 | P2>,
  ): ReducerBuilder<InS, OutS>;
  cases<P1, P2, P3>(
      actionCreators: [
        ActionCreator<P1>,
        ActionCreator<P2>,
        ActionCreator<P3>
      ],
      handler: Handler<InS, OutS, P1 | P2 | P3>,
  ): ReducerBuilder<InS, OutS>;
  cases<P1, P2, P3, P4>(
      actionCreators: [
        ActionCreator<P1>,
        ActionCreator<P2>,
        ActionCreator<P3>,
        ActionCreator<P4>
      ],
      handler: Handler<InS, OutS, P1 | P2 | P3 | P4>,
  ): ReducerBuilder<InS, OutS>;
  cases<P>(
      actionCreators: Array<ActionCreator<P>>,
      handler: Handler<InS, OutS, P>,
  ): ReducerBuilder<InS, OutS>;

  // casesWithAction variadic overloads
  casesWithAction<P1>(
      actionCreators: [ActionCreator<P1>],
      handler: Handler<InS, OutS, FactoryAction<P1>>,
  ): ReducerBuilder<InS, OutS>;
  casesWithAction<P1, P2>(
      actionCreators: [ActionCreator<P1>, ActionCreator<P2>],
      handler: Handler<InS, OutS, FactoryAction<P1 | P2>>,
  ): ReducerBuilder<InS, OutS>;
  casesWithAction<P1, P2, P3>(
      actionCreators: [
        ActionCreator<P1>,
        ActionCreator<P2>,
        ActionCreator<P3>
      ],
      handler: Handler<InS, OutS, FactoryAction<P1 | P2 | P3>>,
  ): ReducerBuilder<InS, OutS>;
  casesWithAction<P1, P2, P3, P4>(
      actionCreators: [
        ActionCreator<P1>,
        ActionCreator<P2>,
        ActionCreator<P3>,
        ActionCreator<P4>
      ],
      handler: Handler<InS, OutS, FactoryAction<P1 | P2 | P3 | P4>>,
  ): ReducerBuilder<InS, OutS>;
  casesWithAction<P>(
      actionCreators: Array<ActionCreator<P>>,
      handler: Handler<InS, OutS, FactoryAction<P>>,
  ): ReducerBuilder<InS, OutS>;

  withHandling(
      updateBuilder: (
          builder: ReducerBuilder<InS, OutS>,
      ) => ReducerBuilder<InS, OutS>,
  ): ReducerBuilder<InS, OutS>;

  // Intentionally avoid AnyAction in return type so packages can export reducers
  // created using .default() or .build() without requiring a dependency on typescript-fsa.
  default(
      defaultHandler: Handler<InS, OutS, FactoryAnyAction>,
  ): (state: InS | undefined, action: { type: any }) => OutS;
  build(): (state: InS | undefined, action: { type: any }) => OutS;
  (state: InS | undefined, action: FactoryAnyAction): OutS;
}

export type Handler<InS extends OutS, OutS, P> = (
    state: InS,
    payload: P,
) => OutS

export function reducerWithInitialState<S>(initialState: S): ReducerBuilder<S> {
  return makeReducer<S, S>(initialState);
}

export function reducerWithoutInitialState<S>(): ReducerBuilder<S> {
  return makeReducer<S, S>();
}

export function upcastingReducer<InS extends OutS, OutS>(): ReducerBuilder<
    InS,
    OutS
    > {
  return makeReducer<InS, OutS>();
}

function makeReducer<InS extends OutS, OutS>(
    initialState?: InS,
): ReducerBuilder<InS, OutS> {
  const handlersByActionType: {
    [actionType: string]: Handler<InS, OutS, any>;
  } = {};
  const reducer = getReducerFunction(
      initialState,
      handlersByActionType,
  ) as ReducerBuilder<InS, OutS>;

  reducer.caseWithAction = <P>(
      actionCreator: ActionCreator<P>,
      handler: Handler<InS, OutS, FactoryAction<P>>,
  ) => {
    handlersByActionType[actionCreator.type] = handler;
    return reducer;
  };

  reducer.case = <P>(
      actionCreator: ActionCreator<P>,
      handler: Handler<InS, OutS,  FactoryAction<P>>,
  ) =>
      reducer.caseWithAction(actionCreator, (state, action) =>
          handler(state, action.payload),
      );

  reducer.casesWithAction = <P>(
      actionCreators: Array<ActionCreator<P>>,
      handler: Handler<InS, OutS, FactoryAction<P>>,
  ) => {
    for (const actionCreator of actionCreators) {
      reducer.caseWithAction(actionCreator, handler);
    }
    return reducer;
  };

  reducer.cases = <P>(
      actionCreators: Array<ActionCreator<P>>,
      handler: Handler<InS, OutS, P>,
  ) =>
      reducer.casesWithAction(actionCreators, (state, action) =>
          handler(state, action.payload),
      );

  reducer.withHandling = (
      updateBuilder: (
          builder: ReducerBuilder<InS, OutS>,
      ) => ReducerBuilder<InS, OutS>,
  ) => updateBuilder(reducer);

  reducer.default = (defaultHandler: Handler<InS, OutS, FactoryAnyAction>) =>
      getReducerFunction(
          initialState,
          { ...handlersByActionType },
          defaultHandler,
      );

  reducer.build = () =>
      getReducerFunction(initialState, { ...handlersByActionType });

  return reducer;
}

function getReducerFunction<InS extends OutS, OutS>(
    initialState: InS | undefined,
    handlersByActionType: { [actionType: string]: Handler<InS, OutS, any> },
    defaultHandler?: Handler<InS, OutS, FactoryAnyAction>,
) {
  return (state = initialState as InS, action: FactoryAnyAction) => {
    const handler = handlersByActionType[action.type] || defaultHandler;
    return handler ? handler(state, action) : state;
  };
}