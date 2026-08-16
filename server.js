require('dotenv').config();
const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

app.post('/webhook/orders-create', async (req, res) => {
    try {
        const order = req.body;
        console.log(`[COMMANDE RECEVE] ID Shopify: ${order.id}`);

        const shippingDetails = {
            orderId: order.id,
            customerName: `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
            address: order.shipping_address.address1,
            city: order.shipping_address.city,
            zip: order.shipping_address.zip,
            country: order.shipping_address.country,
            phone: order.shipping_address.phone,
            items: order.line_items.map(item => ({
                sku: item.sku,
                title: item.title,
                quantity: item.quantity
            }))
        };

        const supplierResult = await sendToSupplier(shippingDetails);

        if (supplierResult.success) {
            console.log(`[SUCCÈS] Commande transmise. Tracking: ${supplierResult.trackingId}`);
            res.status(200).json({ status: "success", tracking: supplierResult.trackingId });
        } else {
            res.status(500).json({ status: "error", message: "Échec envoi" });
        }

    } catch (error) {
        console.error('[ERREUR WEBHook]:', error.message);
        res.status(500).send('Erreur interne');
    }
});

async function sendToSupplier(orderDetails) {
    console.log(`Traitement commande pour ${orderDetails.customerName}...`);
    return {
        success: true,
        trackingId: "TRACK-" + Math.floor(100000 + Math.random() * 900000)
    };
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot actif sur le port ${PORT}`));
