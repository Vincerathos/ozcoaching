# Polices de la charte OZ Coaching

La charte graphique (`design/charte-graphique-ag.png`) impose deux polices :

| Rôle | Police | Où elle sert sur le site |
|---|---|---|
| Texte courant, titres | **Neue Montréal** | tout le site |
| Display | **Znikomit** | uniquement les titres de héros (`.hero h1`, `.page-hero h1`) |

## État actuel

| Fichier | Statut |
|---|---|
| `Znikomit.woff2` | ✅ **en place** — licence SIL OFL 1.1 (voir `Znikomit-OFL.txt`), usage commercial autorisé |
| `Manrope-Variable.woff2` | ✅ **en place** — substitut de Neue Montréal, SIL OFL, variable 200→800 |
| `NeueMontreal-*.woff2` | ✅ **en place** — Light, Regular, Medium, Bold + Italic, fournis par Aurélia |

Tout est **hébergé en local** : le site ne fait plus aucune requête vers Google Fonts,
donc aucune adresse IP de visiteur n'est transmise à un tiers (point RGPD non négligeable —
la CNIL et plusieurs autorités européennes ont sanctionné le chargement direct de Google Fonts).

### Neue Montréal — en place ✅

Fichiers fournis par Aurélia (OTF), convertis en `.woff2` : Light (300), Regular (400),
Medium (500), Bold (700) et Italic (400) — soit 118 Ko au total pour les cinq.
Métadonnées d'origine : Pangram Pangram Foundry, dessinée par Mathieu Desjardins &
Sebastien Tremblay, version 1.000.

⚠️ **Point de vigilance licence.** Les fichiers ne portent aucune licence embarquée
(champs `license` / `licenseURL` vides), donc rien ne permet de vérifier depuis les fichiers
qu'une licence *webfont* a bien été acquise. Chez Pangram Pangram, la licence bureau (celle
qui permet d'installer la police sur un ordinateur) **ne couvre pas** la diffusion sur un
site : c'est une licence distincte. À confirmer avec Aurélia avant la mise en ligne.

Notes techniques :
- Le poids **200** demandé par certains titres n'existe pas dans la famille (la plus légère
  est Light/300) : le navigateur retombe sur Light, ce qui est le rendu attendu.
- Les fichiers `Light` et `Medium` déclarent en interne un style « Regular » — sans effet ici,
  puisque chaque `@font-face` fixe explicitement son `font-weight`.
- Neue Montréal a une **hauteur d'x 5,6 % plus faible que Manrope** : les plus petits textes
  (mentions RGPD, notes) ont été remontés de 12 → 12,5 px pour compenser.

### Manrope — filet de sécurité

Conservée après Neue Montréal dans la pile `--sans` : si une graisse venait à manquer, le
rendu reste cohérent. Choisie après comparaison au même corps de Manrope, Space Grotesk,
Geist et Archivo avec l'échantillon de la charte — la plus proche en graisse et en rythme.

## Où obtenir les fichiers

### Neue Montréal — police commerciale
Éditée par la fonderie **Pangram Pangram** (pangrampangram.com). Un usage sur un site web
public nécessite une **licence webfont**, distincte de la licence bureau : la licence
« desktop » (celle qui permet d'installer la police sur un ordinateur) ne couvre PAS la
diffusion sur un site. Trois pistes :

1. **Acheter la licence webfont** chez Pangram Pangram — c'est la voie propre et définitive.
   Le tarif dépend du trafic mensuel du site ; pour un site vitrine, c'est l'entrée de gamme.
2. **Vérifier si Aurélia a déjà une licence.** Si la charte a été produite par une graphiste,
   celle-ci a peut-être acheté la licence — dans ce cas, demander les fichiers web + le
   justificatif de licence.
3. **Attention à Canva.** Si la charte a été faite sur Canva, la police y est utilisable
   *dans Canva* mais les fichiers ne sont ni exportables ni redistribuables sur un site.

⚠️ Ne pas récupérer les fichiers sur un site de polices gratuites : Neue Montréal y circule
en versions piratées. Utiliser une police sans licence expose Aurélia à une réclamation de
la fonderie.

### Znikomit — c'est fait ✅
Créée par **gluk** (glukfonts.pl), publiée sous **SIL Open Font License 1.1** : usage
commercial, modification et redistribution autorisés. Le texte de la licence est conservé
dans `Znikomit-OFL.txt`, comme l'OFL l'exige. Récupérée depuis Font Squirrel et convertie
en `.woff2`. Elle est utilisée sur les titres de héros (`.hero h1`, `.page-hero h1`),
ce qui fait écho au logo — qui est composé dans cette même police.

## Convertir un .ttf/.otf en .woff2

- En ligne : [cloudconvert.com](https://cloudconvert.com/ttf-to-woff2) ou
  [transfonter.org](https://transfonter.org) (cocher « woff2 » seulement).
- En ligne de commande : `woff2_compress MaPolice.ttf`

## Si une seule graisse est disponible

Garder uniquement les `@font-face` correspondants dans `styles.css` et supprimer les autres :
le navigateur synthétise mal les graisses manquantes, mieux vaut retomber sur Manrope.
