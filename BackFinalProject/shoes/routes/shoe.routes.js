import { Router } from "express";
import Shoe from "../models/Shoes.schema.js";
import {
    getShoeById,
    createNewShoe,
    deleteShoe,
    updateShoe,
} from "../services/shoesDataAccess.service.js";
import { auth } from "../../middlewares/token.js";
import { isUser } from "../../middlewares/isUser.js";
import { isBusiness } from "../../middlewares/isBusiness.js";
import { isAdmin } from "../../middlewares/isAdmin.js";

const shoesRouter = Router();

/* ----- GET All Shoes ----- */
shoesRouter.get("/", async (req, res) => {
    try {
        const shoes = await Shoe.find();
        return res.json(shoes);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

/* ----- GET Shoe by ID ----- */
shoesRouter.get("/:id", async (req, res) => {
    try {
        const shoe = await getShoeById(req.params.id);
        console.log("Shoe data fetched:", shoe);
        return res.json(shoe);
    } catch (err) {
        console.log("Error fetching shoe:", err);
        return res.status(400).json({ message: err.message });
    }
});

/* ----- POST a New Shoe (Authenticated, Business User Only) ----- */
shoesRouter.post("/", auth, isBusiness, async (req, res) => {
    try {
        const shoeData = { ...req.body, userId: req.user._id };
        const shoe = await createNewShoe(shoeData);
        return res.json(shoe);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

/* ----- PUT Update Shoe (Authenticated, User Only) ----- */
shoesRouter.put("/:id", auth, isAdmin, async (req, res) => {
    try {
        const shoe = await updateShoe(req.params.id, req.body);
        return res.json({ message: "Updated shoe successfully", shoe });
    } catch (err) {
        res.status(400).send(err.message);
    }
});

/* ----- DELETE Shoe (Authenticated, User Only) ----- */
shoesRouter.delete("/:id", auth, isUser, async (req, res) => {
    try {
        const shoe = await deleteShoe(req.params.id);
        return res.json({ message: "Deleted shoe successfully", shoe });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
});

export default shoesRouter;