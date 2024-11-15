//[x] 11x13 board grid
//    [x] Make tiles
//        [x] 2-12
//        [x] Dice (1-4)
//        [x] Black marker
//        [x] Missing black marker
//        [X] Drop shadow (?)
//        [x] Red, green, blue, pink token
//            #648fff ##785EF0 #DC267F ##FE6100 #FFB000
//[x] Hook up UI board display to game state
//[ ] Make dice roll area (6 dice grouped correctly, plus up to 6 action buttons)
//[ ] Add post-move actions (roll again, stay)
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

function roll() { return 1 + Math.floor(Math.random()*6) }
const maxProgress = { 2:3, 3:5, 4:7, 5:9, 6:11, 7:13, 8:11, 9:9, 10:7, 11:5, 12:3 }

var sprites
const playerSprites = "ABCDE"
const diceSprites = ["","die1", "die2", "die3", "die4", "die5", "die6"]
class Game {
    constructor(players) {
        this.players = players
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
        this.markerComplete = {}

        this.playerTurn = 0
        this.rolled = false

        $(".action.roll").on("click", () => { this.visualRollDice() })
        $(".action.stop").on("click", () => { this.endTurn(false) })
        this.updateUI()
    }

    placeToken(row, col, name) {
        const tile = $(`#map > :eq(${row}) > :eq(${col})`)
        tile.append(sprites[name].make())
    }

    commitMarkers() {
        // TODO
    }

    endTurn(busted) {
        if (!busted) this.commitMarkers()
        this.markersAvailable = 3
        this.markerProgress = {}
        this.markersOn = {}
        this.markerComplete = {}

        this.playerTurn = (this.playerTurn + 1) % this.players
        this.rolled = false

        this.updateUI()
    }

    advanceMarker(c) {
        if (!this.markersOn[c]) {
            this.markerProgress[c] = 0
            this.markersAvailable--
            this.markersOn[c] = true
        }
        this.markerProgress[c]++
        this.markerComplete[c] = (this.markerProgress[c] == maxProgress[c])
    }

    visualRollDice() {
        const rollTime = 1500;
        $("#action-area .action").hide()
        for (var i=0; i<rollTime; i += 50)
            setTimeout(() => {
                $(".die").each((i, d) => {
                    $(d).empty().append(sprites[diceSprites[roll()]].make())
                })
            }, i)
        setTimeout(() => { this.rollDice() }, rollTime)
    }

    canAdvance(player, columns) {
        var markersNeeded = 0
        for (var i =0; i<columns.length; i++) {
            const c = columns[i]
            if (this.markerComplete[c] || this.columnComplete[c]) return false
            if (!this.markersOn[c]) markersNeeded++;
        }
        return markersNeeded <= this.markersAvailable
    }

    rollDice() {
        var stuck = true
        const setDiceOption = (je, dice) => {
            console.log(je, dice)
            for (var i=0; i<4; i++) {
                je.find(`.die:nth-child(${i+1})`).empty().append(sprites[diceSprites[dice[i]]].make())
            }
            const sums = [dice[0] + dice[1], dice[2] + dice[3]]

            const actionSection = je.find('div:nth-child(5)').empty()

            var actions = []
            const addAdvance = (s) => {
                const action = $(`<div class="action">`)
                if (s.length == 2 && s[0] > s[1]) {
                    // TODO: swap the dice visually too
                    s = [s[1], s[0]]
                }
                if (s.length == 1)
                    action.text(`Advance on ${s[0]}`)
                else
                    action.text(`Advance on ${s[0]} & ${s[1]}`)
                actionSection.append(action)
                action.hide() // Initially hidden
                action.on("click", () => {
                    this.rolled = false
                    for (var c of s) this.advanceMarker(c)
                    this.updateUI()
                })
                stuck = false
            }

            if (this.canAdvance(this.playerTurn, sums)) {
                addAdvance(sums)
            } else {
                if (this.canAdvance(this.playerTurn, [sums[0]])) addAdvance([sums[0]])
                if (this.canAdvance(this.playerTurn, [sums[1]])) addAdvance([sums[1]])
            }
        }

        const dice = [roll(), roll(), roll(), roll()]
        setDiceOption($(".dice-option:nth-child(1)"), [dice[0], dice[1], dice[2], dice[3]])
        setDiceOption($(".dice-option:nth-child(2)"), [dice[0], dice[2], dice[1], dice[3]])
        setDiceOption($(".dice-option:nth-child(3)"), [dice[0], dice[3], dice[1], dice[2]])
        this.rolled = true
        this.updateUI()
        if (stuck) this.endTurn(true)
    }

    updateUI() {
        $(".sprite .sprite").remove()

        // Place marker beans in the corner
        for (var i=0; i<this.markersAvailable; i++) this.placeToken(13, i, "x")

        // Columns
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

        $("#turn-info").text(`It's Player ${this.playerTurn+1}'s turn`)
        const sprite = sprites[playerSprites[this.playerTurn]]
        $("#turn-info").prepend(sprite.make()).append(sprite.make())
        if (this.playerTurn == -1) $(".action").hide()
        else {
            $(".action").show()

            if (this.rolled) {
                $("#action-area .action").hide()
            } else {
                $("#dice-area .action").remove()
                $("#action-area .action").show()
                if (this.markersAvailable == 3) $(".action.stop").hide()
            }
        }
    }
}

async function init() {
    const spriteNames = [
        "die1", "die2", "die3", "die4", "die5", "die6", " ", "^", "|", "v", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "o", "x", "A", "B", "C", "D", "E"
    ]
    sprites = await Sprites.loadAll("sprite64.png", 64, spriteNames)

    const map = [
        "     7      ",
        "    6^8     ",
        "   5^|^9    ",
        "  4^|||^a   ",
        " 3^|||||^b  ",
        "2^|||||||^c ",
        "^|||||||||^ ",
        "||||||||||| ",
        "v|||||||||v ",
        " v|||||||v  ",
        "  v|||||v   ",
        "   v|||v    ",
        "    v|v     ",
        "ooo  v      ",
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

    $(".action").hide()
}

async function main() {
    await init()
    game = new Game(2)
}

main()
