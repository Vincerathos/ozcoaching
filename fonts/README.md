# Polices de la charte OZ Coaching

La charte graphique (`design/charte-graphique-ag.png`) impose deux polices :

| Rôle | Police | Où elle sert sur le site |
|---|---|---|
| Texte courant, titres | **Neue Montréal** | tout le site |
| Display | **Znikomit** | uniquement les titres de héros (`.hero h1`, `.page-hero h1`) |

## Comment les activer

`styles.css` les déclare déjà en `@font-face`. **Il suffit de déposer les fichiers ici** —
ils prennent le relais automatiquement, sans toucher au code. Tant qu'ils sont absents,
le site utilise **Manrope** (Google Fonts) comme substitut et rien ne casse.

Fichiers attendus (format `.woff2`) :

```
fonts/NeueMontreal-Light.woff2      (300)
fonts/NeueMontreal-Regular.woff2    (400)
fonts/NeueMontreal-Medium.woff2     (500)
fonts/NeueMontreal-Bold.woff2       (700)
fonts/Znikomit.woff2                (400)
```

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

### Znikomit — gratuite
Créée par **gluk** (Grzegorz Luk), diffusée gratuitement (dafont, Font Library).
Télécharger le `.ttf`, puis le convertir en `.woff2` (voir ci-dessous).
Vérifier la licence affichée sur la page de téléchargement au moment de l'usage :
selon la source, certaines polices de cet auteur sont en « usage personnel uniquement ».
Si c'est le cas, écrire à l'auteur pour l'usage commercial — il accorde généralement
l'autorisation.

## Convertir un .ttf/.otf en .woff2

- En ligne : [cloudconvert.com](https://cloudconvert.com/ttf-to-woff2) ou
  [transfonter.org](https://transfonter.org) (cocher « woff2 » seulement).
- En ligne de commande : `woff2_compress MaPolice.ttf`

## Si une seule graisse est disponible

Garder uniquement les `@font-face` correspondants dans `styles.css` et supprimer les autres :
le navigateur synthétise mal les graisses manquantes, mieux vaut retomber sur Manrope.
