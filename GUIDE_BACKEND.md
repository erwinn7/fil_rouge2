# 🚀 Guide Backend — fil_rouge2

---

## ✅ Prérequis

Installer sur la machine :

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) → **démarré**
- [Git](https://git-scm.com/)
- [Node.js 20+](https://nodejs.org/) *(optionnel, pour scripts locaux)*

---

## 📁 1. Récupérer le projet

```bash
git clone https://github.com/Erwinn7/fil_rouge2.git
cd fil_rouge2
```

---

## ⚙️ 2. Créer le fichier `.env` dans `backend/`

Créer le fichier `backend/.env` avec ce contenu :

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/uni_db
PORT=3001
NODE_ENV=development
JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=azerty123456
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_SUCCESS_URL=http://localhost:4200/payment/success
STRIPE_CANCEL_URL=http://localhost:4200/payment/cancel
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
```

---

## 🐳 3. Démarrer le projet

```bash
docker compose up -d --build
```

> ⏱️ Première fois : ~3 minutes (téléchargement des images)

### Ce qui se lance automatiquement :

| # | Étape | Description |
|---|-------|-------------|
| 1 | **Migrations** | Crée toutes les tables en base |
| 2 | **Prisma generate** | Génère le client Prisma |
| 3 | **Seed Admin** | Crée l'utilisateur admin |
| 4 | **Seed Catégories** | Crée les 10 catégories |
| 5 | **Serveur** | API disponible sur `http://localhost:3001` |

---

## 🌐 4. Services disponibles

| Service | URL | Description |
|---------|-----|-------------|
| **API Backend** | http://localhost:3001/api | API REST |
| **Frontend** | http://localhost:4200 | App Angular |
| **pgAdmin** | http://localhost:5050 | Interface base de données |

---

Pour le frontend Next.js, voir le fichier `GUIDE_FRONTEND.md`.

---

## 🗄️ 5. Voir les tables dans pgAdmin

**Connexion pgAdmin** → http://localhost:5050

```
Email    : admin@admin.com
Password : admin
```

**Ajouter le serveur PostgreSQL :**

1. Clic droit **Servers** → **Register → Server...**
2. Onglet **General** → Name : `uni_db`
3. Onglet **Connection** :

| Champ | Valeur |
|-------|--------|
| Host | `uni_postgres` |
| Port | `5432` |
| Database | `uni_db` |
| Username | `postgres` |
| Password | `postgres` |

4. Cliquer **Save**

**Chemin des tables :**
```
uni_db → Schemas → public → Tables
```

### Tables créées :

| Table | Description |
|-------|-------------|
| `User` | Utilisateurs (clients + admin) |
| `Category` | Catégories produits |
| `Product` | Produits |
| `Cart` | Panier par utilisateur |
| `CartItem` | Lignes du panier |
| `Order` | Commandes |
| `OrderItem` | Lignes de commande |
| `Payment` | Paiements (Stripe/PayPal/COD) |
| `_prisma_migrations` | Historique des migrations |

---

## 🔑 6. Compte Admin

```
Email    : admin@gmail.com
Password : azerty123456
URL      : http://localhost:4200
```

---

## 📡 7. Principales routes API

### Auth
```
POST /api/auth/register    → Créer un compte
POST /api/auth/login       → Se connecter
GET  /api/auth/me          → Profil connecté
```

### Produits & Catégories
```
GET  /api/products         → Liste des produits
GET  /api/products/:id     → Détail produit
GET  /api/categories       → Liste des catégories
```

### Panier
```
GET    /api/cart            → Voir son panier
POST   /api/cart            → Ajouter un produit
PATCH  /api/cart/:id        → Modifier quantité
DELETE /api/cart/:id        → Retirer du panier
```

### Commandes
```
POST /api/orders            → Créer une commande
GET  /api/orders            → Mes commandes
GET  /api/orders/:id        → Détail commande
```

### Paiement
```
POST /api/payment/cod       → Payer à la livraison
POST /api/payment/stripe    → Payer par Stripe
POST /api/payment/paypal    → Payer par PayPal
```

### Admin
```
GET    /api/admin/users          → Liste utilisateurs
PATCH  /api/admin/users/:id/block → Bloquer un user
GET    /api/admin/orders         → Toutes les commandes
PATCH  /api/admin/orders/:id     → Changer statut commande
GET    /api/admin/products       → Gestion produits
POST   /api/admin/products       → Créer un produit
PATCH  /api/admin/products/:id   → Modifier un produit
DELETE /api/admin/products/:id   → Supprimer un produit
```

---

## 🔄 8. Commandes utiles

```bash
# Voir les logs du backend
docker logs uni_backend -f

# Redémarrer uniquement le backend
docker compose restart backend

# Arrêter tout (garde les données)
docker compose down

# Arrêter tout + supprimer les données
docker compose down -v

# Reconstruire et redémarrer
docker compose up -d --build
```

---

## ⏹️ 8.bis Arrêter le projet sans perdre les données

### Backend (Docker)

Depuis le dossier `backend` :

```bash
docker compose down
```

Cette commande arrête les conteneurs mais conserve le volume `pgdata` (donc la base PostgreSQL est gardée).

### À éviter si tu veux garder les données

```bash
docker compose down -v
```

Le flag `-v` supprime les volumes Docker, donc efface les données PostgreSQL.

---

## 🛑 9. Résolution de problèmes courants

| Problème | Solution |
|----------|----------|
| `Cannot connect to server` dans pgAdmin | Utiliser `uni_postgres` et non `localhost` |
| `SASL: client password must be a string` | Le fichier `backend/.env` est manquant |
| Port déjà utilisé | Changer le port dans `docker-compose.yml` |
| Tables vides après démarrage | Vérifier `docker logs uni_backend` |

---

*Projet fil_rouge2 — Backend Node.js / Prisma / PostgreSQL*


@Copilot kj,f,r,kjgf