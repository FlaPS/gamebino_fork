import {Lens} from 'monocle-ts'

export default Lens.fromProp<Array<any>>()('length').asGetter()
