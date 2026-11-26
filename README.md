# Golden Crispy — Menu digital

Site statique (HTML/CSS/JS) + une petite fonction Vercel (`api/menu.js`) pour que l'admin mette le menu à jour en direct.

## Contenu du dossier
- `index.html` : le menu pour les clients
- `admin.html` : l'administration (photos, articles, catégories, infos, codes QR)
- `menu-data.js` : le menu de départ et les infos du restaurant
- `api/menu.js` + `package.json` : synchronisation admin → menu en ligne
- `images/` : logo et photos

## 1. Avant de déployer : modifier menu-data.js
- `whatsapp` : numéro au format `2126XXXXXXXX` (sans + ni espaces)
- `phoneDisplay`, `address`, `hours`, `instagram`, `mapUrl` (lien Google Maps, optionnel)
- `developer.url` : le lien du site web de SCH Solutions
(Les infos de contact peuvent aussi se changer plus tard dans l'admin.)

## 2. Déployer sur Vercel
1. vercel.com → connexion → **Add New → Project**.
2. Importez le dossier depuis GitHub (conseillé), ou utilisez le Vercel CLI : `npx vercel` dans le dossier.
3. **Framework Preset : Other**. Laissez Build Command et Output Directory vides. → **Deploy**.

## 3. Activer la sauvegarde en ligne (une seule fois)
1. Projet Vercel → onglet **Storage** → **Create Database → Blob** → reliez-le au projet (Connect Project).
2. **Settings → Environment Variables** → ajoutez `ADMIN_PASSWORD` = le mot de passe de votre choix (cochez Production, Preview, Development).
3. **Deployments** → les 3 points du dernier déploiement → **Redeploy**.

## 4. Utiliser l'admin
Ouvrez `https://votre-site.vercel.app/admin.html` (ou le « @ » en bas du menu).
Modifiez prix, photos, articles, catégories, puis entrez le mot de passe et cliquez **« Sauvegarder les modifications »**. Les clients voient le nouveau menu à leur prochain chargement.
Sans la étape 3, le bouton télécharge `menu-data.js` (à remplacer dans le projet puis redéployer).

## 5. Codes QR
Dans l'admin, section « Codes QR » : saisissez l'adresse de votre site, le nombre de tables, **Générer les QR**, cochez ceux à imprimer, **Imprimer la sélection**.
- Table : `?table=5` · À emporter : `?mode=emporter` · Livraison : `?mode=livraison`
- Les QR utilisent une bibliothèque chargée depuis internet (cdn.jsdelivr.net).
- Pour imprimer sans en-têtes du navigateur, désactivez « En-têtes et pieds de page » dans la fenêtre d'impression.
