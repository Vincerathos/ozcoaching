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
| `NeueMontreal-*.woff2` | ⬜ à fournir (licence à acquérir, voir ci-dessous) |

Tout est **hébergé en local** : le site ne fait plus aucune requête vers Google Fonts,
donc aucune adresse IP de visiteur n'est transmise à un tiers (point RGPD non négligeable —
la CNIL et plusieurs autorités européennes ont sanctionné le chargement direct de Google Fonts).

### Pour activer Neue Montréal

1. Déposer les 4 fichiers ici :
   ```
   fonts/NeueMontreal-Light.woff2      (300)
   fonts/NeueMontreal-Regular.woff2    (400)
   fonts/NeueMontreal-Medium.woff2     (500)
   fonts/NeueMontreal-Bold.woff2       (700)
   ```
2. Dans `styles.css`, retirer les `/*` `*/` autour du bloc « Neue Montréal — à activer… ».

C'est tout : la pile `--sans` la place déjà avant Manrope, tout le site suivra.

### Pourquoi Manrope comme substitut

Le choix n'est pas arbitraire : Manrope, Space Grotesk, Geist et Archivo ont été comparées
au même corps avec l'échantillon « Neue Montréal » extrait de la charte. Manrope est la plus
proche en graisse et en rythme ; Space Grotesk est trop large et espacée, Geist trop dense.

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
