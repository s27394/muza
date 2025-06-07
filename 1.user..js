// ==UserScript==
// @name         żetonowe
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  x
// @match        https://usosweb.uw.edu.pl/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const targets = {
        "[0508-ONUW-3-OG]": ["1"],
        "[2200-1PS008]": ["1"]
    };

    console.log("[USOS-SCRIPT] Script initialized");

    const observer = new MutationObserver(() => {
        const courseRows = document.querySelectorAll(".course-row");
        if (courseRows.length === 0) return;

        console.log(`[USOS-SCRIPT] Wykryto ${courseRows.length} kursów – sprawdzam cele`);
        for (const row of courseRows) {
            const label = row.querySelector("label");
            if (!label) continue;

            const text = label.textContent;

            for (const courseCode in targets) {
                if (!text.includes(courseCode)) continue;

                console.log(`[USOS-SCRIPT] 🎯 Znaleziono kurs: ${text.trim()}`);

                const checkbox = label.querySelector('input[type="checkbox"]');
                if (!checkbox) {
                    console.error("[USOS-SCRIPT] ❌ Checkbox nie znaleziony");
                    continue;
                }

                const groupNumbers = targets[courseCode];

                if (!checkbox.checked) {
                    console.log("[USOS-SCRIPT] Checkbox NIE zaznaczony – klikam");
                    checkbox.click();
                    setTimeout(() => clickCart(row, groupNumbers), 250);
                } else {
                    console.log("[USOS-SCRIPT] Checkbox już zaznaczony – szukam koszyka");
                    clickCart(row, groupNumbers);
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function clickCart(row, groupNumbers) {
        const tables = row.querySelectorAll("table.table-data");
        console.log(`[USOS-SCRIPT] Szukam tabel z grupy ${groupNumbers.join(", ")}`);

        for (const table of tables) {
            const rows = table.querySelectorAll("tbody > tr");

            for (const tr of rows) {
                const tds = tr.querySelectorAll("td");
                const num = tds[0]?.innerText?.trim();
                console.log(`[USOS-SCRIPT] Sprawdzam grupę: ${num}`);

                if (!groupNumbers.includes(num)) continue;

                const cart = tr.querySelector("div.cart.want-register");
                if (cart && !cart.classList.contains("want-register-disabled")) {
                    cart.click();
                    console.log(`✅ [USOS-SCRIPT] Kliknięto koszyk grupy ${num}`);
                    return;
                } else {
                    console.warn(`🟡 [USOS-SCRIPT] Koszyk dla grupy ${num} nieaktywny`);
                    return;
                }
            }
        }

        console.error("[USOS-SCRIPT] ❌ Nie znaleziono pasującej grupy do kliknięcia");
    }
})();
