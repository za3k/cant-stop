//[x] 11x13 board grid
//    [x] Make tiles
//        [x] 2-12
//        [x] Dice (1-4)
//        [x] Black marker
//        [x] Missing black marker
//        [X] Drop shadow (?)
//        [x] Red, green, blue, pink token
//            #648fff ##785EF0 #DC267F ##FE6100 #FFB000
//[ ] Make dice roll area (6 dice grouped correctly, plus up to 6 action buttons)
//[ ] Add post-move actions (roll again, stay)
//[ ] Hook up UI board display to game state
//[ ] Add game logic, make all actions work
//    [ ] Advancing
//    [ ] Dice filtering
//    [ ] Stopping + saving progress
//    [ ] Completing a column
//[ ] Single-player mode
//[ ] Local multi-player mode
//[ ] Add credits
//[ ] Explain game rules somewhere (link!)
//
//[ ] Stretch
//    [ ] Audio
//        [ ] Background music
//        [ ] Effects
//            [ ] their turn ended
//            [ ] its your turn
//            [ ] Dice rolled
//            [ ] A piece
//            [ ] Oops! Busted
//    [ ] Dice rolling animation
//    [ ] You vs. AI mode

var sprites
class Game {
    constructor() {
        this.players = 4
        this.playerProgress = {}
        this.playerColumnsComplete = {}
        for (var i=0; i<this.players; i++) {
            this.playerProgress[i] = {}
            this.playerColumnsComplete[i] = 0
        }
        this.columnComplete = {}

        this.markersAvailable = 3
        this.markerProgress = {}
        this.markersOn = {}

        this.playerTurn = 0

        //updateUI()
    }

    placeToken(row, col, name) {
        const tile = $(`#map > :eq(${row}) > :eq(${col})`)
        tile.append(sprites[name].make())
    }

    lock(player, number, pos) {
        this.playerProgress[player][number] = pos
    }

    updateUI() {
        $(".token").remove()

        // Place marker beans in the corner
        for (var i=0; i<this.markersAvailable; i++) this.placeToken(13, i, "x")

        // Columns
        const playerSprites = "ABCDE"
        const columnStart = { 2:8, 3:9, 4:10, 5:11, 6:12, 7:13, 8:12, 9:11, 10:10, 11:9, 12:8 }
        for (var c=2; c<=12; c++) {
            const r = columnStart[c]
            // Place tokens for player progress
            for (var p=0; p<this.players; p++)
                for (var i=0; i<(this.playerProgress[p][c]||0); i++)
                    this.placeToken(r - this.playerProgress[p][c] + i + 1, c-2, playerSprites[p])
            // Place marker bean
            if (this.markerProgress[c]) this.placeToken(r - this.markerProgress[c] + 1, c-2, "x")
        }

    }
}

async function init() {
    const spriteNames = [
        "die1", "die2", "die3", "die4", "die5", "die6", " ", "^", "|", "v", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "o", "x", "A", "B", "C", "D", "E"
    ]
    sprites = await Sprites.loadAll("sprite64.png", 64, spriteNames)
    diceSprites = ["",sprites["die1"], sprites["die2"], sprites["die3"], sprites["die4"], sprites["die5"], sprites["die6"]]

    const map = [
        "     7     ",
        "    6^8    ",
        "   5^|^9   ",
        "  4^|||^a  ",
        " 3^|||||^b ",
        "2^|||||||^c",
        "^|||||||||^",
        "|||||||||||",
        "v|||||||||v",
        " v|||||||v ",
        "  v|||||v  ",
        "   v|||v   ",
        "    v|v    ",
        "ooo  v     ",
    ]
    map.forEach((row, rowNum) => {
        const r = $(`<div></div>`)
        $("#map").append(r)
        row = [...row]
        row.forEach((symbol, colNum) => {
            t = sprites[symbol].make()
            r.append(t)
        })
    })
}

async function main() {
    await init()
    game = new Game()
    game.lock(1, 5, 3)
    game.lock(1, 12, 2)
    game.lock(2, 5, 2)
    game.lock(2, 7, 7)
    game.markerProgress[3] = 3
    game.markersAvailable--
    game.updateUI()
}

main()
