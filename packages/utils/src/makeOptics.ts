import * as R from 'ramda'
import {keyof} from 'io-ts'

/*
type Head<T extends any[]> = T[0]
type Tail<T> = T extends Array<any>
    ? ((...args: T) => never) extends ((a: any, ...args: infer R) => never)
        ? R
        : never
    : never

type Cons<T extends any[], H> =
    ((h: H, ...t: T) => any) extends ((...x: infer X) => any)
        ? X extends any[]
            ? X
            : never
        : never

// Generic lazy tuple reduction

interface Reduction<Base, In> {
    0: Base
    1: In
}

type Reduce<
        T extends Array<any>,
        R extends Reduction<any, any>
    > =
    R[[T] extends [[]]
        ? 0
        : 1
        ]


// Tuple reversal

interface ReverseRec<
        H extends Array<any>,
        T extends Array<any>,
        C = Cons<H, Head<T>>
    >
    extends Reduction<
            H,
            Reduce<
                Tail<T>,
                ReverseRec<
                    C,
                    Tail<T>
                >
            >
        > {}

type Reverse<T> =
    T extends Array<any>
        ? Reduce<T, ReverseRec<[], T>>
        : never

// Currying, finally

interface CurryRec<H, T extends Array<any>>
    extends Reduction<H, Reduce<Tail<T>, CurryRec<(...args: [Head<T>]) => H, Tail<T>>>> {}

type Curry<F extends (...args: any[]) => any> = Reverse<Parameters<F>> extends infer R
    ? R extends any[]
        ? Reduce<R, CurryRec<ReturnType<F>, R>>
        : never
    : never

declare function curry<F extends (...args: any[]) => any>(f: F): Curry<F>
declare const f: (a: number, b: string, c: string, d: boolean, e: void) => boolean

const curried = curry(f)
let r = curried(3)('w')(8)(false)()
r.valueOf()



type Decr<T extends number> =
    T extends 10 ? 9 :
        T extends 9 ? 8 :
            T extends 8 ? 7 :
                T extends 7 ? 6 :
                    T extends 6 ? 5 :
                        T extends 5 ? 4 :
                            T extends 4 ? 3 :
                                T extends 2 ? 1 :
                                    T extends 1 ? 0 :
                                        never;
type Length<T extends unknown[]> = T['length'];

type Last<T extends unknown[]> = T[Decr<Length<T>>];

type HasTail<T extends unknown[]> =
    T extends  ([] | [any])
        ? false
        : true

type IsEmpty<T extends unknown[]> =
    T extends  ([])
        ? true
        : false

interface Reduction<Base, In> {
    0: Base
    1: In
}


type Reduce<
        Tuple extends any[],
        R extends Reduction<any, any>
    > =
        R[
            [Tuple] extends [[]] ? 1 : 0
        ]

interface OpticsRec<I, Tuple extends any[] = [], O = I> extends
    Reduction<
        I,
        Length<Tuple> extends 0
            ? Optics<I, O>
            : Head<Tuple> extends keyof O
                ? OpticsRec<I,  Tail<Tuple>, O[Head<Tuple>]>
                : never
    >{}

type Build<
            I,
            Tuple extends any[],
        >
    =
        Head<Tuple> extends keyof I
                ? Reduce<Tuple, OpticsRec<I, Tuple>>
                : never
 */

type Getter<I, O> = (source: I) => O
    /*
function makeOptics<
    I,
    P1 extends keyof I = keyof I,
    P2 extends keyof I[P1] = keyof I[P1] ,
    P3 extends keyof I[P1][P2] = keyof I[P1][P2],
    O = P1 extends keyof I
            ? P2 extends keyof I[P1]
                ? P3 extends keyof I[P1][P2]
                    ? I[P1][P2][P3]
                    : I[P1][P2]
                :   I[P1]
            : I,

    > (...path: [P1, P2, P3]): {
            get: Getter<I, O>
            path
        }

*/
export type Optics<I, O = I> = {
    get: Getter<I, O>
    path: Path<T, infer K1, infer K2, infer K3>
}

export type Path<T,
    K1 extends keyof  T = keyof T,
    K2 extends keyof T[K1] = keyof T[K1],
    K3 extends keyof T[K1][K2] = keyof T[K1][K2]> = K1 | [K1, K2?, K3?]


function makeOptics<T>(
    ...args: [infer K1]
):  K1 extends keyof T
        ? Optics<T, T[K1]>
        : never
/*
function makeOptics<T, K1 = keyof T, K2 = keyof T[K1]>(
    ...args: [K1, K2]
):  Optics<T, T[K1][K2]>

function makeOptics<T, K1 = keyof T, K2 = keyof T[K1], K3 = keyof T[K1][K2]>(
    ...args: [K1, K2, K3]
):  Optics<T, T[K1][K2][K3]>
*/

function makeOptics (...args) {
    const path = takePath(args)
    const get = R.path(path)
    const lens = R.lensPath(path)
    return {
        path,
        get,
        lens
    }
}

const takePath = R.takeWhile(R.isNil)

/*
export const pathIn = <T>(ar: PathIn<T>) => {
    return ar
*/

const source = {
    ab: {
        bc: {
          val: 8
        }
    }
}

type Source = typeof source

const p = makeOptics<Source>('ab').get(source)

export default makeOptics