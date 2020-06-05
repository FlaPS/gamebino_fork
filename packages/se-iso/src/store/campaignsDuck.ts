import * as FSA from '@sha/fsa'
import * as R from 'ramda'
import {createCRUDDuck, reducerWithInitialState} from '@sha/fsa'

export type CampaignVisitVO = {
    createdAt: any,
    refLink?: any,
    ip?: any,
    location?: any,
    headers?: any
}
export type CampaignLeadVO = {createdAt: string, refLink?: string, userId: string, totalDeposited: number}

export type CampaignVO = {
    campaignId: string
    name: string
    code: string

    startAtISO?: string
    endsAtISO?: string

    budget?: number
    description?: string
    deposited?: number



    visits: CampaignVisitVO[]
    leads: CampaignLeadVO[]
    plans: string[]
    personalUsers?: number

    leadsWithDeposit: number
}


const duck = createCRUDDuck<CampaignVO, 'campaignId'>('campaigns', 'campaignId', {
    visits: [] as  CampaignVisitVO[],
    leads: [] as  CampaignLeadVO[],
    plans: [] as string[],
})

const actions = {
    ...duck.actions,
    visitAdded: duck.factory<{campaignId: string, visit: CampaignVisitVO}>('newVisitAdded', {persistent: true}),
    leadAdded: duck.factory<{campaignId: string, lead: CampaignLeadVO}>('newLeadAdded', {persistent: true}),
    planPurchased: duck.factory<{campaignId: string, planId: string}>('planPurchased', {persistent: true}),
    leadDeposited: duck.factory<{campaignId: string, userId: string, amount: number}>('leadDeposited', {persistent: true})
}

export const campaignsDuck = {
    ...duck,
    actions,
    ...duck.optics,
    selectByCode: (code: string) => state =>
        duck.optics.selectEqOne({code})(state),
    reducer: duck.concatItemReducer(
        reducerWithInitialState({
            visits: [] as  CampaignVisitVO[],
            leads: [] as  CampaignLeadVO[]
        } as CampaignVO)

            .case(actions.leadAdded, (state, payload) => {
                return {
                    ...state,
                    leads: [...state.leads, payload.lead]
                }
            })
            .case(actions.planPurchased, (state, payload) => {
                return {
                    ...state,
                    plans: state.plans ? [...state.plans, payload.planId] : [payload.planId]
                }
            })
            .case(actions.visitAdded, (state, payload) => {
                return {
                    ...state,
                    visits: [...state.visits, payload.visit]
                }
            })
            .case(actions.leadDeposited, (state, payload) => {
                return {
                    ...state,
                    deposited: state.deposited + payload.amount,
                    leads: state.leads.map( l =>
                            l.userId === payload.userId
                        ? {
                            ...l,
                            totalDeposited: l.totalDeposited + payload.amount
                        }
                        : l
                    )
                }
            })
    )
}
