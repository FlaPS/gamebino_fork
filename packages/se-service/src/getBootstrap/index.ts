import {SEServiceConfig} from "../SEServiceConfig"
import xlsxImpl from './xlsxImpl'
import {getExampleLimits, IngredientVO, RecipePartVO, RecipeVO} from '../../../se-iso/src/store'


export default async () => {
    const {quiz, ingredients, recipes} = xlsxImpl()

    const defineLimits = (r: RecipeVO): RecipeVO => ({
        ...r,
        list: r.list.map( (part: RecipePartVO) => {

            part = {
                ...part,
                ...ingredients.find(i => i.name === part.name)
            }
            let sourceType = part.sourceType
            if (!sourceType) {
               sourceType = 'kcals'
               if (part.trueCarbons || part.trueProteins || part.trueFats) {
                   if (part.trueCarbons)
                       sourceType = 'carbons'
                   if (part.trueProteins)
                       sourceType = 'proteins'
                   if (part.trueFats)
                       sourceType = 'fats'
               } else {
                   if (part.carbons > part.fats + part.proteins && part.carbons > 10)
                       sourceType = 'carbons'
                   if (part.proteins > part.fats + part.carbons && part.proteins > 10)
                       sourceType = 'proteins'
                   if (part.fats > part.proteins + part.carbons && part.fats > 10)
                       sourceType = 'fats'

               }
           }
            return {
                ...part,
                sourceType,
                limits: getExampleLimits(part.exampleWeight)[sourceType],
            }
        })
    })

    return {quiz, ingredients, recipes}
}