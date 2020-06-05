import {Schema, Document, Model, model, Connection} from 'mongoose';
import { Extract, typedModel } from 'ts-mongoose';

export const getMongoRepository = <T extends Schema, S extends {
    [name: string]: Function;
}>(
    conn: Connection,
    name: string,
    schema?: T,
    collection?: string,
    skipInit?: boolean,
    statics?: S & ThisType<Model<Document & Extract<T>>>
): Model<Document & Extract<T>> & S => {
    if (schema && statics)
        schema.statics = statics;
    return conn.model(name, schema, collection) as any
}
export default getMongoRepository
