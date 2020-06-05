import {QuestionVO} from 'se-iso/src/store/admin/quizDuck'
import {undefined} from 'io-ts'

const readIntArray = (row, defaultValue = []) => {
    if (row === 0 || row === '0')
        return [0]
    if (!row)
        return defaultValue

    const str = String(row)

    const result = str.split(',').map ( str => str.trim()).map(s => Number(s))
    if(result.find(v => typeof v !== 'number'))
        throw new Error('Row is not array of numbers ' + row)
    return result
}

export default (sheet: any[][]) => {
    const quiz: QuestionVO[] = []
    
    let i = 2
    while(sheet[i] && sheet[i][0] !== undefined) {
        const row = sheet[i]
        const goalsRaw = row[3]

        const goals = readIntArray(goalsRaw, [0,1,2])
        if(row[0])
            quiz.push({
                questionId: Number(row[0]),
                title: row[1],
                minChecks: row[2],
                goals,
            })
        i++
    }


    return quiz
}
