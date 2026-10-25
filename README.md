# Canada & Amerika 2027

Statische Nederlandstalige reiswebsite voor vier reizigers, 17 juli–7 augustus 2027.
20 hotelnachten (17 juli t/m 5 augustus), terugvlucht 6 augustus, aankomst 7 augustus.
Richtbudget: €15.000. Hotels en bedragen zijn voorstellen, geen boekingen.

Live: https://mvaneeten.github.io/vakantie2027/

## Onderdelen van de site

- Hero met diavoorstelling van alle bestemmingen en aftelklok tot vertrek.
- Overzicht "Waar zijn we wanneer?": de verblijven als gekleurde balk en een kalender met per dag de plek en eventuele reistijd.
- Dag voor dag: per dag foto, reistijd (van → naar, afstand, vervoer), activiteiten, ons plan en het hotel van die nacht. Bladeren met de knoppen, de pijltjestoetsen of vegen op de foto. Elke dag heeft een eigen link, bijvoorbeeld `#dag-5`.
- Route op de kaart (OpenStreetMap) met alle stops.
- Hotels: apart overzicht met in- en uitcheckdatum, nachten, raming en link naar de kaart.
- Begroting, praktische informatie en fotoverantwoording.

## Bestanden

- index.html: pagina-opbouw en navigatie.
- vakantie.json: de enige gegevensbron: reisgegevens, tien stops met hotels, 22 dagen, begroting, praktische informatie, bronlinks en foto's.
- app.js: leest vakantie.json, controleert de gegevens en bouwt alle onderdelen op.
- styles.css: vormgeving voor desktop, mobiel en afdrukken.
- images/0.jpg t/m 8.jpg: reservefoto's per bestemming, gebruikt als een online foto niet laadt.

Open de website via een lokale webserver of GitHub Pages; app.js haalt vakantie.json automatisch op.
Bij rechtstreeks openen van index.html kan de browser het ophalen blokkeren. Kies dan via "Reisbestand kiezen" het vakantie.json-bestand. Voor kaarttegels, foto's, Leaflet en webfonts is internet nodig.

## Vakantie aanpassen

Bewerk vakantie.json en herlaad de pagina. Datums gebruiken YYYY-MM-DD, bedragen zijn numeriek in de opgegeven valuta.

- Elke dag bevat beschrijving (`desc`), `notes`, activiteiten (`todo`), stopindex (`stop`, vanaf 0), hotelnacht (`night`), een `photo` en een `fallbackImage`. `stop: null` betekent geen hotelovernachting.
- `transport` beschrijft een reisdag: `mode` (`auto` of `vlucht`), `from`, `to`, `distance` (mag `null`) en `duration`. Op dagen zonder reis is `transport` `null` en toont de site de tekst uit `travel`.
- De volgorde van stops bepaalt de route en de hotelverblijven. Elke stop heeft ook een `photo`.
- Budgetregels moeten samen gelijk zijn aan `trip.targetBudget`; de eerste regel is het hotelbudget en moet gelijk zijn aan de som van de hotelkosten.

De website controleert de dagvolgorde, nachtnummering, foto's, reisgegevens en begroting voordat het programma getoond wordt.

## Foto's

De foto's komen van Wikimedia Commons en staan onder `photos` in vakantie.json. Elke foto heeft een `path` (het Commons-pad, bijvoorbeeld `3/3c/Bestand.jpg`), een `caption`, de maker (`credit`), de licentie en een link naar de bronpagina. De site toont bij elke foto de maker en licentie; dat is verplicht voor CC BY- en CC BY-SA-licenties.

Een foto vervangen: zoek een foto op commons.wikimedia.org, open "Meer details" en neem het pad over uit de link van het originele bestand (`https://upload.wikimedia.org/wikipedia/commons/<path>`), samen met maker en licentie.

## Bronnen voor controles vóór boeken

- https://www.niagaraparks.com/visit/attractions/journey-behind-the-falls/
- https://www.nps.gov/acad/planyourvisit/vehicle_reservations.htm

Controleer reserveringsregels, beschikbaarheid, hotelbezetting, belastingen, parkeerkosten en internationale one-wayautohuur voor zomer 2027.
