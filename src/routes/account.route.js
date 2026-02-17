import express from 'express'
import accountController from '../controllers/account.controller.js';
import authmiddleware from '../middleware/auth.middleware.js'
const router=express.Router();


router.post('/open',authmiddleware.authmiddleware,accountController.open)

router.post('/',authmiddleware.authmiddleware,accountController.getUserAccounts)

router.get('/balance/:AccountId',authmiddleware.authmiddleware,accountController.getAccountBalance)


export default router;