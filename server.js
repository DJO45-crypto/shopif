const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

// Route de vérification (Santé du serveur)
app.get('/', (req, res) => {
  res.status(200).send('Serveur d automatisation actif et opérationnel !');
});

// 1. RECEPTION DES COMMANDES SHOPIFY
app.post('/webhook/orders-create', async (req, res) => {
  try {
    const order = req.body;
    console.log(`\n========================================`);
    console.log(`[SHOPIFY] Nouvelle commande reçue : #${order.order_number || order.id}`);
    console.log(`Client : ${order.customer ? order.customer.first_name : 'Anonyme'} ${order.customer ? order.customer.last_name : ''}`);
    console.log(`Total : ${order.total_price} ${order.currency}`);

    // Extraction des articles
    const lineItems = order.line_items || [];
    console.log(`Articles commandés (${lineItems.length}) :`);
    
    lineItems.forEach(item => {
      console.log(`- ${item.name} (Qté: ${item.quantity}) - SKU: ${item.sku || 'N/A'}`);
    });

    // 2. TRANSMISSION AUTOMATIQUE AUX FOURNISSEURS / API
    await processSupplierAutomation(order);

    res.status(200).send('Webhook reçu et traité avec succès');
  } catch (error) {
    console.error('[ERREUR] Échec du traitement de la commande :', error.message);
    res.status(500).send('Erreur interne du serveur');
  }
});

// FUNCTION POUR GERER L AUTOMATISATION FOURNISSEUR (AliExpress, Amazon, etc.)
async function processSupplierAutomation(orderData) {
  console.log('[FOURNISSEUR] Lancement du traitement automatique...');

  // Exemple d'envoi vers un service tier ou une API fournisseur
  /*
  try {
    // Ici tu pourras brancher l'API d'AliExpress, Amazon, ou un service comme DSers/Webhook externe
    // const response = await axios.post('https://api.fournisseur.com/orders', { ... });
    console.log('[FOURNISSEUR] Commande transmise avec succès au fournisseur.');
  } catch (err) {
    console.error('[FOURNISSEUR ERREUR] Impossible d envoyer au fournisseur :', err.message);
  }
  */
  
  console.log('[FOURNISSEUR] Traitement simulé terminé.');
}

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`Serveur d automatisation lancé sur le port ${PORT}`);
  console.log(`Prêt à écouter les événements Shopify.`);
  console.log(`========================================\n`);
});
