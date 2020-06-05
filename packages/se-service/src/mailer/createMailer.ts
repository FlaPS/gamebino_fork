import {SEServiceConfig} from '../SEServiceConfig'
import {UserVO, usersDuck} from 'se-iso/src/store/usersDuck'
import {nav} from '../../../se-mobile-front/src/nav'
import {PlanVO, plansDuck, configDuck} from 'se-iso/src'
import {SEServiceState} from '../store/serviceDuck'
import Mail from 'nodemailer/lib/mailer'
import {Store} from 'redux'
import getPlanAttachments from './getPlanAttachments'
const nodemailer = require("nodemailer")


const createTransport = async (config: SEServiceConfig) => {
    
    return  nodemailer.createTransport(config.mailer)
}
/**
 * Doc for the reference:
 * https://docs.google.com/document/d/1ia-u4yQmDY5pCjbCPDh668cmQZxLSW0IVfQWdGqCLEk/edit
 *
 * @param config
 */
export default async (io: {config: SEServiceConfig, store: Store}) => {
    const config = io.config

    const from = '"Команда Smart Eat" <no-reply@smart-eat.ru>'
    //let transporter = await createTransport(config)



    const sendMail = async (mailOptions: Mail.Options) => {
        return {}
        /*
        let result
        if(config.forwardBox && !mailOptions.to.toString().includes('+')) {
            const [email] = (mailOptions.to as any as string).split('@')
            const [box, domain] = config.forwardBox.split('@')
            mailOptions.to = box+ '+' + email + '@' + domain
        }
        try {
            result = await transporter.sendMail(mailOptions)
            console.log('Mail Sent', mailOptions.to, mailOptions.subject)
        } catch (e) {
            console.error('EMail Error', mailOptions.to, mailOptions.subject, e)
        }
        return result*/
    }


    const mailApi = {
        // 1
        userRegistered: async (user: UserVO) => {
            const info = await sendMail({
                from, // sender address
                to: user.email, // list of receivers
                subject: "Добро пожаловать на smart-eat.ru", // Subject line
                html: `
                        Здравствуйте!
                        <p/>
                        Мы рады, что вы решили стать пользователем веб-сервиса Smart Eat.
                        <p/>
                        Для входа в личный кабинет
                        <br/>
                        ваш логин: ${user.email}
                        <br/>
                        ваш пароль: ${user.password}
                        <br/>
                        Пожалуйста, не сообщайте эти данные третьим лицам.
                        <br/>
                        Перейти в ваш <a href="${config.frontendHost}${nav.myClients()}">личный кабинет</a>.
                        <br/>
                        Добро пожаловать!
                        <br/>
                        Команда Smart Eat
                    ` // html body
            });

            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

            return info
        },

        // 4
        resetPasswordRequested: async (user: UserVO) => {
            const info = await sendMail({
                from, // sender address
                to: user.email, // list of receivers
                subject: "Smart Eat. Изменение пароля", // Subject line
                html: `
                        Здравствуйте!
                        <p/>
                        Кто-то хочет изменить пароль к вашему аккаунту Smart Eat.
                        <br/>
                        Если это вы — пожалуйста, перейдите по 
                        <a href="${config.frontendHost}${nav.setPassword({resetPasswordGuid: user.resetPasswordGuid})}">ссылке</a> 
                        и укажите новый пароль.
                        <br/>
                        Если письмо отправлено Вам ошибочно, просто проигнорируйте его.
                        <p/>
                        Команда Smart Eat
                    ` // html body
            });

            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            return info
        },

        // 5
        passwordChanged: async (user: UserVO) => {
            const info = await sendMail({
                from, // sender address
                to: user.email, // list of receivers
                subject: "Smart Eat. Успешная смена пароля", // Subject line
                html: `
                        Здравствуйте!
                        <p/>
                        Пароль для доступа к Вашему аккаунту Smart Eat успешно изменен.
                        <p/>
                        Пожалуйста, не сообщайте его третьим лицам.
                        <br/>
                        <a href="${config.frontendHost}${nav.signIn()}">Войдите</a> используя новый пароль.
                        <p/>
                        Команда Smart Eat
                    ` // html body
            });

            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            return info
        },

        demoPlanAfterRegister: async (user: UserVO, plan: PlanVO, state: SEServiceState) => {
            const duration = plansDuck.getDemoPlanDuration(plan)
            const referrerUser = usersDuck.selectById(user.referrerUserId)(state)
            const config = configDuck.selectConfig(io.store.getState())
            const html = user.type === 'personal'
                                ? `
                                    <p>
                                        Добрый день!
                                    </p>
                                    <p>
                                    Пробный план питания по Вашим предпочтениям на ${duration} готов. Он прикреплен к письму вместе со списком покупок, рецептами и инструкцией.
                                    </p>
                                    
                                    <p>
                                    ПОЖАЛУЙСТА, СНАЧАЛА ПОСМОТРИТЕ ВВОДНОЕ <a href='https://youtu.be/W-FhNiE-l7U'>ВИДЕО</a>.
                                    Там есть ответы на самые частые вопросы.
                                    </p>
                                    <p>
                                    Меню сбалансировано по БЖУ для достижения классного результата без вреда здоровью! Хотите целый месяц не думать, что вам есть, и уверенно идти к цели?
                                    Пройдите по <a href='${config.frontendHost}${nav.demoMyClientPlan({planId: plan.planId })}'>ссылке</a> и закажите полное меню на 4 недели.
                                    </p>
                                    <br/>Стоимость плана на 4 недели - ${config.payments.prices.planRegular} руб. 
                                    ${
                                        referrerUser
                                            ? `   <br/>
                                                <b>Но так как вы пришли по ссылке от ${referrerUser.fullName}, цена первого плана для вас - ${config.payments.prices.planRegular - config.payments.refereeRegistrationReward - config.payments.refereeFirstPurchaseReward} р.!</b>
                                                <br/>
                                                `
                                            : ''
                                    }
                                    Вы получите:
                                    <br/>
                                    <br/>1. Индивидуальный план на основе ваших ответов. 
                                    <br/>2. Список покупок, который удобно разбит на категории продуктов и по сроку их хранения. Поход в магазин станет быстрым и экономным, БЕЗ спонтанных покупок! 
                                    У большинства диетологов настолько индивидуальный план будет стоить 3000-5000 руб. Еще и без списка покупок.
                                    
                                    <br/>3. Рецепты блюд из Ваших планов. Готовить будет просто!
                                    <br/>4. Инструкцию, как пользоваться планом, и принципы для достижения цели максимально быстро.
                                    <br/>
                                    <br/> На одном плане ваш вес может измениться на 5-10 кг, и чтобы продолжить эффективно худеть или набирать, нужно сделать перерасчет, который мы делаем со скидкой 50%
                                    <p/>
                                    <br/>Отзывы о наших планах в <a href='https://www.instagram.com/smarteat_ru/'>Instargam</a>.
                                    <br/>     <br/>Команда SmartEat
                                `
                                : `
                                        <p/>
                                        Добрый день!
                                        <p/>
                                        Пробный план питания по Вашим предпочтениям на ${duration} готов. Он прикреплен к письму вместе со списком покупок, рецептами и инструкцией. Меню сбалансировано по БЖУ для достижения результата без вреда здоровью!
                                        <p/>
                                        Такой план на 4 недели составляется 1 - 2 секунды. Такие планы будут стоить ${config.payments.prices.planVerified} р. (для тренеров)
                                        <p/>
                                        ${
                                            referrerUser 
                                                ? 
                                                `   <br/>
                                                    <b>Но так как вы пришли по ссылке от ${referrerUser.fullName}, цена первого плана для вас - ${config.payments.prices.planVerified - config.payments.refereeRegistrationReward - config.payments.refereeFirstPurchaseReward} р.!</b>
                                                    <br/>
                                                `
                                                : ''
                                        }
                                        Все идет через вас, сначала клиент вам его оплачивает, потом вы - нам. Мы направляем план вам, а вы - уже клиенту.
                                        <p/>


                                        <br />С нами удобно:
                                        <br />- Онлайн-ссылка на анкету напрямую клиенту + бланк анкеты в Word’е.
                                        <br />- Просмотр ответов клиента в личном кабинете и редактирование КБЖУ.
                                        <br />- Отправка плана напрямую в мессенджеры или на почту.
                                        <br />- Персональное оформление планов (ваше фото и контакты)
                                        
                                        <p>Видео про основные фишки сервиса тут https://youtu.be/SyhwW2hJRx8</p>
                                        <p/>
                                        Перейти в ваш <a href="${config.frontendHost}${nav.myClients()}">личный кабинет</a>.
                                        <br/>
                                        <br/>Отзывы о наших планах в <a href='https://www.instagram.com/smarteat_ru/'>Instargam</a>.
                                        <br/>
                                        Команда Smart Eat
                                `
            
            const info = await sendMail({
                from, // sender address
                to: user.email, // list of receivers
                subject: `Готов план для Вас на ${duration}`, // Subject line
                html, // html body
                attachments: await getPlanAttachments(state, plan.planId)//attachments,
            });

            console.log("Message sent: %s", info);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            return info
        },


        newClientForTrainerHandler: async (user: UserVO, plan: PlanVO)=> {
            const info = await sendMail({
                from, // sender address
                to: user.email, // list of receivers
                subject:   `${plan.profile.fullName} ${plan.profile.gender ?'заполнил' : 'заполнила'} вашу анкету на план питания'`,
                html: `
                    
                    Здравствуйте!
                    <br/>
                    <br/>
                    Вашу анкету ${plan.profile.gender ?'заполнил' : 'заполнила'} ${plan.profile.fullName}.
                    <br/>
                    Для того, чтобы создать план по этой анкете, ее необходимо оплатить. Это можно сделать, перейдя по 
                        <a href="${config.frontendHost}${nav.myClientPlan({planId: plan.planId})}">ссылке</a>. 
                    <br/>
                    Там же вы сможете просмотреть ответы и/или отредактировать КБЖУ этого плана.
                    <br/>
                    Доступ к редактированию и оплате анкет всегда есть в вашем личном кабинете.
                    <br/>
                    <br/>
                    Команда SmartEat
                `
            })

            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            return info
        },

        refereeRegistrationReward: async (referrerUser: UserVO, referee: UserVO, state) => {
            const config = configDuck.selectConfig(state)

            const info = await sendMail({
                from, // sender address
                to: referrerUser.email, // list of receivers
                subject: `Вам начислено ${config.payments.refereeRegistrationReward} баллов в SmartEat`, // Subject line
                html: `
                        
                        Ура!
                        <p/>
                        Вы рассказали о нас ${referee.fullName}, и он/она  прошел анкету на сайте smart-eat.ru. Спасибо, что порекомендовали нас!
                        
                        <p/>
                        Мы очень это ценим, поэтому начислили вам ${config.payments.refereeRegistrationReward} бонусов на счет. Цена следующего плана будет для вас с такой скидкой.
                        <p/>
                        Перейти в ваш <a href="${config.frontendHost}${nav.myClients()}">личный кабинет</a>.

                        <p/>
                        Команда Smart Eat
                        `, // html body
            });
            console.log("Message sent referrer info: %s", info.messageId)
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
            return info
        },

        refereeFirstPurchaseReward: async (referrerUser: UserVO, referee: UserVO) => {
            const config = configDuck.selectConfig(io.store.getState())
                const info = await sendMail({
                    from, // sender address
                    to: referrerUser.email, // list of receivers
                    subject: `Вам начислено ${config.payments.refereeFirstPurchaseReward} баллов в SmartEat`, // Subject line
                    html: `
                        
                        Ура!
                        <p/>
                        Вы рассказали о нас ${referee.fullName}, и он/она купила себе план питания на месяц. Спасибо, что порекомендовали нас!
                        
                        <p/>
                        Мы очень это ценим, поэтому начислили вам ${config.payments.refereeFirstPurchaseReward} бонусов на счет. Цена следующего плана будет для вас с такой скидкой.
                        <p/>
                        Перейти в ваш <a href="${config.frontendHost}${nav.myClients()}">личный кабинет</a>.

                        <p/>
                        Команда Smart Eat
                        `, // html body
                });
                console.log("Message sent referrer info: %s", info.messageId)
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
                return info
        },

        buyPlan: async (user: UserVO, plan: PlanVO, state: SEServiceState)=> {
            const config = configDuck.selectConfig(io.store.getState())
            const attachments = await getPlanAttachments(state, plan.planId)
            let info

            const price = (user.type !== 'personal' && user.verify === 'done')
                ? config.payments.prices.planVerified
                : config.payments.prices.planRegular
          
            info = await sendMail({
                from, // sender address
                to: user.email, // list of receivers
                subject: user.type === 'personal' ? "Готов план для Вас на месяц" : `Готов план для ${plan.profile.fullName} на месяц`, // Subject line
                html: user.type === 'personal' ?
                    `
                        Добрый день!
                        <p/>
                        Ваш индивидуальный план на месяц готов. В этом письме вы найдете
                        <br/>
                        1. Инструкцию, как пользоваться планом. Обязательно сначала внимательно ее прочитайте. Там есть ответы на частые вопросы!
                        <br/>
                        2. План на месяц
                        <br/>
                        3. Список покупок
                        <br/>
                        4. Рецепты
                        <p/>
                        <p>
                            <b>
                                ПОЖАЛУЙСТА, СНАЧАЛА ПОСМОТРИТЕ ВВОДНОЕ <a href="https://youtu.be/W-FhNiE-l7U">ВИДЕО</a>.
                            </b> 
                            <br/>
                            Там есть ответы на самые частые вопросы.
                        </p>
                        Кстати! 
                        <br/>
                        Когда ваш вес изменится на 5-10 кг, рекомендуем Вам сделать перерасчет плана, чтобы не снижать темп трансформации тела!
                        Перерасчет плана делаем с 50% скидкой. Цена = <strike>${config.payments.prices.planRegular}</strike> ${config.payments.prices.planVerified} руб.
                        <p/>
                        Мы с радостью сделаем его вам бесплатно 😉 Если вы пришлете нам свои фото: одну - ДО питания по плану, вторую - ПОСЛЕ питания по плану. И разрешите нам их выложить у нас в профиле с отзывом) 
                        Лицо, конечно, закроем или обрежем, если захотите!😌 Как тут, например   https://instagram.com/p/BqAH9igFlIH/
                        
                        <p/>
                        Команда Smart Eat
                    `
                    : `
                        Добрый день!<p/>
                        Индивидуальный план на месяц для вашего клиента готов. В этом письме вы найдете<br/>
                        1. Инструкцию, как пользоваться планом. Обязательно сначала внимательно ее прочитайте. Там есть ответы на частые вопросы!<br/>
                        2. План на месяц<br/>
                        3. Список покупок<br/>
                        4. Рецепты <br/>
                        
                        <p/>
                        Кстати!
                        <p/> 
                        Когда вес вашего клиента изменится на 5-10 кг, рекомендуем Вам сделать перерасчет плана, чтобы не снижать темп трансформации тела!<br/>           
                        <p/>
                        Команда SmartEat

                    `, // html body
                // Перерасчет плана делаем с 50% скидкой.<br/>  // убрали при понжении цены до 500
                attachments,
            });
                
            console.log("Message sent: %s", info.messageId);
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

            // Preview only available when sending through an Ethereal account
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

            return info
        },

        verifySuccess: async (user: UserVO) => {
            const config = configDuck.selectConfig(io.store.getState())
            const info = await sendMail({
                from, // sender address
                to: user.email, // list of receivers
                subject: "Ваш аккаунт в SmartEat подтвержден", // Subject line
                html: `
                        Поздравляем!<p/>
                        Ваш аккаунт подтвержден. Теперь вы можете:<p/>
                        
                        1. Создавать планы по цене ${config.payments.prices.planVerified} рублей.<br/>
                        2. Делать планы без логотипа SmartEat.<br/>
                        3. Указывать свои контакты/фото на планах питания.<br/>
                        
                        <p/>
                        Начать пользоваться <a href="${config.frontendHost}${nav.myClients()}">сервисом</a>.
                        <br/>
                        Если вы делаете планы большому количеству клиентов или работаете в маленьком городе/поселке, обсудить с нами индивидуальные условия сотрудничества можно по тел. +7 977 634-71-60.
                        
                        <p/>
                        Команда SmartEat

                    ` // html body
            });

            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            return info
        },

        verifyFailed: async (user: UserVO) => {
            const config = configDuck.selectConfig(io.store.getState())
            const info = await sendMail({
                from, // sender address
                to: user.email, // list of receivers
                subject: "Подтверждение Вашего аккаунта в SmartEat отклонено", // Subject line
                html: `
                       Ой!<p/>
                       <p/>
                        Подтверждение Вашего аккаунта отклонено. <p/>
                        Скорее всего дело в том, что вы предоставили:<br/>
                        - фотографии сертификата/диплома плохого качества<br/>
                        - чужие фотографии сертификата/диплома<br/>
                        - ссылку на чужую страничку в соцсети<br/>
                        - данные, судя по которым вы не являетесь тренером/диетологом/нутрициологом<br/>
                        
                        <p/>
                        Если вы все же являетесь тренером/диетологом/нутрициологом, пожалуйста, попробуйте пройти процедуру подтверждения аккаунта еще раз, предоставив другие данные.
                        <p/>
                        Перейти в <a href="${config.frontendHost}${nav.myClients()}">личный кабинет</a>
                        
                        <p/>
                        <p/>
                        Команда SmartEat


                    ` // html body
            });

            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            return info
        },

        verifyRequested: async (user: UserVO) => {
            const config = configDuck.selectConfig(io.store.getState())
            const html = `
                    Спасибо!
                    <p/>
                    Мы получили Вашу заявку на подтверждение аккаунта. 
                    <br/>
                    И обязательно рассмотрим ее в течение 24 часов. Мы обязательно вышлем вам письмо на имейл о результатах. Пожалуйста, наберитесь терпения! 
                    
                      <br/>
                    <p/>
                    После подтверждения аккаунта вы сможете:
                    <p/>
                    1. Создавать планы по цене ${config.payments.prices.planVerified} рублей.
                      <br/>
                    2. Делать планы без логотипа SmartEat.
                      <br/>
                    3. Указывать свои контакты/фото на планах питания.
                      <br/>
                    Перейти в <a href="${config.frontendHost}${nav.myClients()}">личный кабинет</a>.
                      <br/>
                     <p/>
                    Команда SmartEat
            ` // html body
            const info = await sendMail({
                from, // sender address
                to: user.email, // list of receivers
                subject: "Принята Ваша заявка на подтверждение аккаунта в SmartEat", // Subject line
                html,
            });

            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            return info
        },

        cashbackNotify: async (userId: string, state: SEServiceState) => {
            const user = usersDuck.selectById(userId)(state)
            const config = configDuck.selectConfig(state)
            const html = `
                        Добрый день!
                    <p/>
                        Чтобы план на месяц был для вас дешевле, делитесь ссылкой на анкету SmartEat с друзьями/знакомыми/коллегами и получайте деньги на счет в личном кабинете. 
                        
                    <p/>
                        Получите оба по ${config.payments.refereeRegistrationReward} руб., если друг заполнит анкету по вашей ссылке.
                    <p/>
                        Получите оба по ${config.payments.refereeFirstPurchaseReward}  руб., если друг решит купить план на месяц по вашей ссылке (у вас будет +${config.payments.refereeFirstPurchaseReward}  руб. на счету, у друга - скидка на план в ${config.payments.refereeFirstPurchaseReward}  руб.)
                    <br/>
                        Ссылку можно давать неограниченному количеству людей!
  
                    <p/>
                        Перейти на страницу со ссылкой для кэшбэка <a href="${config.frontendHost}${nav.referralGift()}">личный кабинет</a>.
                    <br/>
                    <p/>
                    Команда SmartEat
            ` // html body
            const info = await sendMail({
                from, // sender address
                to: user.email, // list of receivers
                subject: "Как купить план дешевле", // Subject line
                html,
            });

            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

            return info
        }
}

    const coveredAPI: typeof mailApi = {} as any

    Object.entries(mailApi).forEach( ([key, value]) =>
        coveredAPI[key] = async (...args) => {
            const user: UserVO = args[0]
            const plan = args[1]
            let result
            try {
                console.log('>>>>>>>----')
                console.log('sending mail', key, ' with args')
                result = await mailApi[key](...args)
                console.log("MAIL SENT")
                console.log('----<<<<<<')
            }
            catch (e){

                console.error('SEND MAIL ERROR, COULD NOT SEND', key, ' with args', e)

            }

            return result
        }
    )
    return coveredAPI
}
