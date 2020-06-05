import * as R from 'ramda'
import {ProfileVO} from './ProfileVO'
import {SEBootstrap} from './store'

export type ProfileErrors = Partial<Record<keyof ProfileVO, string>>

export const getProfileDigest = (profile: ProfileVO, bootstrap: SEBootstrap) => {
    const profileErrors: ProfileErrors = {}

    if (profile.fullName === undefined || profile.fullName.trim().length === 0) {
        profileErrors.fullName = 'Укажите Имя'
    }

    if (profile.goal === undefined) {
        profileErrors.goal = 'Укажите вашу цель'
    }

    if (isNaN(Number(profile.age))) {
        profileErrors.age = 'Укажите ваш возраст'
    }

    else if (profile.age < 18) {
        profileErrors.age = 'Вам должно быть не менее 18-ти лет'
    }

    else if (profile.age > 120) {
        profileErrors.age = 'Возраст не более 120 лет'
    }

    if (profile.gender === undefined) {
        profileErrors.gender = 'Укажите пол'
    }

    if(profile.gender === 0 && profile.motherhood === undefined) {
        profileErrors.motherhood = 'Укажите поле'
    }

    if (isNaN(Number(profile.height))) {
        profileErrors.height = 'Укажите рост'
    }

    else if (profile.height < 120 || profile.height > 250) {
        profileErrors.height = 'Рост должен быть в диапазоне 120-250 см'
    }

    if (isNaN(Number(profile.weight))) {
        profileErrors.weight = 'Укажите вес'
    }

    else if (profile.weight < 30 || profile.weight > 250) {
        profileErrors.weight = 'Вес в диапазоне 30 - 250 кг'
    }

    if (profile.fullName === undefined) {
        profileErrors.fullName = 'Укажите имя'
    }

    if (profile.lifestyle === undefined) {
        profileErrors.lifestyle = 'Укажите уровень физической активности'
    }

    if (profile.fitnessLevel === undefined) {
        profileErrors.fitnessLevel = 'Укажите физическую подготовку'
    }

    if (profile.workoutsPerWeek === undefined) {
        profileErrors.workoutsPerWeek = 'Как часто вы тренируетесь'
    }

    if (profile.cookingsPerWeek === undefined) {
        profileErrors.cookingsPerWeek = 'Как часто вы готовите'
    }

    return {
        profile,
        profileErrors,
        profileIsValid: R.isEmpty(profileErrors),
    }
}

