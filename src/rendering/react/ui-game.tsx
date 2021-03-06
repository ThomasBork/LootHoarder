import * as React from "react";
import { Game } from "../../game/game";
import { GameContext } from "./ui-game-context";
import { UIHeader } from "./ui-header";
import { UIBody } from "./ui-body";
import { GameController } from "../../game/game-controller";
import { GameServices } from "../../game/game-services";

export class UIGame extends React.Component<{}, {game: Game}> {
    constructor (props: {game: Game}) {
        super(props);

        this.state = {game: null};
    }
    newGame() {
        const gameController = new GameController();
        GameServices.currentGameController = gameController;
        gameController.initialize();

        gameController.newGame();
        GameServices.currentGame = gameController.game;
        
        this.setState({game: gameController.game});
    }
    render() {
        return (
            <div>
                <UIHeader versionNumber={GameServices.version.currentVersion} onNewGameClick={()=>this.newGame()}></UIHeader>
                {
                    this.state.game
                    ? 
                    <GameContext.Provider value={this.state.game}>
                        <UIBody></UIBody>
                    </GameContext.Provider>
                    : null
                }
            </div>
        );
    }
}