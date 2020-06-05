import {IngredientVO, RecipeVO, SEBootstrap} from './store'
import {AssociativeArray, toAssociativeArray} from '../../utils/src'
import * as R from 'ramda'
import {ProfileVO} from './ProfileVO'
import {getProfileDigest} from './getProfileDigest'


export const getMealsDigest = (bootstrap: SEBootstrap, profile: ProfileVO) => {
    const profileDigest = getProfileDigest(profile, bootstrap)


    let recipes = bootstrap.recipes
    const goal = profile.goal || 0
    const minLengths = [0, 5, 1, 5, 1, 5, 1]

    const ingredients: IngredientVO[] = bootstrap
        .ingredients
        .filter(i =>
            profile.ingredients.includes(i.name)&&
            i.goals.includes(goal)
        )

    const ingredientsByName = toAssociativeArray<IngredientVO>('name')(ingredients)
    let ingredientsByAliases: AssociativeArray<IngredientVO[]> = {}


    ingredients.forEach( i => {
            i.replaceAliases.forEach( alias => {
                const ar = ingredientsByAliases[alias] || (ingredientsByAliases[alias] = [])
                ar.push(i)
            })
        }
    )

    const maxPriority = R.reverse(R.sortBy(R.prop('priority'), recipes))[0].priority
    let allMeals: RecipeVO[] = recipes.filter(recipe =>
        recipe
            .list
            .filter( part => part.required)
            .every( part => {
                return part.goals.includes(goal) && (part.isAlias
                        ? ingredients.find( i => i.replaceAliases.includes(part.name))
                        : ingredients.find(i => i.name === part.name)
                )
            })
    )
    allMeals = allMeals.map( recipe => ({
        ...recipe,
        list: recipe.list.filter (part =>
            part.isAlias ? ingredientsByAliases[part.name] : ingredientsByName[part.name]
        )
    }))
    allMeals = allMeals.map( recipe => ({
        ...recipe,
        list: recipe.list.filter (part => part.goals.includes(goal))
    }))

    const getAvailableMealsByIndex = (index: number) => {
        let meals = []
        let priority = 1
        while(priority <= maxPriority && meals.length < minLengths[index]) {
            const mealsToAdd = allMeals
                .filter(    recipe =>
                    recipe.recipeIndex.toString().startsWith(String(index)) &&
                    (recipe.priority === priority)
                )

            meals = [...meals, ...mealsToAdd]
            priority += 1
        }

        const startIndex = Math.floor(Math.random() * meals.length)
        return  R.flatten(R.splitAt(startIndex, meals))
    }

    const meals = {
        breakfast: getAvailableMealsByIndex(1),
        snack1: getAvailableMealsByIndex(2),
        dinner: getAvailableMealsByIndex(3),
        snack2: getAvailableMealsByIndex(4),
        supper: getAvailableMealsByIndex(5),
        snack3: getAvailableMealsByIndex(6),
    }

    const mealsIsValid = meals.snack3.length > 0 &&
        meals.snack2.length > 0 &&
        meals.snack1.length > 0 &&
        meals.breakfast.length > 1 &&
        meals.supper.length > 1 &&
        meals.dinner.length > 1

    const answers = []

    profile.ingredients.forEach(
        name => {
            const ing = ingredientsByName[name];
            if (ing)
                (ing.questionIds || []).forEach( id =>
                    answers[id] = (answers[id] || 0) + 1
                )
        }
    )
    bootstrap.quiz.forEach( (question) => {
            if( answers[question.questionId] < question.minChecks) {
                profileDigest.profileErrors['ingredients'+question.questionId] = 'Укажите больше продуктов в группе: "'+ question.title +'" '
            }
        }
    )

    return {
        ...profileDigest,
        meals,
        mealsIsValid,
        ingredientsByName,
        ingredientsByAliases,
        ingredients,
    }
}
export type MealsDigest = ReturnType<typeof getMealsDigest>