import React from 'react'
import {Div} from 'atomize'
import GreenButton from '../buttons/GreenButton'
import {useDispatch} from 'react-redux'
import SEList from '../parts/SEList'
import SEListHeading from '../parts/SEListHeading'
import SEModal from './SEModal'


export default ({isOpen, onClose}) => {
    const dispatch = useDispatch();
    return <SEModal isOpen={isOpen} onClose={onClose} maxW={'50rem'}>
        <SEList>
            <SEListHeading>Договор Оферты</SEListHeading>
            <Div maxH={'55vh'}
                 maxW={'75vw'}
                 style={{
                     overflowY: 'scroll',
                     overflowX: 'hidden',
                     textAlign: 'left',
                 }}
            >

                <p>Г. Москва</p>

                <p>12.12.2019</p>

                <h3>Договор публичной оферты № 1</h3>
                <br/>
                <h4>1. Общие положения</h4>

                <p>
                    Настоящий договор является публичным договором (публичной офертой на
                    основании пункта 2 статьи 437 Гражданского Кодекса Российской Федерации)
                    между <b>Индивидуальным предпринимателем</b> Красавиным Денисом
                    Александровичом, именуемого в дальнейшем «Исполнитель», действующего на
                    основании Свидетельства о государственной регистрации физического лица в
                    качестве индивидуального предпринимателя №313774626600622 от 23 сентября
                    2013 года, и любом физическим лицом, выразившим готовность
                    воспользоваться услугами Исполнителя и принявшим условия настоящего
                    договора (далее – Договор), именуемому в дальнейшем «Заказчик».

                </p>

                <p>
                    В соответствии с пунктом 2 статьи 437 Гражданского Кодекса Российской
                    Федерации (ГК РФ) в случае принятия ниже изложенных условий и оплаты
                    услуг, лицо, производящее акцепт этой оферты, становится Заказчиком.
                </p>

                <p>
                    Полным и безоговорочным акцептом настоящей публичной оферты считается
                    факт оплаты Заказчиком услуг, предоставляемых Исполнителем в
                    соответствии с условиями Договора, путем нажатия на кнопку «Оплатить
                    план», и/или факт получения примера плана, путем нажатия на кнопку
                    «Получить пример плана», на любой странице сайта Исполнителя, где такие
                    кнопки присутствуют, по адресу http://smart-eat.ru (далее – «Сайт
                    Исполнителя»).
                </p>

                <p><b>
                    Публичный договор, совершенный в вышеописанном порядке, считается
                    заключенным в простой письменной форме, не требует оформления на
                    бумажном носителе и обладает полной юридической силой.</b>
                </p>

                <p>
                    С момента совершения акцепта Заказчик считается ознакомившимся и
                    согласившимся с настоящей публичной офертой, и в соответствии с ГК РФ
                    считается вступившим с Исполнителем в договорные отношения в
                    соответствии с условиями Договора.
                </p>

                <p>
                    Исполнитель оставляет за собой право при определенных условиях изменять
                    условия Договора (в части цены, сроков предоставления услуг, формы
                    предоставления плана питания и др.) в одностороннем без акцептном
                    порядке, обеспечивая при этом публикацию измененных условий на Сайте
                    Исполнителя.
                </p>
                <br/>
                <h4>2. Термины и определения</h4>

                <p>
                    В целях Договора Стороны согласились использовать следующие термины и
                    определения:
                </p>

                <p>
                    2.1 <b>Клиент</b> – лицо, чьи данные внесены в Онлайн-анкету. Это может быть
                    сам Заказчик или клиент Заказчика (например клиент тренера, клиент
                    фитнес-клуба, клиент диетолога/нутрициолога, клиент блогера и др.), или
                    третье лицо.

                </p>

                <p>2.2 <b>Онлайн-анкета</b> – анкета, в которой заполняются данные Клиента:</p>

                <p>- рост, вес, возраст и др.</p>

                <p>- вкусовые предпочтения: что клиент ест/не ест и др.</p>

                <p>- предпочтения в готовке: как часто он хочет готовить и др.</p>

                <p>
                    2.3 <b>План питания</b> – индивидуальный план питания на 28 дней, составленный
                    на основе ответов Клиента в Онлайн-анкете. В комплекте с планом питания
                    также идет список покупок и инструкция.
                </p>

                <p>
                    2.4. <b>Веб-сервис</b> – собственное разработанное программное обеспечение по
                    сбору данных, автоматическому созданию и отправке планов питания на
                    электронную почту или в мессенджеры.
                </p>
                <br/>
                <h4>3. Предмет Договора</h4>

                <p>
                    3.1. Предметом Договора является возмездное предоставление Исполнителем
                    информационно-консультационных услуг по составлению индивидуального
                    плана питания для Заказчика в целях нормализации веса и режима питания
                    или под другие цели клиента (далее – «Услуги»).
                </p>
                <br/>
                <h4>4. Права и обязанности Исполнителя</h4>

                <p>Исполнитель обязан:</p>

                <p>4.1. Надлежащим образом оказать Услуги по настоящему Договору.</p>

                <p>
                    4.2. Приступить к оказанию Услуг непосредственно после поступления на
                    счет Исполнителя полной стоимости Услуг.
                </p>

                <p>
                    Дата начала оказания Услуг может быть отложена на соответствующий срок в
                    случае, если невозможность оказания Услуг обусловлено
                    невыполнением/ненадлежащим выполнением Заказчиком своих обязательств по
                    Договору или по техническим причинам.
                </p>

                <p>
                    4.3. Давать Заказчику в случае необходимости разъяснения по вопросам
                    реализации плана питания по средствам электронной почты, телефону,
                    мессенджерам.
                </p>

                <p>
                    4.4. Услуги считаются оказанными надлежащим образом и принятыми
                    Заказчиком, если в течение 5 (пяти) дней после получения Заказчиком
                    плана питания Исполнитель не получил от Заказчика письменных
                    аргументированных претензий.
                </p>

                <p>
                    По истечении срока, указанного выше, претензии Заказчика относительно
                    недостатков Услуг, в том числе по количеству (объему), стоимости и
                    качеству не принимаются.
                </p>

                <p>Исполнитель имеет право:</p>

                <p>
                    4.5. Требовать от Заказчика предоставления полной информации (в рамках и
                    целях настоящего договора) для надлежащего заполнения Онлайн-анкеты.
                </p>

                <p>
                    4.6. Отказаться от оказания Услуг с направлением Заказчику
                    соответствующего уведомления в случае, если анализ физического состояния
                    (вкусовых предпочтений, аллергий и др.) Заказчика выявит медицинские
                    противопоказания к использованию плана питания Исполнителя. В таком
                    случае Исполнитель обязуется произвести возврат денежных средств, если
                    план питания не был сформирован, в размере стоимости Услуг, оплаченных
                    Заказчиком в течение 30 (тридцати) дней с момента уведомления Заказчика
                    об отказе от оказания Услуг.
                </p>

                <p>
                    4.7. Отказать в предоставлении услуг Заказчику, если по техническим
                    причинам не может составить план питания из-за медицинских
                    противопоказаний или других особенностей питания клиента.
                </p>

                <p>
                    4.8. Отказать в предоставлении услуг или в возврате денежных средств
                    Заказчику, если Заказчик недобросовестно изучил информацию о продукте,
                    ввел некорректные данные в Онлайн-анкету, не задал уточняющих вопросов
                    до оплаты плана.
                </p>
                <br/>
                <h4>5. Права и обязанности Заказчика</h4>

                <p>Заказчик обязан:</p>

                <p>
                    5.1. Предоставлять Исполнителю достоверные сведения и данные,
                    необходимые для оказания Услуг, путем прохождения Онлайн-анкеты.
                </p>

                <p>
                    5.2. Заказчик сам или его клиент, или лицо, за кого он оплачивает план,
                    до оплаты плана питания должен проконсультироваться с лечащим врачом или
                    другим специалистом, получить рекомендации по питанию и отразить их в
                    Онлайн-анкете. Если рекомендации нельзя отразить в полном объеме,
                    Заказчик должен до оплаты плана питания проконсультироваться с
                    Исполнителем о возможности составления плана питания.
                </p>

                <p>
                    5.2.1. После получения плана также проконсультироваться с лечащим врачом
                    или другим профильным специалистом, чтобы тот дал разрешение следовать
                    данному плану питания.
                </p>

                <p>
                    5.3. Не воспроизводить, не копировать, не распространять, кроме
                    Онлайн-анкеты, а также не использовать любым иным способом в каких бы то
                    ни было целях контент сайта (http://smart-eat.ru), страницы в соц. сетях
                    Заказчика (в том числе: https://www.instagram.com/smarteat_ru;
                    https://www.instagram.com/anton.smarteat), за исключением личного
                    использования или по письменному согласию Заказчика.
                </p>

                <p>
                    5.4. Заказчик гарантирует, что им не будет распространяться любыми
                    возможными способами (включая, но не ограничиваясь: сайты в сети
                    Интернет, все без исключения социальные сети, в том числе, персональную
                    страницу Заказчика) какая-либо негативная информация, касающаяся
                    Исполнителя, методов и способов оказания Услуг и т.д. Указанная
                    информация включает в себя, но не ограничивается: любые негативные
                    мнения, суждения, домыслы, факты, не подтвержденные официальными
                    источниками, клевету, оскорбления, касающиеся обозначенного в настоящем
                    пункте предмета. Данное условие
                    является существенным условием Договора.
                </p>

                <p>5.5. Полностью соблюдать планы питания, полученные от Исполнителя.</p>

                <p>
                    5.6. Внимательно изучить информация на Сайте и корректно ввести
                    информация в Онлайн-анкету. Если Заказчик сомневается в соответствии
                    плана питания его ожиданиям, он может получить пример плана питания на 1
                    день или 1 неделю бесплатно и задать интересующие его вопросы Заказчику.
                </p>

                <p>Заказчика имеет право:</p>

                <p>5.7. Требовать от Исполнителя надлежащего оказания Услуг.</p>

                <p>
                    5.8. Отказаться в одностороннем порядке от оказания Услуг путем
                    направления соответствующего уведомления Исполнителю по электронному
                    адресу: support@smart-eat.ru, с указанием объективных причин отказа. В
                    случае такого отказа Договор будет считаться прекращенным со дня,
                    следующего за днем получения такого уведомления Исполнителем.
                </p>

                <p>
                    5.8.1. Объективность указных причин Исполнитель определяет по своим
                    внутренним критериям.
                </p>

                <p>
                    5.9. В случае одностороннего отказа Заказчика от Услуг Исполнителя и
                    признания Исполнителем убедительности приведенных Заказчиком причин,
                    Исполнитель обязуется произвести возврат стоимости Услуг в течение 30
                    (тридцати) дней после получения Исполнителем письменного извещения от
                    Заказчика.
                </p>
                <br/>
                <h4>6. Финансовые условия</h4>

                <p>
                    6.1. Стоимость Услуг рассчитывается исходя из индивидуальных
                    условий, предоставленных
                    Заказчику (НДС не облагается).
                </p>

                <p>
                    6.2 Стоимость оказания Услуг может изменяться в зависимости от
                    количества заказанных планов и дополнительных скидок по акциям и др.;
                </p>

                <p>
                    6.3 Вне зависимости от избранного Заказчиком периода оказания Услуг,
                    Исполнитель гарантирует оказание всего комплекса Услуг в соответствии с
                    п. 3.2 Договора.
                </p>

                <p>
                    6.4. Услуги предоставляются при условии их 100% предоплаты Заказчиком.
                    Оплата Услуг оформляется при заключении Договора на Сайте Исполнителя.
                    Оплата производится через платежный сервис ТинькоФФ Интернет-эквайринг
                    https://www.tinkoff.ru/business/internet-acquiring/. В случае если
                    оплата не будет осуществлена, Договор не считается заключенным и не
                    имеет юридической силы.
                </p>

                <p>
                    6.5 Стоимость оказания Услуг и цена Договора, указываются в Приложении
                    №1 к данному договору и являются его неотъемлемой частью.
                </p>
                <br/>
                <h4>7. Гарантии и ответственность</h4>

                <p>
                    7.1. Исполнитель не оказывает услуги медицинского учреждения.
                    Исполнитель не проводит осмотр, назначение анализов, сбор информации о
                    здоровье Заказчика или Клиента Заказчика. Заказчик или Клиент Заказчика
                    лично несет ответственность за свое здоровье, и обязуется следовать
                    процедуре п. 5.2.
                </p>

                <p>
                    7.2 Заказчик полностью осознает, что бывают случаи скрытых проблем со
                    здоровьем, о которых может быть неизвестно самому Заказчику. Заказчик
                    отдает себе отчет в том, что услуги по данному Договору предназначены
                    для людей, у которых в ходе предварительного медицинского обследования
                    не было выявлено никаких противопоказаний.
                </p>

                <p>
                    7.3. Исполнитель не несет ответственности за недостижение Заказчиком
                    ожидаемых им результатов либо за несоответствие полученного результата
                    ожиданиям Заказчика, в силу того, что данный договор не предусматривает
                    контроль за исполнением плана питания со стороны Исполнителя.
                </p>

                <p>
                    7.4. В случае нарушения Заказчиком п. 5.3 и п. 5.4 Договора, по
                    требованию Исполнителя Заказчик уплачивает штраф в размере 100 000 (Сто
                    тысяч) рублей за каждый случай нарушения. После наступления данного
                    случая данный Договор считается расторгнутым и компенсации заказчику не
                    подлежит.
                </p>

                <p>
                    7.5. Ответственность Исполнителя ограничена стоимостью оказания Услуг в
                    соответствии с настоящим Договором.
                </p>

                <p>
                    7.6. В случае отзыва публичной оферты Исполнителем, Исполнитель
                    обязуется произвести возврат стоимости Услуг, в течение 30 (тридцати)
                    банковских дней с момента отзыва публичной оферты.
                </p>
                <br/>
                <h4>8. Обработка персональных данных Заказчика</h4>

                <p>
                    8.1. Предоставляя необходимую для оказания Услуг информацию, Заказчик
                    предоставляет Исполнителю свои персональные данные. Настоящим Заказчик
                    выражает свое согласие на обработку переданных им персональных данных в
                    соответствии с Федеральным законом №152-ФЗ от 27 июля 2006 года «О
                    персональных данных».
                </p>

                <p>
                    8.2. Исполнитель при обработке персональных данных Заказчика обязуется
                    принять все предусмотренные действующим законодательством Российской
                    Федерации меры для их защиты от несанкционированного доступа.
                </p>

                <p>
                    8.3. Заказчик полностью осознает, что при определенных обстоятельствах с
                    его согласия персональные данные Заказчика могут стать доступными и
                    третьим лицам (к примеру, размещение достигнутых Заказчиком результатов
                    на сайте и др.).
                </p>
                <br/>
                <h4>9. Права на результаты интеллектуальной деятельности</h4>

                <p>
                    9.1. Исключительные права на Контент сайта (http://smart-eat.ru) и
                    страницы в соц. сетях (https://www.instagram.com/smarteat_ru;
                    https://www.instagram.com/anton.smarteat), принадлежат Исполнителю,
                    и/или его контрагентам.
                </p>

                <p>
                    9.2. Использование Контент сайта Заказчиком только в личных,
                    некоммерческих целях.
                </p>
                <br/>
                <h4>10. Прочие условия</h4>

                <p>10.1. Сбор данных о Клиенте на основании ответов Онлайн-анкеты.</p>

                <p>
                    10.2. Создание плана питания с помощью Веб-сервиса и отправка плана по
                    средствам электронной почты Заказчику в течение 7 дней после прохождения
                    теста.
                </p>

                <p>
                    10.3. Исполнитель не предоставляет образовательные услуги официального
                    учебного заведения и не занимается выдачей каких-либо сертификатов и
                    лицензий. Исполнитель не занимается лечебной или какой-либо другой
                    медицинской практикой. Исполнитель не оказывает услуги тренажерного или
                    аэробного зала, не предоставляет услуги персонального тренера.
                    Исполнитель не оказывает услуг диетологического сопровождения.
                </p>

                <p>
                    10.4. Заказчик полностью осознает, что результат оказания Услуг целиком
                    зависит от того, насколько добросовестно он будет придерживаться
                    предписанного ему плана питания. Заказчик полностью осознает, что
                    Исполнитель ни при каких условиях не может нести и не несет
                    ответственности за результаты Заказчика.
                </p>

                <p>
                    10.5. Заказчик полностью осознает, что результатом оказания Услуг
                    Исполнителем является создание индивидуального плана питания:
                    распределение макро нутриентов (белки, жиры, углеводы) по продуктам, отмеченным в Онлайн-анкете.
                </p>

                <p>
                    10.6. В случае, если Заказчик нарушает предлагаемый Исполнителем план
                    питания, в том числе, нарушает график приема пищи, количество пищи за
                    прием или употребляет пищу, не указанную в плане, Услуги все равно
                    считаются оказанными Исполнителем, и уплаченные денежные средства не
                    подлежат возврату Заказчику.
                </p>

                <p>
                    10.7. Все уведомления и письма в рамках настоящего Договора направляются
                    посредством электронной почты на адрес Заказчика, указанный в
                    соответствии с п. 5.1 настоящего Договора, и адрес Исполнителя
                    support@smart-eat.ru.
                </p>
                <br/>
                <h4>11. Заключительные положения</h4>

                <p>
                    11.1. Договор представляет собой полную договоренность между
                    Исполнителем и Заказчиком. И не предусматривает никаких условий и
                    обязательств в отношении предмета Договора, кроме указанных в нем.
                </p>

                <p>
                    11.2. В случае возникновения споров и разногласий Стороны обязуются
                    приложить все усилия, для разрешения споров путем переговоров или в
                    претензионном порядке. Срок рассмотрения претензии – 10 (десять) дней с
                    момента ее получения.
                </p>

                <p>
                    11.3. В случае невозможности разрешения споров и разногласий путем
                    переговоров или в претензионном порядке, Стороны вправе передать спор на
                    рассмотрение в суд общей юрисдикции или арбитражный суд по месту
                    нахождения Исполнителя.
                </p>

                <p>
                    11.4. Договор вступает в силу с момента акцепта Заказчиком настоящей
                    публичной оферты и действует до полного исполнения Сторонами принятых на
                    себя обязательств.
                </p>
                <br/>
                <h4>12. Реквизиты Исполнителя:</h4>

                <p>Индивидуальный предприниматель Красавин Д. А.</p>

                <p>ОГРНИП: 313774626600622</p>

                <p>
                    Зарегистрирован: 23.09.2013 Межрайонной инспекцией Федеральной налоговой
                    службы №46 по г. Москве за основным государственным регистрационным
                    номером (ОГРНИП) 313774626600622
                </p>

                <p>Юридический адрес: г. Москва, ул. Фестивальная, д.22, к.4</p>

                <p>Электронная почта: support@smart-eat.ru</p>

                <p>Сайт: http://smart-eat.ru/</p>
                <br/>
                <h3>Приложение 1.
                    <br/>
                    К договору публичной оферты №1 от 12.12.2019</h3>

                <p>Стандартная стоимость услуг по данному договору составляет:</p>

                <p>
                    1. Стоимость плана питания на
                    месяц составляет 500 (пятьсот) рублей 00 копеек – для тренеров,
                    диетологов, блогеров, лиц, составляющих планы питания для своих клиентов
                    и работающих в сфере спорта, здравоохранения, красоты;
                </p>

                <p>
                    2. Стоимость плана питания на
                    месяц составляет 980 (девятьсот восемьдесят) рублей 00 копеек – для
                    конечного потребителя;
                </p>
                <br/>
                <h4>Реквизиты Исполнителя:</h4>

                <p>Индивидуальный предприниматель Красавин Д. А.</p>

                <p>ОГРНИП: 313774626600622</p>

                <p>
                    Зарегистрирован: 23.09.2013 Межрайонной инспекцией Федеральной налоговой
                    службы №46 по г. Москве за основным государственным регистрационным
                    номером (ОГРНИП) 313774626600622
                </p>

                <p>Юридический адрес: г. Москва, ул. Фестивальная, д.22, к.4</p>

                <p>Электронная почта: support@smart-eat.ru</p>

                <p>Сайт: http://smart-eat.ru/</p>

            </Div>
            <GreenButton
              onClick={onClose}
            >Закрыть</GreenButton>
        </SEList>
    </SEModal>
}