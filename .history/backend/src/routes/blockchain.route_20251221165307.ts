import { Router } from "express";
import { BlockchainController } from "../controllers/blockchain.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Public routes
router.get("/rates", BlockchainController.getExchangeRates);
router.get("/tokens", BlockchainController.getSupportedTokens);
router.get("/block", BlockchainController.getCurrentBlock);

// Protected routes (require authentication)
router.post("/verify", authenticate, BlockchainController.verifyTransaction);
router.post("/convert", authenticate, BlockchainController.convertCurrency);
router.get("/order/:orderId/status", authenticate, BlockchainController.checkOrderStatus);

export default router;
