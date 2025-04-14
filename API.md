# Documentation API ComparaCourse

Ce document décrit les points d'accès (endpoints) de l'API REST de ComparaCourse.

## Base URL

Toutes les URL sont relatives à `http://localhost:5000/api/` pour le développement local.

## Authentification

L'API utilise l'authentification par session pour sécuriser les endpoints. Les informations d'identification doivent être envoyées via un formulaire de connexion.

## Format des réponses

Toutes les réponses sont au format JSON.

## Ressources API

### Utilisateurs

#### Obtenir un utilisateur

```
GET /users/:id
```

**Paramètres**:
- `id` - ID de l'utilisateur

**Réponse**:
```json
{
  "id": 1,
  "username": "user",
  "password": "password"
}
```

### Magasins

#### Obtenir tous les magasins

```
GET /stores
```

**Réponse**:
```json
[
  {
    "id": 1,
    "name": "Carrefour",
    "location": "Centre commercial Grand Var",
    "logo": "carrefour"
  },
  {
    "id": 2,
    "name": "E.Leclerc",
    "location": "Avenue de Nice",
    "logo": "leclerc"
  }
]
```

#### Obtenir un magasin

```
GET /stores/:id
```

**Paramètres**:
- `id` - ID du magasin

**Réponse**:
```json
{
  "id": 1,
  "name": "Carrefour",
  "location": "Centre commercial Grand Var",
  "logo": "carrefour"
}
```

#### Créer un magasin

```
POST /stores
```

**Corps de la requête**:
```json
{
  "name": "Super U",
  "location": "Rue de la République",
  "logo": "superu"
}
```

**Réponse**:
```json
{
  "id": 4,
  "name": "Super U",
  "location": "Rue de la République",
  "logo": "superu"
}
```

#### Mettre à jour un magasin

```
PUT /stores/:id
```

**Paramètres**:
- `id` - ID du magasin

**Corps de la requête**:
```json
{
  "location": "Place de la Mairie"
}
```

**Réponse**:
```json
{
  "id": 4,
  "name": "Super U",
  "location": "Place de la Mairie",
  "logo": "superu"
}
```

#### Supprimer un magasin

```
DELETE /stores/:id
```

**Paramètres**:
- `id` - ID du magasin

**Réponse**:
```json
{
  "success": true
}
```

### Produits

#### Obtenir tous les produits

```
GET /products
```

**Réponse**:
```json
[
  {
    "id": 1,
    "name": "Lait demi-écrémé 1L",
    "category": "Produits laitiers",
    "brand": "Lactel",
    "unit": "1L",
    "description": null
  },
  {
    "id": 2,
    "name": "Baguette tradition",
    "category": "Boulangerie",
    "brand": null,
    "unit": "pièce",
    "description": null
  }
]
```

#### Obtenir un produit

```
GET /products/:id
```

**Paramètres**:
- `id` - ID du produit

**Réponse**:
```json
{
  "id": 1,
  "name": "Lait demi-écrémé 1L",
  "category": "Produits laitiers",
  "brand": "Lactel",
  "unit": "1L",
  "description": null
}
```

#### Créer un produit

```
POST /products
```

**Corps de la requête**:
```json
{
  "name": "Yaourt nature",
  "category": "Produits laitiers",
  "brand": "Danone",
  "unit": "4x125g"
}
```

**Réponse**:
```json
{
  "id": 6,
  "name": "Yaourt nature",
  "category": "Produits laitiers",
  "brand": "Danone",
  "unit": "4x125g",
  "description": null
}
```

#### Mettre à jour un produit

```
PUT /products/:id
```

**Paramètres**:
- `id` - ID du produit

**Corps de la requête**:
```json
{
  "description": "Yaourt nature sans sucre ajouté"
}
```

**Réponse**:
```json
{
  "id": 6,
  "name": "Yaourt nature",
  "category": "Produits laitiers",
  "brand": "Danone",
  "unit": "4x125g",
  "description": "Yaourt nature sans sucre ajouté"
}
```

#### Supprimer un produit

```
DELETE /products/:id
```

**Paramètres**:
- `id` - ID du produit

**Réponse**:
```json
{
  "success": true
}
```

### Prix

#### Obtenir tous les prix

```
GET /prices
```

**Réponse**:
```json
[
  {
    "id": 1,
    "productId": 1,
    "storeId": 1,
    "price": 0.95,
    "promo": false,
    "oldPrice": null,
    "updatedAt": "2023-04-14T10:30:00.000Z"
  },
  {
    "id": 2,
    "productId": 1,
    "storeId": 2,
    "price": 0.92,
    "promo": true,
    "oldPrice": 1.05,
    "updatedAt": "2023-04-14T10:30:00.000Z"
  }
]
```

#### Obtenir un prix

```
GET /prices/:id
```

**Paramètres**:
- `id` - ID du prix

**Réponse**:
```json
{
  "id": 1,
  "productId": 1,
  "storeId": 1,
  "price": 0.95,
  "promo": false,
  "oldPrice": null,
  "updatedAt": "2023-04-14T10:30:00.000Z"
}
```

#### Créer un prix

```
POST /prices
```

**Corps de la requête**:
```json
{
  "productId": 6,
  "storeId": 1,
  "price": 2.15,
  "promo": false
}
```

**Réponse**:
```json
{
  "id": 16,
  "productId": 6,
  "storeId": 1,
  "price": 2.15,
  "promo": false,
  "oldPrice": null,
  "updatedAt": "2023-04-14T11:45:00.000Z"
}
```

#### Mettre à jour un prix

```
PUT /prices/:id
```

**Paramètres**:
- `id` - ID du prix

**Corps de la requête**:
```json
{
  "price": 1.99,
  "promo": true,
  "oldPrice": 2.15
}
```

**Réponse**:
```json
{
  "id": 16,
  "productId": 6,
  "storeId": 1,
  "price": 1.99,
  "promo": true,
  "oldPrice": 2.15,
  "updatedAt": "2023-04-14T12:00:00.000Z"
}
```

#### Supprimer un prix

```
DELETE /prices/:id
```

**Paramètres**:
- `id` - ID du prix

**Réponse**:
```json
{
  "success": true
}
```

### Listes de courses

#### Obtenir les listes de courses d'un utilisateur

```
GET /users/:userId/shopping-lists
```

**Paramètres**:
- `userId` - ID de l'utilisateur

**Réponse**:
```json
[
  {
    "id": 1,
    "userId": 1,
    "name": "Courses hebdomadaires",
    "status": "active",
    "createdAt": "2023-04-14T10:30:00.000Z",
    "updatedAt": "2023-04-14T10:30:00.000Z"
  }
]
```

#### Obtenir une liste de courses

```
GET /shopping-lists/:id
```

**Paramètres**:
- `id` - ID de la liste de courses

**Réponse**:
```json
{
  "id": 1,
  "userId": 1,
  "name": "Courses hebdomadaires",
  "status": "active",
  "createdAt": "2023-04-14T10:30:00.000Z",
  "updatedAt": "2023-04-14T10:30:00.000Z"
}
```

#### Créer une liste de courses

```
POST /shopping-lists
```

**Corps de la requête**:
```json
{
  "userId": 1,
  "name": "Liste de courses du weekend"
}
```

**Réponse**:
```json
{
  "id": 2,
  "userId": 1,
  "name": "Liste de courses du weekend",
  "status": "active",
  "createdAt": "2023-04-14T12:15:00.000Z",
  "updatedAt": "2023-04-14T12:15:00.000Z"
}
```

#### Mettre à jour une liste de courses

```
PUT /shopping-lists/:id
```

**Paramètres**:
- `id` - ID de la liste de courses

**Corps de la requête**:
```json
{
  "name": "Liste de courses spéciales"
}
```

**Réponse**:
```json
{
  "id": 2,
  "userId": 1,
  "name": "Liste de courses spéciales",
  "status": "active",
  "createdAt": "2023-04-14T12:15:00.000Z",
  "updatedAt": "2023-04-14T12:20:00.000Z"
}
```

#### Supprimer une liste de courses

```
DELETE /shopping-lists/:id
```

**Paramètres**:
- `id` - ID de la liste de courses

**Réponse**:
```json
{
  "success": true
}
```

### Éléments de liste de courses

#### Obtenir les éléments d'une liste de courses

```
GET /shopping-lists/:listId/items
```

**Paramètres**:
- `listId` - ID de la liste de courses

**Réponse**:
```json
[
  {
    "id": 1,
    "shoppingListId": 1,
    "productId": 1,
    "quantity": 2,
    "checked": false
  },
  {
    "id": 2,
    "shoppingListId": 1,
    "productId": 3,
    "quantity": 1,
    "checked": true
  }
]
```

#### Obtenir un élément de liste de courses

```
GET /shopping-list-items/:id
```

**Paramètres**:
- `id` - ID de l'élément

**Réponse**:
```json
{
  "id": 1,
  "shoppingListId": 1,
  "productId": 1,
  "quantity": 2,
  "checked": false
}
```

#### Créer un élément de liste de courses

```
POST /shopping-list-items
```

**Corps de la requête**:
```json
{
  "shoppingListId": 1,
  "productId": 2,
  "quantity": 3
}
```

**Réponse**:
```json
{
  "id": 4,
  "shoppingListId": 1,
  "productId": 2,
  "quantity": 3,
  "checked": false
}
```

#### Mettre à jour un élément de liste de courses

```
PUT /shopping-list-items/:id
```

**Paramètres**:
- `id` - ID de l'élément

**Corps de la requête**:
```json
{
  "checked": true
}
```

**Réponse**:
```json
{
  "id": 4,
  "shoppingListId": 1,
  "productId": 2,
  "quantity": 3,
  "checked": true
}
```

#### Supprimer un élément de liste de courses

```
DELETE /shopping-list-items/:id
```

**Paramètres**:
- `id` - ID de l'élément

**Réponse**:
```json
{
  "success": true
}
```

### Produits favoris

#### Obtenir les produits favoris d'un utilisateur

```
GET /users/:userId/favorite-products
```

**Paramètres**:
- `userId` - ID de l'utilisateur

**Réponse**:
```json
[
  {
    "id": 1,
    "userId": 1,
    "productId": 1,
    "purchaseCount": 5,
    "lastPurchased": null
  },
  {
    "id": 2,
    "userId": 1,
    "productId": 3,
    "purchaseCount": 3,
    "lastPurchased": null
  }
]
```

#### Créer un produit favori

```
POST /favorite-products
```

**Corps de la requête**:
```json
{
  "userId": 1,
  "productId": 4,
  "purchaseCount": 1
}
```

**Réponse**:
```json
{
  "id": 4,
  "userId": 1,
  "productId": 4,
  "purchaseCount": 1,
  "lastPurchased": null
}
```

#### Mettre à jour un produit favori

```
PUT /favorite-products/:id
```

**Paramètres**:
- `id` - ID du produit favori

**Corps de la requête**:
```json
{
  "purchaseCount": 2
}
```

**Réponse**:
```json
{
  "id": 4,
  "userId": 1,
  "productId": 4,
  "purchaseCount": 2,
  "lastPurchased": null
}
```

#### Supprimer un produit favori

```
DELETE /favorite-products/:id
```

**Paramètres**:
- `id` - ID du produit favori

**Réponse**:
```json
{
  "success": true
}
```

### Alertes de prix

#### Obtenir toutes les alertes de prix

```
GET /price-alerts
```

**Réponse**:
```json
[
  {
    "id": 1,
    "productId": 3,
    "storeId": 1,
    "oldPrice": 1.95,
    "newPrice": 1.45,
    "alertType": "decrease",
    "createdAt": "2023-04-14T10:30:00.000Z"
  },
  {
    "id": 2,
    "productId": 5,
    "storeId": 2,
    "oldPrice": 4.25,
    "newPrice": 3.75,
    "alertType": "decrease",
    "createdAt": "2023-04-14T10:30:00.000Z"
  }
]
```

#### Créer une alerte de prix

```
POST /price-alerts
```

**Corps de la requête**:
```json
{
  "productId": 1,
  "storeId": 3,
  "oldPrice": 0.99,
  "newPrice": 0.89,
  "alertType": "decrease"
}
```

**Réponse**:
```json
{
  "id": 3,
  "productId": 1,
  "storeId": 3,
  "oldPrice": 0.99,
  "newPrice": 0.89,
  "alertType": "decrease",
  "createdAt": "2023-04-14T12:45:00.000Z"
}
```

#### Supprimer une alerte de prix

```
DELETE /price-alerts/:id
```

**Paramètres**:
- `id` - ID de l'alerte de prix

**Réponse**:
```json
{
  "success": true
}
```

## Codes d'état HTTP

- `200 OK` - La requête a réussi
- `201 Created` - La ressource a été créée avec succès
- `400 Bad Request` - La requête est incorrecte
- `404 Not Found` - La ressource n'a pas été trouvée
- `500 Internal Server Error` - Erreur serveur

## Limites

L'API a une limite de 100 requêtes par minute par IP.