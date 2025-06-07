// ==UserScript==
// @name         Przedmioty normalne?
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  x
// @author       x
// @match        https://usosweb.uw.edu.pl/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // === numer grupy do wybrania ===
    const targetGroupNumber = "4";

    console.log("Szukam grupy o numerze:", targetGroupNumber);

    window.addEventListener('load', () => {
        const rows = document.querySelectorAll("table.grey tbody tr");
        let groupFound = false;

        for (const row of rows) {
            const cells = row.querySelectorAll("td");

            if (cells.length >= 7) {
                const groupNumber = cells[0].innerText.trim();
                if (groupNumber === targetGroupNumber) {
                    console.log("Znaleziono grupę:", groupNumber);

                    const radio = row.querySelector('input[type="radio"]');
                    if (radio) {
                        radio.click();
                        console.log("Kliknięto radio button.");

                        const form = radio.closest('form');
                        const submitBtn = form?.querySelector('input[type="submit"].submit');

                        if (submitBtn) {
                            console.log("Klikam przycisk Rejestruj.");
                            submitBtn.click();
                        } else {
                            console.warn("Nie znaleziono przycisku Rejestruj.");
                        }

                        groupFound = true;
                        break;
                    } else {
                        console.warn("Nie znaleziono radio buttona w wierszu grupy:", groupNumber);
                    }
                }
            }
        }

        if (!groupFound) {
            console.warn("Nie znaleziono grupy o numerze:", targetGroupNumber);
        }
    });

})();
