import { Router } from "express";
import userRouter from "../users/routes/user.routes.js";
import shoeRouter from "../shoes/routes/shoe.routes.js";
import cartRouter from "../cart/routes/cart.routes.js";

const router = Router();

router.get("/", (req, res) => {
    throw new Error(`This Is An Error`);
});

router.use("/users", userRouter);
router.use("/shoes", shoeRouter);
router.use("/cart", cartRouter);

export default router;