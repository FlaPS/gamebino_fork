import {Profile } from 'se-iso/src/ProfileVO'
import {now} from '@sha/utils'
import appStorage from 'se-iso/src/appStorage'


const testProfile = (): Profile => {
    if (
        window.location.search.endsWith('blank')
    ) return {ingredients: [], dailyPFC: undefined}

    return {

        fullName: 'Max Shammasov',
        email: `miramaxis+${now()}@gmail.com`,
        weight: 100,
        motherhood: 0,

        height: 176,
        age: 30,
        lifestyle: 2,
        fitnessLevel: 1,
        workoutsPerWeek: 2,
        goal: 1,
        dailyPFC: undefined,
        ingredients: [
            "Картофель",
            "Манная крупа",
            "Куриная грудка",
            "Тилапия",
            "Сыр нежирный (до 20%)",
            "Помидоры",
            "Перец сладкий",
            "Яблоко",
            "Белок",
            "Желток",
            "Масло подс.",
            "Лавровый лист",
            "Огурцы",
            "Лук репчатый",
            "Морковь",
            "Цв. Капуста",
            "Молоко 2,5%",
            "Дорадо",
            "Семга",
            "Грудка индейки",
            "Прованские травы",
            "Миндаль",
            "Рис белый",
            "Гречка",
            "Груша",
        ]
    }
}

const predefinedProfile = appStorage.getItem('testProfile', undefined)

export default (): Profile =>
    predefinedProfile || (
          (

            window.location.host === 'smart-eat.ru' ||
            window.location.host === 'planpitania.ru' ||
            window.location.host === 'www.smart-eat.ru' ||
            window.location.host === 'www.planpitania.ru'
          )
            ?   {
                        ingredients: [],
                        dailyPFC: undefined,
                }

            :    testProfile()

    )