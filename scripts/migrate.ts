import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';
import * as schema from '../shared/schema';
import { eq } from 'drizzle-orm';

// Fonction pour créer un utilisateur par défaut et des données de test
const seedDatabase = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  // Vérifier si l'utilisateur 'user' existe déjà
  const existingUser = await db.select().from(schema.users).where(eq(schema.users.username, 'user'));
  
  if (existingUser.length === 0) {
    console.log('🌱 Création des données de test...');
    
    // Créer un utilisateur par défaut
    const [user] = await db.insert(schema.users).values({
      username: 'user',
      password: 'password' // En production, il faudrait hacher le mot de passe
    }).returning();
    
    // Créer quelques magasins
    const [store1] = await db.insert(schema.stores).values({
      name: 'Carrefour',
      location: 'Centre commercial Grand Var',
      logo: 'carrefour'
    }).returning();
    
    const [store2] = await db.insert(schema.stores).values({
      name: 'E.Leclerc',
      location: 'Avenue de Nice',
      logo: 'leclerc'
    }).returning();
    
    const [store3] = await db.insert(schema.stores).values({
      name: 'Auchan',
      location: 'Boulevard Maréchal Juin',
      logo: 'auchan'
    }).returning();
    
    // Créer quelques produits
    const [product1] = await db.insert(schema.products).values({
      name: 'Lait demi-écrémé 1L',
      category: 'Produits laitiers',
      brand: 'Lactel',
      unit: '1L'
    }).returning();
    
    const [product2] = await db.insert(schema.products).values({
      name: 'Baguette tradition',
      category: 'Boulangerie',
      unit: 'pièce'
    }).returning();
    
    const [product3] = await db.insert(schema.products).values({
      name: 'Pâtes penne rigate',
      category: 'Pâtes',
      brand: 'Barilla',
      unit: '500g'
    }).returning();
    
    const [product4] = await db.insert(schema.products).values({
      name: 'Jambon blanc 4 tranches',
      category: 'Charcuterie',
      brand: 'Fleury Michon',
      unit: '160g'
    }).returning();
    
    const [product5] = await db.insert(schema.products).values({
      name: 'Café moulu 250g',
      category: 'Boissons',
      brand: 'Carte Noire',
      unit: '250g'
    }).returning();
    
    // Ajouter les prix pour chaque produit dans chaque magasin
    await db.insert(schema.prices).values([
      // Produit 1 - Lait
      { productId: product1.id, storeId: store1.id, price: 0.95, promo: false },
      { productId: product1.id, storeId: store2.id, price: 0.92, promo: true, oldPrice: 1.05 },
      { productId: product1.id, storeId: store3.id, price: 0.99, promo: false },
      
      // Produit 2 - Baguette
      { productId: product2.id, storeId: store1.id, price: 1.10, promo: false },
      { productId: product2.id, storeId: store2.id, price: 0.95, promo: false },
      { productId: product2.id, storeId: store3.id, price: 1.05, promo: false },
      
      // Produit 3 - Pâtes
      { productId: product3.id, storeId: store1.id, price: 1.45, promo: true, oldPrice: 1.95 },
      { productId: product3.id, storeId: store2.id, price: 1.55, promo: false },
      { productId: product3.id, storeId: store3.id, price: 1.49, promo: false },
      
      // Produit 4 - Jambon
      { productId: product4.id, storeId: store1.id, price: 2.85, promo: false },
      { productId: product4.id, storeId: store2.id, price: 2.75, promo: false },
      { productId: product4.id, storeId: store3.id, price: 2.65, promo: true, oldPrice: 2.95 },
      
      // Produit 5 - Café
      { productId: product5.id, storeId: store1.id, price: 3.95, promo: false },
      { productId: product5.id, storeId: store2.id, price: 3.75, promo: true, oldPrice: 4.25 },
      { productId: product5.id, storeId: store3.id, price: 4.15, promo: false }
    ]);
    
    // Créer une liste de courses pour l'utilisateur
    const [shoppingList] = await db.insert(schema.shoppingLists).values({
      userId: user.id,
      name: 'Courses hebdomadaires',
      status: 'active'
    }).returning();
    
    // Ajouter quelques éléments à la liste de courses
    await db.insert(schema.shoppingListItems).values([
      { shoppingListId: shoppingList.id, productId: product1.id, quantity: 2, checked: false },
      { shoppingListId: shoppingList.id, productId: product3.id, quantity: 1, checked: true },
      { shoppingListId: shoppingList.id, productId: product5.id, quantity: 1, checked: false }
    ]);
    
    // Ajouter quelques produits en favoris
    await db.insert(schema.favoriteProducts).values([
      { userId: user.id, productId: product1.id, purchaseCount: 5 },
      { userId: user.id, productId: product3.id, purchaseCount: 3 },
      { userId: user.id, productId: product5.id, purchaseCount: 2 }
    ]);
    
    // Ajouter quelques alertes de prix
    await db.insert(schema.priceAlerts).values([
      { 
        productId: product3.id, 
        storeId: store1.id, 
        oldPrice: 1.95, 
        newPrice: 1.45, 
        alertType: 'decrease' 
      },
      { 
        productId: product5.id, 
        storeId: store2.id, 
        oldPrice: 4.25, 
        newPrice: 3.75, 
        alertType: 'decrease' 
      }
    ]);
    
    console.log('✅ Données de test créées avec succès!');
  } else {
    console.log('📝 Les données de test existent déjà, aucune action nécessaire.');
  }
  
  await pool.end();
};

// Migration principale
async function main() {
  console.log('🔄 Démarrage de la migration...');
  
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);
  
  console.log('🛠 Application des changements de schéma...');
  // Effectue la migration en utilisant le schéma
  await migrate(db, { migrationsFolder: './migrations' });
  
  console.log('✅ Migration terminée avec succès!');
  
  // Seed the database
  await seedDatabase();
  
  await pool.end();
  
  console.log('🏁 Processus terminé!');
}

main().catch((err) => {
  console.error('❌ Erreur pendant la migration:', err);
  process.exit(1);
});