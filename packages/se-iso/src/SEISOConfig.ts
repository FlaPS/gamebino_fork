export const defaultSEISOConfig = {

    // Host for backlinks in emails and sharing via smart-eat domain
    frontendHost: "http://localhost:8085",

    // host for external sharing links. For trainers to hide our contacts & logo
    externalFrontendHost: "http://localhost:8085",

    contacts: {
        phone: '+7 499 714-64-91',
    },

    planGenerator: {
        personal: {
            demo: 7,
            payed: 28,
        },
        default: {
            demo: 1,
            payed: 28,
        }
    },
    payments: {
        terminalKey: '1543831869453DEMO',
        refereeRegistrationReward: 50,
        refereeFirstPurchaseReward: 200,
        referralReward: 250,
        prices: {
            planRegular: 980,
            planVerified: 500,
        }
    }
}

export type SEISOConfig = typeof defaultSEISOConfig
