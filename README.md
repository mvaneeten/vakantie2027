# Canada & Noordoost-USA 2027

Statische Nederlandstalige reiswebsite voor vier reizigers, 17 juli–7 augustus 2027.
20 hotelnachten (17 juli t/m 5 augustus), terugvlucht 6 augustus, aankomst 7 augustus.
Richtbudget: €15.000. Hotels en bedragen zijn voorstellen, geen boekingen.

## Bestanden

- index.html: pagina en navigatie.
- vakantie.json: de volledige vakantie: reisgegevens, negen stops met hotels, 22 dagen inclusief extra uitleg, fotoverwijzingen, begroting, praktische informatie en bronlinks. Dit is de enige gegevensbron.
- data.js wordt niet meer gebruikt en mag uit het project worden verwijderd.
- app.js: kaart, filters, verblijfsdatums en nachtnummering.
- styles.css: vormgeving voor mobiel, desktop en afdrukken.
- images/0.jpg t/m 8.jpg: bestaande sfeerbeelden per bestemming; geen bevestigde hotelfoto’s.

Open de website via een lokale webserver of GitHub Pages; app.js haalt vakantie.json automatisch op.
Bij rechtstreeks openen van index.html kan de browser het ophalen blokkeren. Kies dan via “Reisbestand kiezen” het vakantie.json-bestand; dit gebruikt dezelfde bron, zonder kopie van de reisgegevens. Voor kaarttegels, Leaflet en webfonts is internet nodig.
De stippellijn verbindt geografische locaties; deze volgt geen wegen. Gebruik de Google Maps-link voor routeplanning.
De kaartknoppen tonen een stop of de volledige route.

## Later publiceren via GitHub Pages zonder plugin

1. Controleer de wijzigingen en commit ze in deze lokale repository.
2. Push de gewenste branch naar de bestaande origin met Git of GitHub Desktop.
3. Open de repository op GitHub en kies Settings → Pages.
4. Kies Deploy from a branch, de gepushte branch en /(root); sla op.
5. Wacht op de publicatie en open de URL die GitHub toont.

Alle lokale bestandsverwijzingen zijn relatief en geschikt voor een GitHub Pages-projectsite.
Er is geen buildstap, GitHub-plugin of API-sleutel nodig. Er is nog niets gepubliceerd.

## Bronnen voor controles vóór boeken

- https://www.niagaraparks.com/visit/attractions/journey-behind-the-falls/
- https://www.nps.gov/acad/planyourvisit/vehicle_reservations.htm

Controleer reserveringsregels, beschikbaarheid, hotelbezetting, belastingen, parkeerkosten en internationale one-wayautohuur voor zomer 2027.

## Vakantie aanpassen

Bewerk vakantie.json en herlaad de pagina. Datums gebruiken YYYY-MM-DD, bedragen zijn numeriek in de opgegeven valuta. Elke dag bevat beschrijving, notes, activiteiten, stopindex (vanaf 0), hotelnacht en fotopad. stop: null betekent geen hotelovernachting. De volgorde van stops bepaalt de route en de hotelverblijven. Budgetregels moeten samen gelijk zijn aan trip.targetBudget; de eerste regel is het hotelbudget.

Verblijfsdatums, totalen en zichtbare reissamenvattingen worden uit JSON berekend. De website controleert de dagvolgorde, nachtnummering en begroting voor het tonen van het programma. Foto’s blijven losse bestanden in images/ en worden vanuit JSON aangewezen.
