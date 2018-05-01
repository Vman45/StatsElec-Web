# API
_StatsElec_ possède une API permettant aux développeurs d'applications d'intégrer les données que _StatsElec_ traite.


## Counters
> GET /api/counters

 * Paramètres : _aucun_
 * Réponse :
    - ```code``` : code HTTP
        - Possibles codes HTTP : ```200```, ```404```
    - ```message``` : retourne un message en cas d'erreur (uniquement lorsque ```code``` != 200)
    - ```data``` : retourne un objet contenant l'ensemble des compteurs (uniquement lorsque ```code == 200```)


> GET /api/counters/:counterId

 * Paramètres : ```:counterId``` _identifiant du compteur à 12 chiffres_
 * Réponse :
    - ```code``` : code HTTP
        - Possibles codes HTTP : ```200```, ```404```
    - ```message``` : retourne un message en cas d'erreur (uniquement lorsque ```code``` != 200)
    - ```data``` : retourne un objet contenant les informations du compteur (uniquement lorsque ```code == 200```)


## Metrics
> GET /api/metrics/:counterId

 * Paramètres : 
    - ```:counterId``` _identifiant du compteur à 12 chiffres_
    - ```?startDate``` _timestamp du début_
    - ```?endDate``` _timestamp de la fin_
 * Réponse :
    - ```code``` : code HTTP
        - Possibles codes HTTP : ```200```, ```400```, ```404```, ```500```, ```501```
    - ```message``` : retourne un message en cas d'erreur (uniquement lorsque ```code``` != 200)
    - ```data``` : retourne un objet contenant toutes les télémétries ou les télémétries de la page sélectionnée (uniquement lorsque ```code == 200```)


> GET /api/metrics/:counterId/:tag

 * Paramètres : 
    - ```:counterId``` _identifiant du compteur à 12 chiffres_
    - ```:tag``` _nom de la colonne dans la base de données_
    - ```?startDate``` _timestamp du début_
    - ```?endDate``` _timestamp de la fin_
 * Réponse :
    - ```code``` : code HTTP
        - Possibles codes HTTP : ```200```, ```400```, ```404```, ```500```, ```501```
    - ```message``` : retourne un message en cas d'erreur (uniquement lorsque ```code``` != 200)
    - ```data``` : retourne un objet contenant toutes les télémétries ou les télémétries de la page sélectionnée par rapport au tag sélectionné (uniquement lorsque ```code == 200```)


> GET /api/metrics/:counterId/tags

 * Paramètres : 
    - ```:counterId``` _identifiant du compteur à 12 chiffres_
 * Réponse :
    - ```code``` : code HTTP
        - Possibles codes HTTP : ```200```, ```403```, ```404```
    - ```message``` : retourne un message en cas d'erreur (uniquement lorsque ```code``` != 200)
    - ```data``` : retourne un objet contenant tous les tags, relations avec la base de données, la description du tag et l'unité de mesure disponibles pour le compteur sélectionné (uniquement lorsque ```code == 200```)


> GET /api/metrics/:counterId/tags/tag

 * Paramètres : 
    - ```:counterId``` _identifiant du compteur à 12 chiffres_
    - ```:tag``` _tag ou nom de la colonne dans la base de données_
 * Réponse :
    - ```code``` : code HTTP
        - Possibles codes HTTP : ```200```, ```403```, ```404```
    - ```message``` : retourne un message en cas d'erreur (uniquement lorsque ```code``` != 200)
    - ```data``` : retourne un objet contenant les informations du tag séléctionné (nom du tag, relations avec la base de données, la description du tag et l'unité de mesure) (uniquement lorsque ```code == 200```)