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
async function init() {
    const spriteNames = [
        "die1", "die2", "die3", "die4", "die5", "die6", " ", "^", "|", "v", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "o", "x", "A", "B", "C", "D", "E"
    ]
    sprites = await Sprites.loadAll("sprite64.png", 64, spriteNames)
    diceSprites = ["",sprites["die1"], sprites["die2"], sprites["die3"], sprites["die4"], sprites["die5"], sprites["die6"]]
    playerSprites = [sprites["A"], sprites["B"], sprites["C"], sprites["D"], sprites["E"]]

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
            //const t = $(`<div class="tile"></div>`)
            t = sprites[symbol].make()
            r.append(t)
        })
    })
}

init()
