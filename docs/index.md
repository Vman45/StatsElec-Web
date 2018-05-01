# StatsElec
[![pipeline status](https://git.ahh.si/themimitoof/StatsElec/badges/master/pipeline.svg)](https://git.ahh.si/themimitoof/StatsElec/commits/master) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/ad05641f1cf44b2eb3a550b450a70c32)](https://www.codacy.com?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Themimitoof/StatsElec-Web&amp;utm_campaign=Badge_Grade) [![Documentation Status](https://readthedocs.org/projects/statselec/badge/?version=latest)](http://statselec.readthedocs.io/fr/latest/?badge=latest) [![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FThemimitoof%2FStatsElec-Web.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FThemimitoof%2FStatsElec-Web?ref=badge_shield)

StatsElec est une interface web permettant de suivre la consommation électrique d'un ou plusieurs compteurs électriques _Enedis_.

Pour suivre l'évolution du projet et de la milestone en cours (GitLab) : [https://git.ahh.si/themimitoof/StatsElec/boards](https://git.ahh.si/themimitoof/StatsElec/boards)


> StatsElec est en phase de développement _précoce_, la base du projet est disponible mais de nouvelles fonctionnalitées voir des changements radicaux sont suspectibles d'arriver au fur et à mesure du temps. Nous vous invitons à suivre l'évolution du projet par le biais de [notre gestionnaire de projet](https://git.ahh.si/themimitoof/StatsElec/boards), via le [flux du dépôt](https://github.com/Themimitoof/StatsElec-Web/releases) ou bien par le biais du blog de [themimitoof.fr](https://themimitoof.fr).


## Fonctionnalités
 * Simple d'utilisation
 * Compatible avec les compteurs _Linky (mode historique uniquement)_ et les compteurs _électroniques_ (_CBEMM_, _CBEMM-ICC_ et _CBETM_)
 * Compatible avec les installations _monophasés_ et _triphasés_
 * Compatible avec les tarifications _base_, _heures creuses/heures pleines_, _EJP_ et _Tempo_
 * Déploiement facile grâce à _Docker_ et _Docker compose_ !


## Incompatibilitées
StatsElec est aujourd'hui incompatible avec les compteurs suivant :
 * Linky _en mode standard (nouveau contrat créé lors de la pose du compteur)_
 * EMERAUDE
 * SAPHIR
 * PME-PMI

_Si vous possédez un de ses compteurs, envoyez-nous plusieurs trames afin d'intégrer le compteur à StatsElec !_


## Licence
_StatsElec_ est distribué sous la license **AGPL-3.0**.

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FThemimitoof%2FStatsElec-Web.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FThemimitoof%2FStatsElec-Web?ref=badge_large)