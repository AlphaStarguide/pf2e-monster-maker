import {MonsterMaker} from "./MonsterMaker"
Hooks.on('init', async function () {
    await game["settings"].register("foundryvtt-pf2e-monster-maker", "roadmaps", {
        scope: 'world',
        config: false,
        type: Object,
        default: {}
    });

    await game["settings"].register("pf2e-monster-maker", "abbreviateName", {
        name:    "Abbreviate Monster Maker",
        hint:    "Turn this on if you prefer to see “MM” instead of the full title “Monster Maker” in the monster sheet.",
        scope:   "world",
        config:  true,
        type:    Boolean,
        default: false
    });
})

function getMonsterManualLabel () {
    return game["settings"].get(
        "pf2e-monster-maker",
        "abbreviateName"
    ) ? "MM" : "Monster Maker";
}

function injectMonsterMakerButton(sheet, html) {
    let actor = sheet.object ?? sheet.document
    if (actor?.type !== "npc") {
        return;
    }
    if(!actor.canUserModify(game["user"], "update")) {
        return;
    }
    const $html = (html instanceof HTMLElement) ? $(html.closest(".application") ?? html) : html;
    let element = $html.find(".window-header .window-title");
    if (!element.length) return;
    if (element.parent().find("a.monster-maker-button").length) return;
    let label = getMonsterManualLabel()
    let button = $(`<a class="popout monster-maker-button"><i style="padding: 0; margin-right: 2px;" class="fas fa-book"></i>${label}</a>`);
    button.on("click", () => {
        new (MonsterMaker as any)(actor).render(true)
    })
    element.after(button);
}

Hooks.on("renderActorSheet", injectMonsterMakerButton)
Hooks.on("renderActorSheetV2", injectMonsterMakerButton)

Hooks.on("renderActorDirectory", function() {
    let footer = $("#actors .directory-footer.action-buttons");
    if (footer.find("button:contains('Monster Maker')").length === 0) {
        let monsterButton = $(`<button><i class="fas fa-book"></i>Monster Maker</button>`);
        footer.append(monsterButton);

        monsterButton.on("click", function() {
            new (MonsterMaker as any)().render(true);
        });
    }
});