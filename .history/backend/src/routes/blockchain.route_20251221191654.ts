import { Router } from "express";
import { BlockchainController } from "../controllers/blockchain.controller";
import { requireAuth } from "../middlewares/auth";

const router = Router();

// Public routes
router.get("/rates", BlockchainController.getExchangeRates);
router.get("/tokens", BlockchainController.getSupportedTokens);
router.get("/block", BlockchainController.getCurrentBlock);

// Protected routes (require authentication)
router.post("/verify", requireAuth, BlockchainController.verifyTransaction);
router.post("/convert", requireAuth, BlockchainController.convertCurrency);
router.get("/order/:orderId/status", requireAuth, BlockchainController.checkOrderStatus);

export default router;
