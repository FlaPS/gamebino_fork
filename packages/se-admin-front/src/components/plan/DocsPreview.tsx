import React from 'react'
import * as Ant from 'antd'

import genHTML from '../../../../se-service/src/docgen/html/genHTML'

export default ({state, plan}: {state, plan}) => {    
    const onClick = (docType) => () => {
        // const win = window.open("", "Инструкция", "scrollbars=yes,resizable=yes,width=780,height=200,top="+(screen.height-400)+",left="+(screen.width-840));
        /*win.document.write(
            genHTML(
                {app: state.app.bootstrap},
                plan,
                docType,
            )
        )*/
    }
    return      <Ant.Row>
                    <Ant.Button
                        onClick={onClick('Menu')}
                    >
                        План
                    </Ant.Button>

                    <Ant.Button
                        onClick={onClick('Instruction')}
                    >
                        Инструкция

                    </Ant.Button>

                    <Ant.Button
                        onClick={onClick('ShoppingList')}
                    >
                        Список покупок
                    </Ant.Button>

                    <Ant.Button
                        onClick={onClick('CookInfo')}
                    >
                        Рецепт приготовления
                    </Ant.Button>
    </Ant.Row>
}